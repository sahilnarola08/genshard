import { createReducer } from '@reduxjs/toolkit'
import {
  INITIAL_ALLOWED_SLIPPAGE,
  DEFAULT_DEADLINE_FROM_NOW,
} from '../../constants'
import { updateVersion } from '../global/actions'
import {
  addItemsToCart,
  addLocalCartItems,
  addSerializedToken,
  clearUserCart,
  removeItemsFromCart,
  removeSerializedToken,
  saveUserStats,
  saveUserToken,
  toggleURLWarning,
  updateMatchesDarkMode,
  updateUserDarkMode,
} from './actions'
import { UserState } from './types'
import moment from "moment"

const currentTimestamp = () => new Date().getTime()

const initialUserCart = {
  
}

export const initialState: UserState = {
  userDarkMode: true,
  matchesDarkMode: false,
  userExpertMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  access_token: "",
  userId: "",
  storedAddress: "",
  nftUserStats: {
    totalAllNfts: 0,
    totalLikedNfts: 0,
    totalNfts: 0
  },
  userCart: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
}

export default createReducer(initialState, (builder) =>
  builder
    // todo: do we need this one
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    //   .addCase(updateUserExpertMode, (state, action) => {
    //     state.userExpertMode = action.payload.userExpertMode
    //     state.timestamp = currentTimestamp()
    //   })
    //   .addCase(updateUserSlippageTolerance, (state, action) => {
    //     state.userSlippageTolerance = action.payload.userSlippageTolerance
    //     state.timestamp = currentTimestamp()
    //   })
    //   .addCase(updateUserDeadline, (state, action) => {
    //     state.userDeadline = action.payload.userDeadline
    //     state.timestamp = currentTimestamp()
    //   })
    //   .addCase(updateUserSingleHopOnly, (state, action) => {
    //     state.userSingleHopOnly = action.payload.userSingleHopOnly
    //   })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][
        serializedToken.address
      ] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(saveUserToken, (state, { payload: { access_token, userId, address } }) => {
      state.access_token = access_token
      state.userId = userId
      state.storedAddress = address
      localStorage.setItem("authorization", JSON.stringify({ access_token, userId, address, time: moment().unix() + 86400 }))
      state.timestamp = currentTimestamp()
    })
    .addCase(saveUserStats, (state, { payload: { totalAllNfts, totalLikedNfts, totalNfts } }) => {
      state.nftUserStats = { totalAllNfts, totalLikedNfts, totalNfts }
      state.timestamp = currentTimestamp()
    })
    .addCase(addItemsToCart, (state, { payload: { item, chainId, walletAddress } }) => {
      const prevCartData = state.userCart[walletAddress] && state.userCart[walletAddress][chainId] || []
      const newItems = [...prevCartData]
      newItems.push(item)
      state.userCart = {
        ...state.userCart,  
        [walletAddress]: {
          ...state.userCart[walletAddress],
          [chainId]: newItems
        }
      }
      localStorage.setItem("user_cart", JSON.stringify(state.userCart))
      state.timestamp = currentTimestamp()
    })
    .addCase(addLocalCartItems, (state, { payload: { localItems } }) => {
      state.userCart = localItems
      state.timestamp = currentTimestamp()
    })
    .addCase(removeItemsFromCart, (state, { payload: { id, walletAddress, chainId } }) => {
      const prevCartData = state.userCart[walletAddress] && state.userCart[walletAddress][chainId] || []
      const newItems = prevCartData.filter(item => item.id !== id)
      state.userCart = {
        ...state.userCart,  
        [walletAddress]: {
          ...state.userCart[walletAddress],
          [chainId]: newItems
        }
      }
      localStorage.setItem("user_cart", JSON.stringify(state.userCart))
      state.timestamp = currentTimestamp()
    })
    .addCase(clearUserCart, (state, {payload: { walletAddress, chainId }}) => {
      const prevCartData = JSON.parse(JSON.stringify(state.userCart)) // deep copy
      delete prevCartData[walletAddress][chainId]
      state.userCart = prevCartData
      localStorage.setItem("user_cart", JSON.stringify(state.userCart))
      state.timestamp = currentTimestamp()
    })
    .addCase(
      removeSerializedToken,
      (state, { payload: { address, chainId } }) => {
        if (!state.tokens) {
          state.tokens = {}
        }
        state.tokens[chainId] = state.tokens[chainId] || {}
        delete state.tokens[chainId][address]
        state.timestamp = currentTimestamp()
      }
    )
    //   .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
    //     if (
    //       serializedPair.token0.chainId === serializedPair.token1.chainId &&
    //       serializedPair.token0.address !== serializedPair.token1.address
    //     ) {
    //       const chainId = serializedPair.token0.chainId
    //       state.pairs[chainId] = state.pairs[chainId] || {}
    //       state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
    //     }
    //     state.timestamp = currentTimestamp()
    //   })
    //   .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
    //     if (state.pairs[chainId]) {
    //       // just delete both keys if either exists
    //       delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
    //       delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
    //     }
    //     state.timestamp = currentTimestamp()
    //   })
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible
    })
)
