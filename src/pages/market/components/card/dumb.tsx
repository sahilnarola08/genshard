import './style.sass'
import threeDashImg from '../../../../images/threedash.svg'
import styled from 'styled-components'
import Button from '../../../../shared/components/buttons'
import { Card } from '../../../../state/market/types'
import { useEffect, useState } from 'react'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { KYC_STATUS } from '../../../../state/application/reducer'
import { isVideoFormat } from '../../helper'

interface CardDumbProps extends Card {
  onClick: () => void
  isPast: boolean
  currentProject? : any
  ticketAddress: string
  marketAddress?: string
}

export default function CardDumb({
  ticketAddress,
  marketAddress,
  currentProject,
  src,
  name,
  total,
  remain,
  balance,
  description,
  onClick,
  isPast,
  price,
  index
}: CardDumbProps) {
  const kycStatus = useSelector((state: AppState) => state.application.kyc_status)
  const { account } = useActiveWeb3React()
  const [isNotWhitelisted, setIsNotWhitelisted] = useState(false)
  const [reachedPurchaseLimit, setPurchaseLimit] = useState(false)
  const [showKYCMessage, setShowKYCMessage] = useState(false)
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)
  const network = useSelector((state: AppState) => state.application.network)

  const [isEnableUSDT, setIsEnableUSDT] = useState<boolean>(false)

  const isEnableUSDTfn = async () => {
    if (!marketAddress!) return 
    const res = await genMarket(marketAddress!).methods.enableUsdt().call()
    setIsEnableUSDT(res);
  }

  useEffect(() => {
    isEnableUSDTfn()
  }, [marketAddress])

  const percent = (Number(total) - Number(remain)) / Number(total)

  const HrPersent = styled.hr`
    height: 2px;
    width: calc(100px * ${percent});
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-highlight);
    margin-left: 0px;
    border: 1px solid var(--color-highlight);
  `

  const BuyNowButton = styled(Button)`
    transition: 0.2s;
    opacity: 1;
    &:hover {
      opacity: 0.7;
    }
  `

  const handleClick = async () => {
    if (kycStatus !== KYC_STATUS.VERIFIED) {
      setShowKYCMessage(true)
      return
    }
    if (marketAddress === undefined) {
      setPurchaseLimit(true)
      return
    }
    const whitelisted = await genMarket(marketAddress).methods.whitelist(index, account!).call()
    const purchaseLimit = await genMarket(marketAddress).methods.purchaseLimits(index).call()

    if (Number(purchaseLimit) === Number(balance)) {
      setPurchaseLimit(true)
    } else if (!whitelisted) {
      setIsNotWhitelisted(true)
    } else {
      onClick()
    }
  }

  const videoFormat = isVideoFormat(src)
  const showIssueMessage = isNotWhitelisted || reachedPurchaseLimit || showKYCMessage

  console.log("details --> ", src, name, index);
  return (
    <div className="overall-container">
      {showIssueMessage ?
        <div style={{ opacity: showIssueMessage ? 0.8 : 0, zIndex: showIssueMessage ? 2 : -1 }} className="not-whitelisted">
          <div style={{ color: '#fff', fontSize: 25 }} className="total-detail">
            {showKYCMessage ? `Please complete KYC` : reachedPurchaseLimit ? `Reached Purchase Limit` : 'Address is not whitelisted'}
          </div>
        </div>
        : null}
      <div className="liveup-card">
        {
          videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} muted={true} url={src} loop={true}/>
          : <img src={src} alt="" />
        }
        {/* {src !== undefined && src.substr(src.length - 3) === 'mp4' ?
          <ReactPlayer className="card-player" width={'50%'} height={'100%'} playing={true} muted={true} url={src} loop={true} />
          : <img src={src} alt="" />} */}
        <div className="card-detail">
          <div className="card-detail-wrapper">
            {/* name and status */}
            <div className="name-status">
              {isPast ? null : (parseInt(remain) / parseInt(total)) > 0.2 ? (
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


            {/* balance-usdBalance and  remain-total */}
            {!isPast ? currentProject.name.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && currentProject.name.toLowerCase() !== "POLKER INO".toLowerCase() ?
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
              </div> : null : null}

            <span className="description">
              {description}
            </span>

            {/* artist and owner */}
            {parseFloat(price) !== 0 ? <div className="price-eth">
              <div className="grid-card-title">Price</div>
              
              {/* Progs : If decided to goes forward with USDT Buy Now instead of Normal buy now then open this code from commenting and comment below one line of code */}
              <span className="value">{Number(price)} {isEnableUSDT ? (network === 'BSC' ? ' BUSD' : ' USDT')  : (network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase())} </span>
             
              {/* Progs : If decided to goes forward with normal buy instead of USDT then open this code from commenting and comment above one line of code */}
              {/* <span className="value">{Number(price)} {network === 'BSC' || network === 'T-BSC' ? 'BNB': network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase()}</span> */}

            </div> : null}

            {!isPast ? <div className="buy-now">
              <BuyNowButton onClick={() => handleClick()} className="outline--highlight btn--select active">{isEnableUSDT ? 'Approve & Buy Now' :'Buy Now'}</BuyNowButton>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
