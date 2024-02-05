import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Web3Status from './connect-wallet/web3status'
import './style.sass'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../../hooks/web3'
import JSBI from 'jsbi'
import { NetworkSymbol } from "../../../connectors";
import { ERC20_ABI } from '../../../constants/abis/erc20'
import { Currency, ETHER, Token, TokenAmount } from '@uniswap/sdk'
import web3 from 'web3'
import { BSC_LIST } from '../../../constants/list/bsc_list'
import { DEFAULT_ETH_LIST } from '../../../constants/list/eth_default_list'
import { TokenInfo } from '@uniswap/token-lists'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../state'
import { changeNetwork, changeKYC } from '../../../state/application/actions'
// @ts-ignore
import snsWebSdk from '@sumsub/websdk';
import Modal from '../../../shared/components/modal'
import axios from 'axios'
import { KYC_STATUS } from '../../../state/application/reducer'
import HeaderLive from './header-live'
import HeaderContent from './header-content'
import { MATIC_LIST } from '../../../constants/list/default-tokenlist-matic'
import { GOERLI_LIST } from '../../../constants/list/gorli_list'
import { MUMBAI_LIST } from '../../../constants/list/mumbai_list'
import { HARMONY_LIST } from '../../../constants/list/harmony_list'
import { AVALANCHE_LIST } from '../../../constants/list/avalanche_list'
import { IOTEX_LIST } from '../../../constants/list/iotex_list'
import { IOTEX_TESTNET_LIST } from '../../../constants/list/iotex_testnet_list'
import { HARMONY_TESTNET_LIST } from '../../../constants/list/harmony_testnet_list'
import { AVALANCHE_TESTNET_LIST } from '../../../constants/list/avalanche_testnet_list'
import { BSC_TESTNET_LIST } from '../../../constants/list/bsc_testnet_list'
import useNetwork from '../../../hooks/useNetwork'

const KYC_BASE = process.env.REACT_APP_KYC_ENDPOINT!

export const NetwokButton: INetworkItem[] = [
  {
    tokenImg: '/images/bnb-icon.png',
    network: NetworkSymbol.BSC,
    active: false,
    chainId: 56
  },
  {
    tokenImg: '/images/matic_.png',
    network: NetworkSymbol.MATIC,
    active: false,
    chainId: 137
  },
  {
    tokenImg: '/images/ETH.svg',
    network: NetworkSymbol.ETH,
    active: true,
    chainId: 1
  },
  {
    tokenImg: '/images/harmony-one-logo-final.png',
    network: NetworkSymbol.HARMONY,
    active: true,
    chainId: 1666600000
  },
  {
    tokenImg: '/images/avalanche-avax-logo-final.png',
    network: NetworkSymbol.AVALANCHE,
    active: true,
    chainId: 43114
  },
  {
    tokenImg: '/images/ETH.svg',
    network: NetworkSymbol.GOERLI,
    active: true,
    chainId: 5
  },
  {
    tokenImg: '/images/BSC.svg',
    network: NetworkSymbol.BSC_NETWORK_TESTNET,
    active: false,
    chainId: 97
  }
  // {
  //   tokenImg: '/images/iotex-iotx-logo-final.png',
  //   network: NetworkSymbol.IOTEX,
  //   active: true,
  //   chainId: 4689
  // }
  // {
  //   tokenImg: '/images/ETH.svg',
  //   network: NetworkSymbol.GOERLI,
  //   active: true,
  //   chainId: 5
  // },
  // {
  //   tokenImg: '/images/matic_.png',
  //   network: NetworkSymbol.MUMBAI,
  //   active: true,
  //   chainId: 80001
  // },
  // {
  //   tokenImg: '/images/iotex-iotx-logo-final.png',
  //   network: NetworkSymbol.IOTEX_NETWORK_TESTNET,
  //   active: true,
  //   chainId: 4690
  // },
  // {
  //   tokenImg: '/images/harmony-one-logo-final.png',
  //   network: NetworkSymbol.HARMONY_NETWORK_TESTNET,
  //   active: true,
  //   chainId: 1666700000
  // },
  // {
  //   tokenImg: '/images/avalanche-avax-logo-final.png',
  //   network: NetworkSymbol.AVALANCHE_NETWORK_TESTNET,
  //   active: true,
  //   chainId: 43113
  // }
]

