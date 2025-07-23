import React from 'react';
import { Bar } from 'react-chartjs-2';

const TeamPerformance = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Revenue Generated',
        data: data.map(item => item.revenueGenerated),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default TeamPerformance;