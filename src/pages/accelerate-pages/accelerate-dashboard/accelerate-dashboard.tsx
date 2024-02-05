import React, { useState } from 'react'
import "./accelerate-dashboard.sass"
import Timer from '../../../images/accelerate/pages/timer.svg';
import Accelerate from '../../../images/accelerate/accelerate.svg';
import BannerIMG from '../../../images/accelerate/pages/dashboard-bg.svg';
import Profile from '../../../images/accelerate/pages/profile-img.svg';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Dashboard from './components/dashboard/dashboard';
import Progress from './components/progress/progress';
import Footercmp from '../../../shared/components/footercmp/footercmp';
import Mentornetwork from './components/mentor-network/mentor-network';
import Vcnetwork from './components/vc-network/vc-network';
import PartnersNetwork from './components/partner-network/partner-network';
import Launchnetwork from './components/launch-network/launch-network';
import StudyPrograms from './components/study-programs/study-programs';
import Partnerdiscounts from './components/partner-discounts/partner-discounts';
import Tools from './components/tools/tools';
import CalendarEvents from './components/calendar-events/calendar-events';
import { DashbordTopSection } from './components/dashbord-top-section/dashbord-top-section';


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
            style={{ width: "100%" }}
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

const Acceleratedashboard = () => {

    const [value, setValue] = useState(0);
    const [projectProgressPercentage, setProjectProgressPercentage] = useState(25);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="dashbord-main-page">
                <div className='position-relative'>
                   
                    <DashbordTopSection symbioteScore={undefined} setSymbioteScore={undefined}/>

                    <div className='container container-maxwidth profil-text'>
                        <div className='dashboard-tabs-section mt-lg-5 mt-md-3 mt-2'>
                            <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                <div>
                                    <div className='profile-name'>
                                        <h3>Duelist King</h3>
                                        <div className='d-flex align-items-center'>
                                            <div>
                                                <button className='new-color-button'>Your Profile</button>
                                            </div>
                                            <div className="">
                                                <div className="">
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
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="Dashboard" {...a11yProps(0)} />
                                        <Tab label="Progress" {...a11yProps(1)} />
                                        <Tab label="Mentor Network" {...a11yProps(2)} />
                                        <Tab label="Partner Network" {...a11yProps(3)} />
                                        <Tab label="VC Network" {...a11yProps(4)} />
                                        <Tab label="Launchpad Network" {...a11yProps(5)} />
                                        <Tab label="Events" {...a11yProps(6)} />
                                        <Tab label="Study Programs" {...a11yProps(7)} />
                                        <Tab label="Partner Discounts" {...a11yProps(8)} />
                                        <Tab label="Tools" {...a11yProps(9)} />
                                    </Tabs>
                                </div>
                                <div className="container p-lg-3 p-md-2 p-0">
                                    <TabPanel value={value} index={0}>
                                        <Dashboard />
                                    </TabPanel>

                                    <TabPanel value={value} index={1}>
                                        <Progress />
                                    </TabPanel>

                                    <TabPanel value={value} index={2}>
                                        <Mentornetwork />
                                    </TabPanel>

                                    <TabPanel value={value} index={3}>
                                        <PartnersNetwork />
                                    </TabPanel>

                                    <TabPanel value={value} index={4}>
                                        <Vcnetwork />
                                    </TabPanel>

                                    <TabPanel value={value} index={5}>
                                        <Launchnetwork />
                                    </TabPanel>

                                    <TabPanel value={value} index={6}>
                                        <CalendarEvents />
                                    </TabPanel>

                                    <TabPanel value={value} index={7}>
                                        {/* <StudyPrograms /> */}
                                    </TabPanel>

                                    <TabPanel value={value} index={8}>
                                        {/* <Partnerdiscounts /> */}
                                    </TabPanel>

                                    <TabPanel value={value} index={9}>
                                        {/* <Tools /> */}
                                    </TabPanel>
                                </div>
                            </Box>
                        </div>
                    </div>

                </div>

                <Footercmp />
            </div>
        </>
    )
}

export default Acceleratedashboard