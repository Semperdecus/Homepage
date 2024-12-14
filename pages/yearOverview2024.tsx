import Layout from '../components/Layout';
import {getGlobalData} from '../utils/global-data';
import SEO from '../components/SEO';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchAndParseCsv} from "../utils/csvUtil";
import {processMoodData} from "../utils/daylioUtil";
import MoodChart from "../components/MoodChart";

export default function Index({globalData}) {
  const [moodData, setMoodData] = useState<{ date: string; moodScore: number }[]>([]);

  useEffect(() => {
    fetchAndParseCsv("/files/daylio_export.csv").then((response) => {
      return response;
    })
      .then((parsedData) => {
        const processedMoodData = processMoodData(parsedData.reverse());
        setMoodData(processedMoodData); // Store the processed data in state
      })
      .catch((error: any) => console.error("Error fetching or parsing CSV file:", error));
  }, []);

  return (
      <main
        className="bg-repeat bg-[length:512px_512px] h-screen overflow-x-auto overflow-y-hidden"
        // style={{backgroundImage: "url('/images/beigePatternClouds.png')"}}
      >
        <div style={{
          position: "relative",
          margin: "auto",
          height: "30vh",
          width: "300vw"
        }}>
          <MoodChart data={moodData}/>
        {/*  here I put images and fancy title for each important event */}
        {/*  here I put sections for each month overview */}
        </div>
      </main>
  );
}

export function getStaticProps() {
  const globalData = getGlobalData();

  return {props: {globalData}};
}
