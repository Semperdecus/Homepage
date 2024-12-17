import React, {useEffect, useState} from 'react';
import {Colors, getMoodColor, moodIcons} from "../MoodLegend";
import Image from "next/image";

const HighlightContainer = ({imageSrc, text, date, position, mood}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    // Set the visibility to true after component mounts
    setIsVisible(true);
  }, []);

  const determineXPosition = () => {
    const targetDate = new Date(date);
    const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
    const diff = targetDate - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${dayOfYear * 9.445 + 1}px`; // I got this number through trail-and-error :)
  };

  const containerStyle = {
    pointerEvents: 'auto',
    position: 'absolute',
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2)',
    background: "#121212",
    width: '250px',
    height: '180px',
    left: determineXPosition(),
    top: (position - 1) * 202,
    opacity: isVisible ? 1 : 0, // Fade-in effect
    transform: isVisible ? 'translateY(0)' : 'translateY(10px)', // Move into place
    transition: 'opacity 0.1s ease, transform 0.5s ease', // Transition effect
    borderRadius: '0px 5px 5px 5px',
    borderTop: `1px solid ${getMoodColor(mood)}`,
    borderLeft: `1px solid ${getMoodColor(mood)}`,
  }

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isHovered ? 0.3 : 1,
    transition: 'opacity 0.1s ease',
    borderRadius: '0px 5px 5px 5px',
  };
  const commonStyle = {
    position: 'absolute',
    fontSize: '13px',
    color: 'white',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
    zIndex: 10,
    fontFamily: 'Rubik, sans-serif',
    fontStyle: 'normal',
  };

  const textStyle = {
    ...commonStyle,
    left: '10px',
    marginRight: '5px',
    top: '50px',
    fontWeight: 300,
  };

  const dateStyle = {
    ...commonStyle,
    left: '10px',
    top: '18px',
    fontWeight: 800,
  };
  const iconStyle = {
    ...commonStyle,
    top: '15px',
    right: '10px',
    minWidth: "30px",
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageSrc && <Image width={250} height={180} src={imageSrc} alt="highlighted" style={imageStyle}/>}
      <div style={iconStyle}>{moodIcons[mood]}</div>
      <div style={dateStyle}>{new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))}</div>
      <div style={textStyle}>{text}</div>
    </div>
  );
};

export default HighlightContainer;
