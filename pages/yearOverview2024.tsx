import {getGlobalData} from '../utils/global-data';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchAndParseCsv} from "../utils/csvUtil";
import {processMoodData} from "../utils/daylioUtil";
import MoodChart from "../components/YearOverview2024/MoodChart";
import {MoodLegend} from "../components/YearOverview2024/MoodLegend";
import highlightData from '../components/YearOverview2024/highlights/highlights.json';
import HighlightContainer from "../components/YearOverview2024/highlights/HighlightContainer";
import HighlightOptions from "../components/YearOverview2024/highlights/HighlightOptions";

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
      style={{background: "#1A1A1A"}}
    >
      <div style={{
        position: "relative",
        margin: "auto",
        height: "864px",
        width: "3294px",
        display: "flex",
      }}>
        <MoodLegend/>
        <MoodChart data={moodData}/>
        <HighlightOptions impact={1}/>
        <div style={{position: "absolute", top: "250px", left: "42px"}}>
          {highlightData.map((highlight, index) => (
            <HighlightContainer
              key={index}
              imageSrc={highlight.imageSrc}
              text={highlight.text}
              date={highlight.date}
              position={highlight.position}
              mood={highlight.mood}/>
          ))}
        </div>

        {/*  here I put sections for each month overview */}
      </div>
    </main>
  )
    ;
}

export function getStaticProps() {
  const globalData = getGlobalData();

  return {props: {globalData}};
}
