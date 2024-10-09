import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LineChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartOptions: ApexOptions = {
    chart: {
      id: 'basic-line',
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories: data.map((entry) => entry.date),
      title: {
        text: 'Date',
      },
    },
    yaxis: {
      title: {
        text: 'Number of Classes',
      },
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Classes per Day',
      align: 'left',
    },
  };

  const chartSeries = [
    {
      name: 'Classes',
      data: data.map((entry) => entry.count),
    },
  ];

  return (
    <div className="w-full flex items-center mt-5">
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" width={500} height={400} />
    </div>
  );
};

export default LineChart;
