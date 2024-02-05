import genGroupedImg from "../../../../images/staking/gen-stake-grouped.svg"
import "./style.sass"

export default function StakeInfo({ progress, stakeBalance, apr, tvl, endTime, isPast, gstoUsd, accessPool }: IStakeInfo) {
    if (Number(progress) > 100) progress = 100
    return (
        <div className="staking-details">
            {accessPool ? null : <><div className="staking-progress-text">{progress + "%"} of the pool is filled</div>
                <div className="staking-progress-bar">
                    <div style={{ width: progress + "%" }} />
                </div> </>}
            <div className="staking-number">
                <p>Your active Staking is</p>
                <div className="bnb-usd">
                    <span>{stakeBalance} GS</span>
                    <span>~ {(Number(stakeBalance) * Number(gstoUsd)).toFixed(2)} USD</span>
                </div>
                <div className="apr-tyl">
                    <span>{apr}% APY</span>
                    <span>TVL: {Number(tvl).toFixed(2)}</span>
                </div>
            </div>
            <div className="ends-in-logo">
                <img src={genGroupedImg} alt="" />
                {
                    accessPool ? null : isPast ? <p className="completed">Staking is Completed</p>
                        : <>
                            <p>Staking will end in</p>
                            <span>{endTime}</span>
                        </>
                }
            </div>
        </div>
    )
}

interface IStakeInfo {
    progress: Number
    stakeBalance: Number
    apr: String
    tvl: String
    gstoUsd: number
    endTime: String
    isPast: Boolean,
    accessPool?: Boolean
}