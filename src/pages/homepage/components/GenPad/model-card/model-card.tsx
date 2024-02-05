import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import './model-card.sass'
import twitter from "../../../../../images/homepage/twitter.svg"
import metaverse from "../../../../../images/homepage/metaverse.svg"
import telegram from "../../../../../images/homepage/telegram.svg"
import websiteLink from "../../../../../images/homepage/websiteLink.svg"
import bannerIMG from "../../../../../images/homepage/banner-img.svg"
import behanceLogo from "../../../../../images/homepage/behancesmall-logo.svg"
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux"
import { AppState } from '../../../../../state'
import Votehero from "../../../../../images/vote-profile-img.svg"

import 'react-circular-progressbar/dist/styles.css';

const redirectIconsMap: any = {
    twitter,
    telegram,
    metaverse,
    websiteLink,
}

const ModelCard = (props: any) => {

    const socialLinks = [
        { src: "twitter" },
        { src: "telegram" },
        { src: "mail" },
        { src: "browser" },
    ];

    const { data, cardTitle } = props;

    const colorHandle = useCallback(() => {

    }, [cardTitle])

    const history = useHistory()
    const network = useSelector((state: AppState) => state.application.network)

    const getTargetUrl = (link: string): string => {
        if (link === "twitter") {
            return data?.socialLinks?.twitterURL
        } else if (link === "telegram") {
            return data?.socialLinks?.telegramURL
        } else if (link === "mail") {
            return data?.socialLinks?.mediumURL
        } else if (link === "browser") {
            return data?.socialLinks?.websiteURL
        } else {
            return '#'
        }
    }

    return (
        <>
            <div className='me-lg-0 me-md-0 me-2'>
                <div className='genpad-card mt-4'>
                    <div className='notch' style={{ border: '2px solid #2479DF', color: "#54C4FC" }}>
                        <span style={{ color: "#FFFFFF", fontWeight: 300, fontFamily: 'Space Grotesk' }}>Upcoming</span>
                    </div>
                    <div className="inner-div">
                        <div className="banner-image">
                            <img src={bannerIMG} className='img-fluid' alt="" />
                        </div>
                        <div className='overview-container'>
                            <div className="image">
                                <img src={Votehero} alt="image" height="100%" width="100%" />
                            </div>
                            <div className='overview-info'>
                                <h1 className='mb-2'>Duelist King</h1>
                                <div className="d-flex align-items-center">
                                    <h3 className='me-2'>DUEK</h3>
                                    <img src={behanceLogo} className='img-fluid chain-img' alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="privat-public gap-3">
                            <button className='white-border-button'>Private</button>
                            <button className='white-border-button'>Gaming</button>
                        </div>
                        <div className='links'>
                            {socialLinks.map((link, id) => (
                                <a target="_blank" href={getTargetUrl(link.src)} onClick={(e) => e.stopPropagation()}><img src={`/images/liveproject/${link.src}.svg`} className='img-fluid' alt={link.src} /></a>
                            ))}
                        </div>
                        <p className='paragraph-new-medium color-white-new'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea</p>
                        <div className='starting-info'>
                            <p className='paragraph-new-small fw-bold mb-0'>Starts</p>
                            <p className='paragraph-new-small mb-0 mt-0 project-start-badge'>1 nov 2023</p>
                        </div>
                        <div className="total-info mb-4">
                            <p className='paragraph-new-small mb-0'>0 PRJX</p>
                            <p className='paragraph-new-small my-0'>dummy</p>
                        </div>
                        <div className="total-info my-0">
                            <p className='paragraph-new-small mb-0' style={{ color: "#686868" }}>Total Raise</p>
                            <p className='paragraph-new-small my-0'>10000</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(ModelCard)