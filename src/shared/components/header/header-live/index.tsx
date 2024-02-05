import { useEffect, useState } from "react"

import twitterSvg from "../../../../images/header-live/twitter-white.svg"
import telegramSvg from "../../../../images/header-live/telegram-white.svg"
import mixedSvg from "../../../../images/header-live/mixed-white.svg"
import internetSvg from "../../../../images/header-live/internet-white.svg"
import uniswapSvg from "../../../../images/header-live/uniswap-logo.svg"
import pancakeswapSvg from "../../../../images/header-live/pancakeswap-logo.svg"
import { useHistory } from "react-router-dom"

import "./style.sass"
import axios from "axios"
import { GS_TOKEN_VALUE_TO_USD_URL, LP_MINING_REDIRECT_URL, PANCAKESWAP_REDIRECT_URL, UNISWAP_REDIRECT_URL } from "../../../../constants"

const socialMediaLinks = [
    {
        image: twitterSvg,
        link: "https://twitter.com/GenShards"
    },
    {
        image: telegramSvg,
        link: "https://t.me/genshardsANN"
    },
    {
        image: mixedSvg,
        link: "https://genesis-shards.medium.com/"
    },
    {
        image: internetSvg,
        link: "https://www.genshards.com/"
    }
]

export default function HeaderLive() {

    const [currentValue, setCurrentValue] = useState(1)
    const [showLPmining, setShowLPmining] = useState(true)
    const history = useHistory()

    useEffect(() => {
        gsToUsdValue()
        const interval = setInterval(() => {
            setShowLPmining(prev => !prev)
        }, 7000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const gsToUsdValue = async () => {
        try {
            const response = await axios.get(GS_TOKEN_VALUE_TO_USD_URL)
            setCurrentValue((response.data["genesis-shards"] && response.data["genesis-shards"]["usd"]) || 1)
        } catch (ex) {
            console.log(ex, 'Error in gstoUsd')
        }
    }

    return (
        <div className="staking-live">
            <div className="first-div">
                {
                    socialMediaLinks.map((social, item) => {
                        return <a key={item} href={social.link} target="_blank" rel="noreferrer"><img src={social.image} alt="" /></a>
                    })
                }
            </div>
            <div className="middle-div">
                {
                    showLPmining ?
                        <p>GS-BNB Liquidity Mining is now live. <a href={LP_MINING_REDIRECT_URL} target="_blank" rel="noreferrer">&nbsp;START NOW.</a></p>
                        :
                        <p>GENSHARDS STAKING IS NOW LIVE. <span onClick={() => history.push('/staking')}>&nbsp;START NOW.</span></p>
                }
            </div>
            <div className="last-div">
                <p>GS TOKEN PRICE: <span>${currentValue.toFixed(2)}</span></p>
                <div className="btn-div">
                    <a href={UNISWAP_REDIRECT_URL} target="_blank" rel="noreferrer"><img src={uniswapSvg} alt="" /></a>
                    <a href={PANCAKESWAP_REDIRECT_URL} target="_blank" rel="noreferrer"><img src={pancakeswapSvg} alt="" /></a>
                </div>
            </div>
        </div>
    )
}