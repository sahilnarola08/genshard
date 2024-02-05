import React from "react";
import "./style.sass";
export const investmentData = [
  {
    title: "Cryptoids.world",
    Percentage: 50,
    bgColor: "#00DAB3",
    invest: 304,
  },
  {
    title: "123swap",
    Percentage: 30,
    bgColor: "#FF3D00",
    invest: 208,
  },
  {
    title: "Supernova",
    Percentage: 22,
    bgColor: "#FC9612",
    invest: 165,
  },
  {
    title: "Kala",
    Percentage: 17,
    bgColor: "#6600FF",
    invest: 86,
  },
  {
    title: "Karmaverse",
    Percentage: 10,
    bgColor: "#FF0071",
    invest: 68,
  },
];
const Investment = () => {
  
  return (
    <div className="investment">
      <div className="investmentCharts">
        {investmentData.map((data, ind) => (
          <div
            key={ind}
            style={{
              width: `${data.invest}px`,
              height: `${data.invest}px`,
              fontSize: `${data.Percentage}px`,
              backgroundColor: `${data.bgColor}`,
            }}
            className="balloonGraphItem"
          >
            {data.title}
          </div>
        ))}
      </div>
      <div className="investmentBlock">
        {investmentData.map((data, ind) => (
          <div
            key={ind}
            style={{ borderLeft: `4px solid ${data.bgColor}` }}
            className="investmentItem"
          >{`${data.title} ${data.Percentage}`}</div>
        ))}
      </div>
    </div>
  );
};

export default Investment;
