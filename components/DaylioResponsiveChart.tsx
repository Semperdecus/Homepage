import React, {useState} from 'react';
import { ChartsXAxis, ChartsYAxis, ResponsiveChartContainer, ScatterPlot } from "@mui/x-charts";
import { Slider } from "@mui/material";

interface DaylioResponsiveChartProps {
  data: any;
  moodLabels: Record<number, string>;
}

const DaylioResponsiveChart: React.FC<DaylioResponsiveChartProps> = ({ data, moodLabels }) => {
  const [xLimits, setXLimits] = useState<[number, number]>([1542231720000, 1737289680000]);  // Initialize with valid timestamps
  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const minDistance = 86400000; // 1 day in milliseconds (you can adjust this to a desired value)
    const newStart = new Date(newValue[0]).getTime();
    const newEnd = new Date(newValue[1]).getTime();

// Check if the difference is too small
    if (newEnd - newStart < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newStart, newEnd);
        setXLimits([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newStart, newEnd);
        setXLimits([clamped - minDistance, clamped]);
      }
    } else {
      // Ensure the xLimits are always ordered from smallest to largest
      setXLimits(newStart < newEnd ? [newStart, newEnd] : [newEnd, newStart]);
    }
  };

  return (
    <div>
      <ResponsiveChartContainer
        xAxis={[
          {
            min: xLimits[0],
            max: xLimits[1],
            scaleType: 'time',
            disableLine: true,
            valueFormatter: (time) => {
              const date = new Date(time);
              const options = { month: 'short', year: 'numeric' };
              // @ts-ignore
              return date.toLocaleDateString('en-US', options);
            },
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            min: 0.7,
            valueFormatter: (value) => {
              return moodLabels[value] ? moodLabels[value] : "";
            },
          },
        ]}
        series={[
          { type: 'scatter', data },
          {
            type: 'line',
            data: data.map(obj => obj.y),
            showMark: true,
          },
        ]}
        height={500}
      >
        <g>
          <ScatterPlot />
        </g>
        <ChartsXAxis
          disableTicks
          tickLabelStyle={{
            textAnchor: 'end',
            angle: -45,
          }}
        />
        <ChartsYAxis disableTicks />
      </ResponsiveChartContainer>

      <Slider
        value={xLimits}
        onChange={handleChange}
        valueLabelDisplay="off"
        min={new Date(2018, 6, 1).getTime()}
        max={new Date(2025, 0, 1).getTime()}
        sx={{ mt: 2 }}
      />
    </div>
  );
};

export default DaylioResponsiveChart;
