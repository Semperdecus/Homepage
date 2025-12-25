import React, {useMemo, useState} from 'react';
import Image from "next/image";

const PhotoContainer = ({data, photoBackgroundSpotLight}) => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const containerStyle = {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    padding: 0,
    margin: 0,
    width: '3694px',
    left: -50,
    top: -50,
  };

  const textStyle = {
    position: 'absolute',
    top: 20,
    fontSize: '13px',
    color: 'white',
    zIndex: 10,
    fontFamily: 'Rubik, sans-serif',
    fontStyle: 'normal',
    fontWeight: 300,
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('nl', options).format(date);
  };

  const handleImageClick = (index) => {
    if (photoBackgroundSpotLight && highlightedIndex === null) {
      setHighlightedIndex(index);
    } else {
      setHighlightedIndex(null)
    }
  };

  const handleCloseModal = () => {
    setHighlightedIndex(null);
  };

  const rotations = useMemo(() => {
    return data.map(() => Math.floor(Math.random() * 21) - 10);
  }, [data]);

  return (
    <>
      <ul style={containerStyle}>
        {data.map((item, index) => {
          const itemStyle = {
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            objectFit: 'cover',
            height: '144px',
            transform: `rotate(${rotations[index]}deg)`,
            borderRadius: '5px',
            borderTop: '1px solid #FFFFFF22',
            borderLeft: '1px solid #FFFFFF22',
            opacity: clickedIndex === index || photoBackgroundSpotLight ? 1 : 0.1,
            transition: "opacity 0.3s ease",
            pointerEvents: 'auto',
            margin: -5,
            zIndex: 0,
            filter: clickedIndex === index || photoBackgroundSpotLight ? 'none' : 'grayscale(100%)',
          };

          const hoverStyle = {
            transition: 'transform 0.3s ease',
            transform: isHovered === index && photoBackgroundSpotLight ? 'scale(1.1)' : 'scale(1)',
          }

          return (
            <li key={index}
                style={hoverStyle}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}>
              <Image width={item.landscape ? 208 : 108} height={144} style={itemStyle} src={item.imageSrc}
                     alt={item.text}
                     onMouseDown={() => setClickedIndex(index)}
                     onMouseUp={() => setClickedIndex(null)}
                     onClick={() => handleImageClick(index)}
                     loading="lazy"
              />
            </li>
          )
        })}
      </ul>
      {highlightedIndex !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={handleCloseModal} // Close modal on background click
        >
          <p style={textStyle}>{formatDate(data[highlightedIndex].date)}</p>
          <img
            src={data[highlightedIndex].imageSrc}
            alt={data[highlightedIndex].date}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderTop: '1px solid #FFFFFF22',
              borderLeft: '1px solid #FFFFFF22',
              borderRadius: '10px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      )}
    </>
  )
};

export default PhotoContainer;
