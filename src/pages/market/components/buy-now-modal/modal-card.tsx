import './style.sass'
import '../card/style.sass'
import threeDashImg from '../../../../images/threedash.svg'
import styled from 'styled-components'
import Button from '../../../../shared/components/buttons'
import { Card as CardType } from '../../../../state/market/types'
import { useSelector } from "react-redux"
import { AppState } from '../../../../state'
import { isVideoFormat } from '../../helper'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { useWeb3Contract } from '../../../../hooks/useContract'

interface CardDumbProps extends CardType {
  onClick: () => void
  currentProject?: any
}

const BuyNowButton = styled(Button)`
  border-radius: 22px !important;
  font-size: 1.15rem;
  padding-left: 35px !important;
  padding-right: 35px !important;
  transition: 0.2s !important;
  opacity: 1;
  max-height: 39px;
  &:hover {
    opacity: 0.7;
  }
`

export default function BigCard({
  src,
  name,
  currentProject,
  total,
  remain,
  balance,
  description,
  onClick,
  price
}: CardDumbProps) {
  const percent = (Number(total) - Number(remain)) / Number(total)

  const network = useSelector((state: AppState) => state.application.network)

  const HrPersent = styled.hr`
    height: 4px;
    width: calc(125px * ${percent});
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-highlight);
    margin-left: 0px;
    border: 1px solid var(--color-highlight);
  `

  const videoFormat = isVideoFormat(src)

  const [isEnableUSDT, setIsEnableUSDT] = useState<boolean>(false)
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)
  const isEnableUSDTfn = async () => {
    if (!currentProject?.marketAddress!) return 
    let res = await genMarket(currentProject?.marketAddress!).methods.enableUsdt().call()
    setIsEnableUSDT(res);
  }

  useEffect(() => {
    isEnableUSDTfn()
  }, [currentProject?.marketAddress])

  return (
    <div>
      <div className="main-card">
      <div className="asset-card-div">
        {
          videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} muted={true} url={src} loop={true}/>
          : <img src={src} alt="" height={'100%'} />
        }
        </div>
        <div className="card-detail">
          {/* name and status */}
          <div className="name-status">
            {(parseInt(remain) / parseInt(total)) > 0.2 ? (
              <div className="status-open">
                <span></span>Open
              </div>
            ) : (remain === '0' ? (
              <div className="sold-out">
                <span></span>Sold Out
              </div>
            ) : (
              <div className="status-closed">
                <span></span>Closing soon
              </div>
            )
            )}
            <div className="card-name" title={name}>
              {name}
            </div>
          </div>

          {currentProject.name.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && currentProject.name.toLowerCase() !== "POLKER INO".toLowerCase() && (
            <>
              {/* balance-usdBalance and  remain-total */}
              <div className="balance-total">
                <div className="total-detail">
                  <span className="value">{remain} / </span>{total} left
                </div>
                {/* list price */}
                <div className="list-price">
                  {/*<div className="title">List Price</div>*/}
                  <div className="percent">
                    <hr className="total" />
                    <HrPersent />
                  </div>
                </div>
              </div></>
          )}
        

          <span className="description">
            {description}
          </span>

          

          {/* artist and owner */}
          <div className="price-eth">
            <div className="title">Price</div>
            {/* <span className="value">{Number(price)*10**18} {network}</span> */}

            {/* Progs : If decided to goes forward with USDT Buy Now instead of Normal buy now then open this code from commenting and comment below one line of code */}
            <div className="title">{Number(price)} {isEnableUSDT ? (network === 'BSC' ? ' BUSD' : ' USDT') : (network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase())} </div>
            
            {/* Progs : If decided to goes forward with normal buy instead of USDT then open this code from commenting and comment above one line of code */}
            {/* div className="title">{Number(price)} {network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase()}</div> */}
            
            {/*<div className="artist-owner-flex">
              <div className="title">Owner</div>
              <div className="value">{owner}</div>
            </div>*/}
          </div>

          <span className="description">
            Balance: {balance}
          </span>

          <div className="buy-now">
            <BuyNowButton onClick={onClick} className="outline--highlight btn--select active">{isEnableUSDT ? "Approve & Buy Now" : "Buy Now"}</BuyNowButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CardFinal = ({ src, name, onClose }: { src: string, name: string, onClose: () => void }) => {
  const videoFormat = isVideoFormat(src)
  return (
    <div>
      <div className="final-page-card">
        <div className="asset-card-div">
          {
            videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} muted={true} url={src} loop={true} />
              : <img src={src} alt="" />
          }
        </div>
        <div>
          <div className="thank-you-top">Thank you for the purchase of</div>
          <div className="thank-you-bottom">{name}</div>
          <div className="card-bar" />
        </div>
        <div className="pink-bar" />
        <div className="thank-you-top" style={{ marginTop: 50, marginBottom: 50 }}>Welcome!</div>
        <div className="buy-now">
          <BuyNowButton onClick={onClose} className="outline--highlight btn--select active">Go to Dashboard</BuyNowButton>
        </div>
      </div>
    </div>
  )
}
