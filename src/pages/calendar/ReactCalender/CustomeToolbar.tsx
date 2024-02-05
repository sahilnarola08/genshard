import moment from "moment";
import React, { useState } from "react";


function RBCToolbar(props: any) {
  const [viewState, setViewState] = useState("month");
  const getCustomToolbar = () => {
    // const toolbarDate = props.date;
    const goToDayView = () => {
      props.onView("day");
      setViewState("day");
      return null;
    };
    const goToWeekView = () => {
      props.onView("week");
      setViewState("week");
      return null;
    };
    const goToMonthView = () => {
      props.onView("month");
      setViewState("month");
      return null;
    };
    const goToAgendaView = () => {
      props.onView("agenda");
      setViewState("agenda");
      return null;
    };
    const goToBack = () => {
      let view = viewState;
      let mDate = props.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 1,
          1
        );
      }
      props.onNavigate("prev", newDate);
    };
    const goToNext = () => {
      let view = viewState;
      let mDate = props.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 7,
          1
        );
      } else {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 1,
          1
        );
      }
      props.onNavigate("next", newDate);
      return null;
    };

    const goToToday = () => {
      const now = new Date();
      props.date.setMonth(now.getMonth());
      props.date.setYear(now.getFullYear());
      props.date.setDate(now.getDate());
      props.onNavigate("current");
    };

    const goToBackYear = () => {
      let mDate = props.date;
      let newDate = new Date(mDate.getFullYear() - 1, 1);
      props.onNavigate("prev", newDate);
      return null;
    };

    const goToNextYear = () => {
      let mDate = props.date;
      let newDate = new Date(mDate.getFullYear() + 1, 1);
      props.onNavigate("next", newDate);
      return null;
    };

    const month = () => {
      const date = moment(props.date);
      let month = date.format("MMMM");
      let day = date.format("D");

      return (
        <span className="rbc-toolbar-label rbc-date">
          <i className="far fa-calendar"></i> <span>{`${month} ${day}`}</span>
        </span>
      );
    };
    const year = () => {
      const date = moment(props.date);
      let year = date.format("YYYY");

      return (
        <span className="rbc-btn-group">
          {viewState === "month" && (
            <button type="button" onClick={goToBackYear}>
              <span className="prev-icon">&#8249;&#8249;</span>
            </button>
          )}
          <span className="rbc-toolbar-label">{year}</span>
          {viewState === "month" && (
            <button type="button" onClick={goToNextYear}>
              <span className="prev-icon">&#8250;&#8250;</span>
            </button>
          )}
        </span>
      );
    };

    const day = () => {
      let view = viewState;
      const date = moment(props.date);
      let day;
      if (view === "day") {
        day = date.format("ddd") + " " + date.format("Do");
      }
      return <span className="rbc-toolbar-label">{day}</span>;
    };

    return (
      <div className="rbc-toolbar">
        <div className="rbc-toolbar-item-1">
          <div className="flex-row">
            <p className="text-muted" style={{ margin: "0" }}>              
              Study Time
            </p>
          </div>
        </div>
        <div className="rbc-toolbar-item-2">
          <span className="rbc-btn-group">
            <span className="next-icon today" onClick={goToToday}>
              Today
            </span>

            <span className="prev-icon" id="prev-btn-icon" onClick={goToBack}>
              &#8249;
            </span>

            <span className="next-icon" id="next-btn-icon" onClick={goToNext}>
              &#8250;
            </span>
          </span>
          {month()}        
          <span className="rbc-btn-group">
            <button className="" onClick={goToMonthView}>
              <span className="label-filter-off">Month</span>
            </button>
            <button className="" onClick={goToDayView}>
              <span className="label-filter-off">Day</span>
            </button>
            <button className="" onClick={goToWeekView}>
              <span className="label-filter-off">Week</span>
            </button>
            <button className="" onClick={goToAgendaView}>
              <span className="label-filter-off">Agenda</span>
            </button>
          </span>
        </div>
      </div>
    );
}}

  export default RBCToolbar;