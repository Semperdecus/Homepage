import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Colors} from "./MoodLegend";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MoodSummary = (data) => {
  const containerStyle = {
    pointerEvents: 'auto',
    position: 'absolute',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '220px',
    left: 980,
    top: 139,
    zIndex: 999,
    color: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
};

  const [moodCounts, setMoodCounts] = useState(null);

  // Calculate moodCounts when data changes
  useEffect(() => {
    if (data.data && data.data.length > 0) {
      const counts = data.data.reduce(
        (acc, {moodScore}) => {
          if (moodScore >= 1 && moodScore <= 1.9) {
            acc['awful']++;
          } else if (moodScore >= 2 && moodScore <= 2.9) {
            acc['bad']++;
          } else if (moodScore >= 3 && moodScore <= 3.9) {
            acc['meh']++;
          } else if (moodScore >= 4 && moodScore <= 4.9) {
            acc['good']++;
          } else if (moodScore === 5) {
            acc['rad']++;
          }
          return acc;
        },
        {'awful': 0, 'bad': 0, 'meh': 0, 'good': 0, 'rad': 0}
      );
      setMoodCounts(counts); // Update state with calculated counts
    } else {
      setMoodCounts(null); // Reset to null if no data
    }
  }, [data]);

  if (!moodCounts) {
    return null; // Render nothing while moodCounts is empty
  }

  const chartData = {
    labels: Object.keys(moodCounts), // ['awful', 'bad', 'meh', 'good', 'rad']
    datasets: [
      {
        label: true,
        data: Object.values(moodCounts), // [9, 56, 161, 111, 11]
        borderColor: [
          Colors.Awful, // awful - red
          Colors.Sad, // bad - orange
          Colors.Meh, // meh - yellow
          Colors.Good, // good - green
          Colors.Rad, // rad - blue
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <>
      <div style={containerStyle}>
        <Bar data={chartData} options={chartOptions}/>
      </div>
    </>
  );
};

export default MoodSummary;
