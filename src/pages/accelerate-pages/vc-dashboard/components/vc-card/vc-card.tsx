import React, { useState } from 'react'
import './vc-card.sass';
import BannerIMG from '../../../../../images/accelerate/pages/dashboard-bg.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export interface VCCardData {
    name: string,
    title: string,
    description: string,
}

export const VCCard = (props: VCCardData) => {
    const history = useHistory()
    const { name, title, description } = props
    const [projectProgressPercentage, setProjectProgressPercentage] = useState(25);
    const location = useLocation();
    const pathname = location.pathname;
    const isMentorDashboard = pathname.includes("/mentor-dashboard")
    
    return (
        <>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="vc-card">
                    <div className="top-button">
                    <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                        <button className='new-color-button-small'>DeFi</button>
                    </div>
                    <div className="banner-image">
                        <img src={BannerIMG} className='img-fluid' alt="" />
                    </div>
                    <div className="text-content">
                        <div className="row ">
                            <div className="col-lg-6">
                                <div className="left-part">
                                    <div className="user-image">
                                        <img src={BannerIMG} className='img-fluid' alt="" />
                                        <h5 className='heading-new-5'>{name}</h5>
                                    </div>
                                    <div className="card-social">
                                        <ul>
                                            <li>
                                                <Link to="/"><i className="ri-twitter-fill"></i></Link>
                                            </li>
                                            <li>
                                                <Link to="/"><i className="ri-links-line"></i></Link>
                                            </li>
                                            <li>
                                                <Link to="/"><i className="ri-send-plane-fill"></i></Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="right-part">
                                    {isMentorDashboard ?
                                        <div className='d-flex gap-3 align-items-center mb-3'>
                                            <div className='card-percentage-slider text-center d-flex'>
                                                <CircularProgressbar value={25} text={`${Number(projectProgressPercentage).toFixed(0)}`} background
                                                    backgroundPadding={0}
                                                    styles={buildStyles({
                                                        backgroundColor: "transparent",
                                                        textColor: "#fff",
                                                        pathColor: "#65DB6A",
                                                        trailColor: "white"
                                                    })} />
                                            </div>
                                            <div className='symbiotescore-text w-100'>
                                                <h3 className='color-white-new paragraph-new-medium fw-bold'>SymbioteScore</h3>
                                            </div>
                                        </div>
                                        :
                                        <h6 className='heading-new-6 text-start mb-3'>{title}</h6>
                                    }
                                    <p className='paragraph-new-small mb-0'>{description}</p>
                                </div>
                            </div>
                            <div className="col-lg-12 mt-4 text-center">
                                <button className='card-button' onClick={() => history.push(isMentorDashboard ? '/profile/mentor-project-details' : '/profile/vc-project-details' )}>View Project Page</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
