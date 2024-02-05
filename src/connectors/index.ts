import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { NetworkConnector } from './NetworkConnector'

export enum NetworkSymbol {
  BSC = 'BSC',
  ETH = 'ETH',
  MATIC = 'MATIC',
  IOTEX = 'IOTEX',
  HARMONY = 'HARMONY',
  AVALANCHE = 'AVALANCHE',
  GOERLI = 'GOERLI',
  MUMBAI = 'MUMBAI',
  IOTEX_NETWORK_TESTNET = 'T-IoTeX',
  HARMONY_NETWORK_TESTNET = 'T-HRMNY',
  AVALANCHE_NETWORK_TESTNET = 'T-AVALANCHE',
  BSC_NETWORK_TESTNET = 'T-BSC'
}

///networks
const NETWORK_URL = process.env.REACT_APP_NETWORK_URL as string;
const BSC_NETWORK = process.env.REACT_APP_BSC_URL as string;
const MATIC_NETWORK = process.env.REACT_APP_MATIC_URL as string;
const IOTEX_NETWORK = process.env.REACT_APP_IOTEX_URL as string;
const HARMONY_NETWORK = process.env.REACT_APP_HARMONY_URL as string;
const AVALANCHE_NETWORK = process.env.REACT_APP_AVALANCHE_URL as string;
const GOERLI_NETWORK = process.env.REACT_APP_GOERLI_URL as string;
const MUMBAI_NETWORK = process.env.REACT_APP_MUMBAI_URL as string;
const IOTEX_NETWORK_TESTNET_NETWORK = process.env.REACT_APP_IOTEX_NETWORK_TESTNET_URL as string;
const HARMONY_NETWORK_TESTNET_NETWORK = process.env.REACT_APP_HARMONY_NETWORK_TESTNET_URL as string;
const AVALANCHE_NETWORK_TESTNET_NETWORK = process.env.REACT_APP_AVALANCHE_NETWORK_TESTNET_URL as string;
const BSC_NETWORK_TESTNET_NETWORK = process.env.REACT_APP_BSC_NETWORK_TESTNET_URL as string;

//chain id
const ETH_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID as string)
const BSC_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_BSC as string)
const MATIC_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_MATIC as string)
const IOTEX_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_IOTEX as string)
const HARMONY_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_HARMONY as string)
const AVALANCHE_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_AVALANCHE as string)
const GOERLI_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_GOERLI as string)
const MUMBAI_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_MUMBAI as string)
const IOTEX_NETWORK_TESTNET_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_IOTEX_NETWORK_TESTNET as string)
const HARMONY_NETWORK_TESTNET_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_HARMONY_NETWORK_TESTNET as string)
const AVALANCHE_NETWORK_TESTNET_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_AVALANCHE_NETWORK_TESTNET as string)
const BSC_NETWORK_TESTNET_CHAIN = parseInt(process.env.REACT_APP_CHAIN_ID_BSC_NETWORK_TESTNET as string)

//GENNFTSTore
export const GEN_NFT_STORE_ADDRESS = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS!
export const GEN_NFT_STORE_ADDRESS_BSC = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_BSC!
export const GEN_NFT_STORE_ADDRESS_MATIC = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_MATIC!
export const GEN_NFT_STORE_ADDRESS_IOTEX = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_IOTEX!
export const GEN_NFT_STORE_ADDRESS_HARMONY = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_HARMONY!
export const GEN_NFT_STORE_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_AVALANCHE!
export const GEN_NFT_STORE_ADDRESS_GOERLI = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_GOERLI!
export const GEN_NFT_STORE_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_MUMBAI!
export const GEN_NFT_STORE_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_NFT_STORE_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_NFT_STORE_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_NFT_STORE_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_STORE_ADDRESS_BSC_NETWORK_TESTNET!

//genNFTStore 
export const GEN_NFT_STORE_ADDRESS_DATA = {
  [ETH_CHAIN]: GEN_NFT_STORE_ADDRESS,
  [BSC_CHAIN]: GEN_NFT_STORE_ADDRESS_BSC,
  [MATIC_CHAIN]: GEN_NFT_STORE_ADDRESS_MATIC,
  [IOTEX_CHAIN]: GEN_NFT_STORE_ADDRESS_IOTEX,
  [HARMONY_CHAIN]: GEN_NFT_STORE_ADDRESS_HARMONY,
  [AVALANCHE_CHAIN]: GEN_NFT_STORE_ADDRESS_AVALANCHE,
  [GOERLI_CHAIN]: GEN_NFT_STORE_ADDRESS_GOERLI,
  [MUMBAI_CHAIN]: GEN_NFT_STORE_ADDRESS_MUMBAI,
  [IOTEX_NETWORK_TESTNET_CHAIN]: GEN_NFT_STORE_ADDRESS_IOTEX_NETWORK_TESTNET,
  [HARMONY_NETWORK_TESTNET_CHAIN]: GEN_NFT_STORE_ADDRESS_HARMONY_NETWORK_TESTNET,
  [AVALANCHE_NETWORK_TESTNET_CHAIN]: GEN_NFT_STORE_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [BSC_NETWORK_TESTNET_CHAIN]: GEN_NFT_STORE_ADDRESS_BSC_NETWORK_TESTNET
}

