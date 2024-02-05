import React, { useState, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { IResolutionItem } from '../../../../state/community/types'
import ResolutionCard from './ResolutionCard'
import "./style.sass"
import axios from "axios"
import { useActiveWeb3React } from '../../../../hooks/web3'

const stakingView = [
    {
        path: "",
        label: "LIVE",
        tab: 1
    },
    {
        path: "past-stake",
        label: "PAST",
        tab: 2
    }
]

// const resolutionList = [
//     {
//         name: "Resolution 1"
//     },
//     {
//         name: "Resolution 2"
//     }
// ]

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || ''

export default function Resolution() {

    const [activeTab, setActiveTab] = useState(1)
    const [resolutions, setResolutions] = useState<any>([])
    const [resolutionVotes, setResolutionVotes] = useState<any>([])
    const [selectedId, setSelectedId] = useState<string>('')
    const [isLoading, setIsLoading] = useState<Boolean>(false)

    const { account, chainId, library } = useActiveWeb3React()

    useEffect(() => {
        if (activeTab === 1) {
            getInitialData()
        } else {
            setResolutions([])
            setResolutionVotes([])
            setIsLoading(false)
        }
    }, [activeTab, account])

    const getInitialData = async () => {
        try {
            setIsLoading(true)
            await getAllResolutions()
            await getResolutionVotes()
            setIsLoading(false)
        } catch (ex) {
            setIsLoading(false)
        }
    }

    const getAllResolutions = async () => {
        try {
            const { data: resolutionData } = await axios.get(`${apiBaseUrl}/api/v1/resolutions`)
            setResolutions(resolutionData.values || [])
        } catch (ex) { console.log('Error in getAllResolutions') }
    }

    const getResolutionVotes = async () => {
        try {
            const { data: resolutionVoteData } = await axios.get(`${apiBaseUrl}/api/v1/resolutions/vote`, { params: { walletAddress: account || '' } })
            setResolutionVotes(resolutionVoteData)
        } catch (ex) { console.log('Error in getAllResolutions') }
    }

    const addResolutionVote = async (resolutionId: string, status: string) => {
        try {
            if (!account) return alert('Connect Metamask')
            setSelectedId(resolutionId)
            await axios.post(`${apiBaseUrl}/api/v1/resolutions/vote`, { resolutionId, walletAddress: account, status })
            await getResolutionVotes()
            setSelectedId("")
        } catch (ex) {
            setSelectedId("")
            console.log('Error in getAllResolutions')
        }
    }

    const onChangeTab = (tab: number) => {
        setIsLoading(true)
        setActiveTab(tab)
    }

    const resolutionList = useMemo(() => {
        return resolutions.map((reso: any) => {
            const findVote = resolutionVotes && resolutionVotes.find((vote: any) => vote._id === reso._id) || {}
            return {
                ...reso,
                ...findVote
            }
        })
    }, [resolutions, resolutionVotes])

    return (
        <div className="resolution-container" id="community-dao-id">
            <div className="resolution-header">
                <h1>Voting</h1>
                <div className="switch-stakes">
                    {stakingView.map((item, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`link-item ${activeTab === item.tab ? "active-link" : ""}`}
                                // toactive-link activeClassName="active-link"
                                onClick={() => onChangeTab(item.tab)}
                                title={item.label}

                            // isActive={(match) => match?.isExact || false}
                            >
                                {item.label}
                            </div>
                            {index === 0 ? <div className="divider" /> : null}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="switch-stakes">
                <div className="resolution-item-container">
                    {isLoading ? <div className="all-resolution-loader">
                        <img
                            className="loading-icon"
                            src="/images/icons/loading.svg"
                            alt="loading"
                        />
                    </div> :
                        resolutionList.length ? resolutionList.map((item: IResolutionItem, index: number) => {
                            return <ResolutionCard
                                key={index}
                                cardDetails={item}
                                selectedId={selectedId}
                                addResolutionVote={addResolutionVote}
                            />
                        }) : <div className="no-resolution"><p>No {activeTab === 1 ? "Live" : "past"} resolutions.</p></div>
                    }
                </div>
            </div>
        </div>
    )
}
