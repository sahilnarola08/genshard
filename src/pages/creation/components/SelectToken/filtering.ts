import { useMemo } from 'react'
import { Token } from '@uniswap/sdk'
import { isAddress } from '../../../../utils'
import web3 from 'web3'
import { TokenInfo } from '@uniswap/token-lists'

export function filterTokens(tokens: any, search: string): any {
  if (search.length === 0) return tokens





  const filteringByAddress = search.startsWith('0x') && web3.utils.isAddress(search)
  if (filteringByAddress){
    search = web3.utils.toChecksumAddress(search)
  }
  //@ts-ignore
  return  tokens.filter((token) => {

    const {symbol, name, address} = token;
    if(filteringByAddress){
      return address == search
    }

    const regex = new RegExp(search, 'i')
    //@ts-ignore
    return regex.test(symbol) || regex.test(name)
  })
}

export function useSortedTokensByQuery(
    tokens: Token[] | undefined,
    searchQuery: string
): Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: Token[] = []
    const symbolSubtrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      } else if (
          token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())
      ) {
        return symbolSubtrings.push(token)
      } else {
        return rest.push(token)
      }
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
