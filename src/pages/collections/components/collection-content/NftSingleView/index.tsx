import Button from "../../../../../shared/components/buttons"
import "./style.sass"
import likeCountIcon from "../../../../../images/collections/like-count-white.svg"
import ReactPlayer from "react-player"
import { INftCollection } from "../../../types"
import DurationIcon from "../../../../../images/collections/clock-white-icon.svg"
import moment from "moment"
import { isVideoFormat } from '../../../../market/helper'

interface INftSingleView {
    collection?: INftCollection | undefined
    onClose: () => void
    cardLoader: any,
    onClickApprove: any
    onClickMint: any
    onClickClaimRewards: any
    onClickClaimAndWithdraw: any
    onClickAddVote: any
}

export default function NftSingleView(props: INftSingleView) {

    const { collection, onClose, onClickMint, onClickClaimRewards, onClickClaimAndWithdraw, onClickApprove, cardLoader, onClickAddVote } = props
    const {
        name = "",
        stake = 0,
        left = 0,
        nftId,
        total = 0,
        likeCount = 0,
        img: src = "",
        rarity = '',
        characterStatus,
        isClaimReward,
        isUserStaking,
        isApproved,
        cardRewards,
        userReward,
    } = collection || {}
    
    const videoFormat = isVideoFormat(src.toString());

    let { remainingTimeUser, cardDuration } = collection || {}

    let remainingTime = ''

    if (isUserStaking) {
        remainingTimeUser = String(Number(remainingTimeUser) - moment().unix())
        let minutes = Math.floor((Number(remainingTimeUser) % 3600) / 60)
        let hours = Math.floor((Number(remainingTimeUser) % 86400) / 3600)
        let days = Math.floor((Number(remainingTimeUser) % (86400 * 30)) / 86400)

        if (days > 0) remainingTime = `${days} Days`
        else if (days <= 0 && hours > 0) remainingTime = `${hours} Hrs`
        else if (hours <= 0 && minutes > 0) remainingTime = `${minutes} min`
        else remainingTime = `0 min`
    } else {
        let minutes = Math.floor(Number(cardDuration) / 60)
        let hours = Math.floor(Number(cardDuration) / 3600)
        let days = Math.floor(Number(cardDuration) / 86400)

        if (days > 0) remainingTime = `${days} Days`
        else if (days <= 0 && hours > 0) remainingTime = `${hours} Hrs`
        else if (hours <= 0 && minutes > 0) remainingTime = `${minutes} min`
        else remainingTime = `0 min`
    }

    // const isButtonDisabled = (!isUserStaking _) left === 0 || (!isUserStaking || isApproved))
    const isButtonDisabled = !isUserStaking ? left === 0 : false

    return (
        <div className="nft-single-container">
            {(cardLoader === nftId) ? <div className="single-card-loader">
                <img
                    className="loading-icon"
                    src="/images/icons/loading.svg"
                    alt="loading"
                />
            </div> : cardLoader ? <div className="remaining-card-disable"></div> : null}
            <div>
                <button className="close-button" type="button" onClick={onClose}>
                    <img src={"/images/icons/close.svg"} alt="close" />
                </button>
            </div>
            <div className="nft-single-item">
                <div className="image-section">
                    <div className="image-div">
                        <div className="like-count" onClick={() => onClickAddVote(collection)}><img src={likeCountIcon} alt="" />{likeCount ? <span>{likeCount}</span> : null}</div>
                        {
                            videoFormat ? <ReactPlayer width={'100%'} height={'100%'} playing={true} muted={true} url={src.toString()} loop={true}/>
                            : <img src={src.toString()} alt="" />
                        }
                        {/* {
                            src && src.substr(src.length - 3) === 'mp4' ?
                                <ReactPlayer width={'100%'} height={'100%'} playing={true} muted={true} url={src.toString()} loop={true} />
                                : <img src={src.toString()} alt="" />
                        } */}
                    </div>
                    <div className="total-nft-left">
                        <span>Left <span>{left}</span> from {total}</span>
                    </div>
                </div>
                <div className="single-nft-info">
                    <div className="nft-heading">
                        <div>
                            {/* <h3>{name}</h3> */}
                            <h1>{name}</h1>
                        </div>
                        <div className="nft-duration">
                            <div className={`duration-chip ${isUserStaking ? 'active-chip' : ''}`}>
                                {isUserStaking ? <span className="remaining-text">Remaining</span> : null}
                                <img src={DurationIcon} alt="" />
                                <span>{remainingTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="nft-element-rarity">
                        {/* <div className="nft-element">
                            <label>Element</label>
                            <span>Character</span>
                        </div> */}
                        <div className="nft-element">
                            <label>Rarity</label>
                            <span>{rarity}</span>
                        </div>
                    </div>
                    <div className="progress-status-card">
                        <span className="status-text">
                            STATUS
                        </span>
                        {
                            Array.isArray(characterStatus) && characterStatus.length ?
                                <div className="progress-status">
                                    {
                                        characterStatus.map((item, index) => {
                                            const range = `${item.min}-${item.max}`
                                            return <ProgressBar
                                                key={index}
                                                textLabel={item.name}
                                                range={range}
                                                progress={item.progress}
                                            />
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                    <div className="stake-info-button">
                        <div className="stake-info">
                            <label>You are Staking</label>
                            <span>{stake} GS</span>
                        </div>
                        <div className="stake-info">
                            <label>Rewards</label>
                            <span>{isUserStaking ? Number(userReward).toFixed(2) : cardRewards} GSK</span>
                        </div>
                        {/* <Button className="" onClick={() => onClickAddVote(collection)}>
                            <img src={likeCountIcon} alt="" />  {likeCount}
                        </Button> */}
                    </div>
                    <div className="mint-button-div">
                        <Button className={isButtonDisabled ? "disable-button" : ""} disabled={isButtonDisabled} onClick={() => {
                            return !isApproved ? onClickApprove(collection) :
                                (isUserStaking && isClaimReward) ? onClickClaimRewards(collection) :
                                    isUserStaking ? onClickClaimAndWithdraw(collection) : onClickMint(collection)

                        }}>
                            {!isApproved ? "APPROVE" : (isUserStaking && isClaimReward) ? "CLAIM REWARDS" : isUserStaking ? "CLAIM & WITHDRAW" : "MINT"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface IProgressBar {
    textLabel: String;
    range: String;
    progress: Number
}

function ProgressBar(props: IProgressBar) {
    let { textLabel, range, progress } = props
    progress = (Number(progress) * 100) / 150
    if (progress > 100) progress = 100

    return (
        <div className="custom-progress-bar">
            <div className="progress-bar-label">
                <label>{textLabel}</label>
                <span>{range}</span>
            </div>
            <div className="progress-bar-count">
                <div style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}

