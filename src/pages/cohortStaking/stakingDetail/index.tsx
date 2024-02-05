import { useEffect, useMemo, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./style.sass"
import goBack from "../../../images/staking/go-back-dark.svg"
import Button from "../../../shared/components/buttons"
import { useWeb3Contract, useWeb3FromWei, useWeb3ToWei } from "../../../hooks/useContract"
import { abi as GET_COHORT_STAKING_ABI } from '../../../contracts/GenCohertStaking.json'
import { useActiveWeb3React } from "../../../hooks/web3"
import { AppState } from "../../../state"
import { useSelector } from "react-redux"
import { abi as GEN_GSK_ABI } from "../../../contracts/GenGsk.json"
import { calculateGasMargin, getGenCohortStakingContract, getGenGSKContract } from "../../../utils"
import { TransactionResponse } from "@ethersproject/providers"
import { apiBaseUrl, COHORT_STAKE_CONTRACT_ADDRESS, DEFAULT_APPROVE_VALUE } from "../../../constants"
import moment from "moment"
import axios from "axios"

interface ICohortStaking {
    name: string,
    durations: {
        percentReturn: number,
        duration: number,
    },
    apyRange: string,
    stakeEndTime: number,
    tokens: {
        icon: string,
        tokenId?: string,
        name?: string,
        apr?: number,
        tokenAddress?: string,
        rewardPercent?: number
    }[],
    cohortId: number
}

// production
// const valueInSecondsByDuration = {
//     0: 2592000,
//     1: 7.776e+6,
//     2: 1.555e+7,
//     3: 3.154e+7
// }

// for testing
// const valueInSecondsByDuration = {
//     0: 300,
//     1: 600,
//     2: 900,
//     3: 1200
// }

// const lockInDurations = [
//     {
//         label: "1M",
//         value: 0,
//     },
//     {
//         label: "3M",
//         value: 1,
//     },
//     {
//         label: "6M",
//         value: 2,
//     },
//     {
//         label: "1Y",
//         value: 3,
//     },
// ]

const cohortContractAddress = COHORT_STAKE_CONTRACT_ADDRESS
const approveValue = DEFAULT_APPROVE_VALUE || ""

function CohertStakingDetail() {

    const params = useParams<{ id: string }>()
    const history = useHistory()

    const [staking, setStaking] = useState<ICohortStaking>()
    const [selectedToken, setSelectedToken] = useState<any>(null)
    const [stakeInfo, setStakeInfo] = useState<any>()
    const [selectedDuration, setSelectedDuration] = useState<any>()
    const [inputBalance, setInputBalance] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [balance, setBalance] = useState<any>(0)
    const [isApproved, setIsApproved] = useState<boolean>(false)

    const network = useSelector((state: AppState) => state.application.network)
    const etherFromWei = useWeb3FromWei()
    const etherToWei = useWeb3ToWei()
    const { account, chainId, library } = useActiveWeb3React()
    // const account = "0x8E7a31D2f1298b429f9f5E7e76a5f517EF506Ef7"

    let tokenContract: any = null;
    let getTokenBscAbi = useWeb3Contract(GEN_GSK_ABI)
    let getTokenAbi = useWeb3Contract(GEN_GSK_ABI)

    if (Number(chainId) === 4 || Number(chainId) === 56) {
        tokenContract = getTokenBscAbi
    } else {
        tokenContract = getTokenAbi
    }

    const cohortStakeContract = useWeb3Contract(GET_COHORT_STAKING_ABI)

    useEffect(() => {
        if (params.id) getCohortStakeById(params.id)
    }, [params.id])

    const getCohortStakeById = (id: string) => {
        setIsLoading(true)
        axios.get(apiBaseUrl + `/api/v1/cohort/${id}`).then(({ data }) => {
            setIsLoading(false)
            setStaking(data)
            setSelectedToken(data.tokens[0])
        }).catch(err => {
            setIsLoading(false)
            console.log('err on getCohortStakeById')
        })
    }

    useEffect(() => {
        if (selectedToken && staking && network && account) {
            getInitialData()
        }
    }, [staking, selectedToken, network, account])

    const getInitialData = async () => {
        try {
            setIsLoading(true)
            const [stakeRewardTotal, stakeInfo, approveValue] = await Promise.all([
                getstakeInfoTotalReward(),
                getStakeInfo(),
                checkIfApproved(selectedToken.tokenAddress),
                onFetchUserbalance(selectedToken.tokenAddress)
            ])

            if (!Number(approveValue)) {
                setIsApproved(false)
            } else setIsApproved(true)
            setInputBalance(0)
            const { amount = "", id = "", startTime = "", endTime = "" } = stakeInfo

            const stakes = await getStakes(Number(staking?.cohortId), Number(id))
            const { duration = "", percentReturn = "" } = stakes

            setStakeInfo({
                id: Number(id),
                stakeRewardTotal,
                stakeAmount: Number(etherFromWei(amount)).toFixed(2),
                startTime,
                endTime
            })
            setSelectedDuration({
                id: Number(id),
                duration,
                percentReturn
            })
            setIsLoading(false)
        } catch (ex) { setIsLoading(false) }
    }

    const onChangeToken = (token) => {
        setSelectedToken(token)
    }

    const onChangeDuration = async (id: number) => {
        setIsLoading(true)
        const stakes = await getStakes(Number(staking?.cohortId), Number(id))
        const { duration = "", percentReturn = "" } = stakes

        setSelectedDuration({
            id: Number(id),
            duration,
            percentReturn
        })
        setIsLoading(false)
    }

    const onGoBack = () => {
        history.goBack()
    }

    const getstakeInfoTotalReward = async () => {
        try {
            const result = await cohortStakeContract(cohortContractAddress).methods.stakeInfo_totalReward(staking?.cohortId, selectedToken.tokenAddress).call({ from: account })
            return result
        } catch (ex) { console.log(ex, 'Error in getstakeInfoTotalReward'); return 0 }
    }

    const getStakeInfo = async () => {
        try {
            const result = await cohortStakeContract(cohortContractAddress).methods.stakeInfo(staking?.cohortId, selectedToken.tokenAddress).call({ from: account })
            return result
        } catch (ex) { console.log(ex, 'Error in getStakeInfo'); return {} }
    }

    const onClickApprove = async () => {
        try {
            setIsLoading(true)
            const genToken = getGenGSKContract(selectedToken.tokenAddress, chainId!, library!, account!)
            const args = [cohortContractAddress, approveValue]
            const estimatedGasLimit = await genToken.estimateGas.approve(...args, {})
            const transactionResponse: TransactionResponse = await genToken.approve(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await getInitialData()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setIsLoading(false)
        }
    }

    const checkIfApproved = async (tokenAddress: any) => {
        try {
            return await tokenContract(tokenAddress).methods.allowance(account, cohortContractAddress).call()
        } catch (ex) {
            return 0
        }
    }

    const onFetchUserbalance = async (tokenAddress: string) => {
        try {
            let userBalance = await tokenContract(tokenAddress).methods.balanceOf(account).call()
            userBalance = Number(etherFromWei(userBalance)).toFixed(0)
            setBalance(userBalance)
            return userBalance
        } catch (ex) {
            console.log(ex, 'Error in onFetchUserbalance')
            return 0
        }
    }


    const onClickClaimRewards = async (isStakeEnded = false) => {
        try {
            setIsLoading(true)
            const genPadStaking = getGenCohortStakingContract(cohortContractAddress, chainId!, library!, account!)
            const rewardMethod = isStakeEnded ? "claimAndWithdrawAll" : "claimReward"
            console.log({ rewardMethod })
            const args = [staking?.cohortId, selectedToken.tokenAddress]
            const estimatedGasLimit = await genPadStaking.estimateGas[rewardMethod](...args, {})
            const transactionResponse: TransactionResponse = await genPadStaking[rewardMethod](...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await getInitialData()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickClaimRewards")
            setIsLoading(false)
        }
    }

    const onClickStake = async () => {
        try {
            if (!inputBalance) return
            setIsLoading(true)
            const genPadStaking = getGenCohortStakingContract(cohortContractAddress, chainId!, library!, account!)
            const args = [etherToWei(String(inputBalance)), staking?.cohortId, selectedToken.tokenAddress, selectedDuration.id]
            console.log({ args })
            const estimatedGasLimit = await genPadStaking.estimateGas.cohertStake(...args)
            const transactionResponse: TransactionResponse = await genPadStaking.cohertStake(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await getInitialData()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickStake")
            setIsLoading(false)
        }
    }

    const onClickMax = () => {
        setInputBalance(balance)
    }

    const getStakes = async (cohortId: number, durationId: number) => {
        try {
            const result = await cohortStakeContract(cohortContractAddress).methods.stakes(cohortId, durationId).call({ from: account })
            return result
        } catch (ex) { console.log(ex, 'Error in getStakes'); return {} }
    }

    const { name = '', apyRange = '', tokens = [], stakeEndTime = '', durations = [] } = staking || {}
    const { stakeAmount, duration: stakeDuration, id: contractDurationId, stakeRewardTotal, endTime = '' } = stakeInfo || {}
    const { id: selectedDurationId = '', duration: tierDuration = '', percentReturn = '' } = selectedDuration || {}

    let isStakeEnded = Number(stakeEndTime) < moment().unix()
    let lockInDuration = moment().unix() + Number(tierDuration)
    let isUserStakeEnded = Number(endTime) ? Number(endTime) < moment().unix() : false

    console.log({ staking, stakeInfo, selectedDuration })

    // const valueInSecondsByDuration = {
    //     0: 300,
    //     1: 600,
    //     2: 900,
    //     3: 1200
    // }

    // const lockInDurations = [
    //     {
    //         label: "1M",
    //         value: 0,
    //     },
    //     {
    //         label: "3M",
    //         value: 1,
    //     },
    //     {
    //         label: "6M",
    //         value: 2,
    //     },
    //     {
    //         label: "1Y",
    //         value: 3,
    //     },
    // ]

    const [valueInSecondsByDuration, lockInDurations] = useMemo(() => {

        if (Array.isArray(durations)) {
            let valueInSeconds = {}
            let lockIn: { label: any, value: number, rewardPercent: number }[] = []
            for (let i = 0; i < durations.length; i++) {
                const { rewardPercent, duration } = durations[i]

                let months = Math.floor(Number(duration) / 30) as any
                if(months > 11) months = "1Y"
                else if(months > 0) months = `${months}M`
                else {
                    months = `${duration}D`
                }

                lockIn.push({
                    label: months,
                    value: i,
                    rewardPercent
                })

                valueInSeconds = {
                    ...valueInSeconds,
                    [i]: (Number(duration) * 86400)
                }
            }
            return [valueInSeconds, lockIn]
        }
        return [{}, []]
    }, [durations])

    const totalLocked = useMemo(() => {
        return Number(stakeAmount) + Number(inputBalance)
    }, [stakeAmount, inputBalance])

    return (
        <div className="cohort-detail-container">
            {isLoading ? <div className="single-card-loader">
                <img
                    className="loading-icon"
                    src="/images/icons/loading.svg"
                    alt="loading"
                />
            </div> : null}
            <div className="cohort-staking-heading">
                <h1>STAKING</h1>
            </div>
            <div className="stake-heading">
                <div className="stake-name">
                    <img src={goBack} onClick={onGoBack} alt="" />
                    <h1>{name}</h1>
                </div>
                <div className="stake-duration">
                    <span>Timer</span>
                    <span className="duration">{moment((Number(stakeEndTime) || moment().unix()) * 1000).format('Do MMM yyyy')}</span>
                </div>
            </div>

            <div className="staking-details-container">
                <div className="staking-details-item">
                    <h1 className="project-list-heading">Project List</h1>

                    <div className="token-list-container">
                        {
                            tokens.map((token, index) => {
                                return <div className="token-list-item" key={index} onClick={() => onChangeToken(token)}>
                                    <div className={`token-detail ${token.tokenAddress === String((selectedToken && selectedToken.tokenAddress) || '') ? "selected-item" : ""}`}>
                                        <img src={token.icon} alt="" />
                                        <span>{token.name}</span>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                    <div className="staking-calculation-container">
                        <div className="stake-info">
                            <h1>APY <span>{apyRange}</span></h1>
                            <div className="project-stake-balance">
                                Staked Balance &nbsp;
                                <span className="stake-amount">{stakeAmount}</span>
                                <div>
                                    <img src={selectedToken && selectedToken.icon} alt="" />
                                    <span>{selectedToken && selectedToken.name}</span>
                                </div>
                            </div>

                            <EstimatedRewards
                                tokens={tokens}
                                imgHeight={60}
                                selectedToken={selectedToken}
                                stakeRewardTotal={stakeRewardTotal}
                                valueInSecondsByDuration={valueInSecondsByDuration}
                            />

                            {Number(stakeRewardTotal) ? <div className="claim-rewards-actions">
                                <Button className="outline--highlight active" onClick={() => onClickClaimRewards(isUserStakeEnded)}>Claim {isUserStakeEnded ? "Withdraw" : ""} Rewards</Button>
                            </div> : null}
                        </div>

                        <div className="stake-calculator">
                            <h1>APY Calculator</h1>
                            <div className="apy-calculator-d-flex">
                                <label>
                                    Staked Balance
                                </label>
                                <div className="stake-balance-input">
                                    <input type="number" value={inputBalance || ''} onChange={e => setInputBalance(Number(e.target.value))} />
                                    <Button className="outline--highlight" onClick={onClickMax}>MAX</Button>
                                </div>
                            </div>
                            <div className="apy-calculator-d-flex">
                                <label>
                                    Lock-In Duration
                                </label>
                                <div className="lock-in-duration">
                                    {
                                        lockInDurations.map((duration, index) => {
                                            const disableSelection = duration.value < Number(contractDurationId)
                                            return <div
                                                className={`lock-in-item ${duration.value === selectedDurationId ? "selected-duration" : ""}`} key={index}>
                                                <span
                                                    className={`${disableSelection ? 'disabled-duration' : ''}`}
                                                    onClick={() => disableSelection ? null : onChangeDuration(duration.value)}
                                                >{duration.label}</span>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="apy-calculator-d-flex">
                                <label>APY</label>
                                <div className="total-apy">
                                    <span>{0}%</span>
                                </div>
                            </div>
                            <div className="apy-calculator-d-flex">
                                <label>
                                    Estimated Rewards
                                </label>
                                <div className="estimated-rewards">

                                    <EstimatedRewards
                                        tokens={tokens}
                                        imgHeight={50}
                                        selectedToken={selectedToken}
                                        percentReturn={percentReturn}
                                        selectedDurationId={selectedDurationId}
                                        totalLocked={totalLocked}
                                        valueInSecondsByDuration={valueInSecondsByDuration}
                                    />

                                </div>
                            </div>
                            <p>Your total staked tokens will be locked until {moment(lockInDuration * 1000).format("Do MMM yyyy")}</p>
                            {isStakeEnded ? null : <div className="stake-actions">
                                <Button className="outline--highlight active" onClick={isApproved ? onClickStake : onClickApprove}>{isApproved ? "Stake" : "Approve"}</Button>
                            </div>}
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default CohertStakingDetail

const EstimatedRewards = ({
    tokens = [],
    selectedToken = {},
    imgHeight = 50,
    percentReturn = "",
    selectedDurationId = "",
    stakeRewardTotal = "",
    totalLocked = 0,
    valueInSecondsByDuration = {}
}: any) => {
    let { selfEr = "", otherEr = "", tokenAddress = '' } = selectedToken || {}
    const showRewards = !!percentReturn
    if (showRewards) {
        selfEr = Number(selfEr) * Number(valueInSecondsByDuration[Number(selectedDurationId)])
        otherEr = Number(otherEr) * Number(valueInSecondsByDuration[Number(selectedDurationId)])
    }
    const rewardTotal = Number(totalLocked) * (Number(percentReturn) / 100)
    const etherFromWei = useWeb3FromWei()
    return <div className="token-percentage">
        {
            tokens.map((token: any, index: number) => {
                const { icon } = token
                const isSelected = token.tokenAddress === tokenAddress
                let value: any = 0
                if (showRewards) {
                    value = rewardTotal * (Number(isSelected ? etherFromWei(selfEr) : etherFromWei(otherEr)))
                } else {
                    value = Number(etherFromWei(String(stakeRewardTotal * Number(isSelected ? selfEr : otherEr))))
                }
                return <div className="token-percentage-item" key={index}>
                    <div className="">
                        <span>{value.toFixed(2)} </span><img src={icon} alt="" height={imgHeight} width={imgHeight} style={{ objectFit: "cover" }} />
                    </div>
                </div>
            })
        }
    </div>
}