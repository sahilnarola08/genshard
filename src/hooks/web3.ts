import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@uniswap/sdk'
import { NetworkContextName } from '../constants'
import { isMobile } from 'react-device-detect'
import Web3 from 'web3'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: ChainId
} {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        console.log("ROBERT AUTHORIZED");
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window.ethereum) {
          console.log("ROBERT AUTHORIZED MOBILE");
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        console.log("ROBERT CHAIN CHANGED");
        activate(injected, undefined, true).catch((error: any) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          console.log("ROBERT ACCOUNTS CHANGED");
          activate(injected, undefined, true).catch((error: any) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}

// export function useWeb3Contract(ABI: any) {
//   return useCallback(
//     (address: string) => {
//       const web3 = new Web3(process.env.REACT_APP_NETWORK_URL!)
//       const contract = new web3.eth.Contract(ABI, address)
//       return contract
//     },
//     [ABI]
//   )
// }
