import React, { useEffect, useRef, useState } from 'react'
import "./accelerate.sass"
import accelerate from '../../../../images/accelerate/accelerate.svg';
import arbitrumIcon from '../../../../images/accelerate/arbitrum-icon.svg';
import roketIcon from '../../../../images/accelerate/roket-icon.svg';
import zksyncIcon from '../../../../images/accelerate/zksync-icon.svg';
import comprehensiveIcon from '../../../../images/accelerate/comprehensive-icon.svg';
import ventureIcon from '../../../../images/accelerate/venture-icon.svg';
import mentorsIcon from '../../../../images/accelerate/mentors-icon.svg';
import exchangesIcon from '../../../../images/accelerate/exchanges-icon.svg';
import investIcon from '../../../../images/accelerate/invest-icon.svg';
import mentorIcon from '../../../../images/accelerate/mentor-icon.svg';
import Raised from "../../../../images/homepage/raised.svg"
import ProjectLaunch from "../../../../images/homepage/project-launch.svg"
import Partners from "../../../../images/homepage/partners.svg"
import GlobalCommunity from "../../../../images/homepage/global-community.svg"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import trumpLogo from "../../../../images/homepage/trump-logo.svg"
import swiggyLogo from "../../../../images/homepage/swiggy-logo.svg"
import lohmanLogo from "../../../../images/homepage/lohman-logo.svg"
import tinderLogo from "../../../../images/homepage/tinder-logo.svg"
import metaLogo from "../../../../images/homepage/meta-logo.svg"
import Slider from 'rc-slider';
import PartnerListTable from '../ecosystem/components/partner-list-table/partner-list-table';
import ReactPlayer from 'react-player';
import exelerateProjectImg from '../../../../images/staking/exelerate-project-img.svg';
import explorEcosystemImg from '../../../../images/staking/explor-ecosystem-img.svg';
import checkIdoImg from '../../../../images/staking/check-ido-img.svg';
import partnerImg from '../../../../images/staking/partner-img.svg';
import Footercmp from '../../../../shared/components/footercmp/footercmp';
import { TagSlider } from './components/tag-slider/tag-slider';
import { useHistory } from 'react-router-dom';
import { ComprehensiveOfferings } from './components/comprehensive-offerings/comprehensive-offerings';
import { VantureCapitalComp } from '../Homepage/vanture-capital-comp/vanture-capital-comp';
import { MentorNetworkComp } from './components/mentor-network-comp/mentor-network-comp';
import { ExchangesComp } from './components/exchanges-comp/exchanges-comp';


const counterData = [
    {
        image: ProjectLaunch,
        name: "Project Launches",
        number: "50+"
    },
    {
        image: Raised,
        name: "Raised",
        number: "$1.6M+"
    },
    {
        image: Partners,
        name: 'Partners',
        number: "450+"
    },
    {
        image: GlobalCommunity,
        name: "Global Community",
        number: "110K+"
    },
]

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

var _ = require("lodash");

