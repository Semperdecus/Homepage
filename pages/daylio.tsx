import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, {GradientBackground} from '../components/Layout';
import {getGlobalData} from '../utils/global-data';
import SEO from '../components/SEO';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import useId from '@mui/utils/useId';
import {format} from 'date-fns';
import DaylioHeatmap from "../components/DaylioHeatmap";
import {ChartsXAxis, ChartsYAxis, LinePlot, ResponsiveChartContainer, ScatterPlot} from "@mui/x-charts";
import {Slider} from "@mui/material";
import {fetchAndParseCsv} from "../utils/csvUtil";

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
    fetchAndParseCsv("/files/daylio_export.csv").then((response) => {
      return response;
    })
      .then((parsedData) => {
        // Transform data
        const chartData = parsedData.map((row) => ({
          x: new Date(`${row.full_date} ${row.time}`).getTime(), // Timestamp for x-axis
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

  const chartData = data.map(({x, y}) => ({
    x,
    y: moodLabels[y] // Convert numeric mood value to label
  }));

  const formattedData = chartData.map(({x, y}) => ({
    x: format(new Date(x), 'MMMM dd, yyyy'), // Formatting the timestamp to a readable date
    y
  }));

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

    const minDistance = new Date(2017, 0, 1).getTime();
    if (new Date(newValue[1], 0, 1).getTime() - new Date(newValue[0], 0, 1).getTime() < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(new Date(newValue[0], 0, 1).getTime(), minDistance);
        setXLimits([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(new Date(newValue[1]).getTime(), minDistance);
        setXLimits([clamped - minDistance, clamped]);
      }
    } else {
      setXLimits(newValue as number[]);
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
                    min: xLimits[0],
                    max: xLimits[1],
                    scaleType: 'time',
                    dataKey: 'month',
                    disableLine: true,
                    valueFormatter: (time, context) => {
                      const date = new Date(time);
                      const options = {month: 'short', year: 'numeric'};
                      // @ts-ignore
                      return date.toLocaleDateString('en-US', options)
                    },
                    data: formattedData.map(({x}) => x), // Use formatted dates for x-axis
                  },
                ]}
                yAxis={[
                  {
                    disableLine: true,
                    min: 0.7,
                    valueFormatter: (value, context) => {
                      return moodLabels[value] ? moodLabels[value] : ""
                    },
                    // colorMap: {
                    //   type: 'piecewise',
                    //   thresholds: [2, 3, 4, 5, 6],
                    //   colors: ['red', 'orange', 'yellow', 'green', 'blue'],
                    // }
                  },
                ]}
                series={[
                  {type: 'scatter', data},
                  {
                    type: 'line',
                    data: data.map(obj => {
                      return obj.y
                    }),
                    showMark: true,
                  },
                ]}
                height={500}
              >
                <g clipPath={`url(#${clipPathId})`}>
                  <ScatterPlot/>
                  <LinePlot/>
                </g>
                <ChartsXAxis disableTicks tickLabelStyle={{
                  textAnchor: 'end',
                  angle: -45,
                  margin: '5000px'
                }}
                />
                <ChartsYAxis disableTicks tickLabelStyle={{
                  margin: 500
                }}/>
                {/*{isLimited && <ChartsClipPath id={clipPathId}/>}*/}
              </ResponsiveChartContainer>

              <Slider
                value={xLimits}
                onChange={handleChange}
                valueLabelDisplay="off"
                min={new Date(2018, 6 , 1).getTime()}
                max={new Date(2025, 0 , 1).getTime()}
                sx={{mt: 2}}
              />
            </div>
          ) : (
            <p>Loading</p>
          )}
        </Box>
          {/*<div>*/}
          {/*  {data.length > 0 ? (*/}
          {/*    <DaylioHeatmap data={data}></DaylioHeatmap>*/}
          {/*    ) : (*/}
          {/*    <p>Loading</p>*/}
          {/*    )}*/}
          {/*</div>*/}
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
