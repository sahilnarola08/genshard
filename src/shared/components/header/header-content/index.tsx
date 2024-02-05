import { useState, useRef, useEffect } from "react"
import { Link, NavLink } from 'react-router-dom'
import { KYC_STATUS } from '../../../../state/application/reducer'
import styled from 'styled-components'
import { Text } from 'rebass'
import Web3Status from '../connect-wallet/web3status'
import { Fragment } from 'react'
import "./style.sass"
import menuWhiteIcon from "../../../../images/header-menu-white.png"
import closeWhiteIcon from "../../../../images/header-menu-close-white.svg"
import arrowDownWhite from "../../../../images/header-live/arrow-down-white.svg"
import useOutsideAlerter from "../../../../hooks/useOutsideAlerter"
import { User } from 'react-feather'

const HomePageLink: ILinkItem[] = [

    {
        to: '/dashboard',
        title: 'Dashboard',
        altTitle: 'Go Dashboard page',
    },
    {
        to: '/community',
        title: 'GenVoice',
        altTitle: 'Go community page',
    },
    {
        to: '/genverse',
        title: 'GenVerse',
        altTitle: 'Go Collection page',
    },
    {
        to: '/market',
        title: 'Market',
        altTitle: 'Go Market page',
    },
    // {
    //     to: '/create',
    //     title: 'Create',
    //     altTitle: 'Go Create page',
    // },
    // {
    //     to: '/calendar',
    //     title: 'Calendar',
    //     altTitle: 'Go Calender page',
    // },
    // {
    //     to: '/marketplace',
    //     title: 'Marketplace',
    //     altTitle: 'Go Marketplace page',
    // },
]

const rewardsDropDownLink: ILinkItem[] = [
    {
        to: '/staking',
        title: 'Staking',
        altTitle: 'Go Staking page',
    },
    {
        to: '/access-pool',
        title: 'Access Pool',
        altTitle: 'Go Access Pool page',
    },
    {
        to: 'https://genesisshards.defiterm.io/',
        title: 'Liquidity Mining',
        altTitle: 'Go Liquidity Mining',
    },
]

