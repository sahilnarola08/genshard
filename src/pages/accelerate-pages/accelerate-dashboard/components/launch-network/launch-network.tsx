import React from 'react'
import "./launch-network.sass"
import Elone from '../../../../../images/accelerate/pages/elon.svg';
import CarlPei from '../../../../../images/accelerate/pages/carl-pei.svg';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const mentorDAta = [
    {   
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    }
]
const launchData = [
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
    },
    {
        image: Elone,
        name: "L1",
        title: "Makes funny cars",
    },
    {
        image: CarlPei,
        name: "L2",
        title: "Not Nothing",
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
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Launchnetwork = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <div className='launch-network-section'>
                <div className='lead-section'>
                    {/* <div className=''> */}
                    <h5 className='heading-new-5 me-3'>Currently Connected to</h5>
                    <div className='currently-filter text-center mt-lg-5 mt-md-3 mt-2'>
                        <p className='paragraph-new fw-bold'>Filter by</p>
                        <div className='currently-tab'>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Launchpads" {...a11yProps(0)} />
                                    <Tab label="Exchanges" {...a11yProps(1)} />
                                    <Tab label="Market Makers" {...a11yProps(2)} />
                                    <Tab label="Liquidity Providers" {...a11yProps(3)} />
                                </Tabs>
                            </Box>
                        </div>
                    </div>
                    <TabPanel value={value} index={0}>
                        <div className='connection-section mt-3'>
                            <div className="row">
                                {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                                    <div className="col-lg-3">
                                        <div className='all-mentor-section text-center'>
                                            <img className='img-fluid' src={item.image} alt="" />
                                            <p className='paragraph-new mt-3'>{item.name}</p>
                                            <p className='paragraph-new-medium'>{item.title}</p>
                                            <button className='new-primary-button'>Talk</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className='color-white-new heading-new-2'>tab 2</div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <div className='color-white-new heading-new-2'>tab 3</div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <div className='color-white-new heading-new-2'>tab 4</div>
                    </TabPanel>

                </div>
                <div className='lead-section mt-lg-5 mt-md-3 mt-2'>
                    {/* <div className=''> */}
                    <h5 className='heading-new-5 me-3'>Our Launch Network</h5>
                    <div className='mt-lg-5 mt-md-3 mt-2 launch-filter'>
                        <div className='currently-filter text-center '>
                            <p className='paragraph-new fw-bold'>Filter by</p>
                            <div className='currently-tab'>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Launchpads" {...a11yProps(0)} />
                                        <Tab label="Exchanges" {...a11yProps(1)} />
                                        <Tab label="Market Makers" {...a11yProps(2)} />
                                        <Tab label="Liquidity Providers" {...a11yProps(3)} />
                                    </Tabs>
                                </Box>
                            </div>
                        </div>
                        <TabPanel value={value} index={0}>
                            <div className='connection-section mt-3'>
                                <div className="row">
                                    {launchData && launchData?.map((item: any, i: any) => (
                                        <div className="col-lg-3 mb-lg-5 mb-md-3 mb-2">
                                            <div className='all-mentor-section text-center'>
                                                <img className='img-fluid' src={item.image} alt="" />
                                                <p className='paragraph-new mt-3'>{item.name}</p>
                                                <p className='paragraph-new-medium'>{item.title}</p>
                                                <button className='new-primary-button'>Talk</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <div className='color-white-new heading-new-2'>tab 2</div>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div className='color-white-new heading-new-2'>tab 3</div>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <div className='color-white-new heading-new-2'>tab 4</div>
                        </TabPanel>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Launchnetwork