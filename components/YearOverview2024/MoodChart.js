import React from "react";
import {Line} from "react-chartjs-2";
import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import {Colors, getMoodColor} from './MoodLegend';

ChartJS.register(annotationPlugin, LineElement, PointElement, LinearScale, Title, CategoryScale);

// Add extra lines for highlight dates
const highlightAnnotations = (data) => data.reduce((annotations, entry) => {
  {
    data.map((highlight) => {
      if (highlight.date.includes(entry.date)) {
        annotations.push({
          type: "line",
          xMin: entry.date,
          xMax: entry.date,
          yMin: highlight.position * -4.5,
          borderColor: getMoodColor(highlight.mood),
          borderWidth: 1,
        });
      }
    })
  }

  return annotations;
}, []);

// Create an array of lines for the start of each month
const monthlyAnnotations = (data) => data.reduce((annotations, entry, index) => {
  const currentDate = new Date(entry.date);
  const currentMonth = currentDate.getMonth(); // Get the current month (0-11)

  // Check if this entry is the first day of a new month
  if (index === 0 || new Date(data[index - 1].date).getMonth() !== currentMonth) {
    annotations.push({
      type: "line",
      xMin: entry.date,
      xMax: entry.date,
      borderColor: "rgba(255, 255, 255, 0.4)",
      borderWidth: 1,
      borderDash: [2, 4], // Dotted line (px dash, px space)
      label: {
        position: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the label
        font: {
          size: 10,
        },
      },
    });
  }

  return annotations;
}, []);

export default function MoodChart({data, highlightData}) {
  // Transform the data for the chart
  const chartData = {
    labels: data.map((entry) => entry.date), // X-axis: dates
    datasets: [
      {
        data: data.map((entry) => entry.moodScore), // Y-axis: mood scores
        borderColor: "#4A90E2", // Line color
        tension: 0.1, // Smooth curves
        pointRadius: 0,
        segment: {
          stepped: true,
          borderColor: function (context) {
            const yval = context.p1.raw
            if (yval === 5) {
              return Colors.Rad
            } else if (yval >= 4) {
              return Colors.Good
            } else if (yval >= 3) {
              return Colors.Meh
            } else if (yval >= 2) {
              return Colors.Sad
            } else if (yval >= 1) {
              return Colors.Awful
            }
          }
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        position: 'top',

        ticks: {
          callback: function (val) {
            const date = new Date(this.getLabelForValue(val));
            if (date.getDate() === 1) {
              return date.toLocaleString('default', {month: 'short'});
            }

            return "";
          },
          maxRotation: 0, // Make sure the ticks are horizontal (no rotation)
          minRotation: 0, // Ensure no rotation on smaller screens
          autoSkip: false,
          color: 'rgba(255, 255, 255, 0.4)',
        },
        grid: {
          display: false, // Remove grid lines from x-axis
        },
      },
      y: {
        min: -18,
        max: 5.2,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [...highlightAnnotations(highlightData), ...monthlyAnnotations(data)],
      },
      legend: {
        display: false,
      }
    },
    animation: false
  };

  return <Line data={chartData} options={chartOptions}/>;
}
