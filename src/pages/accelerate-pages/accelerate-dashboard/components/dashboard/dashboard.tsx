import React, { useEffect, useState } from 'react'
import "./dashboard.sass"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import Elone from '../../../../../images/accelerate/pages/elon.svg';
import roketIcon from '../../../../../images/accelerate/roket-icon.svg';
import ReactPlayer from "react-player"
import Slider from "react-slick";
import { ProgressRangeSlider } from './components/progress-slider/progress-slider'
import Updatessymbioversetable from './components/progress-slider/updates-symbioverse-table/updates-symbioverse-table';



const mentorDAta = [
  {
    name: "Elon Musk",
    title: "Makes funny cars",
  },
  {
    name: "Carl Pei",
    title: "Not Nothing",
  },
  {
    name: "Donald Trump",
    title: "Peace Propogator",
  },
  {
    name: "Arnold",
    title: "Cult.fit ambassador",
  },
  {
    name: "Taylor Swift",
    title: "Doesn’t stitch",
  },
]

const Dashboard = () => {


  const [projectProgressPercentage, setProjectProgressPercentage] = useState(35);
  const [playing, setPlaying] = useState(false)

  let settings = {
    dots: false,
    speed: 300,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 2.5,
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2.5,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1.8,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1.2,
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 0.5,
        }
      }

    ]
  };

  const collections = [
    {
      id: 1,

    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    },
    {
      id: 5
    },
  ]

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
    }
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension())
    }
    window.addEventListener('resize', updateDimension);
    return (() => {
      window.removeEventListener('resize', updateDimension);
    })
  }, [screenSize])

  return (
    <>
      <div className='dashboard-section'>
        <div className='symbiotescore-section '>
          <div className='d-flex gap-3'>
            <div className='percentage-slider text-center d-flex'>
              <CircularProgressbar value={25} text={`${Number(projectProgressPercentage).toFixed(0)}`} background
                backgroundPadding={0}
                styles={buildStyles({
                  backgroundColor: "transparent",
                  textColor: "#fff",
                  pathColor: "#FFB800",
                  trailColor: "white"
                })} />
            </div>
            <div className='symbiotescore-text w-100'>
              <div className='text-end'>
                <i className="ri-information-line" style={{ color: "#54C4FC" }}></i>
              </div>
              <h3 className='color-white-new'>SymbioteScore</h3>
              <p className='paragraph-new-medium'>Aggregate score based on lead mentors' and Symbiote team's feedback.</p>
            </div>
          </div>
        </div>
        <div className='counter-section mt-lg-5 mt-md-3 mt-2'>
          <div className="row">
            <div className='col-lg-4 col-md-4 col-6'>
              <div className='counters-card'>
                <h4 className='heading-new-4'>Partner Connects</h4>
                <h2 className='heading-new-2 mt-3'>548</h2>
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-6'>
              <div className='counters-card'>
                <h4 className='heading-new-4'>Mentor Connects</h4>
                <h2 className='heading-new-2 mt-3'>38</h2>
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-6 mt-lg-0 mt-md-0 mt-3'>
              <div className='counters-card'>
                <h4 className='heading-new-4'>Courses Completed</h4>
                <h2 className='heading-new-2 mt-3'>2</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-lg-5 mt-md-3 mt-2'>
          <ProgressRangeSlider />
        </div>
        <div className=''>
          <Updatessymbioversetable />
        </div>
        <div className='mentors-section mt-lg-5 mt-4'>
          <h3 className='update-heading'>Recommended Mentors</h3>
          <div className='connection-section mt-lg-5 mt-md-3 mt-2'>
            {screenSize && screenSize.width > 767 ?
              <div className="row justify-content-lg-center justify-content-md-start">
                {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                  <div className="col-lg-2 col-md-3 mb-lg-0 mb-md-3 mb-0">
                    <div className='all-mentor-section text-center'>
                      <img className='img-fluid' src={Elone} alt="" />
                      <p className='paragraph-new mt-3'>{item.name}</p>
                      <p className='paragraph-new-medium'>{item.title}</p>
                      <button className='new-primary-button'>Connect</button>
                    </div>
                  </div>
                ))}
              </div> :
              <div className='accelerate-list-slider'>
                <Slider {...settings}>
                  {mentorDAta && mentorDAta?.map((values, i) => (
                    <div className='all-mentor-section'>
                      <img className='img-fluid' src={Elone} alt="" />
                      <p className='paragraph-new my-2'>{values.name}</p>
                      <p className='paragraph-new-medium mb-2'>{values.title}</p>
                      <button className='new-primary-button'>Connect</button>
                    </div>
                  ))}
                </Slider>
              </div>
            }
          </div>
        </div>

        <div className='courses-section mt-lg-5 mt-4'>
          <h3 className='update-heading mb-lg-5 mb-4'>Recommended Courses</h3>
          <div className='media-slider'>
            <Slider {...settings}>
              {collections?.map((values, i) => (
                <div className="slide-content">
                  <div className="content">
                    <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                    <div className='mt-3 slider-card-content'>
                      <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                      <p className='heading-new-6 mt-3'>Nancy talks about her experience <br /> in building a team for her startup <br /> BlockWise.</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className='event-section mt-lg-5 mt-md-3 mt-2'>
          <div className="row">
            <div className="col-lg-6">
              <h4 className='heading-new-4'>Your Upcoming Events</h4>
              <div className='event-bg mt-3'>
                <div className='event-card'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='heading-new-4'>15 May 2023</h4>
                    <p className='paragraph-new fw-light mb-0'>3 Days to go</p>
                  </div>
                  <h4 className='heading-new-4 fw-light mt-3'>Understanding Tokenomics</h4>
                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h4 className='paragraph-new fw-light'>with Gregory Peck</h4>
                    <i className="ri-notification-3-line" style={{ color: "#fff" }}></i>
                  </div>
                </div>
                <div className='event-card mt-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='heading-new-4'>15 May 2023</h4>
                    <p className='paragraph-new fw-light mb-0'>3 Days to go</p>
                  </div>
                  <h4 className='heading-new-4 fw-light mt-3'>Understanding Tokenomics</h4>
                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h4 className='paragraph-new fw-light'>with Gregory Peck</h4>
                    <i className="ri-notification-3-line" style={{ color: "#fff" }}></i>
                  </div>
                </div>

              </div>
            </div>
            <div className="col-lg-6 mt-lg-0 mt-4">
              <h4 className='heading-new-4'>Events on Symbiote</h4>
              <div className='event-bg mt-3'>
                <div className='event-card2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='heading-new-4'>15 May 2023</h4>
                    <p className='paragraph-new fw-light mb-0'>3 Days to go</p>
                  </div>
                  <h4 className='heading-new-4 fw-light mt-3'>Understanding Tokenomics</h4>
                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h4 className='paragraph-new fw-light'>with Gregory Peck</h4>
                    <i className="ri-notification-3-line" style={{ color: "#fff" }}></i>
                  </div>
                </div>
                <div className='event-card2 mt-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='heading-new-4'>15 May 2023</h4>
                    <p className='paragraph-new fw-light mb-0'>3 Days to go</p>
                  </div>
                  <h4 className='heading-new-4 fw-light mt-3'>Understanding Tokenomics</h4>
                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h4 className='paragraph-new fw-light'>with Gregory Peck</h4>
                    <i className="ri-notification-3-line" style={{ color: "#fff" }}></i>
                  </div>
                </div>
                <div className='event-card2 mt-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='heading-new-4'>15 May 2023</h4>
                    <p className='paragraph-new fw-light mb-0'>3 Days to go</p>
                  </div>
                  <h4 className='heading-new-4 fw-light mt-3'>Understanding Tokenomics</h4>
                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h4 className='paragraph-new fw-light'>with Gregory Peck</h4>
                    <i className="ri-notification-3-line" style={{ color: "#fff" }}></i>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard