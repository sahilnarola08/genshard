import { useEffect, useMemo, useState } from 'react'
import { NftoCard } from '.'
import { useHistory } from "react-router-dom"
import { useActiveWeb3React } from '../../../../hooks/web3'
import axios from "axios"
import { calculateGasMargin, getGenKarmaContract } from '../../../../utils'
import { useWeb3ToWei } from '../../../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'

const baseUrl = process.env.REACT_APP_API_BASE_URL || ''
const voteBurnAmount = "100"
export default function AllProjects() {

    const history = useHistory()
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()
    const etherToWei = useWeb3ToWei()
    const [projects, setProjects] = useState<any[]>([])
    const [userVotes, setUserVotes] = useState([])
    const [selectedId, setSelectedId] = useState("")
    const [filters, setFilters] = useState({
        limit: 20,
        skip: 0
    })

    useEffect(() => {
        getInitialProjects()
        window.scrollTo(110, 0);
    }, [])

    useEffect(() => {
        if (projects.length && selectedAccount) {
            getUserVotes()
        }
    }, [projects, selectedAccount])

    const getInitialProjects = () => {
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + '/api/v1/projects', { params: { limit: filters.limit, skip: filters.skip } }).then(res => {
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

    return useMemo(() => <div className="community-pg">
        <div className="community-main">
            <div className="community-container">
                <div className='community-all-projects'>

                    <div className="community-nfto-container">
                        <div className="community-nfto-heading">
                            <span onClick={() => history.push('/community')}>{'<- Back'}</span>
                            <h1>Community NFTO's</h1>
                        </div>
                        <div className="project-cards">
                            {
                                getProjectsWithVotes.length ? getProjectsWithVotes.map((item, index) => {
                                    return <NftoCard
                                        key={index}
                                        cardDetails={item}
                                        selectedId={selectedId}
                                        addUserVote={addUserVote}
                                    />
                                }) : <div className="no-project-found"><p>No Project Found.</p></div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>, [getProjectsWithVotes, selectedId])
}
