import React, { useState } from 'react';
import './dashbord-top-section.sass';
import Accelerate from '../../../../../images/accelerate/accelerate.svg';
import BannerIMG from '../../../../../images/accelerate/pages/dashboard-bg.svg';
import Profile from '../../../../../images/accelerate/pages/profile-img.svg';
import Timer from '../../../../../images/accelerate/pages/timer.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProvideFeedbackModel from '../../../vc-dashboard/components/vc-all-projects/components/provide-feedback-model/provide-feedback-model';
import UpdateSymbioteScoreModel from '../../../vc-dashboard/components/vc-all-projects/components/update-symbioteScore-model/update-symbioteScore-model';

interface detailsProps {
    symbioteScore: any,
    setSymbioteScore: any
}

export const DashbordTopSection = ({ symbioteScore, setSymbioteScore }: detailsProps) => {

    const [projectProgressPercentage, setProjectProgressPercentage] = useState(25);
    const [provideFeedbackModel, setProvideFeedbackModel] = useState<boolean>(false)
    const provideFeedbackModelToggle = () => setProvideFeedbackModel(!provideFeedbackModel)
    const [updateSymbioteScoreModel, setUpdateSymbioteScoreModel] = useState<boolean>(false)
    const updateSymbioteScoreModelToggle = () => setUpdateSymbioteScoreModel(!updateSymbioteScoreModel)

    const history = useHistory()
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const isVCProfile = pathname.includes("/vc-project-details")
    const isPublicProfile = pathname.includes("/public-profile")
    const isMentorProjects = pathname.includes("/mentor-project-details")
    const isProjectDashboard = pathname.includes("/project-dashboard")
    const isProjectProfile = pathname.includes("/project-view/profile")


    return (
        <>
            <div>
                {/* {isPublicProfile && */}
                <div className='d-flex demo-title'>
                    <img src={Timer} alt="" />
                    <h5 className='heading-new-5'><span className='heading-new-5' style={{ color: "#65DB6A" }}>Get ready</span>for Demo Day</h5>
                </div>

                <div className='dashboard-profile-section mt-lg-5 mt-md-3 mt-2'>
                    <div className="container container-maxwidth profil-text">
                        {isVCProfile ?
                            <div className='back-btn'>
                                <Link className='paragraph-new-medium mb-0' to='/project-dashboard'>Back to Dashboard</Link>
                            </div> :
                            <img className='dashboard-title img-fluid' src={Accelerate} alt="" />
                        }
                    </div>
                    <div className='mt-lg-5 mt-md-3 mt-2'>
                        <div className='profile-banner'>
                            <img className='img-fluid w-100' src={BannerIMG} alt="" />
                        </div>
                        <div className='container container-maxwidth profil-text'>
                            <div className='profil-text-section '>
                                <div className='d-flex align-items-end profile-btn'>
                                    <div className='user-profile'>
                                        <img src={Profile} className='img-fluid' alt="" />
                                    </div>
                                    {!isProjectDashboard &&
                                        <div>
                                            <h3 className='duelist-king mb-4 ms-3'>Duelist King</h3>
                                        </div>
                                    }
                                    {isPublicProfile &&
                                        <div className='mb-4 ms-3'>
                                            <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                                        </div>
                                    }
                                    {isProjectProfile &&
                                        <div className='mb-4 ms-3'>
                                            <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                                        </div>
                                    }
                                    {isProjectDashboard &&
                                        <div className='mb-lg-4 mb-3 ms-lg-3 ms-md-3 ms-0'>
                                            <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                                        </div>
                                    }
                                </div>
                                {isVCProfile &&
                                    <div className='mb-4'>
                                        <button className='new-color-button'>Connect to Project</button>
                                    </div>
                                }
                                {isMentorProjects &&
                                    <div className='mb-4 d-flex align-items-center gap-3'>
                                        <button className='new-primary-button fw-bold' onClick={() => provideFeedbackModelToggle()}>Feedback</button>
                                        <button className='new-primary-button fw-bold' onClick={() => updateSymbioteScoreModelToggle()}>Update Score</button>
                                    </div>
                                }
                                <div className='deshboard-social d-flex mb-4'>
                                    <div><i className="ri-twitter-fill"></i></div>
                                    <div><i className="ri-link"></i></div>
                                    <div><i className="ri-send-plane-fill"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isProjectProfile &&
                    <div className='container container-maxwidth mt-lg-5 mt-md-3 mt-2'>
                        <div className='profile-section d-flex align-items-center justify-content-between'>
                            <div className='back-btn'>
                                <p className='paragraph-new-medium mb-0' role='button' onClick={() => history.push('/project-dashboard')}>Back to Dashboard</p>
                            </div>
                            <div className='your-profile'>
                                <h2 className=''>Your Profile</h2>
                            </div>
                            <div className='public-btn'>
                                <button className='new-primary-button' onClick={() => history.push('/profile/public-profile')}><i className="ri-eye-fill me-2"></i>View as Public Profile</button>
                            </div>
                        </div>
                        <div className='form-slider mt-3'>
                            <div className='percentage-slider text-center m-auto d-flex'>
                                <CircularProgressbar value={25} text={`${Number(projectProgressPercentage).toFixed(0)}%`} background
                                    backgroundPadding={0}
                                    styles={buildStyles({
                                        backgroundColor: "transparent",
                                        textColor: "#fff",
                                        pathColor: "#FFB800",
                                        trailColor: "white"
                                    })} />
                                <p className='paragraph-new-small my-4 text-center' style={{ color: "#FFB800" }}>Completed</p>
                            </div>
                        </div>
                        <div className='text-center mt-4'>
                            <h6 className='heading-new-6'>Please enter any missing details in the form to complete your profile</h6>
                            <p className='paragraph-new mb-0 mt-2'>Fields and sections marked in Orange will guide you to the unfilled data sections</p>
                        </div>
                    </div>
                }
            </div>
            <ProvideFeedbackModel isOpen={provideFeedbackModel} toggle={provideFeedbackModelToggle} />
            <UpdateSymbioteScoreModel isOpen={updateSymbioteScoreModel} toggle={updateSymbioteScoreModelToggle} symbioteScore={symbioteScore} setSymbioteScore={setSymbioteScore} />
        </>
    )
}
