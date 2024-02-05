import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from "moment";
// import Year from "./Year";
import backIcon from '../assert/images/backIcon.svg';
import nextIcon from '../assert/images/nextIcon.svg';
import { startOf, add } from "react-big-calendar/lib/utils/dates";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { useActiveWeb3React } from '../../../hooks/web3'
import _ from 'lodash'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './dropdown.min.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.sass";
import Modals from "../modal/Modal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getEventData } from '../API/ApiCall'
import Loader from '../Loader/Loader';
import LoaderComp from "../../../shared/components/LoaderComponent";

let date
const localizer = momentLocalizer(moment);
localizer.formats.yearHeaderFormat = 'YYYY'
let cusAccount
let cDate = new Date()
let eventResultsDataArray = [];
const globalAllEvents = []
const getAllEvents = async (startDate, enddate) => await getEventData(cusAccount, startDate, enddate).then(res => res);

const ReactCalender = () => {
  const { account, chainId, library } = useActiveWeb3React()
  cusAccount = account;
  const [allEvents, setEvents] = useState([]);
  const [calendardate, setCalendardate] = useState(new Date())
  const [open, setOpen] = useState(false);
  const [modalData, setmodalData] = useState([]);
  const [viewSelected, setViewSelected] = useState('month');
  const [loader, setLoader] = useState(false);
  
  const toggle = (e) => {
    let resultsArray = []
    resultsArray.push(e)
    return setmodalData(resultsArray), setOpen(!open)
  };

  

  useEffect(() => {
    (async () => {
      setLoader(account ? true : false)
      console.log('AgainCalled Me');
      eventResultsDataArray = []
      eventResultsDataArray = (await getAllEvents(moment().startOf(viewSelected).format('X'), moment().endOf(viewSelected).format('X')).then(res => res))
      setEvents(eventResultsDataArray)
      setLoader(false)
    })();
  }, [viewSelected]);

  const updateView = (view) => {
    setEvents(view)
  }

  // const onNavigate = useCallback((newDate) => setCalendardate(newDate), [setCalendardate])

  return (
    <div className="reactCalender">
      {/* {loader ? <LoaderComp isOpen={loader} onClose={() => setLoader(false)} /> : <></>} */}
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView={viewSelected}
        components={{ toolbar: ({ ...props }) => <CalendarToolbar updateViews={updateView} {...props} /> }}
        events={allEvents}
        style={{ height: "100vh" }}
        views={{
          day: true,
          week: true,
          month: true,
          year: Year,
        }}
        eventPropGetter={event => ({
          style: {
              backgroundColor: event.colorCode
          }
        })}
        
        // messages={{ year: Year }}
        // onNavigate={onNavigate}
        onSelectEvent={(e) => toggle(e)}
      />
      <Modals open={open} toggle={toggle} eventProjectData={modalData} />
    </div>
  );
};

class CalendarToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log('dataaaa IF:')
    const year = new Date(this.props.date).getFullYear();
    let startDate = new Date();
    let endDate = new Date();
    if (this.props.view === "week") {
      startDate = new Date(this.props.label.split('–')[0] + year);
      if (!(/^[a-zA-Z]/.test(this.props.label.split('–')[1]))) {
        endDate = new Date(this.props.label.split('–')[0].split(' ')[0] + this.props.label.split('–')[1] + ' ' + year);
      } else {
        endDate = new Date(this.props.label.split('–')[1] + year);
      }
    } else if (this.props.view === "day") {
      startDate = new Date(this.props.label + ' ' + year);
      endDate = new Date(this.props.label + ' ' + year);
    } else if (this.props.view === "month") {
      startDate = new Date(this.props.label);
      endDate = new Date(this.props.label);
    } else if (this.props.view === "year") {
      startDate = new Date(this.props.label);
      endDate = new Date(this.props.label);
    }
    // console.log('Start Date', startDate);
    // console.log('End Date', endDate);
    // console.log('this.props.view', this.props.view, prevProps.view);
    // console.log('this.props.label', this.props.label, prevProps.label);
    // console.log('Date', moment(startDate).startOf(this.props.view), moment(endDate).endOf(this.props.view));
    eventResultsDataArray = []
    if (this.props.view !== prevProps.view) {
      console.log('Come IF');
      eventResultsDataArray = (await getAllEvents(moment(startDate).startOf(this.props.view).format('X'), moment(endDate).endOf(this.props.view).format('X')).then(res => res))
      this.props.updateViews(eventResultsDataArray)
    } else if (this.props.label !== prevProps.label) {
      console.log('Come Else');
      eventResultsDataArray = (await getAllEvents(moment(startDate).startOf(this.props.view).format('X'), moment(endDate).endOf(this.props.view).format('X')).then(res => res))
      this.props.updateViews(eventResultsDataArray)
    }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <div className="customeToolbar">
        <div className="rbc-toolbar-label">{this.props.label}</div>
        <div className="dropDownToday">
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {this.props.view}
            </DropdownToggle>

            <DropdownMenu>

              <DropdownItem
                type="button"
                value='year'
                onClick={() => this.props.onView('year')}
              >Year</DropdownItem>

              <DropdownItem
                type="button"
                value='month'
                onClick={() => this.props.onView('month')}
              >Month</DropdownItem>

              <DropdownItem
                type="button"
                value='week'
                onClick={() => this.props.onView('week')}
              >Week</DropdownItem>

              <DropdownItem
                type="button"
                value='day'
                onClick={() => this.props.onView('day')}
              >Day</DropdownItem>
            </DropdownMenu>

          </Dropdown>

          <div className="rbc-btn-group">
            <button type="button" onClick={() => this.props.onNavigate('TODAY')}>today</button>
            <button type="button" onClick={() => this.props.onNavigate('PREV')}><img src={backIcon} /></button>
            <button type="button" onClick={() => this.props.onNavigate('NEXT')}><img src={nextIcon} /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReactCalender;

