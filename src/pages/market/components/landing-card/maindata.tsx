import { ExtendedProject } from '../../../../state/market/types'
import cardBackground from '../../../../images/card_background.png'
import nfTradeLogo from '../../../../images/nftrade.svg';
import openSeaLogo from '../../../../images/open-sea.svg';
import Button from '../../../../shared/components/buttons'
import moment from 'moment'

interface MainDataProps extends ExtendedProject {
    buttonText?: string
    isLive: boolean
    onClick: () => void
}

export default function MainData(props: MainDataProps) {
    const applyWhitelist = props.preIdo ? moment().diff(moment.unix(parseInt(props.preIdo!))) < 0 : false
    console.log('props', props) 
    return (
        <>
            <div className="card-data-container">
                <div className="title">
                    {props.name}
                </div>
                <img className="bg-image-mobile" src={props.projectImage} alt="" />
                <div className="mini-header">
                    subscription
                </div>

                <div className="split-container">
                    <div className="individual-split">
                        <div className="mini-header">
                            public
                        </div>
                        <div className="header-text">
                            {props.name.toLowerCase() == "ACKNOLEDGER NFT COLLECTION".toLowerCase() || props.name.toLowerCase() == "POLKER INO".toLowerCase() ? "-" : props.subPublic == "NaN" ? 0.00 + '%' : props.subPublic + '%'}
                        </div>
                    </div>
                    <div className="individual-split">
                        <div className="mini-header">
                            private
                        </div>
                        <div className="header-text">
                            {props.name.toLowerCase() == "ACKNOLEDGER NFT COLLECTION".toLowerCase() || props.name.toLowerCase() == "POLKER INO".toLowerCase() ? "-" : props.subPrivate == "NaN" ? 0.00 + '%' : props.subPrivate + '%'}
                        </div>
                    </div>
                </div>

                <div className="split-container">
                    <div className="individual-split">
                        <div className="mini-header">
                            funds target
                        </div>
                        <div style={{ color: 'black' }} className="header-text">
                            {props.fundsTarget}
                        </div>
                    </div>
                    <div className="individual-split">
                        <div className="mini-header">
                            {props.name.toLowerCase() == "ACKNOLEDGER NFT COLLECTION".toLowerCase() || props.name.toLowerCase() == "POLKER INO".toLowerCase() ? "ino" : 'pre-ido'}
                        </div>
                        <div style={{ color: 'black' }} className="header-text">
                            {props.isPast ? 'DONE' : props.preIdo ? moment.unix(parseInt(props.preIdo!)).fromNow() : props.isLive ? 'LIVE' : moment.unix(parseInt(props.startDate!)).fromNow()}
                        </div>
                    </div>
                </div>
                {!props.isPast && (
                    <div className="btn-container">
                        <Button
                            onClick={props.onClick}
                            style={{ textTransform: 'uppercase', letterSpacing: '0.145em' }}
                            className={`outline--highlight view-button active ${(!props.isLive || props.buttonText !== undefined && !applyWhitelist) && 'btn-coming-soon'}`}
                            disabled={props.buttonText !== undefined ? false : !props.isLive && !applyWhitelist}>
                            {props.buttonText !== undefined ? props.buttonText : applyWhitelist ? 'Apply for Whitelist' : props.isPast ? 'View Results' : props.isLive ? 'Buy NFTs' : 'Coming Soon'}
                        </Button>
                    </div>
                )}
                {props.isPast && (!props.openSeaURL && !props.nfTradeURL) && (
                    <div className="btn-container">
                        <Button
                            onClick={props.onClick}
                            style={{ textTransform: 'uppercase', letterSpacing: '0.145em' }}
                            className={`outline--highlight view-button active ${(!props.isLive || props.buttonText !== undefined && !applyWhitelist) && 'btn-coming-soon'}`}
                            disabled={props.buttonText !== undefined ? false : !props.isLive && !applyWhitelist}>
                            {props.buttonText !== undefined ? props.buttonText : applyWhitelist ? 'Apply for Whitelist' : props.isPast ? 'View Results' : props.isLive ? 'Buy NFTs' : 'Coming Soon'}
                        </Button>
                    </div>
                )}
            </div>
            <img className="bg-image" src={props.projectImage} alt="" />
            {props.isPast && (props.openSeaURL || props.nfTradeURL) && (
                <>
                    <Button
                        onClick={props.onClick}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.145em', alignSelf: 'flex-end' }}
                        className={`outline--highlight active view-button btn-padding`}
                        disabled={props.buttonText !== undefined ? false : !props.isLive && !applyWhitelist}>
                        {props.buttonText !== undefined ? props.buttonText : applyWhitelist ? 'Apply for Whitelist' : props.isPast ? 'View Results' : props.isLive ? 'Buy NFTs' : 'Coming Soon'}
                    </Button>
                    <div className="" style={{ display: 'flex', gap: 12, flex: 1 }}>
                        {props.openSeaURL && (
                            <div className="individual-split" style={{ flex: 1 }}>
                                <div className="mini-header" style={{ margin: '4px 0' }}>
                                    View Project On
                                </div>
                                <Button
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.145em' }}
                                    className={`outline--highlight btn-padding`}
                                    onClick={() => window.open(props.openSeaURL, '_blank')}
                                >
                                    <img src={openSeaLogo} alt="" className="logo-button" />
                                </Button>
                            </div>
                        )}
                        {props.nfTradeURL && (
                            <div className="individual-split" style={{ flex: 1, alignSelf: 'flex-end' }}>
                                <Button
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.145em' }}
                                    className={`outline--highlight btn-padding`}
                                    onClick={() => window.open(props.nfTradeURL, '_blank')}
                                >
                                    <img src={nfTradeLogo} alt="" className="logo-button" />
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}  
        </>
    )
}