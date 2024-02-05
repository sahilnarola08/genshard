import React, { useState } from 'react'
import "./accelerate-onboard.sass"
import Accelerate from '../../../images/accelerate/accelerate.svg';
import ZksyncIcon from '../../../images/accelerate/zksync-icon.svg';
import ArbitrumIcon from '../../../images/accelerate/arbitrum-icon.svg';
import CelebrateBGIcon from '../../../images/accelerate/pages/celebrate-bg-icon.svg';
import Elone from '../../../images/accelerate/pages/elon.svg';
import Footercmp from '../../../shared/components/footercmp/footercmp';
import MediaSlider from '../../upcomingproject/components/media-slider-comp/mediaSlider';
import Slider from "react-slick";
import ReactPlayer from "react-player"
import { useHistory } from 'react-router-dom';
import { WelcomingSection } from '../accelerate-dashboard/components/welcoming-section/welcoming-section';



const Accelerateonboard = () => {
    const [playing, setPlaying] = useState(false)

    let settings = {
        dots: false,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
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
        }
    ]
    const history = useHistory()
    return (
        <>
            <img className='cele-bg' src={CelebrateBGIcon} alt="" />
            <div className='onbord-section'>
                <div className="container container-maxwidth">
                    <WelcomingSection />
                    {/* <div className='text-end'>
                        <button className='new-primary-button' onClick={() => history.push('/project-dashboard')}>Skip</button>
                    </div> */}
                    <div className='thank-text-section mt-lg-5 mt-md-4 mt-3'>
                        <div>
                            <h3 className='heading-new-3 start-heading color-white-new'>Good Start!</h3>
                            <p className='paragraph-new fw-light my-lg-4 my-md-4 my-3'>We think your next course of action should be to get some mentors onboard who can help you grow your team and <br /> select the right people to #BUIDL your project and take it to the moon!</p>
                            <p className='paragraph-new fw-bold mt-0 mb-lg-4 mb-md-4 mb-3'>Check out some of our mentors who can guide you specifically with this</p>
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
                            <div>
                                <button className='new-black-button mt-lg-5 mt-md-3 mt-2'>Check out all the Tutorials</button>
                            </div>
                        </div>
                    </div>
                    <div className='text-center mt-lg-5 mt-md-3 mt-2'>
                        <button className='new-color-button' onClick={() => history.push('/project-dashboard')}>Go to App <i className="ri-external-link-line ms-2"></i></button>
                    </div>
                </div>
                <Footercmp />
            </div>
        </>
    )
}

export default Accelerateonboard