export const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `};
`
export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) =>
        !active ? 'Transparent' : theme.bg3};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  :focus {
    border: 1px solid blue;
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  color: black;
  justify-content: flex-start;
  height: 100%;
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


export default function HeaderContent(props: IHeaderContent) {

    const {
        account,
        balance,
        network,
        buttons,
        kycStatus,
        NetworkSwitch,
        launchWebSdk,
        accessToken
    } = props

    const [openMenu, setOpenMenu] = useState(false)
    const [openChain, setOpenChain] = useState(false)
    const [openRewards, setOpenRewards] = useState(false)
    const dropdownRef = useRef(null);
    const openRewardRef = useRef(null);
    const clickedOutside = useOutsideAlerter(dropdownRef);
    const openRewardClickedOutside = useOutsideAlerter(openRewardRef);

    useEffect(() => {
        if (clickedOutside && openChain) {
            setOpenChain(false)
        }
        if (openRewardClickedOutside && openRewards) {
            setOpenRewards(false)
        }
    }, [clickedOutside, openRewardClickedOutside])


    let selectedChain = buttons.find((button: any) => button.network === network)
    if (!selectedChain) {
        selectedChain = buttons[0]
    }

    return (
        <Fragment>

            {/* desktop view */}
            <div className="header__content">
                <div className="logo">
                    <Link to="/" className="logo__link">
                        GEN SHARDS
                    </Link>
                </div>

                {/* list links */}
                <div className='link-container'>
                    <nav className="links">
                        {HomePageLink.map((link, index) => {
                            if (link.title === 'Liquidity Mining') {
                                return <a
                                    key={index}
                                    href={link.to}
                                    className="link-item"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.title}
                                </a>
                            }
                            return <NavLink
                                key={index}
                                className="link-item"
                                to={link.to}
                                activeClassName="active-link"
                                title={link.altTitle}
                                exact
                            >
                                {link.title}
                            </NavLink>
                        })}
                        <div className="links rewards-dropdown">
                            <div className="reward-click-listener" onClick={() => setOpenRewards(prev => !prev)}>
                                <span
                                    className="link-item"
                                >
                                    Rewards
                                </span>
                                <img src={arrowDownWhite} alt="" />
                            </div>
                            {openRewards ? <div ref={openRewardRef} className="rewards-dropdown-menu">
                                {rewardsDropDownLink.map((link, index) => {
                                    if (link.title === 'Liquidity Mining') {
                                        return <a
                                            key={index}
                                            href={link.to}
                                            className="link-item"
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ marginRight: 0 }}
                                            onClick={() => setOpenRewards(prev => !prev)}
                                        >
                                            {link.title}
                                        </a>
                                    }
                                    return <NavLink
                                        key={index}
                                        className="link-item"
                                        to={link.to}
                                        style={{ marginRight: 0 }}
                                        activeClassName="active-link"
                                        title={link.altTitle}
                                        exact
                                        onClick={() => setOpenRewards(prev => !prev)}
                                    >
                                        {link.title}
                                    </NavLink>
                                })}

                            </div> : null}
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


                        {/* <Aligner style={{
                        width: "200px",
                        marginLeft: "2rem"
                    }}>
                        {buttons.map((button: any, index: number) => {
                            return (
                                <ActiveBorder
                                    key={index}
                                    active={(button.network === network)}>
                                    <NetworkButtonStyled
                                        onClick={() => NetworkSwitch(button.network)}
                                        network={button.network}
                                    >
                                        <Aligner>
                                            <img src={button.tokenImg} alt={button.network} style={{ marginRight: "5px" }} />
                                            <p>{button.network}</p>
                                        </Aligner>
                                    </NetworkButtonStyled>
                                </ActiveBorder>
                            )
                        })}
                    </Aligner> */}

                        <div className="select-chain-item" >
                            <div className="select-chain">
                                <p className="chain-p">Chain: </p>
                                <div className="selected-chain-div">
                                    <img src={selectedChain.tokenImg} alt={selectedChain.network} />
                                    <p>{selectedChain.network === "BSC" ? "BNB" : selectedChain.network}</p>
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
                                                    <p>{button.network === "BSC" ? "BNB" : button.network}</p>
                                                </Aligner>

                                            </NetworkButtonStyled>
                                        </ActiveBorder>
                                    )
                                })}
                            </div> : null}
                        </div>

                        {account !== null ? <ActiveBorder
                            style={{ width: 120, marginRight: '16px' }}
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

                        {/* <NavLink
                            to={'/profile-detail'}
                            activeClassName="active-link"
                            title={'Go Profile page'}
                            exact
                        >
                            <User size={25} color="#fff" />
                        </NavLink> */}
                        {/* <ConnectButton /> */}
                        {/* <Dropdown options={mockOptions}>
              User
            </Dropdown> */}
                    </nav>
                </div>
            </div>

            {/* mobile view */}
            <div className="mobile-header">
                <div className="logo">
                    <Link to="/" className="logo__link">
                        GEN SHARDS
                    </Link>
                </div>
                <div>
                    <img style={{ cursor: "pointer" }} src={menuWhiteIcon} width="40" alt="" onClick={() => setOpenMenu(prev => !prev)} />
                </div>
                {openMenu ? <div className="menu-item-header">
                    <ul>
                        <li>
                            {/* <NavLink style={{textAlign: 'left'}}
                                to={'/profile-detail'}
                                activeClassName="active-link"
                                title={'Go Profile page'}
                                exact
                            >
                                <User size={20} color="#fff" />
                            </NavLink> */}
                            <div className="account-balance-menu">
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
                                            {account && balance?.toSignificant(4)} {network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase()}
                                        </BalanceText>
                                    ) : null}
                                    <Web3Status />
                                </AccountElement>
                            </div>
                        </li>
                        <li className="select-chain-item">
                            <div className="select-chain">
                                <p className="chain-p">Chain: </p>
                                <div className="selected-chain-div">
                                    <img src={selectedChain.tokenImg} alt={selectedChain.network} />
                                    <p>{selectedChain.network === "BSC" ? "BNB" : selectedChain.network}</p>
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
                                                onClick={() => NetworkSwitch(button.network)}
                                                network={button.network}
                                            >

                                                <Aligner>
                                                    <img src={button.tokenImg} alt={button.network} style={{ marginRight: "5px" }} />
                                                    <p>{button.network === "BSC" ? "BNB" : button.network}</p>
                                                </Aligner>

                                            </NetworkButtonStyled>
                                        </ActiveBorder>
                                    )
                                })}
                            </div> : null}
                        </li>
                        {HomePageLink.map((link, index) => {
                            if (link.title === 'Liquidity Mining') {
                                return <li key={index}>
                                    <a
                                        href={link.to}
                                        className="link-item"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {link.title}
                                    </a>
                                </li>
                            }
                            return <li key={index}>
                                <NavLink
                                    className="link-item"
                                    to={link.to}
                                    activeClassName="active-link"
                                    title={link.altTitle}
                                    exact
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        })}
                    </ul>
                </div> : null}
            </div>
        </Fragment>
    )
}

interface IHeaderContent {
    NetworkSwitch: any,
    account: any,
    balance: any,
    network: any,
    buttons: any,
    kycStatus: any,
    launchWebSdk: any,
    accessToken: any
}

interface ILinkItem {
    to: string
    title: string
    altTitle?: string
}