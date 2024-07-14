import React from "react";

interface ChartComponentProps {
  data: number[];
  dates: string[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, dates }) => {
  const maxAmount = Math.max(...data);
  const totalAmount = data.reduce(
    (total: number, amount: number) => total + amount,
    0
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "350px",
        width: "600px",
        backgroundColor: "#0A1128",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingRight: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #FFFFFF",
            width: "110%",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "-100px",
              fontSize: "1.5rem",
              textAlign: "left",
              color: "#FFFFFF",
            }}
          >
            {maxAmount}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #FFFFFF",
            width: "110%",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "-100px",
              fontSize: "1.5rem",
              textAlign: "left",
              color: "#FFFFFF",
            }}
          >
            {maxAmount / 2}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #FFFFFF",
            width: "110%",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "-100px",
              fontSize: "1.5rem",
              textAlign: "left",
              color: "#ffffff",
            }}
          >
            0
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "flex-end",
        }}
      >
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              margin: "0 2px",
              backgroundColor: "#8a2be2",
              border: "3px solid rgba(0, 255, 0, 1)",
              height: `${(value / maxAmount) * 100}%`,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              color: "rgba(0, 255, 0, 1)",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "1.5rem",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: "0",
                transform: "translateY(-100%)",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                whiteSpace: "nowrap",
                fontSize: "1.5rem",
              }}
            >
              {dates[index]}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "-65px",
          fontSize: "2rem",
          color: "#00FF00",
        }}
      >
        Total: {totalAmount} $degen
      </div>
    </div>
  );
};

export default ChartComponent;
