import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, {GradientBackground} from '../components/Layout';
import {getGlobalData} from '../utils/global-data';
import SEO from '../components/SEO';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import useId from '@mui/utils/useId';

import {ResponsiveChartContainer} from '@mui/x-charts/ResponsiveChartContainer';
import {ScatterPlot} from '@mui/x-charts/ScatterChart';
import {LinePlot, MarkPlot} from '@mui/x-charts/LineChart';
import {ChartsClipPath} from '@mui/x-charts/ChartsClipPath';
import {ChartsXAxis} from '@mui/x-charts/ChartsXAxis';
import {ChartsYAxis} from '@mui/x-charts/ChartsYAxis';
import {ChartsGrid} from '@mui/x-charts/ChartsGrid';
import { format } from 'date-fns';
import Papa from "papaparse";

export default function Index({globalData}) {
    const [data, setData] = useState([]);
    const [xLimits, setXLimits] = useState([null, null]); // Min and max for x-axis
    const moodLabels = {
        1: "awful",
        2: "bad",
        3: "meh",
        4: "good",
        5: "rad"
    };
    useEffect(() => {
        // Fetch the CSV file from the public directory
        fetch("/files/daylio_export.csv")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch CSV file");
                }
                return response.text();
            })
            .then((csvData) => {
                // Clean the CSV data: remove trailing semicolons and ensure proper row separation
                const cleanedCsv = csvData
                    .split("\n")  // Split by lines
                    .filter((line) => line.trim() !== "") // Remove empty lines
                    .map((line) => line.trim().replace(/;+$/, "")) // Remove trailing semicolons
                    .map((line) => line.replace(/"""/g, "\"")) // Fix extra quotes
                    .join("\n");  // Rejoin the cleaned lines

                // Parse the cleaned CSV using PapaParse
                const parsedData = Papa.parse(cleanedCsv, {
                    header: true,          // Treat the first row as header
                    skipEmptyLines: true, // Skip empty lines
                    dynamicTyping: true,  // Auto-type conversion (e.g. string to number)
                    quoteChar: '"',       // Handle quoted fields correctly
                    delimiter: ",",       // Specify the delimiter
                    newline: "\n",        // Ensure the newline character is correctly handled
                    complete: (results) => {
                        setData(results.data); // Set parsed data to state
                    },
                    error: (error) => {
                        console.error("PapaParse Error:", error); // Log any parsing errors
                    },
                });

                // Transform data
                const chartData = parsedData.data.map((row) => ({
                    x: new Date(`${row.date} ${row.time}`).getTime(), // Timestamp for x-axis
                    y:
                        row.mood === "good" ? 4 :
                            row.mood === "meh" ? 3 :
                                row.mood === "rad" ? 5 :
                                    row.mood === "bad" ? 2 :
                                        row.mood === "awful" ? 1 :
                                            3, // Mood to numeric
                }));
                // Set min and max x-axis limits
                const xValues = chartData.map((point) => point.x);
                const minX = Math.min(...xValues);
                const maxX = Math.max(...xValues);

                setXLimits([minX, maxX]);
                setData(chartData);
            })
            .catch((error) => console.error("Error fetching or parsing CSV file:", error));
    }, []);

    const chartData = data.map(({ x, y }) => ({
        x,
        y: moodLabels[y] // Convert numeric mood value to label
    }));

    const formattedData = chartData.map(({ x, y }) => ({
        x: format(new Date(x), 'MMMM dd, yyyy'), // Formatting the timestamp to a readable date
        y
    }));

    const [isLimited, setIsLimited] = React.useState(false);

    const id = useId();
    const clipPathId = `${id}-clip-path`;

    const handleChange = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - minDistance);
                setXLimites([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setXLimites([clamped - minDistance, clamped]);
            }
        } else {
            setXLimites(newValue as number[]);
        }
    };

    return (
        <Layout>
            <SEO title={globalData.name} description={globalData.siteTitle}/>
            <Header name={globalData.name}/>
            <main className="w-full">
                <Box>
                    {data.length > 0 ? (
                        <div>
                            <ResponsiveChartContainer
                                xAxis={[
                                    {
                                        label: "Date and Time",
                                        min: xLimits[0],
                                        max: xLimits[1],
                                        data: formattedData.map(({ x }) => x), // Use formatted dates for x-axis
                                    },
                                ]}
                                yAxis={[
                                    {
                                        label: "Mood",
                                        data: ["awful", "bad", "meh", "good", "rad"], // The mood labels for the y-axis
                                    },
                                ]}
                                series={[
                                    {type: 'scatter', data, markerSize: 8},
                                    {
                                        type: 'line',
                                        data: chartData.map(({ y }) => moodLabels[y]), // Display mood labels on line plot
                                        showMark: true,
                                    },
                                ]}
                                height={500}
                                margin={{top: 10}}
                            >
                                <ChartsGrid vertical horizontal/>
                                <g clipPath={`url(#${clipPathId})`}>
                                    <ScatterPlot/>
                                    <LinePlot/>
                                </g>
                                <ChartsXAxis/>
                                <ChartsYAxis/>
                                <MarkPlot/>
                                {isLimited && <ChartsClipPath id={clipPathId}/>}
                            </ResponsiveChartContainer>

                            <Slider
                                value={xLimits}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                min={2017}
                                max={2026}
                                sx={{mt: 2}}
                            />
                        </div>
                    ) : (
                        <p>Loading</p>
                    )}
                </Box>
            </main>
            <Footer copyrightText={globalData.footerText}/>
            <GradientBackground
                variant="large"
                className="fixed top-20 opacity-40 dark:opacity-60"
            />
            <GradientBackground
                variant="small"
                className="absolute bottom-0 opacity-20 dark:opacity-10"
            />
        </Layout>
    );
}

export function getStaticProps() {
    const globalData = getGlobalData();

    return {props: {globalData}};
}
