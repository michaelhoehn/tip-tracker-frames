import React from "react";

const ChartComponent = ({ data }) => {
  const maxAmount = Math.max(...data);

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
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              margin: "0 2px",
              backgroundColor: "rgba(54, 255, 100, 0.2)",
              border: "1px solid rgba(0, 255, 0, 1)",
              height: `${(value / maxAmount) * 100}%`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              color: "rgba(0, 255, 0, 1)",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "2rem",
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartComponent;

// flex: 1,
// margin: "0 2px",
// backgroundColor: "rgba(54, 162, 235, 0.2)",
// border: "1px solid rgba(54, 162, 235, 1)",
// height: `${(value / maxAmount) * 100}%`,
// display: "flex",
// alignItems: "flex-end",
// justifyContent: "center",
// color: "#00FF00",
// fontFamily: "'Courier New', Courier, monospace",
// fontSize: "1rem",
