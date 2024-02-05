import businessImg from "../../../../images/staking/business-fill.svg"
// import financeImg from "../../../../images/staking/finance-fill.svg"
import Button from '../../../../shared/components/buttons'
import { IGsContract } from "../../../../state/staking/types";
import StakeInfo from "../stake-info";
import "./style.sass"

export default function RetiredCard(props: ICardDetails) {

    const { cardDetails, gstoUsd, cardLoader, onClickClaimWithdraw, index } = props
    const { stakeBalance, apr, tvl, endTime, progress = 0, isPast, isClaimed, withdrawAmount, contractAddress } = cardDetails || {}

    return <div className="claim-retired-detail">
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
                gstoUsd={gstoUsd}
                stakeBalance={stakeBalance}
                endTime={endTime}
                isPast={isPast}
            />
            <div className="divider" />
            <div className="claim-actions">
                {
                    !isClaimed ? <div className="claim-withdraw-all">
                        <div className="img-amount">
                            <img src={businessImg} alt="" />
                            <span>{withdrawAmount} GS</span>
                        </div>
                        <Button className="outline--highlight active" onClick={() => onClickClaimWithdraw(index)}>{`CLAIM & WITHDRAW ALL`}</Button>
                    </div>
                        : <div className="claim-withdraw-all">
                            <div className="img-amount">
                                <img src={businessImg} alt="" />
                                <span>0 GS</span>
                            </div>
                            <Button className="outline--highlight disabled">RETIRED POOL</Button>
                        </div>
                }
            </div>
        </div>
    </div >
}

interface ICardDetails {
    cardDetails: IGsContract
    index: number,
    gstoUsd: any,
    cardLoader: any,
    onClickClaimWithdraw: (index: any) => void
}