import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, {GradientBackground} from '../components/Layout';
import {getGlobalData} from '../utils/global-data';
import SEO from '../components/SEO';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchAndParseCsv} from "../utils/csvUtil";
import DaylioHeatmap from "../components/DaylioHeatmap";

export default function Index({globalData}) {
  const [scatterPlotdata, setScatterPlotdata] = useState([]);
  const [heatmapData, setHeatMapData] = useState([]);
  const moodToNumber = (mood) => {
    switch (mood) {
      case 'good':
        return 4;
      case 'meh':
        return 3;
      case 'rad':
        return 5;
      case 'bad':
        return 2;
      case 'awful':
        return 1;
      default:
        return 0; // Default for unknown moods
    }
  };

  const formatDataByDay = (rawData: any[]) => {
    // Create an object to store grouped data
    const groupedData: { [day: string]: number[] } = {};

    // Loop through rawData and group by day of the month
    rawData.forEach(entry => {
      const day = new Date(entry.name).getDate(); // Extract day of the month (e.g., 19 from "2024-11-19")
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      // Merge moods for that specific day
      const average = entry.data.reduce((sum, value) => sum + value, 0) / entry.data.length;
      const roundedAverage = Math.floor(average);

      groupedData[day].push(roundedAverage);
    });

    // Now, we will create the final formatted data
    const formattedData = [];

    // Iterate over the days (1 to 31), fill the final result
    for (let i = 1; i <= 31; i++) {
      // For each day, take all moods collected for that day
      const dayData = groupedData[i] || [];  // If no data for the day, use an empty array

      formattedData.push({
        name: String(i),  // Use the day of the month as name
        data: dayData,    // Use the collected moods for that day
      });
    }

    return formattedData;
  };

  useEffect(() => {
    fetchAndParseCsv("/files/daylio_export.csv").then((response) => {
      return response;
    })
      .then((parsedData) => {
        // Transform data
        const parsedScatterPlotData = parsedData.map((row) => ({
          x: new Date(`${row.full_date} ${row.time}`).getTime(), // Timestamp for x-axis
          y: moodToNumber(row.mood)
        }));
        setScatterPlotdata(parsedScatterPlotData);

        const groupedData = {};

        parsedData.forEach((row) => {
          const mood = moodToNumber(row.mood);

          // If this day already exists in groupedData, push the mood to its array
          if (groupedData[row.full_date]) {
            groupedData[row.full_date].push(mood);
            // TODO push placeholder mood of value 0 when it's a month with 30 days, and fill up february with placeholder moods of value 0 up to 31th day, keeping leap years in mind
          } else {
            // If this day doesn't exist, create it with the mood as the first entry
            groupedData[row.full_date] = [mood];
          }
        });

        // Map the groupedData into the required format
        const formattedData = Object.keys(groupedData).map((day) => ({
          name: day,  // Name is the day of the month (19, 20, etc.)
          data: groupedData[day],  // Moods for that day
        }));

        setHeatMapData(formatDataByDay(formattedData));
      })
      .catch((error: any) => console.error("Error fetching or parsing CSV file:", error));
  }, []);

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.siteTitle}/>
      <Header name={globalData.name}/>
      <main className="w-full">
        {/*<Box>*/}
        {/*  {scatterPlotdata.length > 0 ? (*/}
        {/*    <div>*/}
        {/*      <DaylioResponsiveChart data={scatterPlotdata} moodLabels={moodLabels} />*/}
        {/*    </div>*/}
        {/*  ) : (*/}
        {/*    <p>Loading</p>*/}
        {/*  )}*/}
        {/*</Box>*/}
        <div>
          {heatmapData.length > 0 ? (
            <DaylioHeatmap data={heatmapData}></DaylioHeatmap>
          ) : (
            <p>Loading</p>
          )}
        </div>
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
