import React from 'react';

const HighlightOptions = ({impact}) => {
  const containerStyle = {
    position: 'fixed',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    background: "#555555",
    width: '250px',
    height: '50px',
    left: 20,
    bottom: 20,
    zIndex: 999,
  };

  return (
    <div
      style={containerStyle}
    >
      <p>test</p>
    </div>
  );
};

export default HighlightOptions;
