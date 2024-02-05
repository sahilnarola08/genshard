import { useEffect, useState } from 'react'
import "./styles.sass";
import '../landing-card/style.sass'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import MainData from '../landing-card/maindata'
import moment from 'moment'
import { useHistory } from 'react-router'
import backIcon from '../../../../images/marketplace/backIcon.svg'
import { AppDispatch } from '../../../../state'
import { useDispatch } from 'react-redux'
import { changeCurrentProject } from '../../../../state/market/actions'
import _ from 'lodash'
import whiteCard from '../../../../images/whitelist/white.png'
import silverCard from '../../../../images/whitelist/silver.png'
import pinkCard from '../../../../images/whitelist/pink.png'
import goldCard from '../../../../images/whitelist/gold.png'
import blackCard from '../../../../images/whitelist/black.png'
import Button from '../../../../shared/components/buttons';
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { useActiveWeb3React } from '../../../../hooks/web3'
import ReactCardFlip from 'react-card-flip';
import { WhitelistForm } from '../../../../state/market/types';

const optionalAccounts: string[] = [
];

const CARD_ITEMS: { card: string, img: any, msg: string }[] = [
    { card: 'black', img: blackCard, msg: "Users need to hold 30000 GS tokens in their wallet from the time of whitelist up to the preIDO date." },
    { card: 'gold', img: goldCard, msg: "Users need to hold 15000 GS tokens in their wallet from the time of whitelist up to the preIDO date." },
    { card: 'pink', img: pinkCard, msg: "Users need to hold 7500 GS tokens in their wallet from the time of whitelist up to the preIDO date." },
    { card: 'silver', img: silverCard, msg: "Users need to hold 2000 GS tokens in their wallet from the time of whitelist up to the preIDO date." },
    { card: 'open community', img: whiteCard, msg: "Users can participate without the need for GS holdings and can select any card of choice." },
]

