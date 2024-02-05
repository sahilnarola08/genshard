import React from "react";
import "./style.sass"
const FilterForProjects = ({ projects, handleFilter }:any) => {

  const filterItem = [
    {
      label: "King Arthur",
      count: 123,
    },
    {
      label: "Leonidas",
      count: 0,
    },
    {
      label: "Morgan Lefay",
      count: 23,
    },
    {
      label: "Morgan Lefay",
      count: 56,
    },
  ];

  return (
    <>
      {
        projects &&
        <div className="filterForProjects">
          <div className="projectTitle">PROJECTS</div>
          <hr />
          <div className="allFiters">
            {projects.map((item, ind) => (
              <div className="filterCheckCount">
                <div className="filterCheck">
                  <input type="checkbox" name={item.name} value={item.name} onChange={(e)=>e.target.checked ? handleFilter({checked:e.target.checked ,...item}) : handleFilter({checked:e.target.checked ,...item})
                  }/>
                  <label>{item.name}</label>
                </div>
                {/* <div className="count">{item.winnersCount}</div> */}
              </div>
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default FilterForProjects;
