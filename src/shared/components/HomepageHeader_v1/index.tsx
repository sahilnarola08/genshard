import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import HeaderLive from '../header/header-live'
import menuWhiteIcon from "../../../images/header-menu-white.png"
// @ts-ignore
import snsWebSdk from '@sumsub/websdk';
// import Web3Status from '../header/connect-wallet/web3status';
import { AccountElement, BalanceText } from '../header/header-content';
import Web3Status from '../header/connect-wallet/web3status';
import { useActiveWeb3React } from '../../../hooks/web3';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../state';
import JSBI from 'jsbi'
import { Currency, ETHER, Token, TokenAmount } from '@uniswap/sdk'
import { DEFAULT_ETH_LIST } from '../../../constants/list/eth_default_list'
import { BSC_LIST } from '../../../constants/list/bsc_list'
import { TokenInfo } from '@uniswap/token-lists'
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
import styled from 'styled-components';
import { NetworkSymbol } from '../../../connectors';
import arrowDownWhite from "../../../images/header-live/arrow-down-white.svg"
import { changeNetwork, changeKYC } from '../../../state/application/actions'
import { KYC_STATUS } from '../../../state/application/reducer'
import { User } from 'react-feather'
import axios from 'axios'
import './style.sass'
import { GENPAD_STAKING_ADDRESS, GENPAD_STAKING_TOKEN_ADDRESS } from '../../../constants';
import { useWeb3Contract, useWeb3FromWei } from '../../../hooks/useContract';
import { abi as GET_PAD_STAKE_ABI } from "../../../contracts/GenpadStaking.json"
import { aGSInfoByTotalaGs } from '../../../pages/homepage/components/Staking';
import Progressbar from '../../../pages/homepage/components/ProgressBar';
import useNetwork from '../../../hooks/useNetwork';
import { UserCart } from '../../../state/user/types';
import useCart from '../../../hooks/useCart';
import useUserAuth from '../../../hooks/useUserAuth';

interface INetworkItem {
  tokenImg: string,
  network: NetworkSymbol,
  active?: Boolean,
  chainId: Number,
}

const NetwokButton: INetworkItem[] = [
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

const mainRoutes = [
  {
    title: 'GenPad',
    path: '/genpad',
  },
  {
    title: 'GenDAO',
    path: '/gendao',
  },
  {
    title: 'GenVoice',
    path: '/community',
  }
]

const newMainRoutes = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Staking',
    path: '/genpad/staking',
    // path: '/',
  },
  // {
  //   title: 'Market',
  //   path: '/market',
  // },
  // {
  //   title: 'Dashboard',
  //   path: '/dashboard',
  // },
  // {
  //   title: 'Create',
  //   path: '/create',
  // },
  // {
  //   title: 'Community',
  //   path: '/community',
  // },
  {
    title: 'VoteDAO',
    path: '/votedao' //'/explore-nfts',
  },
  {
    title: 'Launchpad',
    path: '/launchpad',
  },
  {
    title: 'Acceleration',
    path: '/accelerate',
  },
  
  {
    title: 'Ecosystem',
    path: '/ecosystem',
  },
  
  {
    title: 'Profile',
    path: '/profile' //'/explore-nfts',
  },
]

const otherRoutesList = [
  {
    title: 'Dashboard',
    path: '/dashboard',
  },
  {
    title: 'GenVerse',
    path: '/genverse',
  },
  {
    title: 'Market',
    path: '/market',
  },
  {
    title: 'Create',
    path: '/create',
  },
  {
    title: 'Staking',
    path: '/staking',
  },
  {
    title: 'Access Pool',
    path: '/access-pool',
  },
  {
    title: 'Liquidity Mining',
    path: 'https://genesisshards.defiterm.io/',
  },
  {
    title: 'Calendar',
    path: '/calendar',
  },
  {
    title: 'Marketplace',
    innerMenu: [
      {
        title: 'Home',
        path: '/marketplace',
      },
      {
        title: 'All NFTs',
        path: '/marketplace/projects',
      },
      {
        title: 'Stats',
        path: '/top-collections',
      },
      {
        title: 'Mint NFT',
        path: '/assets/create',
      },
      {
        title: 'FAQ',
        path: '/marketplace',
      },
    ]
  },
  {
    title: 'Cohort Staking',
    path: '/cohort-staking',
  },
  // {
  //   title: 'Create Collection',
  //   path: '/collection/create',
  // },
  {
    title: 'Top Collections',
    path: '/top-collections',
  },


]

