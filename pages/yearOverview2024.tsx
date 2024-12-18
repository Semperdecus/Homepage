import {getGlobalData} from '../utils/global-data';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchAndParseCsv} from "../utils/csvUtil";
import {processMoodData} from "../utils/daylioUtil";
import MoodChart from "../components/YearOverview2024/MoodChart";
import {MoodLegend} from "../components/YearOverview2024/MoodLegend";
import highlightDataUnfiltered from '../components/YearOverview2024/highlights/highlights.json';
import photoData from '../components/YearOverview2024/photoBackground/photos.json';
import photoBackgroundPythonScript from '../components/YearOverview2024/photoBackground/photoBackground.json';
import HighlightContainer from "../components/YearOverview2024/highlights/HighlightContainer";
import MoodSummary from "../components/YearOverview2024/MoodSummary";
import PhotoContainer from "../components/YearOverview2024/photoBackground/PhotoContainer";
import Options from "../components/YearOverview2024/Options";

export default function Index() {
  const [moodData, setMoodData] = useState<{ date: string; moodScore: number }[]>([]);
  const [isPhotoBackgroundActive, setIsPhotobackgroundActive] = useState(false);
  const [highlightData, setHighlightData] = useState(
    highlightDataUnfiltered.filter(item => !item.hide)
  );

  const handleIconClick = () => {
    setIsPhotobackgroundActive(!isPhotoBackgroundActive);
  };
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

  // Trigger feature
  let typedString = "";

  useEffect(() => {
    const handleKeyPress = (e) => {
      typedString += e.key;

      // If the typed string is "help", modify highlightData
      if (typedString.toLowerCase() === 'help') {
        setHighlightData(highlightDataUnfiltered);

        typedString = '';
      }

      if (typedString.length > 4) {
        typedString = typedString.slice(1);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const randomizedBackgroundPhotoData = () => {
    return [...photoData, ...photoBackgroundPythonScript, ...highlightDataUnfiltered].sort(() => Math.random() - 0.5); // Shuffle the array randomly
  };

  // const highlightData = highlightDataUnfiltered.filter(item => !item.hide);

  return (
    <main
      className="bg-repeat bg-[length:512px_512px] h-screen overflow-x-auto"
      style={{background: "#151515"}}
    >
      <div style={{
        position: "relative",
        height: "864px",
        width: "3294px",
        left: 30,
        top: 30,
        display: "flex",
        zIndex: 1,
        pointerEvents: "none",
      }}>
        {!isPhotoBackgroundActive && <MoodLegend />}
        {!isPhotoBackgroundActive && <MoodChart data={moodData} highlightData={highlightData} />}
        <Options onIconClick={handleIconClick}/>
        {!isPhotoBackgroundActive && <div style={{position: "absolute", top: "250px", left: "42px", zIndex: 1}}>
          {highlightData.map((highlight, index) => (
            <HighlightContainer
              key={index}
              imageSrc={highlight.imageSrc}
              text={highlight.text}
              date={highlight.date}
              position={highlight.position}
              mood={highlight.mood}
            />
          ))}
        </div>}
        {!isPhotoBackgroundActive && <MoodSummary data={moodData}/>}
        <PhotoContainer data={randomizedBackgroundPhotoData()} photoBackgroundSpotLight={isPhotoBackgroundActive}/>
      </div>
    </main>
  );
}

export function getStaticProps() {
  const globalData = getGlobalData();

  return {props: {globalData}};
}
