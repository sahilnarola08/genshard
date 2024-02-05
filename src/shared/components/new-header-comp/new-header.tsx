import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import menuWhiteIcon from "../../../images/header-menu-white.png"
import twitterWhiteIcon from "../../../images/homepage/twitter-white-icon.svg"
import mediumIcon from "../../../images/homepage/medium-icon.svg"
import './new-header.css'
import { AccountElement, BalanceText } from '../header/header-content';
import Progressbar from '../../../pages/homepage/components/ProgressBar';
import { useWeb3Contract, useWeb3FromWei } from '../../../hooks/useContract';
import StakeInfo from '../../../pages/staking/components/stake-info';
import { aGSInfoByTotalaGs } from '../../../pages/homepage/components/Staking';
import { useActiveWeb3React } from '../../../hooks/web3';
import JSBI from 'jsbi'
import Web3Status from '../header/connect-wallet/web3status';
import { Token, TokenAmount } from '@uniswap/sdk';
import { TokenInfo } from '@uniswap/token-lists';
import { DEFAULT_ETH_LIST } from '../../../constants/list/eth_default_list';
import { useSelector } from 'react-redux';
import { AppState } from '../../../state';
import { NetworkSymbol } from '../../../connectors';
import { MATIC_LIST } from '../../../constants/list/default-tokenlist-matic';
import { BSC_LIST } from '../../../constants/list/bsc_list';
import { IOTEX_LIST } from '../../../constants/list/iotex_list';
import { HARMONY_LIST } from '../../../constants/list/harmony_list';
import { AVALANCHE_LIST } from '../../../constants/list/avalanche_list';
import { GOERLI_LIST } from '../../../constants/list/gorli_list';
import { MUMBAI_LIST } from '../../../constants/list/mumbai_list';
import { HARMONY_TESTNET_LIST } from '../../../constants/list/harmony_testnet_list';
import { AVALANCHE_TESTNET_LIST } from '../../../constants/list/avalanche_testnet_list';
import { BSC_TESTNET_LIST } from '../../../constants/list/bsc_testnet_list';
import { abi as GET_PAD_STAKE_ABI } from "../../../contracts/GenpadStaking.json"
import { GENPAD_STAKING_ADDRESS, GENPAD_STAKING_TOKEN_ADDRESS } from '../../../constants';
import arrowDownWhite from "../../../images/header-live/arrow-down-white.svg"
import styled from 'styled-components';
import useNetwork from '../../../hooks/useNetwork';
import { IOTEX_TESTNET_LIST } from '../../../constants/list/iotex_testnet_list';

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


