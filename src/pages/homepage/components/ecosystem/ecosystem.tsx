import Footercmp from "../../../../shared/components/footercmp/footercmp"
import "./ecosystem.sass"
import ChainImg from "../../../../images/homepage/chain-img.svg"
import AvalanceLogo from "../../../../images/homepage/avalance-logo.svg"
import BinanceLogo from "../../../../images/homepage/binance-logo.svg"
import EtheriumLogo from "../../../../images/homepage/etherium-logo.svg"
import HarmonyLogo from "../../../../images/homepage/harmony-logo.svg"
import RbtrumLogo from "../../../../images/homepage/rbtrum-logo.svg"
import PoligonLogo from "../../../../images/homepage/poligon-logo.svg"
import featurCardImg from "../../../../images/homepage/featur-card-img.svg"
import tableIcon from "../../../../images/homepage/table-icon.svg"
import TestimonialsLogo from "../../../../images/Testimonials-logo.svg"
import WorldImg from "../../../../images/homepage/world-img.svg"
import partnerlogoimg from "../../../../images/partner-logo-img.svg"
import ecosystemheroImg from "../../../../images/homepage/ecosystem-hero.svg"

import StakeBg from '../../../../images/staking/staking-bg-img.svg';
import quates from "../../../../images/quates.svg"
import { Link } from "react-router-dom"
import TwitterIcon from '@mui/icons-material/Twitter';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import TelegramIcon from '@mui/icons-material/Telegram';

import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, GridToolbarQuickFilter, GridValueGetterParams } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useMemo } from "react"
import WelcomeInfo from "../WelcomeInfo"
import PartnerListTable from "./components/partner-list-table/partner-list-table"
import { PartnerGridList } from "./components/partner-grid-list/partner-grid-list"
const counterData = [
    {
        // image: GlobalCommunity,
        name: "Global Community",
        number: "50+"
    },
    {
        // image: Partners,
        name: 'Partners',
        number: "$1.6M+"
    },
    {
        // image: ProjectLaunch,
        name: "Project Launches",
        number: "450+"
    },
    {
        // image: Raised,
        name: "Raised",
        number: "110K+"
    },
]

const chainPartner = [
    {
        image: AvalanceLogo,
    },
    {
        image: BinanceLogo,
    },
    {
        image: EtheriumLogo,
    },
    {
        image: HarmonyLogo,
    },
    {
        image: RbtrumLogo,
    },
    {
        image: PoligonLogo,
    },
]

function QuickSearchToolbar() {
    return (
        <Box
            sx={{
                p: 0.5,
                pb: 0,
            }}
        >
            <GridToolbarQuickFilter />
        </Box>
    );
}

const VISIBLE_FIELDS = ['Name', 'Type', 'Description', 'Socials'];

const getApplyFilterFnSameYear = (value: string) => {
    if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
        // If the value is not a 4 digit string, it can not be a year so applying this filter is useless
        return null;
    }
    return (params: GridCellParams): boolean => {
        if (params.value instanceof Date) {
            return params.value.getFullYear() === Number(value);
        }
        return false;
    };
};


