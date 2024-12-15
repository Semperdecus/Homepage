import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactApexChart to disable SSR for this component
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type DaylioHeatmapProps = {
  data: {
    name: string;
    data: number[];
  }[];
};

const DaylioHeatmap: React.FC<DaylioHeatmapProps> = ({ data }) => {
  const options = {
    chart: {
      height: 800,
      type: "heatmap",
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      heatmap: {
        radius: 80,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 1,
              to: 1.9,
              color: "#eb5869",
              name: 'awful',
            },
            {
              from: 2,
              to: 2.9,
              color: "#e99b36",
              name: 'bad',
            },
            {
              from: 3,
              to: 3.9,
              color: "#f5c859",
              foreColor: "#f5c859",
              name: 'meh',
            },
            {
              from: 4,
              to: 4.9,
              color: "#77c294",
              name: 'good',
            },
            {
              from: 5,
              to: 6,
              color: "#39c5bf",
              name: 'rad',
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      position: 'bottom',
    },
  };

  return (
    <div>
      {/*<ReactApexChart options={options} series={data} type="heatmap" />*/}
    </div>
  );
};

export default DaylioHeatmap;
