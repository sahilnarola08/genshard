import React, { useEffect, useState } from 'react'
import "./vc-connection-request.sass"
import Filterlist from '../filter-list/filter-list'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slider from 'react-slick';
import { VCCard } from '../vc-card/vc-card';
import BannerIMG from '../../../../../images/accelerate/pages/dashboard-bg.svg';
import { Link } from 'react-router-dom';
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
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  "
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  "
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  "
    },
]

const dropdownData = [
    {
        btnName: "Accelerate ONLY",
        dropdown: [
            "Accelerate ONLY",
            "Accelerate ONLY",
            "Accelerate ONLY",
            "Accelerate ONLY",
        ]
    },
    {
        btnName: "Area",
        dropdown: [
            "Area",
            "Area",
            "Area",
            "Area",
        ]
    },
]

const VCConnectionRequest = () => {

    return (
        <>
            <div className="row">
                <div className="mb-5 d-flex align-items-center justify-content-center gap-4">
                    <h5 className='heading-new-5'>Filter List by</h5>
                    {dropdownData && dropdownData.map((item: any, index: number) => (
                        <RadioDropdown
                            key={index}
                            BtnName={item.btnName}
                            dropdownValues={item.dropdown}
                        />
                    ))}
                </div>
                {cardData && cardData.map((item: any, index: number) => (
                    <div className="col-lg-6">
                        <div className="vc-card">
                            <div className="top-button">
                            <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                                <button className='new-color-button-small'>DeFi</button>
                            </div>
                            <div className="banner-image">
                                <img src={BannerIMG} className='img-fluid' alt="" />
                            </div>
                            <div className="text-content">
                                <div className="">
                                    <div className="mb-3">
                                        <div className="left-part d-flex align-items-center justify-content-between">
                                            <div className="user-image">
                                                <img src={BannerIMG} className='img-fluid' alt="" />
                                                <h5 className='heading-new-5'>{item.name}</h5>
                                            </div>
                                            <div className="card-social mt-0">
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
                                    <div className="">
                                        <div className="right-part">
                                            <h6 className='heading-new-6 text-start mb-3'>Message:</h6>
                                            <p className='paragraph-new-small mb-0'>{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="respond-reject-btn">
                                            <button className='respond-btn'>Respond</button>
                                            <button className='reject-btn'>Reject</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default VCConnectionRequest