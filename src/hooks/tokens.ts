import { useDispatch } from 'react-redux';
import { Currency, currencyEquals, Token } from '@uniswap/sdk'
import { arrayify, parseBytes32String } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { filterTokens } from '../pages/creation/components/SelectToken/filtering'
import {
  useCombinedActiveList,
  useCombinedInactiveList,
  useDefaultTokenList,
} from '../state/lists/hooks'
import { TokenAddressMap } from '../state/lists/types'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { useActiveWeb3React } from './web3'
import { ETHER } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { NetworkChainId } from "../connectors";
import { getNftVotesByTokens } from '../pages/marketplace/API/ApiCall';
import { saveTokenLikes } from '../state/tokens/actions';

export function useDefaultTokens(): { [address: string]: Token } {
  const defaultList = useDefaultTokenList()
  return useTokensFromMap(defaultList, false)
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens, true)
}

export function useAllInactiveTokens(): { [address: string]: TokenInfo } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList()
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false)

  // filter out any token that are on active list
  const activeTokensAddresses = Object.keys(useAllTokens())
  const filteredInactive = activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        if (!activeTokensAddresses.includes(address)) {
          newMap[address] = inactiveTokens[address]
        }
        return newMap
      },
      {}
    )
    : inactiveTokens

  return filteredInactive as any
}

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {};
    if (chainId !== NetworkChainId['ETH']) return {};
    // if(chainId === 56) return {};


    const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce<{
      [address: string]: Token
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(
  currency: Currency | undefined | null
): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find((token) => currencyEquals(currency, token))
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
      ? parseBytes32String(bytes32)
      : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(
    address ? address : undefined,
    false
  )
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    'decimals',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(
          symbol.result?.[0],
          symbolBytes32.result?.[0],
          'UNKNOWN'
        ),
        parseStringOrBytes32(
          tokenName.result?.[0],
          tokenNameBytes32.result?.[0],
          'Unknown Token'
        )
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

// used to detect extra search results
export function useFoundOnInactiveList(
  searchQuery: string
): TokenInfo[] | undefined {
  const { chainId } = useActiveWeb3React()
  const inactiveTokens = useAllInactiveTokens()

  return useMemo(() => {
    if (!chainId || searchQuery === '') {
      return undefined
    } else {
      const tokens = filterTokens(Object.values(inactiveTokens), searchQuery)
      return tokens
    }
  }, [chainId, inactiveTokens, searchQuery])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}

export function useTokenLikes() {
  const dispatch = useDispatch()

  const getTokenLikes = async (tokens: { tokenAddress: string, tokenId: string }[]) => {
    try {
      if (!tokens.length) return
      const tokensWithLikes = await getNftVotesByTokens(tokens)
      const likesMap = {} as { [tokensAddressWithTokenId: string]: number }[]
      tokensWithLikes.forEach(tokenWithLikes => {
        const { tokenAddress, tokenId, totalLikes } = tokenWithLikes
        likesMap[`${tokenAddress}_${tokenId}`] = totalLikes
      })
      dispatch(saveTokenLikes(likesMap))
    } catch (ex) {
      console.error(ex)
    }
  }

  return { getTokenLikes }
}