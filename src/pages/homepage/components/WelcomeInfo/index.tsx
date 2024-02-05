import React, { useEffect, useState } from 'react'
import "../../style.sass"
import Button from '../../../../shared/components/buttons'
import homePageLogo from "../../../../images/homepage/hero-main-img.svg"
import ArbitrumLogoImg from "../../../../images/homepage/arbitrum-logo-img.svg"
import zykncLogoImg from "../../../../images/homepage/zyknc-logo.svg"
import ecosystemheroImg from "../../../../images/homepage/ecosystem-hero.svg"
import Raised from "../../../../images/homepage/raised.svg"
import ProjectLaunch from "../../../../images/homepage/project-launch.svg"
import Partners from "../../../../images/homepage/partners.svg"
import GlobalCommunity from "../../../../images/homepage/global-community.svg"
import PartnersIcon from "../../../../images/homepage/partners-icon.svg"
import categoriesIcon from "../../../../images/homepage/categories-icon.svg"
import countriesIcon from "../../../../images/homepage/countries-icon.svg"
import blockchainsIcon from "../../../../images/homepage/blockchains-icon.svg"
import { useHistory, useLocation } from 'react-router-dom'

const welcomeButtons = [
    {
        label: 'Apply'
    },
    {
        label: 'Telegram'
    },
    {
        label: 'Blog'
    },
]
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
const partnerData = [
    {
        image: PartnersIcon,
        name: "Partners",
        number: "120+"
    },
    {
        image: categoriesIcon,
        name: 'Categories',
        number: "10+"
    },
    {
        image: countriesIcon,
        name: "Countries",
        number: "32"
    },
    {
        image: blockchainsIcon,
        name: "Blockchains supported",
        number: "5+"
    },
]

export default function WelcomeInfo() {
    const location = useLocation();
    const pathname = location.pathname;
    const history = useHistory()

    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    function getCurrentDimension() {
        return {
            width: window.innerWidth,
        }
    }
    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    return (
        <>
            {pathname === "/" &&
                <div className='welcome-to-container'>
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-lg-6 col-md-6 col-6 align-self-center">
                                {screenSize && screenSize.width > 767 ?
                                    <div className='welcome-content'>
                                        <h2 className='heading-new-2'>LAUNCHPAD</h2>
                                        <div className="live-arbitrum">
                                            <p>Home for launches on</p>
                                        </div>
                                        <div className="logo-flex live-arbitrum gap-lg-3 gap-2">
                                            <img src={ArbitrumLogoImg} className='img-fluid' alt="" />
                                            <p className='m-0'>&</p>
                                            <img src={zykncLogoImg} className='img-fluid' alt="" />
                                        </div>
                                    </div> :
                                    <div className='welcome-content'>
                                        <div className="live-arbitrum">
                                            <p>Home for launches on</p>
                                        </div>
                                        <div className="logo-flex live-arbitrum gap-lg-3 gap-2">
                                            <img src={ArbitrumLogoImg} className='img-fluid' alt="" />
                                            <p className='m-0'>&</p>
                                            <img src={zykncLogoImg} className='img-fluid' alt="" />
                                        </div>
                                        <h2 className='heading-new-2 mb-3'>LAUNCH</h2>
                                    </div>
                                }

                                <div className='actions-buttons '>
                                    <button className="new-primary-button" >Go to App <i className="ri-external-link-line ms-2"></i></button>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-6 position-relative">
                                <div className='background-logo'>
                                    <img src={homePageLogo} className='img-fluid' alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="row">
                                    {counterData.map((item: any, i: number) => {
                                        return <div className="col-lg-3 col-md-4 col-sm-6 col-6">
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
            }
            {pathname === "/ecosystem" &&
                <div className='welcome-to-container'>
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-6 align-self-center z-1">
                                <div className='welcome-content'>
                                    <h1 className='heading-new-1'>Ecosystem</h1>
                                    <div><span /></div>
                                    <div className="live-arbitrum">
                                        <p className='paragraph-new my-lg-5 my-mb-3 my-2'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  </p>
                                    </div>
                                </div>
                                <div className='actions-buttons'>
                                    <button className="new-primary-button" >Apply to be a partner</button>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className='background-logo'>
                                    <img src={ecosystemheroImg} className='img-fluid' alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="row">
                                    {partnerData && partnerData.map((item: any, i: number) => {
                                        return <div className="col-lg-3 col-md-4 col-6">
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
            }
        </>
    )
}