const Accelerate = () => {
    const [selectedMenu, setselectedMenu] = useState("Venture Capitals");
    const [projectMenu, setProjectMenu] = useState(["Venture Capitals"]);
    const [value, setValue] = useState(0);
    const [playing, setPlaying] = useState(false)
    const history = useHistory()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (projectMenu.length < 2) {
            setProjectMenu([...projectMenu, "Mentors", "Partners", "Exchanges"])
        }
    }, [selectedMenu])

    return (
        <>
            <div>
                <div className='accelerate-hero-section left-part-background pb-lg-5 pb-4'>
                    <div className='container position-relative'>

                        <div className='launch-text'>
                            <p className='d-lg-none d-md-none d-block mb-2'>Home for launches on</p>
                        </div>
                        <div className='launch-text'>
                            <p className='d-lg-flex d-md-flex d-none'>Home for launches on</p>
                            <img src={arbitrumIcon} className='img-fluid' alt="" />
                            <p>&</p>
                            <img src={zksyncIcon} className='img-fluid' alt="" />
                        </div>
                        <div className='d-flex justify-content-center mt-lg-4 mt-3'>
                            <img src={accelerate} className='img-fluid accelerate-main-img' alt="" />
                        </div>
                        <div className='help-text'>
                            <p className='heading-new-5 fw-lighter mb-0 mt-lg-5 mt-md-4 mt-3 fs-12'>The journey of every Crypto Project is unique. But success is everyone’s destination. </p>
                            <p className='heading-new-5 mb-0 mt-lg-4 mt-md-3 mt-2 fs-12'>Let us help you get there!</p>
                        </div>
                        <div className='program-button mt-lg-4 mt-md-3 mt-3'>
                            <button className='new-color-button' onClick={() => history.push('/forms/project-view/first-time-login')}>Apply for the Program</button>
                        </div>
                        <div className="row mt-lg-5 mt-md-3 mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="row">
                                    {counterData && counterData.map((item: any, i: number) => {
                                        return <div className="col-lg-3 col-md-3 col-6">
                                            <div className="counter-card">
                                                <div className="counter-img">
                                                    <img src={item.image} className='img-fluid' alt="" />
                                                </div>
                                                <h2 className='heading-new-2'>{item.number}</h2>
                                                <p className='paragraph-new-medium'>{item.name}</p>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='accelerate-program-section mt-lg-5 mt-md-3 mt-2 position-relative'>
                    <div className="container">
                        <h5 className='heading-new-5 fw-normal text-center'>Understand the <span className='heading-new-5 fw-700'>Accelerate </span> program</h5>
                        <div className="projectDetails-top background-primary mt-lg-5 mt-md-3 mt-3">
                            <div className="projectDetails">
                                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="What do you get by joining us?" {...a11yProps(0)} />
                                        <Tab label="Where will the program be run?" {...a11yProps(1)} />
                                        <Tab label="Why are we the best fit for you?" {...a11yProps(2)} />
                                        <Tab label="What happens after the program?" {...a11yProps(3)} />
                                    </Tabs>
                                    <TabPanel value={value} index={0}>
                                        <p className='paragraph-new mb-0'>If you are looking to turn your game-changing ideas into a viable business, we’ll provide you:</p>
                                        <ul>
                                            <li className='paragraph-new'>2-month fully remote accelerator program.</li>
                                            <li className='paragraph-new'>Operational, legal, commercial, marketing, and tech support.</li>
                                            <li className='paragraph-new'>Token engineering support and business model testing to pinpoint product-market fit.</li>
                                            <li className='paragraph-new'>50+ mentors and active VC network featuring known names in Web3.</li>
                                        </ul>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <p className='paragraph-new mb-0'>We are currently planning to be a fully remote and virtual program. There may be the opportunity for in-person events in major cities. We have so far incubated companies from all over the globe.</p>
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <p className='paragraph-new mb-0'>Symbiote Accelerate is designed to support decentralized projects to design, build, and scale at every stage of their development.</p>
                                        <p className='paragraph-new mb-0'>We provide support via relationships, introductions, and access to specialists from across the venture platform. We have incubated and supported leading Web 3.0 teams and can bring a powerhouse of support to ventures building Web 3.0 infrastructure.</p>
                                    </TabPanel>
                                    <TabPanel value={value} index={3}>
                                        <p className='paragraph-new mb-0'>Once we help you with your public launch and listing, expect to establish a long-term relationship with our founders and team. We will be there at every step of your success and continue providing value.</p>
                                    </TabPanel>
                                </Box>
                            </div>

                        </div>
                    </div>
                </div>

                {/* <div className="many-more-section text-center mt-5"> 
                        <div className="tag-slider overflow-hidden">
                            <div className="tag-slide-flex">
                                {sliderCollections?.map((values) => (
                                    <div className="tag-slider-item">
                                        <img src={values.image} className='img-fluid' alt={""} />
                                        <p className='paragraph-new-medium mb-0'>{values?.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div> 
                    </div> */}

                <div className="overflow-hidden">
                    <TagSlider />
                </div>

                {/* <div className="">
                    <ComprehensiveOfferings />
                </div> */}

                <div className='plunge-section mt-5 right-part-background'>
                    <div className="container position-relative">
                        <h2 className='heading-new-2 text-center'>Ready to take the plunge?</h2>
                        <button className='get-accelerated-btn mt-lg-5 mt-md-3 mt-2'>Get Accelerated</button>
                        <div className='symbioteScale-section pt-3 pt-md-4 pt-lg-5  '>
                            <div className='symbioteScale-box-section '>
                                <h3 className='heading-new-4 fw-lighter text-center'>Let’s track your journey on the <span className='heading-new-4'>SymbioteScale</span></h3>
                                <p className='paragraph-new mt-3 text-center my-lg-5 my-md-3 my-2 mb-4 fw-lighter'>The <span> SymbioteScale</span> is our proprietary and thoroughly researched tool to evaluate where you are on your journey. <br />
                                    This Tool will help us identify your exact needs and pain points to ensure we provide you with a comprehensive service package.</p>
                                <div className="d-lg-flex d-md-flex d-block align-items-center gap-3 pt-lg-4 pt-md-4 pt-0">
                                    <div className="w-100">
                                        {/* <div className='d-flex justify-content-between '>
                                        <p className='paragraph-new fw-bold'></p>
                                        <p className='paragraph-new fw-bold'>MVP <br />Build</p>
                                        <p className='paragraph-new fw-bold'>Product <br />Market Fit</p>
                                        <p className='paragraph-new fw-bold'>Company <br /> Restructuring</p>
                                        <p className='paragraph-new fw-bold'>Team <br /> & Management</p>
                                        <p className='paragraph-new fw-bold'>Networking <br /> with Partners</p>
                                        <p className='paragraph-new fw-bold'>VC <br /> Networks</p>
                                        <p className='paragraph-new fw-bold'>Marketing &<br /> KOL Connects</p>
                                    </div> */}
                                        <div className="symbioteScale-slider-main">
                                            <div className='symbioteScale-slider'>
                                                <Slider
                                                    defaultValue={0}
                                                    step={null}
                                                    // vertical= {true}
                                                    // reverse={false}
                                                    marks={{ 0: "Idea \t Clarity", 10: "MVP Build", 21: "Product Market Fit", 35: "Company Restructuring", 52: "Team & Management", 68: "Networking with Partners", 82: "VC Networks", 95: "Marketing & KOL Connects" }}
                                                    trackStyle={{ backgroundColor: '#65DB6A' }}
                                                    railStyle={{ backgroundColor: '#54C4FC' }}
                                                    handleStyle={{
                                                        borderColor: '#FFFFFF',
                                                        backgroundColor: '#FFFFFF',
                                                    }}
                                                    dotStyle={{
                                                        background: "#000000",
                                                        border: "1.1761px solid #FFFFFF",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-fit-content icon-content-text">
                                        <div className="text-center">
                                            <img src={roketIcon} alt="" className='img-fluid' />
                                        </div>
                                        <p className='paragraph-new mb-0 mt-lg-3 mt-md-3 mt-0 fw-bold launch-text'>LAUNCH<br />TO MARKET</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='paragraph-new mb-0 mt-4 text-center fw-lighter' style={{ color: "#515151" }}>Drag the slider to where you think you are in your journey</p>
                                    <p className='paragraph-new mb-0 my-lg-4 my-md-3 my-2 text-center fw-lighter'>We understand that you’re in your Company Restructuring Phase.</p>
                                    <p className='paragraph-new mb-0 text-center crucial-text fw-lighter'>This is a very crucial point where you are getting your team consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='comprehensive-section mt-5 position-relative'>
                    <div className="container position-relative">
                        <h2 className='heading-new-2 mb-3 mb-lg-4 mb-lg-5'>Our comprehensive offerings</h2>
                        <div className='row'>
                            <div className="col-lg-4 col-md-4 col-4">
                                <div>
                                    <h3 className='heading-new-4'>Token <br /> Economy</h3>
                                    <p className='paragraph-new-medium'>It decides the future of the project. We help you with logic and modelling.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Incorporation <br />and Legal</h3>
                                    <p className='paragraph-new-medium'>Your legal structure is an essential component of your strategy. In this unpredictable international law system, you need clarity.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Fundraising</h3>
                                    <p className='paragraph-new-medium'>We cover all the fundraising aspects, from pitch polishing to demo day.</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-4">
                                <div className='offering-img'>
                                    <img className='img-fluid' src={comprehensiveIcon} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-4">
                                <div className='text-mar'>
                                    <h3>Smart Contract<br />and Security</h3>
                                    <p className='paragraph-new-medium'>We provide guidance in building a safe product quickly. A single hack can destroy your venture.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Marketing <br /> and Community</h3>
                                    <p className='paragraph-new-medium'>We help you to build and engage your community. No community, no party.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Launching <br /> Your Token</h3>
                                    <p className='paragraph-new-medium'>The price market action depends on many factors, from your token launch (on cex or dex) to your market maker. Let our experts guide you.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='peek-into-section mt-5 left-part-background'>
                    <div className='peek-into-section mt-lg-5 mt-md-3 mt-2 left-part-background'>
                        <div className="container position-relative">
                            <h2 className='heading-new-2'>A peek into the world of Symbiote</h2>
                            <div className="">
                                <div className="Symbiote-data my-lg-5 my-md-4 my-3">
                                    {projectMenu.map((menu: any, id: number) => (
                                        <button key={id}
                                            className={selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "}
                                            onClick={() => setselectedMenu(menu)}
                                        >
                                            {menu}
                                        </button>
                                    ))}
                                </div>
                                {selectedMenu === "Venture Capitals" &&
                                    <>
                                        <VantureCapitalComp/>
                                    </>
                                }
                                {selectedMenu === "Mentors" &&
                                    <>
                                        <MentorNetworkComp/>
                                    </>
                                }
                                {selectedMenu === "Partners" &&
                                    <>
                                        <PartnerListTable />
                                    </>
                                }
                                {selectedMenu === "Exchanges" &&
                                    <>
                                        <ExchangesComp/>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className='acceleration-dashboard-section mt-5'>
                    <div className="container">
                        <h2 className='heading-new-2'>Acceleration Dashboard</h2>
                        <ReactPlayer className="card-player mt-lg-5 mt-md-3 mt-4" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                    </div>
                </div>

                <div className='sounds-good-section mt-lg-5 mt-md-3 mt-2 right-part-background'>
                    <div className="container position-relative">
                        <h2 className='heading-new-2 mb-lg-5 mb-4'>Sounds good? Then see you soon!</h2>
                        <div className="row mt-lg-3 mt-md-2 mt-2">
                            <div className="col-lg-3 col-md-4 mb-lg-0 mb-md-0 mb-3 text-center">
                                <img src={accelerate} className='img-fluid mb-4' alt="" />
                                <div className="service-card-border" role='button' onClick={() => { history.push(`/contact-form/project-ahead`) }} >
                                    <div className="service-card-inner">
                                        <div className="service-card mb-0 left-card">
                                            <div className="card-img">
                                                <img src={exelerateProjectImg} className="img-fluid" alt="" />
                                            </div>
                                            <h4 className="heading-new-4 mt-4 mb-0">Take your<br />project ahead</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-8">
                                <p className='heading-new-5'>Support | Be a part of the Symbiote Ecosystem</p>
                                <div className="service-card-border">
                                    <div className="service-card-inner">
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6">
                                                <div className="service-card" role='button' onClick={() => { history.push(`/contact-form/become-partner`) }}>
                                                    <div className="card-img">
                                                        <img src={partnerImg} className="img-fluid" alt="" />
                                                    </div>
                                                    <h4 className="heading-new-4 mt-4 mb-0">Become<br />a Partner</h4>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6" role='button' onClick={() => { history.push(`/contact-form/invest`) }}>
                                                <div className="service-card">
                                                    <div className="card-img">
                                                        <img src={investIcon} className="img-fluid" alt="" />
                                                    </div>
                                                    <h4 className="heading-new-4 mt-4 mb-0">Invest<br />with us</h4>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6" role='button' onClick={() => { history.push(`/contact-form/mentor-projects`) }}>
                                                <div className="service-card mb-0">
                                                    <div className="card-img">
                                                        <img src={mentorIcon} className="img-fluid" alt="" />
                                                    </div>
                                                    <h4 className="heading-new-4 mt-4 mb-0">Mentor<br />our Projects</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footercmp />
            </div>
        </>
    )
}

export default Accelerate