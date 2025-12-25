import React, {useState} from 'react';
import {HiOutlinePhoto} from "react-icons/hi2";
import {Colors} from "../MoodLegend";

const Options = ({onIconClick, activeYear}) => {
  const [isActive, setIsActive] = useState(false);

  const handleIconClick = () => {
    setIsActive(!isActive);
    if (onIconClick) {
      onIconClick();
    }
  };

  const navigateToYear = (year) => {
    if (activeYear === year) return;
    window.location.href = `/yearOverview${year}`;
  };

  const containerStyle = {
    position: 'fixed',
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
    left: 20,
    bottom: 20,
    zIndex: 999,
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const arrowStyle = {
    opacity: 1,
    animation: 'arrowPulseFade 5s ease forwards',
    pointerEvents: 'none',
  };

  const yearButtonsContainerStyle = {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 999,
    display: 'flex',
    gap: 12,
  };

  const yearButtonStyle = {
    pointerEvents: 'auto',
    padding: '8px 14px',
    fontSize: 14,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.5)',
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  };

  const activeYearButtonStyle = {
    ...yearButtonStyle,
    background: 'white',
    color: 'black',
    cursor: 'default',
  };

  return (
    <>
      <div
        style={containerStyle}
      >
        <HiOutlinePhoto onClick={handleIconClick}
                        size={30}
                        color={isActive ? 'white' : Colors.Rad}
                        style={{
                          cursor: 'pointer',
                          transition: 'color 0.3s ease',
                        }}/>
        <svg
          style={arrowStyle}
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M15 6L9 12L15 18"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={yearButtonsContainerStyle}>
        {[2024, 2025].map((year) => (
          <button
            key={year}
            style={activeYear === year ? activeYearButtonStyle : yearButtonStyle}
            onClick={() => navigateToYear(year)}
            disabled={activeYear === year}
          >
            {year}
          </button>
        ))}
      </div>
    </>
  );
};

export default Options;