function Ecosystem() {

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', },
        { field: 'image', headerName: '', renderCell: (params) => <img src={params.value} /> },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'socials',
            headerName: 'Socials',
            type: 'actions',
            flex: 1,
            getActions: () => [
                <GridActionsCellItem
                    icon={<TwitterIcon />}
                    label="Delete"
                    onClick={() => { console.log("clicked") }}
                />,
                <GridActionsCellItem
                    icon={<InsertLinkIcon />}
                    label="Toggle Admin"
                    onClick={() => { console.log("clicked") }}
                // showInMenu
                />,
                <GridActionsCellItem
                    icon={<TelegramIcon />}
                    label="Duplicate User"
                    onClick={() => { console.log("clicked") }}
                // showInMenu
                />,
            ],
        },
    ];

    const rows = [
        { id: 1, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 2, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 3, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 4, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 5, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 6, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 7, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 8, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
        { id: 9, image: tableIcon, name: "Lorem Ipsum", type: 'Gaming', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', },
    ];

    return (
        <>
            <div>
                <WelcomeInfo />

                <PartnerGridList />

                <section className="chain-work-with-section">
                    <div className="">
                        <div className="container">
                            <div className="section-heading mb-4">
                                <h4><img src={ChainImg} alt="" /> Chains we work with</h4>
                            </div>
                            <div className="chain-partners">
                                {chainPartner && chainPartner.map((item: any, i: number) => {
                                    return <div className="chain-partner" key={i}>
                                        <img src={item.image} className="img-fluid" alt="" />
                                    </div>
                                })}
                            </div>
                            <p className="mt-4 text-center small-heading">...and we’re always working on adding more!</p>
                        </div>
                    </div>
                </section>

                <section className="featured-card-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="featured-card">
                                    <div className="top-content">
                                        <p className="big-fonts mb-0">GameFi</p>
                                    </div>

                                    <div className="featured-card-inner">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>

                                    <div className="featured-card-inner">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mt-lg-0 mt-5">
                                <div className="featured-card">
                                    <div className="top-content">
                                        <p className="big-fonts mb-0">Defi</p>
                                    </div>

                                    <div className="featured-card-inner">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>

                                    <div className="featured-card-inner">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="heading-new-4 ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="heading-new-5 mb-3">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="paragraph-new-medium mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="bottom-btn">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                           

                            {/* <div className="col-lg-6 mt-lg-0 mt-5">
                                <div className="featured-card">
                                    <div className="top-content">
                                        <p className="big-fonts mb-0">DeFi</p>
                                    </div>
                                    <div className="mb-lg-5 mb-4">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="mb-4">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="mt-lg-5 mt-md-3 mt-2">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>
                                    <div className="mb-lg-5 mb-4">
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="mb-4">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="mt-lg-5 mt-md-3 mt-2">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bottom-content">
                                            <div className="left-content">
                                                <div className="d-flex align-items-center">
                                                    <img src={featurCardImg} className="img-fluid" alt="" />
                                                    <h4 className="ms-3">DUELIST <br /> KING</h4>
                                                </div>
                                                <ul className="social-link">
                                                    <li>
                                                        <Link to=""><i className="ri-twitter-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-links-line"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link to=""><i className="ri-send-plane-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="right-content">
                                                <h5 className="mb-4">Ut enim ad minim veniam, quis nostrud</h5>
                                                <p className="mb-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                            </div>
                                        </div>
                                        <div className="mt-lg-5 mt-md-3 mt-2 ">
                                            <button className="partner-button">Connect to Partner</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </section>

                <section className="partner-list-table left-part-background">
                    <div className="container position-relative">
                        <div className="Partners-heading text-center mb-4">Partners List</div>
                        <PartnerListTable />
                    </div>
                </section>

                <section className="Testimonials-sec ">
                    <div className="container">
                        <div className="Testimonials-heading text-center mb-5">Testimonials</div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card mb-5">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <h4 className="mb-3">Being on the CometX system catapulted us to the next level</h4>
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card mb-5">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <img className="mb-3" src={TestimonialsLogo} alt="" />
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card mb-5">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <h4 className="mb-3">Being on the CometX system catapulted us to the next level</h4>
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card ">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <h4 className="mb-3">Being on the CometX system catapulted us to the next level</h4>
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card ">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <img className="mb-3" src={TestimonialsLogo} alt="" />
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="counter-card ">
                                    <div className="counter-img">
                                        <img src={quates} className='img-fluid' alt="" />
                                    </div>
                                    <h4 className="mb-3">Being on the CometX system catapulted us to the next level</h4>
                                    <p className="mb-0">Barack Obama, US </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <section className="belong-world-section">

                    <div className="container">
                        <div className="heading text-center mb-5">
                            <h2 className='mb-3'>Your project belongs to the world.</h2>
                            <p style={{ color: "#fff" }}>Let us help you get there.</p>
                        </div>
                        <div className="d-flex justify-content-center">
                            <h2><span style={{ color: "#2479DF" }}>110,000</span><br /> Members</h2>
                            <img src={WorldImg} className='img-fluid' alt="" />
                            <h2 className='align-self-end'>Across<span style={{ color: "#2479DF" }}> 6 </span><br />Continents</h2>
                        </div>
                    </div>
                </section> */}
                <section className="project-belong-world-section mb-lg-0 mb-md-5">
                    <div className="container">
                        <div className="heading text-center mb-lg-5 mb-4">
                            <h2 className='mb-3 heading-new-2'>Your project belongs to the world.</h2>
                            <p className='paragraph-new'>Let us help you get there.</p>
                            <button className="new-color-button mt-lg-3">Check out ACCELERATE</button>
                        </div>
                        <div className="d-lg-flex d-md-flex d-block justify-content-center text-lg-start text-center">
                            <h2 className='heading-new-2 mb-lg-0 mb-4 d-lg-block d-md-block d-none'><span className='heading-new-2' style={{ color: "#2479DF" }}>110,000</span><br />Members</h2>
                            <img src={WorldImg} className='img-fluid' alt="" />
                            {/* <div className="outer-lines">
                            <div className="inner-map"></div>
                        </div> */}
                            <div className="d-lg-none d-md-none d-flex justify-content-between">
                                <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4'><span className='heading-new-2' style={{ color: "#2479DF" }}>110,000</span><br />Members</h2>
                                <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4'>Across<span className='heading-new-2' style={{ color: "#2479DF" }}> 6 </span><br />Continents</h2>
                            </div>
                            <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4 d-lg-block d-md-block d-none'>Across<span className='heading-new-2' style={{ color: "#2479DF" }}> 6 </span><br />Continents</h2>
                        </div>
                    </div>
                </section>

                {/* belong-world counter */}
                <section className="belong-world-counter d-lg-none d-md-none d-block">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-6">
                                <div className="counter-card">
                                    <h2 className='mb-2 heading-new-2'>75M</h2>
                                    <p className='paragraph-new-medium mb-0'>Total GS Staked</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-6">
                                <div className="counter-card">
                                    <h2 className='mb-2 heading-new-2'>75M</h2>
                                    <p className='paragraph-new-medium mb-0'>Total GS Staked</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mt-3">
                                <div className="counter-card">
                                    <h2 className='mb-2 heading-new-2'>75M</h2>
                                    <p className='paragraph-new-medium mb-0'>Total GS Staked</p>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                                <button className='mt-lg-5 mt-md-4 mt-3 new-primary-button'>Stake your GS now</button>
                            </div>
                        </div>
                    </div>
                </section>

                <Footercmp />
            </div>
        </>
    )
}

export default Ecosystem