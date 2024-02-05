export interface IGsContract {
    stakeBalance: Number,
    apr: String,
    tvl: String,
    endTime: String,
    claimAmount: Number,
    withdrawAmount: Number,
    progress: Number,
    isPast: Boolean,
    isClaimed: Boolean,
    stakeInput: String,
    withdrawInput: String,
    isMaxStake: Boolean,
    isMaxWithDraw: Boolean,
    contractAddress: String,
    isApproved: Boolean,
    stakeTokenContract: String
}


export interface IStakingProps {
    accessPool: Boolean
}