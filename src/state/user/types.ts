export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  matchesDarkMode: boolean // whether the dark mode media query matches

  userExpertMode: boolean

  userSingleHopOnly: boolean // only allow swaps on direct pairs

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  access_token: string
  userId: string
  storedAddress: string
  nftUserStats: {
    totalNfts: number
    totalLikedNfts: number
    totalAllNfts: number
  }
  userCart: UserCart,
  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  URLWarningVisible: boolean
}


export interface UserCart {
  [walletAddress: string]: {
    [chainId: number]: UserCartItem[]
  }
}

export interface UserCartItem {
  id: string,
  tokenAddress: string,
  tokenId: string,
  listingItemId: number,
  price: number,
  name: string,
  fromAddress: string,
  nftAsset: string,
  quantity: number
}