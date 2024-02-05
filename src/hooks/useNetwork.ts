import { useDispatch } from 'react-redux'
import { NetworkSymbol } from '../connectors'
import { changeNetwork } from '../state/application/actions'
import { useActiveWeb3React } from './web3'

export default function useNetwork() {

  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch()

  const { ethereum } = window as any

  const NetworkSwitch = (networkSymbol: NetworkSymbol) => {
    if (!account) {
      dispatch(changeNetwork({
        network: networkSymbol,
        chainId: account ? chainId : null
      }))
    }

    if (networkSymbol == NetworkSymbol.ETH && (!account || chainId !== process.env.REACT_APP_CHAIN_ID)) {
      // Reference for default switching to ETH Chain
      // https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: '0x1'
          // chainName: 'Ethereum Mainnet',
          // nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          // rpcUrls: [process.env.REACT_APP_NETWORK_URL!],
          // blockExplorerUrls: ['https://etherscan.io/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.BSC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x38',
          chainName: 'Binance Smart Chain',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_BSC_URL!],
          blockExplorerUrls: ['https://bscscan.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.MATIC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MATIC)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x89',
          chainName: 'Matic Mainnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_MATIC_URL!],
          blockExplorerUrls: ['https://polygonscan.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.IOTEX && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1251',
          chainName: 'IoTeX Network Mainnet',
          nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_IOTEX_URL!],
          blockExplorerUrls: ['https://iotexscan.io']
        }]
      })
    }


    if (networkSymbol == NetworkSymbol.HARMONY && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x63564C40',
          chainName: 'Harmony Mainnet Shard 0',
          nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_HARMONY_URL!],
          blockExplorerUrls: ['https://explorer.harmony.one']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.AVALANCHE && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xA86A',
          chainName: 'Avalanche C-Chain',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_AVALANCHE_URL!],
          blockExplorerUrls: ['https://snowtrace.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.GOERLI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_GOERLI)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x5',
          chainName: 'Goerli test network',
          nativeCurrency: { name: 'GETH', symbol: 'GETH', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_GOERLI_URL!],
          blockExplorerUrls: ['https://goerli.etherscan.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.MUMBAI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MUMBAI)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13881',
          chainName: 'Matic(Polygon) Testnet Mumbai',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_MUMBAI_URL!],
          blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.IOTEX_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1252',
          chainName: 'IoTeX Network Testnet',
          nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_IOTEX_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.iotexscan.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.HARMONY_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x6357D2E0',
          chainName: 'Harmony Testnet Shard 0',
          nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_HARMONY_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://explorer.pops.one']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.AVALANCHE_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xA869',
          chainName: 'Avalanche Fuji Testnet',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_AVALANCHE_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.snowtrace.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.BSC_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x61',
          chainName: 'Binance Smart Chain Testnet',
          nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_BSC_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.bscscan.com']
        }]
      })
    }
  }

  return { NetworkSwitch }
}