const SubChains: INetworkItem[] = [
  {
    tokenImg: '/images/bnb-icon.png',
    network: NetworkSymbol.BSC,
    active: true,
    chainId: 56
  },
  {
    tokenImg: '/images/matic_.png',
    network: NetworkSymbol.MATIC,
    active: false,
    chainId: 137
  }
]

export const VerifyCard = styled.div`
  width: 700px;
  border-radius: 50px;
  background-color: #f5f5f5;

  @media (max-width: 700px) {
    max-width: 100%;
  }
`

export function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { account, chainId, library } = useActiveWeb3React()
  const [balance, setBalance] = useState<any>()

  const network = useSelector((state: AppState) => state.application.network)
  const [buttons, setButtons] = useState<INetworkItem[]>(NetwokButton)

  const [defaultList, setDefaultList] = useState<TokenInfo[]>(DEFAULT_ETH_LIST)
  const [accessToken, setAccessToken] = useState<string>()
  const [isKYCWindowOpen, setKYCWindowOpen] = useState(false)
  const [kycStatus, setKYCStatus] = useState<KYC_STATUS>(KYC_STATUS.NOT_SET)

  const { NetworkSwitch } = useNetwork()

  const mockOptions = [
    {
      title: 'View My NFTs',
      onClick: () => history.push('/nfts'),
    },
  ]

  async function getNewAccessToken() {
    const res = await axios.get(KYC_BASE + `get-access-token?userAddress=${account!}`)
    return res.data.token
  }

  async function getKYCStatus() {
    try {
      const res = await axios.get(KYC_BASE + `get-applicant-status?userAddress=${account!}`)
      return res.data
    } catch (e) {
      console.log(e)
      return e
    }
  }

  function launchWebSdk(apiUrl: string, flowName: string, accessToken: string, applicantEmail?: string, applicantPhone?: string) {
    let snsWebSdkInstance = snsWebSdk.init(
      accessToken,
      // token update callback, must return Promise
      // Access token expired
      // get a new one and pass it to the callback to re-initiate the WebSDK
      () => getNewAccessToken()
      // async (newAccessTokenCallback: any) => {
      //   let newAccessToken = await getNewAccessToken()
      //   newAccessTokenCallback(newAccessToken)
      // }
    )
      .withConf({
        lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
        email: applicantEmail,
        phone: applicantPhone,
        uiConf: {
          customCssStr: ":root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}"
          // URL to css file in case you need change it dynamically from the code
          // the similar setting at Customizations tab will rewrite customCss
          // you may also use to pass string with plain styles `customCssStr:`
        },
        // onMessage: (type: any, payload: any) => {
        //   console.log('WebSDK onMessage', type, payload)
        // },
        // onError: (error: any) => {
        //   console.error('WebSDK onError', error)
        // },
      })
      .withOptions({ addViewportTag: false, adaptIframeHeight: true })
      // see below what kind of messages WebSDK generates
      .on('idCheck.stepCompleted', (payload: any) => {
        console.log('WebSDK stepCompleted', payload)
      })
      .on('idCheck.onError', (error: any) => {
        console.error('WebSDK onError', error)
      })
      .build();

    // let snsWebSdkInstance = snsWebSdk.Builder(apiUrl, flowName)
    //   .withAccessToken(
    //     accessToken,
    //     async (newAccessTokenCallback: any) => {
    //       let newAccessToken = await getNewAccessToken()
    //       newAccessTokenCallback(newAccessToken)
    //     }
    //   )
    //   .withConf({
    //     lang: 'en',
    //     email: applicantEmail,
    //     phone: applicantPhone,
    //     onMessage: (type: any, payload: any) => {
    //       console.log('WebSDK onMessage', type, payload)
    //     },
    //     uiConf: {
    //       customCssStr: ":root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}"
    //     },
    //     onError: (error: any) => {
    //       console.error('WebSDK onError', error)
    //     },
    //   })
    //   .build();
    snsWebSdkInstance.launch('#sumsub-websdk-container')
    setKYCWindowOpen(true)
  }

  useEffect(() => {
    dispatch(changeKYC(kycStatus))
  }, [kycStatus])

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getNewAccessToken()
        setAccessToken(token)
        const result = await getKYCStatus()
        if (result.code === 404) {
          await axios.post(KYC_BASE + `create-applicant`, {
            userAddress: account!
          })
        }
        //setKYCStatus(KYC_STATUS.VERIFIED);
        setKYCStatus(
          result.code === 404
            ? KYC_STATUS.NOT_VERIFIED
            : result.review.reviewStatus === 'init'
              ? KYC_STATUS.NOT_VERIFIED
              : result.review.reviewResult.reviewAnswer === 'GREEN'
                ? KYC_STATUS.VERIFIED
                : KYC_STATUS.NOT_VERIFIED)
      } catch (err) {
        //setKYCStatus(KYC_STATUS.VERIFIED);
        setKYCStatus(KYC_STATUS.NOT_VERIFIED);
      }
    }
    if (account) {
      getAccessToken()
    }
  }, [account])

  //switch list
  useEffect(() => {
    setButtons(NetwokButton)
    // if (network == 'ETH') {
    // } else {
    //   setButtons(SubChains)
    // }
    let ChainId = Number(chainId)
    console.log('network------------->', network);
    if (!account) {
      setDefaultList(network == 'BSC' ? BSC_LIST : network == 'MATIC' ? MATIC_LIST : network == 'IOTEX' ? IOTEX_LIST : network == 'HARMONY' ? HARMONY_LIST : network == 'AVALANCHE' ? AVALANCHE_LIST : network == 'GOERLI' ? GOERLI_LIST : network == 'MUMBAI' ? MUMBAI_LIST : network == 'T-IoTeX' ? IOTEX_TESTNET_LIST : network == 'T-HRMNY' ? HARMONY_TESTNET_LIST : network == 'T-AVALANCHE' ? AVALANCHE_TESTNET_LIST : network == 'T-BSC' ? BSC_TESTNET_LIST : DEFAULT_ETH_LIST)
    } else {
      setDefaultList(ChainId == 56 ? BSC_LIST : ChainId == 137 ? MATIC_LIST : ChainId == 4689 ? IOTEX_LIST : ChainId == 1666600000 ? HARMONY_LIST : ChainId == 43114 ? AVALANCHE_LIST : ChainId == 5 ? GOERLI_LIST : ChainId == 80001 ? MUMBAI_LIST : ChainId == 4690 ? IOTEX_TESTNET_LIST : ChainId == 1666700000 ? HARMONY_TESTNET_LIST : ChainId == 43113 ? AVALANCHE_TESTNET_LIST : ChainId == 97 ? BSC_TESTNET_LIST : DEFAULT_ETH_LIST)
    }
    if (account) loadBalance()
  }, [chainId, network, account])

  const { ethereum } = window as any


  //  eth get balance
  const loadBalance = async () => {
    if (library) {
      const getBalance = JSBI.BigInt((await library.getBalance(account!)).toString())
      const walletBalance = new TokenAmount(defaultList[0] as Token, getBalance)
      setBalance(walletBalance);
    }
  }

  // const NetworkSwitch = (networkSymbol: NetworkSymbol) => {
  //   if (!account) {
  //     dispatch(changeNetwork({
  //       network: networkSymbol,
  //       chainId: account ? chainId : null
  //     }))
  //   }

  //   if (networkSymbol == NetworkSymbol.ETH && (!account || chainId !== process.env.REACT_APP_CHAIN_ID)) {
  //     // Reference for default switching to ETH Chain
  //     // https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md
  //     ethereum.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{
  //         chainId: '0x1'
  //         // chainName: 'Ethereum Mainnet',
  //         // nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  //         // rpcUrls: [process.env.REACT_APP_NETWORK_URL!],
  //         // blockExplorerUrls: ['https://etherscan.io/']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.BSC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x38',
  //         chainName: 'Binance Smart Chain',
  //         nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_BSC_URL!],
  //         blockExplorerUrls: ['https://bscscan.com/']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.MATIC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MATIC)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x89',
  //         chainName: 'Matic Mainnet',
  //         nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_MATIC_URL!],
  //         blockExplorerUrls: ['https://polygonscan.com/']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.IOTEX && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x1251',
  //         chainName: 'IoTeX Network Mainnet',
  //         nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_IOTEX_URL!],
  //         blockExplorerUrls: ['https://iotexscan.io']
  //       }]
  //     })
  //   }


  //   if (networkSymbol == NetworkSymbol.HARMONY && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x63564C40',
  //         chainName: 'Harmony Mainnet Shard 0',
  //         nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_HARMONY_URL!],
  //         blockExplorerUrls: ['https://explorer.harmony.one']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.AVALANCHE && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0xA86A',
  //         chainName: 'Avalanche C-Chain',
  //         nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_AVALANCHE_URL!],
  //         blockExplorerUrls: ['https://snowtrace.io']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.GOERLI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_GOERLI)) {
  //     ethereum.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{
  //         chainId: '0x5'
  //         // chainName: 'Goerli test network',
  //         // nativeCurrency: { name: 'GETH', symbol: 'GETH', decimals: 18 },
  //         // rpcUrls: [process.env.REACT_APP_GOERLI_URL!],
  //         // blockExplorerUrls: ['https://goerli.etherscan.io/']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.MUMBAI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MUMBAI)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x13881',
  //         chainName: 'Matic(Polygon) Testnet Mumbai',
  //         nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_MUMBAI_URL!],
  //         blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.IOTEX_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX_NETWORK_TESTNET)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x1252',
  //         chainName: 'IoTeX Network Testnet',
  //         nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_IOTEX_NETWORK_TESTNET_URL!],
  //         blockExplorerUrls: ['https://testnet.iotexscan.io']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.HARMONY_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY_NETWORK_TESTNET)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x6357D2E0',
  //         chainName: 'Harmony Testnet Shard 0',
  //         nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_HARMONY_NETWORK_TESTNET_URL!],
  //         blockExplorerUrls: ['https://explorer.pops.one']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.AVALANCHE_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE_NETWORK_TESTNET)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0xA869',
  //         chainName: 'Avalanche Fuji Testnet',
  //         nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_AVALANCHE_NETWORK_TESTNET_URL!],
  //         blockExplorerUrls: ['https://testnet.snowtrace.io']
  //       }]
  //     })
  //   }

  //   if (networkSymbol == NetworkSymbol.BSC_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC_NETWORK_TESTNET)) {
  //     ethereum.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{
  //         chainId: '0x61',
  //         chainName: 'Binance Smart Chain Testnet',
  //         nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  //         rpcUrls: [process.env.REACT_APP_BSC_NETWORK_TESTNET_URL!],
  //         blockExplorerUrls: ['https://testnet.bscscan.com']
  //       }]
  //     })
  //   }

  // }

  return useMemo(
    () => (
      <div className="header">
        {/* <div className="header-staking-live">
          <HeaderLive />
        </div> */}
        <Modal kycChanges={true} isOpen={isKYCWindowOpen} onClose={() => setKYCWindowOpen(false)}>
          <VerifyCard id="sumsub-websdk-container" />
        </Modal>
        <HeaderContent
          NetworkSwitch={NetworkSwitch}
          launchWebSdk={launchWebSdk}
          accessToken={accessToken}
          account={account}
          balance={balance}
          network={network}
          buttons={buttons}
          kycStatus={kycStatus}
        />
      </div>
    ),
    [isKYCWindowOpen, kycStatus, account, network, balance]
  )
}

interface ILinkItem {
  to: string
  title: string
  altTitle?: string
}


interface INetworkItem {
  tokenImg: string,
  network: NetworkSymbol,
  active?: Boolean,
  chainId: Number,

}