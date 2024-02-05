import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@uniswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getNetworkLibrary, NETWORK_CHAIN_ID, NetworkSymbol} from '../connectors'
import { AppDispatch, AppState } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './web3'

export function useFetchListCallback(): (
  listUrl: string,
  sendDispatch?: boolean
) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const network = useSelector((state: AppState) => state.application.network)

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.MAINNET) {
        if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
          const networkLibrary = getNetworkLibrary(network as NetworkSymbol)
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary)
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch &&
        dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch &&
            dispatch(
              fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId })
            )
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}