export default function CurrentProject() {
    const { account } = useActiveWeb3React()
    const history = useHistory()
    const genMarket = useWeb3Contract(GEN_MARKET_ABI)
    const currentProject = useSelector((state: AppState) => state.market.currentProject)
    const dispatch = useDispatch<AppDispatch>()

    const [isLive, setIsLive] = useState(false)
    const [isWhitelisted, setIsWhitelisted] = useState(false)
    const [isOptionalMessageVisible, setIsOptionalMessageVisible] = useState(false)
    const [selectedForm, setSelectedForm] = useState('black')
    const [showMessage, setShowMessage] = useState([false, false, false, false, false])
    const applyWhitelist = currentProject!.preIdo ? moment().diff(moment.unix(parseInt(currentProject!.preIdo!))) < 0 : false

    const checkWhitelist = async () => {

        setIsWhitelisted(false);
        setIsOptionalMessageVisible(false);
        
        if (currentProject?.marketAddress === undefined) {
            setIsWhitelisted(false)
            return
        }
        
        for (let i = 0; i < CARD_ITEMS.length; i++) {
            const whitelisted = await genMarket(currentProject?.marketAddress!).methods.whitelist(i, account!).call()
            console.log('Default whitelisted', whitelisted, i);
            
            if (whitelisted) {
                console.log('Approved Default whitelisted');
                setIsWhitelisted(true)
                setIsOptionalMessageVisible(false);
                return
            }
        }

       if (currentProject.id === 'sportzchain' && optionalAccounts.includes(account!)) {
            // Optional users - Pool Open + 2 hrs
            console.log('new else ')
            setIsWhitelisted(true);
            setIsOptionalMessageVisible(true);
            return
        } 
    }

    const handleShowMessage = (index: number) => {
        const newShow = showMessage.map((data, indexMap) => index === indexMap ? !data : data)
        setShowMessage(newShow)
    }

    useEffect(() => {
        if (currentProject === undefined) {
            history.push('/market')
            return
        }
        setIsLive(moment().diff(moment.unix(parseInt(currentProject.startDate!))) > 0)
        checkWhitelist()
    }, [])

    return (
        <div className="project-center">
            <div className={`current-project-container`}>
                <div className={`back-icon-container`} onClick={() => {
                    dispatch(changeCurrentProject(undefined))
                    history.push('/market')
                }}>
                    <img style={{ paddingRight: 3 }} src={backIcon} />
                </div>
                <div className={`main-data-container`}>
                    {/* @ts-ignore */}
                    <MainData {...currentProject} onClick={() => {
                        window.open(currentProject?.report)
                    }} buttonText={'View Research Report'} isLive={isLive} />
                </div>
                <div className="timeline-container">
                    <div className="mini-section-title">
                        timeline
                    </div>
                    <ul className="timeline-main-container">
                        <div className="timeline-background-container">
                            <div className="timeline-background" />
                        </div>
                        {_.map(currentProject?.timeline, (item) => {
                            return (
                                <li className={`timeline-item-container ${item.date < moment().unix() ? 'select-timeline-item' : ''}`}>
                                    <div className="ball-outer">
                                        <div className="ball-middle">
                                            <div className="ball-inner" />
                                        </div>
                                    </div>
                                    <div className="timeline-date">
                                        {moment.unix(item.date).format('Do MMM YYYY')}
                                    </div>
                                    <div className="timeline-title" style={{ color: (item.date < moment().unix()) ? '#117DCC' : ''}}>
                                        {item.title}
                                    </div>
                                </li>
                            )
                        })}
                         <div className="timeline-bottom-background-container">
                            <div className="timeline-bottom-background" />
                        </div>
                    </ul>
                </div>
                <div className="whitelist-container">
                    {isWhitelisted || !isLive || applyWhitelist ? <div className="mini-section-title">
                        whitelist forms
                    </div> : null}
                    {currentProject!.isPast ?
                        <div />
                        : (!isWhitelisted && isLive && !applyWhitelist) ?
                            <div className="whitelist-congrats-container">
                                <div className="congrats-text">
                                {/* The whitelist process has closed. Results to be announced soon! */}
                                Sorry, unfortunately you are not whitelisted!
                                </div>
                            </div>
                            // You have been whitelisted and are eligible to buy the NFTs!
                            : isWhitelisted && !applyWhitelist ?
                                <div className="whitelist-congrats-container">
                                    <div className="congrats-text" style={{ marginBottom: 35 }}>
                                        Congratulations!
                                    </div>
                                    <div className="congrats-text">
                                        {isOptionalMessageVisible 
                                            ? 'You\'re whitelisted. You\'ll be able to participate 2 hours after the initial pool opens!' 
                                            : 'You have been whitelisted and are eligible to buy the NFTs!'
                                        } 
                                    </div>
                                </div>
                                : !isLive || applyWhitelist ?
                                    <div className="whitelist-selection-container">
                                        {_.map(_.range(0, CARD_ITEMS.length), (index) => {
                                            const showForm =  currentProject?.whitelistForm[CARD_ITEMS[index].card as keyof WhitelistForm]
                                            if(showForm === "N/A") return null
                                            return (
                                                <div className="whitelist-item-container">
                                                    <ReactCardFlip isFlipped={showMessage[index]}>
                                                        <img className="whitelist-item-img" src={CARD_ITEMS[index].img} onMouseEnter={() => handleShowMessage(index)} alt=""/>
                                                        <div className="msg-container whitelist-item-img" onMouseLeave={() => handleShowMessage(index)}>
                                                            <div className="msg">{CARD_ITEMS[index].msg}</div>
                                                        </div>
                                                    </ReactCardFlip>
                                                    <Button className={`${CARD_ITEMS[index].card === selectedForm ? 'active' : ''} outline--highlight whitelist-index-button`} onClick={() => setSelectedForm(CARD_ITEMS[index].card)}>
                                                        {CARD_ITEMS[index].card}
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : null}
                    {!isOptionalMessageVisible && (applyWhitelist || isWhitelisted) ? <div>
                        <Button onClick={() => {
                            if (isLive && !applyWhitelist) {
                                history.push('/market/buy-nfts')
                                return
                            }
                            if ((!isWhitelisted && !currentProject!.isPast) || applyWhitelist) {
                                const whitelistIndex = selectedForm as keyof typeof currentProject
                                console.log(whitelistIndex)
                                console.log(currentProject?.whitelistForm)
                                window.open(currentProject?.whitelistForm[whitelistIndex])
                            }
                        }} className={`outline--highlight active final-button`}>
                            {applyWhitelist ? 'apply for whitelist' : currentProject!.isPast ? 'view nfts' : isLive ? 'buy nfts' : 'apply for whitelist'}
                        </Button>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}