//get network url by symbol
// const NetworkURL = (networkSymbol: string) => {
//
//   switch (networkSymbol) {
//     case (NetworkSymbol.BSC): return BSC_NETWORK;
//     case (NetworkSymbol.ETH): return NETWORK_URL;
//     case (NetworkSymbol.MATIC): return MATIC_NETWORK;
//
//     default: return NETWORK_URL;
//   }
// }

export const NetworkURL = {
  [NetworkSymbol.BSC]: BSC_NETWORK,
  [NetworkSymbol.ETH]: NETWORK_URL,
  [NetworkSymbol.MATIC]: MATIC_NETWORK,
  [NetworkSymbol.IOTEX]: IOTEX_NETWORK,
  [NetworkSymbol.HARMONY]: HARMONY_NETWORK,
  [NetworkSymbol.AVALANCHE]: AVALANCHE_NETWORK,
  [NetworkSymbol.GOERLI]: GOERLI_NETWORK,
  [NetworkSymbol.MUMBAI]: MUMBAI_NETWORK,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: IOTEX_NETWORK_TESTNET_NETWORK,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: HARMONY_NETWORK_TESTNET_NETWORK,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: AVALANCHE_NETWORK_TESTNET_NETWORK,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: BSC_NETWORK_TESTNET_NETWORK
}

//network symbol object
export const NetworkSymbolAndId = {
  [BSC_CHAIN]: NetworkSymbol.BSC,
  [ETH_CHAIN]: NetworkSymbol.ETH,
  [MATIC_CHAIN]: NetworkSymbol.MATIC,
  [IOTEX_CHAIN]: NetworkSymbol.IOTEX,
  [HARMONY_CHAIN]: NetworkSymbol.HARMONY,
  [AVALANCHE_CHAIN]: NetworkSymbol.AVALANCHE,
  [GOERLI_CHAIN]: NetworkSymbol.GOERLI,
  [MUMBAI_CHAIN]: NetworkSymbol.MUMBAI,
  [IOTEX_NETWORK_TESTNET_CHAIN]: NetworkSymbol.IOTEX_NETWORK_TESTNET,
  [HARMONY_NETWORK_TESTNET_CHAIN]: NetworkSymbol.HARMONY_NETWORK_TESTNET,
  [AVALANCHE_NETWORK_TESTNET_CHAIN]: NetworkSymbol.AVALANCHE_NETWORK_TESTNET,
  [BSC_NETWORK_TESTNET_CHAIN]: NetworkSymbol.BSC_NETWORK_TESTNET,
}

export const NetworkChainId = {
  [NetworkSymbol.BSC]: BSC_CHAIN,
  [NetworkSymbol.ETH]: ETH_CHAIN,
  [NetworkSymbol.MATIC]: MATIC_CHAIN,
  [NetworkSymbol.IOTEX]: IOTEX_CHAIN,
  [NetworkSymbol.HARMONY]: HARMONY_CHAIN,
  [NetworkSymbol.AVALANCHE]: AVALANCHE_CHAIN,
  [NetworkSymbol.GOERLI]: GOERLI_CHAIN,
  [NetworkSymbol.MUMBAI]: MUMBAI_CHAIN,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: IOTEX_NETWORK_TESTNET_CHAIN,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: HARMONY_NETWORK_TESTNET_CHAIN,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: AVALANCHE_NETWORK_TESTNET_CHAIN,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: BSC_NETWORK_TESTNET_CHAIN,
}

// export const GetNetworkChainId = (networkSymbol: NetworkSymbol) => {
//   return NetworkChainId[networkSymbol]
// }
// networkSymbol == 'BSC' ? 56 : 1



export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? '1'
)

export const network = (networkSymbol: NetworkSymbol) => new NetworkConnector({
  urls: { [NetworkChainId[networkSymbol]]: NetworkURL[networkSymbol] },
})

export const injected = new InjectedConnector({
  // Before adding new networks add the chainID here - Compulsory Notes
  supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 4689, 1666600000, 43114, 80001, 4690, 1666700000, 43113, 97],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(networkSymbol: NetworkSymbol): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network(networkSymbol).provider as any))
}