// --------------------------------------------------------------

function createCalendar(currentDate) {
  if (!currentDate) {
    currentDate = moment();
  } else {
    currentDate = moment(currentDate);
  }

  const first = currentDate.clone().startOf("month");
  const last = currentDate.clone().endOf("month");

  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week = [];
    calendar.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = currentDate.clone().set("date", day + 1 - first.day());
      date.calendar = calendar;
      week.push(date);
    }
  }

  return calendar;
}

function CalendarDate(props) {
  const { dateToRender, dateOfMonth, events } = props;
  const containEvent = events.find(el => moment(el.start).format('YYYY-MM-DD') === dateToRender.format("YYYY-MM-DD"))
  const today = containEvent ? "today" : "";

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`date in-month ${today}`}
      onClick={() => props.onClick(dateToRender)}
    // onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender.date()}
    </button>
  );
}

class Calendars extends CalendarToolbar {

  state = {
    calendar: undefined,
    drawerOpen: false,
    selectedDate: [{
      "_id": "6206068fda6fa19c34466714",
      "startDate": new Date(1644561902 * 1000),
      "endDate": new Date(1644648302 * 1000),
      "title": "Event one"
    }],
    open: false,
    modalData: [],
    allEventData:[]
  }

  componentDidMount() {
    this.setState({ calendar: createCalendar(this.props.date) });
  }

  // async componentDidMount() {
  //   this.setState({ allEventData: (await getAllEvents(moment().startOf(this.props.view).format('X'), moment().endOf(this.props.view).format('X')).then(res => res)) });
  // }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ calendar: createCalendar(this.props.date) });
    }
  }

  selectedEvent = async (date) => {
    const filterResultsDataArray = eventResultsDataArray.filter(eventObj => moment(eventObj.start).format("YYYY-MM-DD") === moment(date).format('YYYY-MM-DD'))
    console.log('filterResultsDataArray:', filterResultsDataArray);
    if (filterResultsDataArray.length > 0) {
      //const selectedDateEvents = (await getAllEvents(moment(date).startOf('day').format('X'), moment(date).endOf('day').format('X')).then(res => res))
      this.setState({ calendar: createCalendar(date), open: !this.state.open, modalData: filterResultsDataArray });
    }
  }

  toggle = (e) => {
    console.log('e-->', e);
    let resultsArray = []
    resultsArray.push(e)
    this.setState((prevState) => ({ modalData: resultsArray, open: !prevState.open, drawerOpen: false }))
  };

  render() {
    if (!this.state.calendar) {
      return null;
    }

    let backdrop;
    let drawerClasses = 'side-drawer'
    if (this.state.drawerOpen) {
      drawerClasses = 'side-drawer open';
      backdrop = <div
        className="backdrop"
        onClick={() => this.setState({
          drawerOpen: false
        })}
      />;
    }

    return (
      <>
        <Modals open={this.state.open} toggle={this.toggle} eventProjectData={this.state.modalData} />
        <div className={drawerClasses}>
          {this.state.selectedDate.map(el => <div onClick={() => {
            console.log('el', el);
            this.toggle(el);
          }} style={{ backgroundColor: '#ff0071', color: 'white', borderRadius: 5, margin: 10, paddingLeft: 5, cursor: 'pointer' }}>{el.title}</div>)}
        </div>
        {backdrop}
        <div className="month">
          <div className="month-name">
            {this.state.calendar.currentDate.format("MMMM").toUpperCase()}
          </div>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <span key={index} className="day">
              {day}
            </span>
          ))}
          {this.state.calendar.map((week, index) => (
            <div key={index}>
              {week.map((date) => (
                <CalendarDate
                  key={date.date()}
                  dateToRender={date}
                  dateOfMonth={this.state.calendar.currentDate}
                  events={this.props.events}
            
                  //onSelectEvent={this.selectedEvent}
                  // onSelectEvent={this.navigate('TODAY')}
                  //onClick={() => this.props.onView('month')}
                  onClick={this.selectedEvent}
                />
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }
}

class Year extends React.Component {
  render() {
    let { date, events, onView, ...props } = this.props;
    console.log('prosp  =====> ', props)
    let range = Year?.range(date);
    const months = [];
    const firstMonth = startOf(date, "year");
    for (let i = 0; i < 12; i++) {
      months.push(
        <Calendars key={i + 1} date={add(firstMonth, i, "month")} events={events} onView={onView} />
      );
    }

    return <div className="year">{months?.map((month) => month)}</div>;
  }
}

Year.range = (date) => {
  return [startOf(date, "year")];
};

Year.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return add(date, -1, "year");

    case navigate.NEXT:
      return add(date, 1, "year");

    default:
      return date;
  }
};

Year.title = (date, { localizer }) =>
  localizer.format(date, "yearHeaderFormat");