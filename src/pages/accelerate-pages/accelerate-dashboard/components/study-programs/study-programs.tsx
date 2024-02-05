import React, { useState } from 'react'
import "./study-programs.sass"
import Elone from '../../../../../images/accelerate/pages/elon.svg';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';

const collections = [
    {
        id: 1,
    },
    {
        id: 2,
        read: true
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

const mentorDAta = [
    {
        name: "Elon Musk",
        title: "Genius",
    },
]

const StudyPrograms = () => {
    const [playing, setPlaying] = useState(false)
    const location = useLocation();
    const history = useHistory();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    console.log("video-detailsvideo-details", splitLocation)

    let settings = {
        dots: false,
        speed: 300,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
    };

    return (
        <>
            {splitLocation[2] === "video-details" ?
                <div>
                    <div className="">
                        <a className='paragraph-new' href='#' onClick={() => history.goBack()}>Back to Study Programs</a>
                        <h3 className='heading-new-4 fw-light text-start mt-3' style={{ color: "#757575" }}>Managing Finances</h3>
                        <div className="fs-82 my-4">How to build a team?</div>
                        <div className="video-details">
                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                        </div>
                        <div className=""></div>
                    </div>
                    <div className='connection-section mt-3'>
                        <h4 className='heading-new-4 mb-4'>Mentors in the video</h4>

                        <div className="row">
                            {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                                <div className="col-lg-2">
                                    <div className='all-mentor-section text-center'>
                                        <img className='img-fluid' src={Elone} alt="" />
                                        <p className='paragraph-new mt-3'>{item.name}</p>
                                        <p className='paragraph-new-medium'>{item.title}</p>
                                        <button className='new-primary-button'>Connect</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                :
                <div className='study-programing-page'>
                    <div className='courses-section mt-lg-5 mt-md-3 mt-2'>
                        <h3 className='update-heading'>From the Symbioverse</h3>
                        <div className='media-slider mt-lg-5 mt-md-3 mt-2'>
                            <Slider {...settings}>
                                {collections?.map((values, i) => (
                                    <div className="slide-content" onClick={() => { history.push(`/project-dashboard/video-details/${values?.id}`) }}>
                                        <div className="content">
                                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                                            <div className='mt-3'>
                                                <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                                                <p className='heading-new-6 mt-3'>Nancy talks about her experience in building a team for her startup BlockWise.</p>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div >
                    <div className='courses-section mt-lg-5 mt-md-3 mt-2'>
                        <h3 className='update-heading'>Managing Finances</h3>
                        <div className='media-slider mt-lg-5 mt-md-3 mt-2'>
                            <Slider {...settings}>
                                {collections?.map((values, i) => (
                                    <div className="slide-content">
                                        <div className="content">
                                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                                            <div className='mt-3'>
                                                <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                                                <p className='heading-new-6 mt-3'>Nancy talks about her experience in building a team for her startup BlockWise.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className='courses-section mt-lg-5 mt-md-3 mt-2'>
                        <h3 className='update-heading'>Managing Finances</h3>
                        <div className='media-slider mt-lg-5 mt-md-3 mt-2'>
                            <Slider {...settings}>
                                {collections?.map((values, i) => (
                                    <div className="slide-content">
                                        <div className="content">
                                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                                            <div className='mt-3'>
                                                <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                                                <p className='heading-new-6 mt-3'>Nancy talks about her experience in building a team for her startup BlockWise.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className='courses-section mt-lg-5 mt-md-3 mt-2'>
                        <h3 className='update-heading'>Curated External Content for you</h3>
                        <div className='media-slider mt-lg-5 mt-md-3 mt-2'>
                            <Slider {...settings}>
                                {collections?.map((values, i) => (
                                    <div className="slide-content">
                                        <div className="content">
                                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                                            {values?.read === true &&
                                                <div className="new-color-button-div">
                                                    <button className='new-color-button'>Read</button>
                                                </div>
                                            }
                                            <div className='mt-3'>
                                                <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                                                <p className='heading-new-6 mt-3'>Nancy talks about her experience in building a team for her startup BlockWise.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className='courses-section mt-lg-5 mt-md-3 mt-2'>
                        <div className='media-slider mt-lg-5 mt-md-3 mt-2'>
                            <Slider {...settings}>
                                {collections?.map((values, i) => (
                                    <div className="slide-content">
                                        <div className="content">
                                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                                            {values?.read === true &&
                                                <div className="new-color-button-div">
                                                    <button className='new-color-button'>Read</button>
                                                </div>
                                            }
                                            <div className='mt-3'>
                                                <h3 className='heading-new-3 color-white-new'>How to build a team?</h3>
                                                <p className='heading-new-6 mt-3'>Nancy talks about her experience in building a team for her startup BlockWise.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default StudyPrograms