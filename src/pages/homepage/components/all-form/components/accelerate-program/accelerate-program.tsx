import React, { useState } from 'react'
import "./accelerate-program.sass"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


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


const Accelerateprogram = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
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
        </>
    )
}

export default Accelerateprogram