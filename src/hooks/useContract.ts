import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@uniswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useCallback, useMemo } from 'react'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { useActiveWeb3React } from './web3'
import { getContract } from '../utils'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { abi as GEN_FACTORY_ABI } from '../contracts/GenFactory.json'
import { abi as GEN_SHARDS_ABI } from '../contracts/GenShards.json'
import GEN_TICKET_ABI from '../contracts/GenTickets.json'
import GEN_TICKET_ABI_v1 from '../contracts/GenTickets_v1.json'
import { Project } from '../state/ticket/types'

import {
  GEN_TICKET_ADDRESS,
  GS_ADDRESS,
  FACTORY_ADDRESS
} from '../constants'
import Web3 from 'web3'
import { useSelector } from 'react-redux'
import { AppState } from '../state'
import { NetworkURL } from "../connectors";

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
      case 56:
      case 137:
      case 1666600000: 
      case 1666700000:    
      case 43114: 
      case 43113:  
      case 4689: 
      case 4690: 
      case 80001: 
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  )
}
export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET
      ? '0x65770b5283117639760beA3F867b69b3697a91dd'
      : undefined,
    UNISOCKS_ABI,
    false
  )
}

export function useGenShard(): Contract | null {
  const network = useSelector((state: AppState) => state.application.network)
  return useContract(GS_ADDRESS[network], GEN_SHARDS_ABI)
}

export function useGenFactory(): Contract | null {
  const network = useSelector((state: AppState) => state.application.network)
  return useContract(FACTORY_ADDRESS[network], GEN_FACTORY_ABI);
}


export function useGenTicket(): Contract | null {
  return useContract(GEN_TICKET_ADDRESS, GEN_TICKET_ABI)
}

export function useContractTicket(contract_address: string, currentProject: Project | undefined): Contract | null {
  return useContract(contract_address, currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
}

export function useWeb3Contract(ABI: any, stackingType?: string) {
  const network = useSelector((state: AppState) => state.application.network)
  return (address: string) => {
    let web3 = new Web3(NetworkURL[(stackingType === "staking") ? "T-BSC" : network])
    const contract = new web3.eth.Contract(ABI, address)
    return contract
  }
}

export function useWeb3ToWei() {
  const network = useSelector((state: AppState) => state.application.network)
  return (value: any) => {
    let web3 = new Web3(NetworkURL[network])
    return String(web3.utils.toWei(value.toString(), 'ether'))
  }
}

export function useWeb3FromWei() {
  const network = useSelector((state: AppState) => state.application.network)
  return (value: any) => {
    let web3 = new Web3(NetworkURL[network])
    return String(web3.utils.fromWei(value.toString(), 'ether'))
  }
}

