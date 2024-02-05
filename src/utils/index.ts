import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber, Contract } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { AddressZero } from '@ethersproject/constants'
import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'
import { TokenAddressMap } from '../state/lists/types'
import { GEN_FACTORY_ADDRESS } from '../constants'
import { abi as GEN_FACTORY_ABI } from '../contracts/GenFactory.json'
import { abi as GEN_TICKET_ABI } from '../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../contracts/GenTickets_v1.json'
import { abi as GEN_TELEGRAM_ABI } from '../contracts/GenTelegram.json'
import { abi as GEN_STAKE_ABI } from '../contracts/GenStakes.json'
import { abi as GEN_KARMA_ABI } from '../contracts/GenKarma.json'
import { abi as GEN_GSK_SWAP_ABI } from '../contracts/GenGskSwap.json'
import { abi as GEN_GSK_ABI } from '../contracts/GenGsk.json'
import { abi as GEN_COLLECTION_ABI } from '../contracts/GenCollection.json'
import { abi as GEN_TOKEN_BSC_ABI } from '../contracts/GenTokenBsc.json'
import { abi as GEN_PAD_STAKING_ABI } from '../contracts/GenpadStaking.json'
import { abi as GET_COHORT_STAKING_ABI } from '../contracts/GenCohertStaking.json'
import { abi as ERC20_ABI } from '../contracts/IERC20.json'
import GEN_TOKEN_ABI from "../constants/abis/erc20.json"
import { useSelector } from 'react-redux'
import { AppState } from '../state'
import { Project } from '../state/ticket/types'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
    }${chainId === 56 ? 'bscscan.com' : chainId === 137 ? 'polygonscan.com' : chainId === 4689 ? 'iotexscan.io' : chainId === 1666600000 ? 'explorer.harmony.one' : chainId === 43114 ? 'snowtrace.io' : chainId === 4 ? 'etherscan.io' : chainId === 80001 ? 'mumbai.polygonscan.com' : chainId === 4690 ? 'testnet.iotexscan.io' : chainId === 1666700000 ? 'explorer.pops.one' : chainId === 43113 ? 'testnet.snowtrace.io' :  chainId === 97 ? 'testnet.bscscan.com' :  chainId === 5 ? 'etherscan.io' : 'etherscan.io'}`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  )
}

export function getGenFactoryContract(
  _: number,
  library: Web3Provider,
  account?: string
): Contract {
  return getContract(GEN_FACTORY_ADDRESS, GEN_FACTORY_ABI, library, account)
}

export function getGenTicketContract(projectType: string | undefined, address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, projectType === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1, library, account)
}

export function getGenTelegramContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_TELEGRAM_ABI, library, account)
}

export function getERC20Contract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, ERC20_ABI, library, account)
}

export function getGenStakeContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_STAKE_ABI, library, account)
}

export function getGenKarmaContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_KARMA_ABI, library, account)
}

export function getGenGskSwapContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_GSK_SWAP_ABI, library, account)
}

export function getGenGSKContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_GSK_ABI, library, account)
}

export function getGenCollectionContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_COLLECTION_ABI, library, account)
}

export function getGenPadStakingContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GEN_PAD_STAKING_ABI, library, account)
}

export function getGenCohortStakingContract(address: string, _: number, library: Web3Provider, account?: string): Contract {
  return getContract(address, GET_COHORT_STAKING_ABI, library, account)
}

export function getGenTokenContract(address: string, chainId: number, library: Web3Provider, account?: string): Contract {
  if (chainId === 56 || chainId === 4) {
    return getContract(address, GEN_TOKEN_BSC_ABI, library, account)
  }
  return getContract(address, GEN_TOKEN_ABI, library, account)
}


export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(
  defaultTokens: TokenAddressMap,
  currency?: Currency
): boolean {
  if (currency === ETHER) return true
  return Boolean(
    currency instanceof Token &&
    defaultTokens[currency.chainId]?.[currency.address]
  )
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000))
}

export function asyncSleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function daysToSeconds(days: number) {
  return days * 24 * 60 * 60
}

export function valueToTokenDecimal(value: string, decimal: number) {
  return parseInt(value) / 10**decimal;
}

export function getScrollPercent() {
	var h = document.documentElement,
		b = document.body,
		st = "scrollTop",
		sh = "scrollHeight";
	return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
}

export function getScrollPercentOfElement(e : any) {
  // e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
	var h = e.target,
		b = document.body,
		st = "scrollTop",
		sh = "scrollHeight";
	return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
}

export function searchToObject(search: string) {
  return search.substring(1).split("&").reduce(function(result, value) {
    var parts = value.split('=');
    if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return result;
  }, {})
}