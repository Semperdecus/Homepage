import React, {useState} from 'react';
import {HiOutlinePhoto} from "react-icons/hi2";
import {Colors} from "./MoodLegend";

const Options = ({onIconClick}) => {
  const [isActive, setIsActive] = useState(false);

  const handleIconClick = () => {
    setIsActive(!isActive);
    if (onIconClick) {
      onIconClick();
    }
  };

  const containerStyle = {
    position: 'fixed',
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
    left: 20,
    bottom: 20,
    zIndex: 999,
    pointerEvents: 'auto',
  };

  return (
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
    </div>
  );
};

export default Options;
