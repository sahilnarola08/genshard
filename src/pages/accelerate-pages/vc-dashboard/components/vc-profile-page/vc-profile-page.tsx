import React, { useState } from 'react'
import "./vc-profile-page.sass"
import Profile from '../../../../../images/accelerate/pages/profile-img.svg';
import CourseImg from '../../../../../images/accelerate/pages/course-img.svg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { DashbordTopSection } from '../../../accelerate-dashboard/components/dashbord-top-section/dashbord-top-section';
import { RangeSlider } from '../../../accelerate-dashboard/components/partner-network/components/range-slider/range-slider';
import ProgressTable from '../../../accelerate-dashboard/components/progress/components/progress-table/progress-table';
import { useHistory } from 'react-router-dom';
import Footercmp from '../../../../../shared/components/footercmp/footercmp';
import { VCHeroSection } from '../vc-hero-section/vc-hero-section';

interface PastProgressData {
    date: string;
    area: string;
    update: string;
    docs: string;
}
function pastProgressCreateData(
    date: string,
    area: string,
    update: string,
    docs: string
): PastProgressData {
    return { date, area, update, docs };
}
interface PastProgressColumn {
    id: 'date' | 'area' | 'update' | 'docs';
    label: string;
    minWidth?: number;
}
const pastProgressTableColumns: readonly PastProgressColumn[] = [
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'area', label: 'Area', minWidth: 100 },
    { id: 'update', label: 'Update', minWidth: 170 },
    { id: 'docs', label: 'Docs', minWidth: 170 },
];

const CourseData = [
    {
        image: CourseImg,
        name: "How to build a team?",
        details: "Nancy talks about her experience in building a team for her startup BlockWise."
    },
    {
        image: CourseImg,
        name: "How to build a team?",
        details: "Nancy talks about her experience in building a team for her startup BlockWise."
    },
    {
        image: CourseImg,
        name: "How to build a team?",
        details: "Nancy talks about her experience in building a team for her startup BlockWise."
    },
    {
        image: CourseImg,
        name: "How to build a team?",
        details: "Nancy talks about her experience in building a team for her startup BlockWise."
    },
]


const Vcprofilepage = () => {

    const history = useHistory()
    const [projectProgressPercentage, setProjectProgressPercentage] = useState(25);
    const [symbioteScore, setSymbioteScore] = useState(83);
    const pastProgressTableData = [
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
        pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    ];


    return (
        <>
            <div>
                <VCHeroSection />
                <DashbordTopSection symbioteScore={undefined} setSymbioteScore={undefined} />
                <div className='container container-maxwidth mt-lg-5 mt-md-3 mt-2 public-view-section'>
                    {/* <div className='profile-section d-flex align-items-center justify-content-between'>
                        <div className='back-btn'>
                            <p className='paragraph-new-medium mb-0' role='button' onClick={() => history.push('/project-dashboard')}>Back to Dashboard</p>
                        </div>
                        <div className='your-profile'>
                            <h2 className=''>Your Profile</h2>
                        </div>
                        <div className='public-btn'>
                            <button className='new-primary-button' onClick={() => history.push('/public-profile-view')}><i className="ri-eye-fill me-2"></i>View as Public Profile</button>
                        </div>
                    </div> 
                    <div className='text-center edit-form mt-lg-5 mt-md-3 mt-2'>
                        <p className='paragraph-new-medium' role='button'>Edit the form</p>
                    </div> */}
                    <div className='profile-details'>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex align-items-center'>
                            <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                            </div>
                            <div className='form-slider mt-3'>
                                <div className='percentage-slider text-center m-auto d-flex'>
                                    <CircularProgressbar value={83} text={`${Number(symbioteScore).toFixed(0)}`} background
                                        backgroundPadding={0}
                                        styles={buildStyles({
                                            backgroundColor: "transparent",
                                            textColor: "#fff",
                                            pathColor: "#65DB6A",
                                            trailColor: "white"
                                        })} />
                                    <p className='paragraph-new-small my-4 text-center'>SymbioteScore</p>
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
                                    <p className='paragraph-new-small my-4 text-center' style={{ color: "#FFB800" }}>Profile Completion</p>
                                </div>
                            </div>
                        </div>
                        <div className='view-btn-section d-flex gap-4 justify-content-center mt-lg-5 mt-md-3 mt-2'>
                            <div>
                                <button className='new-primary-button'>View Whitepaper</button>
                            </div>
                            <div>
                                <button className='new-primary-button'>View Pitchdeck</button>
                            </div>
                            <div className='deshboard-social d-flex '>
                                <div><i className="ri-twitter-fill"></i></div>
                                <div><i className="ri-link ms-3"></i></div>
                                <div><i className="ri-send-plane-fill ms-3"></i></div>
                            </div>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <p className='paragraph-new mb-0'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <h4 className='heading-new-4'>Key Team Highlights</h4>
                            <ul className='mt-4'>
                                <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet</li>
                            </ul>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4 className='heading-new-4'>Key Partnership Highlights</h4>
                                    <ul className='mt-4'>
                                        <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                        <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                        <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                        <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet</li>
                                    </ul>
                                </div>
                                <div className="col-lg-6">
                                    <h4 className='heading-new-4'>Key Investment Highlights</h4>
                                    <ul className='mt-4'>
                                        <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                        <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                        <li className='paragraph-new-medium mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                        <li className='paragraph-new-medium mb-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <p className='paragraph-new mb-0'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <div className='counter-section '>
                                <div className="row">
                                    <div className='col-lg-4'>
                                        <div className='counters-card'>
                                            <h4 className='heading-new-4'>Partner Connects</h4>
                                            <h2 className='heading-new-2 mt-3'>548</h2>
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className='counters-card'>
                                            <h4 className='heading-new-4'>Mentor Connects</h4>
                                            <h2 className='heading-new-2 mt-3'>38</h2>
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className='counters-card'>
                                            <h4 className='heading-new-4'>Courses Completed</h4>
                                            <h2 className='heading-new-2 mt-3'>2</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <RangeSlider />
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <h4 className='heading-new-4'>Past Progress</h4>
                            <ProgressTable tableData={pastProgressTableData} tableColumn={pastProgressTableColumns} />
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2'>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4 className='heading-new-4'>The Project’s Upcoming Events</h4>
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
                                <div className="col-lg-6">
                                    <h4 className='heading-new-4'>Study Courses Completed</h4>
                                    <div className='event-bg mt-3'>
                                        {CourseData && CourseData?.map((item: any, i: any) => (
                                            <div className='courses-section d-flex gap-4 mb-5'>
                                                <div><img src={item.image} alt="" /></div>
                                                <div>
                                                    <h5 className='heading-new-5'>{item.name}</h5>
                                                    <p className='paragraph-new mb-0'>{item.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footercmp />
        </>
    )
}

export default Vcprofilepage