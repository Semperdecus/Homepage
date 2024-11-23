import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, {GradientBackground} from '../components/Layout';
import {getGlobalData} from '../utils/global-data';
import SEO from '../components/SEO';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {fetchAndParseCsv} from "../utils/csvUtil";
import DaylioResponsiveChart from "../components/DaylioResponsiveChart";

export default function Index({globalData}) {
  const [data, setData] = useState([]);
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
        setData(chartData);
      })
      .catch((error: any) => console.error("Error fetching or parsing CSV file:", error));
  }, []);

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.siteTitle}/>
      <Header name={globalData.name}/>
      <main className="w-full">
        <Box>
          {data.length > 0 ? (
            <div>
              <DaylioResponsiveChart data={data} moodLabels={moodLabels} />
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
