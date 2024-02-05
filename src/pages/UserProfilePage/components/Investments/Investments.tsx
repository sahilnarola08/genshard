import React from "react";
import "./style.sass";

const Investments = () => {
  const InvestmentsData = [
    {
      title: "Cryptoids.world",
      count: 50,
      bgColor: "#00DAB3",
    },
    {
      title: "Supernova",
      count: 40,
      bgColor: "#FC9612",
    },
    {
      title: "Karmaverse",
      count: 40,
      bgColor: "#0066FF",
    },
    {
      title: "kala",
      count: 50,
      bgColor: "#6600FF",
    },
    {
      title: "Genshards",
      count: 40,
      bgColor: "#FF0071",
    },
    {
      title: "123swap",
      count: 40,
      bgColor: "#FF3D00",
    },
    {
      title: "kala",
      count: 40,
      bgColor: "#6600FF",
    },
  ];
  const inverstBubbleData = [
    {
      title: "GS",
      bgColor: "#FF0071",
      size: 71,
    },
    {
      title: "Karmaverse",
      bgColor: "#0066FF",
      size: 164,
    },
    {
      title: "Supernova",
      bgColor: "#FC9612",
      size: 170,
    },
    {
      title: "Cryptoids.world",
      bgColor: "#00DAB3",
      size: 280,
    },
    {
      title: "kala",
      bgColor: "#6600FF",
      size: 89,
    },
    {
      title: "123swap",
      bgColor: "#FF3D00",
      size: 215,
    },
  ];
  return (
    <div className="Investments">
      <div className="bubbleChart">
        {inverstBubbleData.map((invest, ind) => (
          <div
            key={ind}
            style={{ backgroundColor: `${invest.bgColor}`,width:`${invest.size}px`,height:`${invest.size}px` }}
            className="bubbleItem"
          >
            {invest.title}
          </div>
        ))}
      </div>
      <div className="investmentsDetail">
        {InvestmentsData.map((invest, ind) => (
          <div key={ind} className="investLabelCount">
            <div
              className="label"
              style={{ borderLeft: `4px solid ${invest.bgColor}` }}
            >
              {invest.title}
            </div>
            <div className="count">{invest.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investments;