const anotherRoutes = [
  {
    title: 'Community NFTOs'
  },
  {
    title: 'DAO'
  },
  {
    title: 'Academy'
  },
  {
    title: 'Contests'
  },

]

const ActiveBorder = styled.div<
  { active: Boolean }>`
background-color: transparent;
width: 108px;
height: 37px;
//padding: 2px;
border-radius: 13px;
border: ${({ active }) => active ? '1px solid #117DCC' : 'none'};
display: flex;
justify-content: center;
align-items: center;
`
const NetworkButtonStyled = styled.button<
  {
    active?: Boolean,
    network: String
  }>`
    border-radius: 0.625rem;
    width: auto;
    height: 25px;
    border: none;
    padding: 0.3125rem 0.4125rem;
    background-color: ${({ network }) => network == 'BSC' ? '#F3BA2F' : 'white'};
    transition: all 0.3s ease-in-out;
    cursor: pointer;
   :hover,
   :active,
   :focus {
   
}
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  color: black;
  justify-content: flex-start;
  height: 100%;
`

const HomepageHeader_v1 = () => {
  const location = useLocation()
  const [buttons, setButtons] = useState<INetworkItem[]>(NetwokButton)
  const [openChain, setOpenChain] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [mobileMenu, setMobileMenu] = useState<boolean>(false)
  const [balance, setBalance] = useState<any>()
  const [defaultList, setDefaultList] = useState<TokenInfo[]>(DEFAULT_ETH_LIST)
  const dropdownRefTarget = useRef(null);
  const dropdownRef = useRef(null);
  const [stakeInfo, setStakeInfo] = useState({})
  const [accessToken, setAccessToken] = useState<string>()
  const [isKYCWindowOpen, setKYCWindowOpen] = useState(false)
  const [kycStatus, setKYCStatus] = useState<KYC_STATUS>(KYC_STATUS.NOT_SET)
  const KYC_BASE = process.env.REACT_APP_KYC_ENDPOINT!
  const dispatch = useDispatch();
  const history = useHistory()

  const { account, library, chainId } = useActiveWeb3React()
  const etherFromWei = useWeb3FromWei()
  const network = useSelector((state: AppState) => state.application.network)
  // const { items: cartItems } = useSelector((state: AppState) => state.user.userCart)
  const genpadStakeContract = useWeb3Contract(GET_PAD_STAKE_ABI)
  const { NetworkSwitch } = useNetwork()
  const userCart = useSelector((state: AppState) => state.user.userCart)
  const cartItems = (account && chainId) && userCart && userCart[account!] && userCart[account!][chainId!] || []
  const { getUserAuthToken } = useUserAuth()
  const { addLocalStorageCartItems, clearCart } = useCart()

  let contractAddress = GENPAD_STAKING_ADDRESS[4]
  let tokenAddress = GENPAD_STAKING_TOKEN_ADDRESS[4]

  if (Number(chainId) === 97) {
    contractAddress = GENPAD_STAKING_ADDRESS[String(chainId)]
    tokenAddress = GENPAD_STAKING_ADDRESS[String(chainId)]
  }

  const pathsForUser = ["/genpad", "/marketplace/projects", "/profile", "/marketplace", "/project", "/profile-detail", "/marketplace/projects/project-detail"]
  const moveFromGenpad = ["/genpad", "/profile", "/project"]
  const moveFromMarketPlace = ["/marketplace/projects", "/marketplace", "/profile-detail", "/marketplace/projects/project-detail"]

  //  eth get balance
  const [first, setfirst] = useState({});
// console.log(otherRoutesList?.innerMenu?.title)
  const loadBalance = async () => {
    if (library) {
      const getBalance = JSBI.BigInt((await library.getBalance(account!)).toString())
      const walletBalance = new TokenAmount(defaultList[0] as Token, getBalance)
      setBalance(walletBalance);
    }
  }


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
      () => getNewAccessToken()
    )
      .withConf({
        lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
        email: applicantEmail,
        phone: applicantPhone,
        uiConf: {
          customCssStr: ":root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}"
        },
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
    snsWebSdkInstance.launch('#sumsub-websdk-container')
    setKYCWindowOpen(true)
  }

  // useEffect(() => {

  // }, [])

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

    getUserAuthToken()

  }, [account])

  const goToHomePage = (path: string) => {
    console.log("----/----/---- ", path, "path")
    if (path === "https://genesisshards.defiterm.io/") {
      setOpenMenu(false)
      setMobileMenu(false)
      window.open(path, "_blank")
    } else {
      setOpenMenu(false)
      setMobileMenu(false)
      history.push(path)
    }
  }

  const menuOnClickHandler = () => {
    console.log("coming");
    setOpenMenu(prev => !prev)
  }
  const subMenuOpen = () => {
    setOpenSubMenu(prev => !prev)
  }

  const headerName = "SHARDS"//location.pathname === "/genpad" ? "PAD" : "SHARDS"

  //switch list
  useEffect(() => {
    setButtons(NetwokButton)
    console.log('network------------->', network);
    if (!account) {
      setDefaultList(network == 'BSC' ? BSC_LIST : network == 'MATIC' ? MATIC_LIST : network == 'IOTEX' ? IOTEX_LIST : network == 'HARMONY' ? HARMONY_LIST : network == 'AVALANCHE' ? AVALANCHE_LIST : network == 'GOERLI' ? GOERLI_LIST : network == 'MUMBAI' ? MUMBAI_LIST : network == 'T-IoTeX' ? IOTEX_TESTNET_LIST : network == 'T-HRMNY' ? HARMONY_TESTNET_LIST : network == 'T-AVALANCHE' ? AVALANCHE_TESTNET_LIST : network == 'T-BSC' ? BSC_TESTNET_LIST : DEFAULT_ETH_LIST)
    } else {
      setDefaultList(chainId == 56 ? BSC_LIST : chainId == 137 ? MATIC_LIST : chainId == 4689 ? IOTEX_LIST : chainId == 1666600000 ? HARMONY_LIST : chainId == 43114 ? AVALANCHE_LIST : chainId == 5 ? GOERLI_LIST : chainId == 80001 ? MUMBAI_LIST : chainId == 4690 ? IOTEX_TESTNET_LIST : chainId == 1666700000 ? HARMONY_TESTNET_LIST : chainId == 43113 ? AVALANCHE_TESTNET_LIST : chainId == 97 ? BSC_TESTNET_LIST : DEFAULT_ETH_LIST)
    }
    if (account) {
      loadBalance()
      onGetStakeInfo()
    }
  }, [chainId, network, account])


  const onGetStakeInfo = async () => {
    try {
      const stakeInfo = await genpadStakeContract(contractAddress).methods.stakeInfo(account!).call()
      setStakeInfo(stakeInfo)
      return stakeInfo
    } catch (ex) {
      console.log(ex, 'Error in getProjectDetails')
      return {}
    }
  }

  const { ethereum } = window as any
  let selectedChain = buttons.find((button: any) => button.network === network)
  if (!selectedChain) {
    selectedChain = buttons[0]
  }

  let { ags = "0" } = stakeInfo as any
  ags = Number(etherFromWei(ags))
  const selectedaGsInfo = useMemo(() => {
    let findaGs = aGSInfoByTotalaGs.find(agsInfo => (agsInfo.agsMin <= Number(ags)) && (agsInfo.agsMax >= Number(ags)))
    return findaGs
  }, [ags])


  const tierProgress = useMemo(() => {
    if (!selectedaGsInfo) return 0
    const { agsMax = 0 } = selectedaGsInfo
    if (agsMax === Infinity) return 100
    return (Number(ags) / agsMax) * 100
  }, [selectedaGsInfo, ags])

  const { startName = '', endName = '', color = '#c3c3c3' } = selectedaGsInfo || {}

  return (
    <div className="header homePageHeader">
      {/* <div className="header-staking-live">
        <HeaderLive />
      </div> */}

      {/* desktop view */}
      <div className="header__content homepage-header">

        <div className="gen-header-logo">
          {/* <img src="/images/genshards-logo.svg" alt="logo" /> <h1 onClick={() => history.push("/")}>GENESIS SHARDS</h1> */}
          <h1 className='heading-new-1' onClick={() => history.push("/")}>Symbiote</h1>
        </div>
        <nav>
          <div className="main-routes-selection">
            {
              newMainRoutes.map((route, index) => {
                return <Link to={route.path} key={index} className="route-list-item">
                  {route.title}
                </Link>
              })
            }

            

            {/* <div className="others">
              <div className="other" style={{ cursor: "pointer" }} onClick={menuOnClickHandler}>Others <img src={arrowDownWhite} alt="down arrow" /> </div>
              {openMenu ? <div className="others-route-dropdown" ref={dropdownRefTarget}>
                <ul>
                  {
                    otherRoutesList.map((route, index) => {
                      return <li key={index} onClick={() => goToHomePage(route.path)}>
                        <span>{route.title}</span>
                      </li>
                    })
                  }
                </ul>
              </div> : null}
            </div> */}
          </div>
          <div className="other-routes-selection">
            <div className="show-user-tier">
              <div className="tier-color" style={{ background: color }} />
              <span>{startName || endName}</span>
              <div className="show-progress-bar">
                <div className='progress-name'><span>{startName}</span> <span>{endName}</span></div>
                <Progressbar progress={tierProgress} />
              </div>
            </div>
            <div className="account-element">
              <div>
                <AccountElement
                  active={!!account}
                  style={{ pointerEvents: 'auto' }}
                >
                  {account ? (
                    <BalanceText
                      style={{ flexShrink: 0 }}
                      pl="0.75rem"
                      pr="0.5rem"
                      fontWeight={500}
                    >
                      {account && balance?.toSignificant(4)} {network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase()}
                    </BalanceText>
                  ) : null}
                  <Web3Status />
                </AccountElement>
              </div>
            </div>
          </div>
          <div className="others-route">
          <div className="select-chain-item" onMouseEnter={() => setOpenChain(prev => !prev)} onMouseLeave={() => setOpenChain(prev => !prev)}>
            <div className="select-chain">
              {/* <p className="chain-p">Chain: </p> */}
              <div className="selected-chain-div" style={{ marginLeft: 10 }}>
                <img src={selectedChain.tokenImg} alt={selectedChain.network} />
                <div>{selectedChain.network === "BSC" ? "BNB" : selectedChain.network}</div>
              </div>
              <img src={arrowDownWhite} alt=""/>
            </div>

            {openChain ? <div className="select-chain-dropdown" ref={dropdownRef}>
              {buttons.map((button: any, index: number) => {
                return (
                  <ActiveBorder
                    key={index}
                    active={(button.network === network)}>

                    <NetworkButtonStyled
                      onClick={() => { NetworkSwitch(button.network); setOpenChain(prev => !prev) }}
                      network={button.network}
                    >

                      <Aligner>
                        <img src={button.tokenImg} alt={button.network} style={{ marginRight: "5px" }} />
                        <div>{button.network === "BSC" ? "BNB" : button.network}</div>
                      </Aligner>

                    </NetworkButtonStyled>
                  </ActiveBorder>
                )
              })}
            </div> : null}
          </div>
        </div>
        </nav>
        

        {/* {account !== null ? <ActiveBorder
          style={{ minWidth: '144px', marginLeft: '10px' }}
          key={2}
          active={false}>
          <NetworkButtonStyled
            style={{ width: 'fit-content' }}
            onClick={() => launchWebSdk(process.env.REACT_APP_SUMSUB_BASE!, 'basic-kyc', accessToken!)}
            network={'ETH'}
          >
            <Aligner style={{ justifyContent: 'center' }}>
              <div style={{
                height: 12,
                width: 12,
                borderRadius: '50%',
                marginRight: 4,
                marginTop: 2,
                backgroundColor: kycStatus === KYC_STATUS.VERIFIED ? '#00CF6C'
                  : kycStatus === KYC_STATUS.NOT_VERIFIED ? '#FF0000'
                    : 'transparent'
              }} />
              <div>{kycStatus}</div>
            </Aligner>
          </NetworkButtonStyled>
        </ActiveBorder> : null} */}
        {pathsForUser.includes(location.pathname) &&
          <div className="user" onClick={() => {
            moveFromGenpad.includes(location.pathname) && history.push("/profile");
            moveFromMarketPlace.includes(location.pathname) && history.push("/profile-detail");
          }
          }><User size={20} color="#fff" /></div>
        }

      </div>



      {/* mobile view */}

      <div className="mobile-view-homepage-header">
        {/* <div className="gen-logo">
          <Link to="/" className="logo__link">
            GEN SHARDS
          </Link>
        </div> */}
        <div>

        </div>
        <div className="menu-icon">
          <img style={{ cursor: "pointer" }} src={menuWhiteIcon} width="40" alt="" onClick={() => setMobileMenu(prev => !prev)} />
        </div>
        {mobileMenu ? <div className="menu-item-header">
          <div className="menu-items">
            <div className="other-routes-selection">
              <div className="account-element">
                <div>
                  <AccountElement
                    active={!!account}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {account ? (
                      <BalanceText
                        style={{ flexShrink: 0 }}
                        pl="0.75rem"
                        pr="0.5rem"
                        fontWeight={500}
                      >
                        {account && balance?.toSignificant(4)} {network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'RIN' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase()}
                      </BalanceText>
                    ) : null}
                    <Web3Status />
                  </AccountElement>
                </div>
              </div>
              <div className="others-route">
                <div className="select-chain-item">
                  <div className="select-chain">
                    {/* <p className="chain-p">Chain: </p> */}
                    <div className="selected-chain-div" style={{ marginLeft: 10 }}>
                      <img src={selectedChain.tokenImg} alt={selectedChain.network} />
                      <div>{selectedChain.network === "BSC" ? "BNB" : selectedChain.network}</div>
                    </div>
                    <img src={arrowDownWhite} alt="" onClick={() => setOpenChain(prev => !prev)} />
                  </div>

                  {openChain ? <div className="select-chain-dropdown" ref={dropdownRef}>
                    {buttons.map((button: any, index: number) => {
                      return (
                        <ActiveBorder
                          key={index}
                          active={(button.network === network)}>

                          <NetworkButtonStyled
                            onClick={() => { NetworkSwitch(button.network); setOpenChain(prev => !prev) }}
                            network={button.network}
                          >

                            <Aligner>
                              <img src={button.tokenImg} alt={button.network} style={{ marginRight: "5px" }} />
                              <div>{button.network === "BSC" ? "BNB" : button.network}</div>
                            </Aligner>

                          </NetworkButtonStyled>
                        </ActiveBorder>
                      )
                    })}
                  </div> : null}
                </div>
              </div>
              <div className="show-user-tier">
                <div className="tier-color" style={{ background: color }} />
                <span>{startName || endName}</span>
                <div className="show-progress-bar">
                  <div className='progress-name'><span>{startName}</span> <span>{endName}</span></div>
                  <Progressbar progress={tierProgress} />
                </div>
              </div>
              {account !== null ? <ActiveBorder
                style={{ width: 177, justifyContent: "end" }}
                key={2}
                active={false}>
                <NetworkButtonStyled
                  style={{ width: 'fit-content' }}
                  onClick={() => launchWebSdk(process.env.REACT_APP_SUMSUB_BASE!, 'basic-kyc', accessToken!)}
                  network={'ETH'}
                >
                  <Aligner style={{ justifyContent: 'center' }}>
                    <div style={{
                      height: 12,
                      width: 12,
                      borderRadius: '50%',
                      marginRight: 4,
                      marginTop: 2,
                      backgroundColor: kycStatus === KYC_STATUS.VERIFIED ? '#00CF6C'
                        : kycStatus === KYC_STATUS.NOT_VERIFIED ? '#FF0000'
                          : 'transparent'
                    }} />
                    <div>{kycStatus}</div>
                  </Aligner>
                </NetworkButtonStyled>
              </ActiveBorder> : null}
            </div>
            <ul>
              {
                mainRoutes.map((route, index) => {
                  return <li key={index} onClick={() => goToHomePage(route.path)}>
                    {route.title}
                  </li>
                })
              }
              {
                otherRoutesList.map((route, index) => {
                  return <li key={index} onClick={() => 
                  route?.path ? goToHomePage(route?.path) : subMenuOpen()}>
                    {route.title}
                      {openSubMenu ?
                        <ul className='sub-menu'>
                          {route.innerMenu && route.innerMenu.map((subRoute, i) => (
                            <li key={i} onClick={() => goToHomePage(subRoute.path)}>
                              {subRoute.title}{console.log(subRoute)}
                            </li>
                          ))}
                        </ul> : ""}
                  </li>
                })
              }
            </ul>
          </div> </div> : null}
      </div>
      {/* <div className="another-route-wrapper">
        {
          anotherRoutes?.map((link, ind) => <div key={ind} className="another-route">{link?.title}</div>)
        }
      </div> */}
    </div>
  )
}

export default HomepageHeader_v1