import React, { useEffect, useState } from 'react'
import "./vc-all-projects.sass"
import Filterlist from '../filter-list/filter-list'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slider from 'react-slick';
import { VCCard } from '../vc-card/vc-card';
import BannerIMG from '../../../../../images/accelerate/pages/dashboard-bg.svg';
import Roket from '../../../../../images/vc/roket.svg'
import Game from '../../../../../images/vc/game.svg'
import { Link, useLocation } from 'react-router-dom';
import { RadioDropdown } from '../radio-dropdown/radio-dropdown';

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

const cardData = [
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
]
const projectslistData = [
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
]

const dropdownData = [
    {
        btnName: "Connect Status",
        dropdown: [
            "Connected",
            "Requested",
            "Not Connected",
        ]
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

const VcAllProjects = () => {
    const [selectedMenu, setselectedMenu] = useState("Projects Overview");
    const [projectMenu, setProjectMenu] = useState(["Projects Overview"]);
    const location = useLocation();
    const pathname = location.pathname;
    const isVCDashboard = pathname.includes("/vc-dashboard")

    useEffect(() => {
        if (projectMenu.length < 2) {
            setProjectMenu([...projectMenu, "All Projects List"])
        }
    }, [selectedMenu])

    let settings = {
        dots: false,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
    };
    return (
        <>
            {isVCDashboard ?
            <>
                <div className="event-button text-center my-3">
                    {projectMenu.map((menu: any, id: number) => (
                        <button key={id}
                            className={selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "}
                            onClick={() => setselectedMenu(menu)}
                        >
                            {menu}
                        </button>
                    ))}
                </div> 
            {selectedMenu === "Projects Overview" &&
                <div>
                    <div className='just-in mb-5'>
                        <h1>Just in</h1>
                        <Filterlist />
                    </div>
                    <div className='mb-5'>
                        <Slider {...settings}>
                            {collections?.map((values, i) => (
                                <div className='vc-slider-card'>
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
                                                            <h5 className='heading-new-5'>DUELIST KING</h5>
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
                                                        <h6 className='heading-new-6 text-start mb-3'>Ut enim ad minim veniam, quis nostrud </h6>
                                                        <p className='paragraph-new-small mb-0'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mt-4 text-center">
                                                    <button className='card-button'>View Project Page</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className='my-5'>
                        <img src={Roket} className='img-fluid mb-3' alt="" />
                        <h4 className='heading-new-4 mb-5'>Early Star</h4>
                        <div>
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
                                            <div className="left-part d-flex justify-content-between align-items-center">
                                                <div className="user-image">
                                                    <img src={BannerIMG} className='img-fluid' alt="" />
                                                    <h5 className='heading-new-5'>DUELIST KING</h5>
                                                </div>
                                                <div className="card-social mt-0 me-5">
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
                                                <h6 className='heading-new-6 text-start mb-3'>Ut enim ad minim veniam, quis nostrud </h6>
                                                <p className='paragraph-new-small mb-0'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 mt-4 text-center">
                                            <button className='card-button'>View Project Page</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-5 ">
                            <img src={Game} className='img-fluid mb-3' alt="" />
                            <div className='d-flex align-items-center gap-5'>
                                <h5 className='heading-new-5'>New in Gaming</h5>
                                <div className="table-filter-content mt-0">
                                    <div className="heading-table">
                                        <p className='paragraph-new fw-bold mb-0'>Filter List by</p>
                                        {dropdownData && dropdownData.map((item: any, index: number) => (
                                            <RadioDropdown
                                                key={index}
                                                BtnName={item.btnName}
                                                dropdownValues={item.dropdown}
                                            />
                                        ))}
                                        {/* <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Accelerate ONLY</button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="area-1" id="area-1" defaultChecked />
                                                        <label className="form-check-label paragraph-new-small" htmlFor="area-1">Connected</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="area-1" id="area-2" />
                                                        <label className="form-check-label paragraph-new-small" htmlFor="area-2">Requested</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="area-1" id="area-3" />
                                                        <label className="form-check-label paragraph-new-small" htmlFor="area-3">Not Connected</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row gaming-scroll">
                            {cardData && cardData.map((item: any, index: number) => (
                                <VCCard
                                    name={item.name}
                                    title={item.title}
                                    description={item.description} />
                            ))}
                        </div>
                    </div>
                </div>
            }
            {selectedMenu === "All Projects List" &&
                <div>
                    <div className='mb-5 d-flex justify-content-center'>
                        <Filterlist />
                    </div>
                    <div>
                        <div className="row projects-scroll">
                            {projectslistData && projectslistData.map((item: any, index: number) => (
                                <VCCard
                                    name={item.name}
                                    title={item.title}
                                    description={item.description} />
                            ))}
                        </div>
                    </div>
                </div>
            }</>:
            <div className="row mb-5">
                {cardData && cardData.map((item: any, index: number) => (
                    <VCCard
                        name={item.name}
                        title={item.title}
                        description={item.description} />
                ))}
            </div>}
        </>
    )
}

export default VcAllProjects