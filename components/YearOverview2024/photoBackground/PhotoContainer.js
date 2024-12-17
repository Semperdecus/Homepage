import React, {useMemo, useState} from 'react';
import Image from "next/image";

const PhotoContainer = ({data}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const containerStyle = {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    padding: 0,
    margin: 0,
    width: '3694px',
  };

  const rotations = useMemo(() => {
    return data.map(() => Math.floor(Math.random() * 21) - 10);
  }, [data]);

  return (
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
          opacity: hoveredIndex === index ? 0.8 : 0.1,
          transition: "opacity 0.3s ease",
          pointerEvents: 'auto',
          margin: -5,
          zIndex: 0,
          filter: hoveredIndex === index ? 'none' : 'grayscale(100%)',  // Apply grayscale unless hovered
        };

        return (
          <li key={index}>
            <Image width={item.landscape ? 208 : 108} height={144} style={itemStyle} src={item.imageSrc} alt={item.text}
                 onMouseDown={() => setHoveredIndex(index)}
                 onMouseUp={() => setHoveredIndex(null)}
                 loading="lazy"
            />
          </li>
        )
      })}
    </ul>
  );
};

export default PhotoContainer;
