import businessImg from "../../../../images/staking/business-fill.svg"
import financeImg from "../../../../images/staking/finance-fill.svg"
import Button from '../../../../shared/components/buttons'
import EndAdornmentInput from '../../../../shared/components/staking/EndAdornmentInput';
import { IGsContract } from "../../../../state/staking/types";
import StakeInfo from "../stake-info";
import "./style.sass"

export default function ClaimCard(props: ICardDetails) {

    const {
        index,
        cardDetails,
        onClickStake,
        onClickWithdraw,
        onClickStakeMax,
        gstoUsd,
        onChangeInputValue,
        cardLoader,
        onClickWithdrawMax,
        onClickClaimReward,
        onClickClaimWithdraw,
        onClickApprove,
        accessPool
    } = props

    const { stakeBalance, apr, tvl, endTime, claimAmount, withdrawAmount, progress = 0, isPast, isMaxStake, isMaxWithDraw, stakeInput, withdrawInput, isApproved, contractAddress } = cardDetails || {}

    return <div className="claim-details">
        <div className="card-view">
            {(cardLoader === contractAddress) ? <div className="single-card-loader">
                <img
                    className="loading-icon"
                    src="/images/icons/loading.svg"
                    alt="loading"
                />
            </div> : cardLoader ? <div className="remaining-card-disable"></div> : null}
            <StakeInfo
                progress={progress}
                apr={apr}
                tvl={tvl}
                accessPool={accessPool}
                gstoUsd={gstoUsd}
                stakeBalance={stakeBalance}
                endTime={endTime}
                isPast={isPast}
            />

            <div className="staking-inputs">
                {isApproved ? null :
                    <div className="disabled-staking-inputs" >
                        <p>Please Approve first to start staking</p>
                    </div>
                }
                <div className="stake-input">
                    <div className="head">
                        <div onClick={() => onClickStake(index)}>
                            <span>STAKE</span>
                        </div>
                    </div>
                    <EndAdornmentInput
                        value={stakeInput}
                        name="stakeInput"
                        onChange={(e: any) => onChangeInputValue(index, e)}
                        onClickMax={() => onClickStakeMax(index)}
                        isMax={isMaxStake}
                    />
                </div>
                <div className="stake-input">
                    <div className="head">
                        <div onClick={() => onClickWithdraw(index)}>
                            <span>WITHDRAW</span>
                        </div>
                    </div>
                    <EndAdornmentInput
                        value={withdrawInput}
                        name="withdrawInput"
                        onChange={(e: any) => onChangeInputValue(index, e)}
                        onClickMax={() => onClickWithdrawMax(index)}
                        isMax={isMaxWithDraw}
                    />
                </div>
            </div>
            <div className="divider" />
            <div className="claim-actions">
                {
                    isApproved ? <div className="claim-withdraw-bnd-count">
                        <div className="claim-btn">
                            <div>
                                <img src={financeImg} alt="" />
                                <span>{claimAmount} {accessPool ? "GSK" : "GS"}</span>
                            </div>
                            <Button className="outline--highlight" onClick={() => onClickClaimReward(index)}>CLAIM REWARD</Button>
                        </div>
                        <div className="claim-btn">
                            <div>
                                <img src={businessImg} alt="" />
                                <span>{withdrawAmount} {accessPool ? "GSK" : "GS"}</span>
                            </div>
                            <Button className="outline--highlight" onClick={() => onClickClaimWithdraw(index)}>CLAIM & WITHDRAW ALL</Button>
                        </div>
                    </div>
                        : <div className="approve-btn">
                            <Button className="outline--highlight active" onClick={() => onClickApprove(index)}>APPROVE</Button>
                        </div>
                }
            </div>
        </div>
    </div >
}

interface ICardDetails {
    cardDetails: IGsContract
    index: number,
    onClickStake: any,
    onClickWithdraw: any,
    onClickStakeMax: any,
    onClickWithdrawMax: any,
    onClickClaimReward: any,
    cardLoader: String,
    gstoUsd: number
    onChangeInputValue: (index: number, e: any) => void
    onClickClaimWithdraw: any,
    onClickApprove: any,
    accessPool: Boolean
}