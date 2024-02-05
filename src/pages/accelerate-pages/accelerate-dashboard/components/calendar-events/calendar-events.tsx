import React, { useEffect, useState } from 'react'
import "./calendar-events.sass"
import Elone from '../../../../../images/accelerate/pages/elon.svg';
import eventsImg1 from '../../../../../images/events/events-img-1.svg';
import eventsImg2 from '../../../../../images/events/events-img-2.svg';
import eventsImg3 from '../../../../../images/events/events-img-3.svg';
import eventsImg4 from '../../../../../images/events/events-img-4.svg';
import CalenderBig from '../../../../../images/events/calender-big.svg';
import CalenderView from '../../../../../images/events/calender-view.svg';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { ReminderCard } from './reminder-card/reminder-card';
import { ReminderDetailsCardData } from './details-card/details-card';
import { RadioDropdown } from '../../../vc-dashboard/components/radio-dropdown/radio-dropdown';

const collectionscard = [
    {
        image: eventsImg1,
        reminder: "Set Reminder"
    },
    {
        image: eventsImg2,
        reminder: "Set Reminder"
    },
    {
        image: eventsImg3,
        reminder: "Set Reminder"
    },
    {
        image: eventsImg4,
        reminder: "Set Reminder"
    },
]

const collections = [
    {
        heading: "15 May 2023 / 6pm UTC",
        datToGo: "3 Days to go",
        title: "Understanding Tokenomics",
        partner: "with Gregory Peck",
        guests: "Sundar Pichai, Jackie Chan, Priyanka Chopra, Hema Malini"
    },
    {
        heading: "15 May 2023 / 6pm UTC",
        datToGo: "3 Days to go",
        title: "Understanding Tokenomics",
        partner: "with Gregory Peck",
        guests: "Sundar Pichai, Jackie Chan, Priyanka Chopra, Hema Malini"
    },
    {
        heading: "15 May 2023 / 6pm UTC",
        datToGo: "3 Days to go",
        title: "Understanding Tokenomics",
        partner: "with Gregory Peck",
        guests: "Sundar Pichai, Jackie Chan, Priyanka Chopra, Hema Malini"
    },
    {
        heading: "15 May 2023 / 6pm UTC",
        datToGo: "3 Days to go",
        title: "Understanding Tokenomics",
        partner: "with Gregory Peck",
        guests: "Sundar Pichai, Jackie Chan, Priyanka Chopra, Hema Malini"
    },
]

const dropdownData = [
    {
        btnName: "Earliest",
        dropdown: [
            "Earliest",
            "Earliest",
            "Earliest",
            "Earliest",
        ]
    },
]

const CalendarEvents = () => {
    const [selectedMenu, setselectedMenu] = useState("Listicle View");
    const [projectMenu, setProjectMenu] = useState(["Listicle View"]);

    const [symbioteEvents, setSymbioteEvents] = useState("Listicle View");
    const [symbioteEventsMenu, setSymbioteEventsMenu] = useState(["Listicle View"]);

    useEffect(() => {
        if (projectMenu.length < 2) {
            setProjectMenu([...projectMenu, "Calendar View"])
        }
    }, [selectedMenu])

    useEffect(() => {
        if (symbioteEventsMenu.length < 2) {
            setSymbioteEventsMenu([...projectMenu, "Calendar View"])
        }
    }, [symbioteEvents])

    return (
        <>
            <div>
                <div className="event-text-card-section">
                    <div className="event-header-content">
                        <div className="d-flex align-items-center gap-4">
                            <h4 className='heading-new-4'>Symbiote Events</h4>
                            {symbioteEvents === "Listicle View" &&
                                <div className="event-dropdown gap-2">
                                    <p className='paragraph-new mb-0'>Sort </p>
                                    {dropdownData && dropdownData.map((item: any, index: number) => (
                                        <RadioDropdown
                                            key={index}
                                            BtnName={item.btnName}
                                            dropdownValues={item.dropdown}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="event-button">
                            {projectMenu.map((menu: any, id: number) => (
                                <button key={id}
                                    className={symbioteEvents === menu ? "selectedMenu menuItem " : "menuItem "}
                                    onClick={() => setSymbioteEvents(menu)}
                                >
                                    {menu}
                                </button>
                            ))}
                        </div>
                    </div>
                    {symbioteEvents === "Listicle View" &&
                        <div className="row">
                            {collectionscard && collectionscard.map((item: any, i: number) => (
                                <ReminderCard
                                    imageURL={item?.image}
                                    reminderTime={item?.reminder}
                                />
                            ))}
                        </div>
                    }
                    {symbioteEvents === "Calendar View" &&
                        <div className="calender-view-iframe text-center mt-5">
                            <iframe src="https://calendar.google.com/calendar/embed?src=7b55230010c0b0b5a2d32d264a7ced177a9f3fb95fcff0ab7f7d7c98b7015f3b%40group.calendar.google.com&ctz=Asia%2FKolkata" width="100%" height="100%" frameBorder="0" scrolling="no"></iframe>
                        </div>
                    }
                </div>

                {/* <div className=''>
                    <h4 className='heading-new-4'>Symbiote Events</h4>
                    <div className="calender-view text-center mt-5">
                        <img src={CalenderBig} className='img-fluid w-100' alt="" />
                    </div>
                </div>
                <div className="">
                    <div className="row">
                        {collectionscard && collectionscard.map((item: any, i: number) => (
                            <ReminderCard
                                imageURL={item?.image}
                                reminderTime={item?.reminder}
                            />
                        ))}
                    </div>
                </div> */}


                <div className="event-text-card-section mt-5">
                    <div className="event-header-content">
                        <div className="d-flex align-items-center gap-4">
                            <h4 className='heading-new-4'>Your Events</h4>
                            {selectedMenu === "Listicle View" &&
                                <div className="event-dropdown gap-2">
                                    <p className='paragraph-new mb-0'>Sort </p>
                                    {dropdownData && dropdownData.map((item: any, index: number) => (
                                        <RadioDropdown
                                            key={index}
                                            BtnName={item.btnName}
                                            dropdownValues={item.dropdown}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="event-button">
                            {projectMenu.map((menu: any, id: number) => (
                                <button key={id}
                                    className={selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "}
                                    onClick={() => setselectedMenu(menu)}
                                >
                                    {menu}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedMenu === "Listicle View" &&
                        <div className="row">
                            {collections && collections.map((item: any, i: number) => (
                                <ReminderDetailsCardData
                                    heading={item.heading}
                                    dayToGo={item.datToGo}
                                    title={item.title}
                                    partner={item.partner}
                                    guests={item.guests}
                                />
                            ))}
                        </div>
                    }
                    {selectedMenu === "Calendar View" &&
                        <div className="calender-view text-center mt-5">
                            <img src={CalenderView} className='img-fluid w-100' alt="" />
                        </div>

                    }

                </div>
            </div>
        </>
    )
}

export default CalendarEvents