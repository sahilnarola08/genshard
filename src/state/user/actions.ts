import { createAction } from '@reduxjs/toolkit'
import { SerializedPair, SerializedToken, UserCart } from './types'

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>(
  'user/updateMatchesDarkMode'
)
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  'user/updateUserDarkMode'
)

export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>(
  'user/updateUserExpertMode'
)

// export const updateUserSingleHopOnly = createAction<{
//   userSingleHopOnly: boolean
// }>('user/updateUserSingleHopOnly')

// export const updateUserSlippageTolerance = createAction<{
//   userSlippageTolerance: number
// }>('user/updateUserSlippageTolerance')
// export const updateUserDeadline = createAction<{ userDeadline: number }>(
//   'user/updateUserDeadline'
// )
export const addSerializedToken = createAction<{
  serializedToken: SerializedToken
}>('user/addSerializedToken')

export const removeSerializedToken = createAction<{
  chainId: number
  address: string
}>('user/removeSerializedToken')

export const saveUserToken = createAction<{
  access_token: string
  userId: string
  address: string
}>('user/saveUserToken')

export const saveUserStats = createAction<{
  totalAllNfts: number,
  totalLikedNfts: number,
  totalNfts: number
}>('user/saveUserStats')

export const addItemsToCart = createAction<{
  item: {
    id: string,
    tokenAddress: string,
    tokenId: string,
    listingItemId: number,
    price: number,
    name: string,
    fromAddress: string,
    nftAsset: string,
    quantity: number
  },
  chainId: number,
  walletAddress: string
}>('user/addItemsToCart')

export const removeItemsFromCart = createAction<{
  id: string,
  chainId: number,
  walletAddress: string,
}>('user/removeItemsFromCart')

export const clearUserCart = createAction<{walletAddress: string, chainId: number}>('user/clearUserCart')
export const addLocalCartItems = createAction<{ localItems: UserCart }>('user/addLocalCartItems')


// export const addSerializedPair = createAction<{
//   serializedPair: SerializedPair
// }>('user/addSerializedPair')

// export const removeSerializedPair = createAction<{
//   chainId: number
//   tokenAAddress: string
//   tokenBAddress: string
// }>('user/removeSerializedPair')

export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
