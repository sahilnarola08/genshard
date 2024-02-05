import { ChainId, Currency, CurrencyAmount, ETHER, Token } from '@uniswap/sdk'
import { Tags, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '..'
import { UNSUPPORTED_LIST_URLS } from '../../constants/list'
import sortByListPriority from '../../utils/listSort'
import { ListState, TokenAddressMap, WrappedTokenInfo } from './types'
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'
import { useETHBalances, useTokenBalances } from '../wallet/hooks'

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.MAINNET]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.KOVAN]: {},
}

function combineMaps(
  map1: TokenAddressMap,
  map2: TokenAddressMap
): TokenAddressMap {
  return {
    [ChainId.MAINNET]: { ...map1[1], ...map2[1] },
    [ChainId.ROPSTEN]: { ...map1[3], ...map2[3] },
    [ChainId.RINKEBY]: { ...map1[4], ...map2[4] },
    [ChainId.GÖRLI]: { ...map1[5], ...map2[5] },
    [ChainId.KOVAN]: { ...map1[42], ...map2[42] },
  }
}

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

// Get all list state on state.list.byUrl
export function useAllLists(): {
  readonly [url: string]: ListState
} {
  return useSelector((state: AppState) => state.lists.byUrl)
}

// get active list url on state
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeListUrls']>(
    (state) => state.lists.activeListUrls
  )?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url))
}

// get the inactive list url
export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter(
    (url) =>
      !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)
  )
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(): TokenAddressMap {
  return listToTokenMap(DEFAULT_TOKEN_LIST)
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST)
  return combineMaps(activeTokens, defaultTokenMap)
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined'
    ? new WeakMap<TokenList, TokenAddressMap>()
    : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined)
        throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list: list,
          },
        },
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(
  urls: string[] | undefined
): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(
    () => currencies?.some((currency) => currency === ETHER) ?? false,
    [currencies]
  )
  const ethBalance = useETHBalances(containsETH ? [account] : [])
  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}
