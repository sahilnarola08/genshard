import React from 'react'
import "./style.sass"
import coingeckoImg from "../../../../images/community/coingecko.png"
import twitterImg from "../../../../images/community/twitter.png"
import telegramImg from "../../../../images/community/telegram.png"
import cmcImg from "../../../../images/community/cmc.png"
import mediumImg from "../../../../images/community/medium.png"
import {
    CMC_REDIRECT_LINK,
    COINGECKO_REDIRECT_LINK,
    MEDIUM_REDIRECT_LINK,
    TELEGRAM_REDIRECT_LINK,
    TWITTER_REDIRECT_LINK
} from '../../../../constants'

export default function SocialMedia() {

    const communityHeader = [
        {
            title: "NFTOs",
            id: "community-nftos-id"
        },
        {
            title: "Voting",
            id: "community-dao-id"
        },
        {
            title: "Academy",
            id: "community-academy-id"
        },
    ]

    const socialLinks = [
        {
            name: "Coingecko",
            link: COINGECKO_REDIRECT_LINK,
            image: coingeckoImg
        },
        {
            name: "Twitter",
            link: TWITTER_REDIRECT_LINK,
            image: twitterImg
        },
        {
            name: "Telegram",
            link: TELEGRAM_REDIRECT_LINK,
            image: telegramImg
        },
        {
            name: "CMC",
            link: CMC_REDIRECT_LINK,
            image: cmcImg
        },
        {
            name: "Medium",
            link: MEDIUM_REDIRECT_LINK,
            image: mediumImg
        },
    ]

    const scrollIntoView = (id: any = '') => {
        const scrollDiv = document.getElementById(id)?.offsetTop
        console.log(scrollDiv)
        window.scrollTo({ top: Number(scrollDiv) - 50, behavior: 'smooth' });
    }

    return (
        <div className="social-media-container">
            <div className="social-media-faded-div" />
            <div className="social-media-item">
                <div className="header-links">
                    {
                        communityHeader.map((item) => {
                            return <div className="header-link" key={item.id} onClick={() => scrollIntoView(item.id)}>
                                <span>{item.title}</span>
                            </div>
                        })
                    }
                </div>
                <div className="header-tag-line">
                    <h1>Join the <span>GS</span> Community</h1>
                    <p>Participate in GenShards Governance | Learn more about Crypto, NFTs & the Metaverse
                        A lot more coming soon.</p>
                </div>
                <div className="social-media-links">
                    <h2>Social Media</h2>
                    <div className="social-media-wrapper">
                        {
                            socialLinks.map(item => {
                                return <a href={item.link} target="_blank" rel="noreferrer" key={item.name} className="social-media-div">
                                    <div className="social-image"><img src={item.image} alt="" /></div>
                                    <span>{item.name}</span>
                                </a>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}