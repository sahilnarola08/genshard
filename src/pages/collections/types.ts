
export interface INftCollection {
    _id?: String,
    nftId: Number,
    name: String,
    element: String,
    rarity: String,
    characterStatus: [ICharacterStatus],
    stake: Number,
    total: Number,
    likeCount: Number,
    img: String,
    createdDate: Number,
    left: Number,
    isUserStaking: Boolean,
    isClaimReward: Boolean,
    isApproved: Boolean,
    cardValue: String,
    cardDuration: String,
    cardRewards: String,
    userClaimed: String,
    userReward: String,
    userStaked: String,
    userTotalStaked: String,
    remainingTimeUser: String
}

interface ICharacterStatus {
    name: String,
    min: Number,
    max: Number,
    progress: Number,
    _id?: String
}