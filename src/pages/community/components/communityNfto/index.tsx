import { useEffect, useState, useMemo } from 'react'
import Button from '../../../../shared/components/buttons'
import "./style.sass"
import votesIcon from '../../../../images/community/votes.svg'
import websiteIcon from '../../../../images/community/website-icon.svg'
import telegramIcon from '../../../../images/community/telegram-icon.svg'
import twitterIcon from '../../../../images/community/twitter-icon.svg'
import learnMoreIcon from '../../../../images/community/learn-more.svg'
import { useHistory } from "react-router-dom"
import axios from "axios"
import { useActiveWeb3React } from '../../../../hooks/web3'
import { calculateGasMargin, getGenKarmaContract } from '../../../../utils'
import { GEN_KARMA_GOERLI } from '../../../../constants'
import { useWeb3ToWei } from '../../../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'

import { abi as GEN_KARMA_ABI } from '../../../../contracts/GenKarma.json'
import Web3 from "web3"

const baseUrl = process.env.REACT_APP_API_BASE_URL || ''
const karmaContractAddress = GEN_KARMA_GOERLI

const voteBurnAmount = "100"

const webLinkArray = [
    {
        name: "Website",
        icon: websiteIcon,
    },
    {
        name: "Telegram",
        icon: telegramIcon,
    },
    {
        name: "Twitter",
        icon: twitterIcon,
    }
]

export default function CommunityNfto() {
    const history = useHistory()
    const etherToWei = useWeb3ToWei()
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()
    const [projects, setProjects] = useState<any[]>([])
    const [userVotes, setUserVotes] = useState([])
    const [selectedId, setSelectedId] = useState("")

    useEffect(() => {
        getInitialProjects()
    }, [])

    useEffect(() => {
        if (projects.length && selectedAccount) {
            getUserVotes()
        }
    }, [projects, selectedAccount])

    const getInitialProjects = () => {
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + '/api/v1/projects', { params: { limit: 3 } }).then(res => {
                setProjects(res.data.values || [])
                resolve(res.data)
            }).catch(err => {
                console.log(err)
                resolve({ values: [], total: 0 })
            })
        })
    }

    const getUserVotes = () => {
        return new Promise((resolve, reject) => {
            const projectIds = projects.map((product: any) => product._id)
            axios.post(baseUrl + '/api/v1/projects/getVotes', { walletAddress: selectedAccount, projectIds }).then(res => {
                setUserVotes(res.data.values || [])
                resolve(res.data)
            }).catch(err => {
                console.log(err)
                resolve({ values: [], total: 0 })
            })
        })
    }

    const addUserVote = async (projectId: string) => {
        try {
            if (!selectedAccount) {
                alert('Connect metamask')
                return
            }
            setSelectedId(projectId)
            // const genKarma = getGenKarmaContract("0xF5E89C3c473f255eA72Ce404dC87D0d7AbA8c0a5" as any, chainId!, library!, selectedAccount!)

            // const args = [
            //     etherToWei(voteBurnAmount)
            // ]
            // const estimatedGasLimit = await genKarma.estimateGas.burn(...args)
            // const transactionResponse: TransactionResponse = await genKarma.burn(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            // await transactionResponse.wait()
            await axios.post(baseUrl + '/api/v1/projects/addVotes', { walletAddress: selectedAccount, projectId })
            await getUserVotes()
            const updatedProjects = projects.map((project: any) => {
                if (String(project._id) === String(projectId)) return { ...project, totalVotes: project.totalVotes + 1 }
                else return project
            })
            setProjects(updatedProjects)
            setSelectedId("")
        } catch (ex) {
            setSelectedId("")
            console.log(ex || 'error addUserVote')
        }
    }

    const getProjectsWithVotes = useMemo(() => projects.map((project: any) => {
        const isVoted = userVotes.find((vote: any) => vote.refId === project._id)
        return { ...project, isVoted: !!isVoted }
    }), [projects, userVotes])

    return useMemo(() => (
        (
            <div className="community-nfto-container" id="community-nftos-id">
                <div className="community-nfto-heading">
                    <h1>Community NFTOs</h1>
                </div>
                <div className="project-cards">
                    {
                        getProjectsWithVotes.length ? getProjectsWithVotes.map((item: any, index: number) => {
                            return <NftoCard
                                key={index}
                                cardDetails={item}
                                selectedId={selectedId}
                                addUserVote={addUserVote}
                            />
                        }) : <div className="no-project-found"><p>No Project Found.</p></div>
                    }
                </div>
                <div className="project-bottom">
                    <p onClick={() => history.push('/community/projects')}>{'See all projects ->'}</p>
                </div>
            </div>
        )
    ), [getProjectsWithVotes, selectedId])
}

export function NftoCard(props: INftoCard) {
    const {
        cardDetails = {},
        addUserVote = () => { },
        selectedId = ""
    } = props

    const {
        _id = "",
        name = "",
        tokenName = "",
        totalVotes = "",
        isVoted = false,
        logoImage = "",
        socialLinks = {},
        gridColor = "",
    } = cardDetails || {}

    const socialLinksMap = Object.entries(socialLinks)
    let webLinks = webLinkArray.map((item: any) => {
        const link = socialLinksMap.find(([key]) => key.toLowerCase().includes(String(item.name).toLowerCase()))
        return { webName: item.name, redirectLink: link ? link[1] : "" }
    })

    let aboutMoreLink = socialLinks["mediumURL"]

    const bgColor = `linear-gradient(180deg, ${gridColor || '#5D5D5D'} 0%, rgba(9, 9, 10, 0) 90%)`
    return useMemo(() => (
        <div className="nfto-card-container">
            <div className="nfto-card">
                {_id === selectedId ? <div className="nfto-card-loader">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                </div> : null}
                <div style={{ backgroundImage: bgColor }} className="nfto-card-faded-bg" />
                <div className="image-div">
                    <img src={logoImage} alt="" />
                </div>
                <h3 className="project-heading">{name}</h3>
                <div className="card-token-vote">
                    <h4>{tokenName || "TOKEN"}</h4>
                    <div className="card-vote-counts">
                        <img src={votesIcon} alt="" />
                        <span>{totalVotes} Votes</span>
                    </div>
                </div>
                <div className="card-vote-btn">
                    <Button className={isVoted ? '' : 'vote-now'} onClick={() => isVoted ? {} : addUserVote(_id)}>{isVoted ? 'Voted' : 'Vote Now'}</Button>
                </div>
                <div className="card-bottom-links">
                    <ul>
                        <li>
                            <a href={aboutMoreLink} target="_blank" rel="noreferrer">Learn more about this project <img src={learnMoreIcon} alt="" /></a>
                        </li>
                        <li>
                            <div className="card-footer">
                                {
                                    webLinks.map((item: any, index: number) => {
                                        return <a key={index} href={item.redirectLink} className="web-link" target="_blank" rel="noreferrer">
                                            <img src={index === 0 ? websiteIcon : index === 1 ? telegramIcon : index === 2 ? twitterIcon : websiteIcon} alt="" />
                                            <span>{item.webName}</span>
                                        </a>
                                    })
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    ), [cardDetails, selectedId])
}

interface INftoCard {
    cardDetails: any,
    addUserVote?: any,
    selectedId: string
}