import { Currency, ETHER, Token } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import React, { useMemo } from 'react'
import useHttpLocations from '../../../../../hooks/useHttpLocations'

import EthereumLogo from '../../../../../images/ethereum-logo.png'
import { WrappedTokenInfo } from '../../../../../state/lists/types'
import Logo from '../Logo'

// export const getTokenLogoURL = (address: string) =>
//   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

export default function CurrencyLogo({
  currency,
  size,
  style,
}: {
  currency?: any
  size?: string
  style?: React.CSSProperties
}) {


  // const uriLocations = useHttpLocations(
  //   currency instanceof WrappedTokenInfo ? currency?.logoURI : undefined
  // )



  // const srcs: string[] = useMemo(() => {
  //   // if (currency === ETHER) return []

  //   if (currency instanceof Token) {
  //     if (currency instanceof WrappedTokenInfo) {
  //       return [...uriLocations, getTokenLogoURL(currency.address)]
  //     }
  //     return [getTokenLogoURL(currency.address)]
  //   }
  //   return []
  // }, [currency, uriLocations])

  if (currency === ETHER) {
    // return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
    return <img src={EthereumLogo} width={size} style={style} />
  }


  return (
    <Logo
      src={currency?.logoURI}
      alt={`${currency?.symbol ?? 'token'} logo`}
      style={{ ...style, width: size, height: size }}
    />
  )
}
