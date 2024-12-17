import {getGlobalData} from '../utils/global-data';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchAndParseCsv} from "../utils/csvUtil";
import {processMoodData} from "../utils/daylioUtil";
import MoodChart from "../components/YearOverview2024/MoodChart";
import {MoodLegend} from "../components/YearOverview2024/MoodLegend";
import highlightData from '../components/YearOverview2024/highlights/highlights.json';
import photoData from '../components/YearOverview2024/photoBackground/photos.json';
import photoBackgroundPythonScript from '../components/YearOverview2024/photoBackground/photoBackground.json';
import HighlightContainer from "../components/YearOverview2024/highlights/HighlightContainer";
import MoodSummary from "../components/YearOverview2024/MoodSummary";
import PhotoContainer from "../components/YearOverview2024/photoBackground/PhotoContainer";

export default function Index() {
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

  const randomizedBackgroundPhotoData = () => {
    return [...photoData, ...photoBackgroundPythonScript].sort(() => Math.random() - 0.5); // Shuffle the array randomly
  };

  return (
    <main
      className="bg-repeat bg-[length:512px_512px] h-screen overflow-x-auto"
      style={{background: "#151515"}}
    >
      <div style={{
        position: "relative",
        margin: "auto",
        height: "864px",
        width: "3294px",
        display: "flex",
        zIndex: 1,
        pointerEvents: "none",
      }}>
        <MoodLegend/>
        <MoodChart data={moodData}/>
        {/*<Options impact={1}/>*/}
        <div style={{position: "absolute", top: "250px", left: "42px", zIndex: 1}}>
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
        <MoodSummary data={moodData} />
        <PhotoContainer data={randomizedBackgroundPhotoData()} />

      </div>
    </main>
  );
}

export function getStaticProps() {
  const globalData = getGlobalData();

  return {props: {globalData}};
}
