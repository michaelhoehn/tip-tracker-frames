import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: [...Array(7).keys()]
      .map((i) =>
        new Date(
          new Date().setDate(new Date().getDate() - i)
        ).toLocaleDateString()
      )
      .reverse(),
    datasets: [
      {
        label: "Tips received",
        data: data.reverse(),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        width: "600px",
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
