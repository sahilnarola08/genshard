import React, { useEffect, useState } from 'react'
import "./accelerate-lists.sass"
import Accelerate from '../../../images/accelerate/accelerate.svg';
import ZksyncIcon from '../../../images/accelerate/zksync-icon.svg';
import ArbitrumIcon from '../../../images/accelerate/arbitrum-icon.svg';
import CelebrateBGIcon from '../../../images/accelerate/pages/celebrate-bg-icon.svg';
import Elone from '../../../images/accelerate/pages/elon.svg';
import Footercmp from '../../../shared/components/footercmp/footercmp';
import { useHistory } from 'react-router-dom';
import { WelcomingSection } from '../accelerate-dashboard/components/welcoming-section/welcoming-section';
import Slider from 'react-slick';

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

let settings = {
  dots: false,
  slidesToShow: 2,
  initialSlide: 0,
  arrows: true,
  infinite: false,
  responsive: [
    {
      breakpoint: 350,
      settings: {
        slidesToShow: 2,
      }
    },
  ]
};

const Acceleratelists = () => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const history = useHistory()

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
      <img className='cele-bg' src={CelebrateBGIcon} alt="" />
      <div className='list-section'>
        <div className="container container-maxwidth">
          <WelcomingSection />
          <div className='thank-text-section mt-lg-5 mt-4'>
            <div>
              <p className='paragraph-new'>We think your next course of action should be to get some mentors onboard who can help you grow your team and <br /> select the right people to #BUIDL your project and take it to the moon!</p>
              <p className='paragraph-new fw-bold mb-md-4'>Check out some of our mentors who can guide you specifically with this</p>
              <div className='connection-section mt-lg-5 mt-md-3 mt-2'>
                {screenSize && screenSize.width > 767 ?
                  <div className="row justify-content-lg-center justify-content-md-start">
                    {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                      <div className="col-lg-2 col-md-3">
                        <div className='all-mentor-section'>
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
              <div className='mt-lg-5 mt-3 mb-lg-0 mb-md-0 mb-4'>
                <button className='new-black-button'>Check out all the Mentors</button>
              </div>
            </div>
            <div className='mt-lg-5 mt-md-3 mt-2'>
              <p className='paragraph-new'>You should also probably start looking at some influencers who can help grow your community and <br /> get the initial users for your product.</p>
              <p className='paragraph-new fw-bold mb-md-4'>Check out some of our partner KOLs, who have been in this space for years and can assist you</p>
              <div className='connection-section mt-lg-5 mt-md-3 mt-2'>
                {screenSize && screenSize.width > 767 ?
                  <div className="row justify-content-lg-center justify-content-md-start">
                    {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                      <div className="col-lg-2 col-md-3">
                        <div className='all-mentor-section'>
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
            <div className='mt-lg-5 mt-3 mb-lg-0'>
              <button className='new-black-button'>Check out all the Mentors</button>
            </div>
          </div>
          <div className='text-center mt-lg-5 mt-md-3 mt-2 mb-lg-0 mb-md-5 mb-4'>
            <button className='new-color-button' onClick={() => history.push('/project-courses')}>Next Step</button>
          </div>
        </div>
        <Footercmp />
      </div>
    </>
  )
}

export default Acceleratelists