const NewHeader = () => {

    const [isActive, setActive] = useState(false);
    const [scroll, setScroll] = useState(false)
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const history = useHistory();
    const etherFromWei = useWeb3FromWei()
    const { account, library, chainId } = useActiveWeb3React()
    const [balance, setBalance] = useState<any>()
    const [defaultList, setDefaultList] = useState<TokenInfo[]>(DEFAULT_ETH_LIST)
    const network = useSelector((state: AppState) => state.application.network)
    const [openChain, setOpenChain] = useState(false)
    const [buttons, setButtons] = useState<INetworkItem[]>(NetwokButton)
    const [stakeInfo, setStakeInfo] = useState({})
    const genpadStakeContract = useWeb3Contract(GET_PAD_STAKE_ABI)
    const dropdownRef = useRef(null);
    const { NetworkSwitch } = useNetwork()
    const [isMenuActive, setIsMenuActive] = useState(false);


    let contractAddress = GENPAD_STAKING_ADDRESS[4]
    let tokenAddress = GENPAD_STAKING_TOKEN_ADDRESS[4]

    if (Number(chainId) === 97) {
        contractAddress = GENPAD_STAKING_ADDRESS[String(chainId)]
        tokenAddress = GENPAD_STAKING_ADDRESS[String(chainId)]
    }



    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 0);
        });
    }, []);

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

    const { ethereum } = window as any
    let selectedChain = buttons.find((button: any) => button.network === network)
    if (!selectedChain) {
        selectedChain = buttons[0]
    }

    //switch list
    useEffect(() => {
        setButtons(NetwokButton)
        console.log('network------------->', network);
        if (!account) {
            setDefaultList(network == 'BSC' ? BSC_LIST : network == 'MATIC' ? MATIC_LIST : network == 'IOTEX' ? IOTEX_LIST : network == 'HARMONY' ? HARMONY_LIST : network == 'AVALANCHE' ? AVALANCHE_LIST : network == 'GOERLI' ? GOERLI_LIST : network == 'MUMBAI' ? MUMBAI_LIST : network == 'T-IoTeX' ? IOTEX_TESTNET_LIST : network == 'T-HRMNY' ? HARMONY_TESTNET_LIST : network == 'T-AVALANCHE' ? AVALANCHE_TESTNET_LIST : network == 'T-BSC' ? BSC_TESTNET_LIST : DEFAULT_ETH_LIST)
        } else {
            // eslint-disable-next-line
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

    let { ags = "0" } = StakeInfo as any
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

    const [isSubMenuSecondActive, setIsSubMenuSecondActive] = useState(false);
    const [isSubMenuActive, setIsSubMenuActive] = useState(false);
    const menuClose = () => {
        setIsMenuActive(false);
        setIsSubMenuActive(false)
        setIsSubMenuSecondActive(false)

    };

    const subMenu = () => {
        setIsSubMenuActive(!isSubMenuActive);
        if (isMenuActive) {
            setIsMenuActive(true);
        }
    };

    const subMenuSecond = () => {
        setIsSubMenuSecondActive(!isSubMenuSecondActive);
        if (isMenuActive) {
            setIsMenuActive(true);
        }
    };

    const menuOpenClick = () => {
        setIsMenuActive(true);
        // if (isSubMenuActive) {
        //     setIsSubMenuActive(!isSubMenuActive);
        // }
        // if (!isSubMenuSecondActive) {
        //     setIsSubMenuSecondActive(!isSubMenuSecondActive);
        // }
    };

    return (
        <div className="updated-header">
            <header className={scroll ? "scrolled" : ""}>
                <div className="container">
                    <nav className="navbar">
                        <Link to="" className="navbar-logo heading-new-3 text-decoration-none">Symbiote</Link>
                        <div className='menu-open-icon' onClick={menuOpenClick}>
                            <i className="ri-menu-line"></i>
                        </div>
                        {/* <ul className={isMenuActive ? "navbar-links active" : "navbar-links"}> */}
                        <ul className="navbar-links">
                            <li className='menu-open-icon close-menu-icon' >
                                <i className="ri-close-line"></i>
                            </li>
                            <li className="navbar-dropdown">
                                <a>Products <i className="ri-arrow-down-s-line"></i></a>
                                <div className="dropdown">
                                    <Link to="/launchpad">Launchpad</Link>
                                    <Link to="/genpad/staking">Staking</Link>
                                    <Link to="/votedao">VoteDAO</Link>
                                </div>
                            </li>
                            <li>
                                <Link to="/ecosystem">Ecosystem</Link>
                            </li>
                            <li>
                                <Link to="/accelerate">Acceleration</Link>
                            </li>
                            <li className="navbar-dropdown">
                                <a>Resources <i className="ri-arrow-down-s-line"></i></a>
                                <div className="dropdown">
                                    <Link to="">Documentation</Link>
                                    <Link to="">About Us</Link>
                                    <Link to="">CoinGecko link</Link>
                                    <Link to="">CMC Link</Link>
                                    <Link to="">Buy GS</Link>
                                </div>
                            </li>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className='wallets-connection'>
                                <div>
                                    <Link to=""><img src={mediumIcon} alt="" /></Link>
                                </div>
                                <div className='mx-2'>
                                    <Link to=""> <img src={twitterWhiteIcon} alt="" /></Link>
                                </div>
                                <div className="other-routes-selection">
                                    {/* <div className="show-user-tier">
                                        <div className="tier-color" style={{ background: color }} />
                                        <span>{startName || endName}</span>
                                        <div className="show-progress-bar">
                                            <div className='progress-name'><span>{startName}</span> <span>{endName}</span></div>
                                            <Progressbar progress={tierProgress} />
                                        </div>
                                    </div> */}
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
                            </li>
                        </ul>

                        {/* sidebar start */}
                        <div id="mySidenav" className={isMenuActive ? "sidenav active" : "sidenav"}>
                            <div className="closebtn" onClick={menuClose}>
                                <i className="ri-close-line"></i>
                            </div>
                            <ul>
                                <li className="navbar-dropdown">
                                    <button className={isSubMenuActive ? "exclusive-res open" : "exclusive-res"} onClick={subMenu}>
                                        Products <i className="ri-arrow-down-s-line"></i>
                                    </button>
                                    <div className={isSubMenuActive ? "sub-menu open" : "sub-menu"}>
                                        <Link to="/launchpad" onClick={menuClose}>Launchpad</Link>
                                        <Link to="/genpad/staking" onClick={menuClose}>Staking</Link>
                                        <Link to="/votedao" onClick={menuClose}>VoteDAO</Link>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/ecosystem" onClick={menuClose}>Ecosystem</Link>
                                </li>
                                <li>
                                    <Link to="/accelerate" onClick={menuClose}>Acceleration</Link>
                                </li>
                                <li className="navbar-dropdown">
                                    <button className={isSubMenuSecondActive ? "exclusive-res open" : "exclusive-res"} onClick={ subMenuSecond}>
                                        Resources <i className="ri-arrow-down-s-line"></i>
                                    </button>
                                    <div className={isSubMenuSecondActive ? "sub-menu open" : "sub-menu"}>
                                        <Link to="" onClick={menuClose}>Documentation</Link>
                                        <Link to="" onClick={menuClose}>About Us</Link>
                                        <Link to="" onClick={menuClose}>CoinGecko link</Link>
                                        <Link to="" onClick={menuClose}>CMC Link</Link>
                                        <Link to="" onClick={menuClose}>Buy GS</Link>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/profile" onClick={menuClose}>Profile</Link>
                                </li>
                                <li className='wallets-connection'>
                                    <div>
                                        <Link to="" onClick={menuClose}><img src={mediumIcon} alt="" /></Link>
                                    </div>
                                    <div className='mx-2'>
                                        <Link to="" onClick={menuClose}> <img src={twitterWhiteIcon} alt="" /></Link>
                                    </div>
                                    <div className="other-routes-selection" onClick={menuClose}>
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
                                </li>
                            </ul>
                        </div>
                        {/* sidebar end */}
                    </nav>
                </div>
            </header>
        </div>
    )
}

export default NewHeader;