import { ChainId, Token } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '..'
import { useActiveWeb3React } from '../../hooks/web3'
import { addSerializedToken } from './actions'
import { SerializedToken } from './types'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(
    ({ user: { tokens } }) => tokens
  )

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(
      deserializeToken
    )
  }, [serializedTokensMap, chainId])
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  )

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}
