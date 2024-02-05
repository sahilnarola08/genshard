import { useState, useEffect, useCallback } from "react"
import './style.sass';
import { useWeb3FromWei, useWeb3ToWei, useWeb3Contract } from '../../../../hooks/useContract'
import { useActiveWeb3React } from "../../../../hooks/web3";
import moment from "moment"
import { IGsContract, IStakingProps } from "../../../../state/staking/types";
import axios from "axios"
import ClaimCard from "../claim-card";
import InfoModal from "../../../../shared/components/InfoModal";
import { useSelector } from "react-redux";
import { AppState } from "../../../../state";
import { calculateGasMargin, getGenStakeContract, getGenTokenContract } from "../../../../utils";
import { TransactionResponse } from "@ethersproject/providers";
import { noExponents } from "../../staking.helpers";
import { abi as GEN_STAKE_ABI } from "../../../../contracts/GenStakes.json"
import GEN_TOKEN_ABI from "../../../../constants/abis/erc20.json"
import { abi as GEN_TOKEN_BSC_ABI } from "../../../../contracts/GenTokenBsc.json"
import { GS_TOKEN_VALUE_TO_USD_URL } from "../../../../constants";

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

export default function LiveStake(props: IStakingProps) {

    const { accessPool = false } = props

    const stakeContract = useWeb3Contract(GEN_STAKE_ABI)
    const network = useSelector((state: AppState) => state.application.network)
    const etherFromWei = useWeb3FromWei()
    const etherToWei = useWeb3ToWei()
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()

    const [gsContract, setGsContract] = useState<Array<IGsContract>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [cardLoader, setCardLoader] = useState<String>('')
    const [gstoUsd, setGstoUsd] = useState<number>(1)
    const [modalOpen, setModalOpen] = useState({
        open: false,
        message: ''
    })
    let intervalIns: any = null


    let tokenContract: any = null;
    let getTokenBscAbi = useWeb3Contract(GEN_TOKEN_BSC_ABI)
    let getTokenAbi = useWeb3Contract(GEN_TOKEN_ABI)

    if (Number(chainId) === 56) {
        tokenContract = getTokenBscAbi
    } else {
        tokenContract = getTokenAbi
    }

    useEffect(() => {
        if (!library || !chainId || !selectedAccount) {
            alert('Connect metamask')
            return
        } else {
            fetchInitialData()
        }
    }, [selectedAccount, chainId, network, accessPool])

    // useEffect(() => {
    //     if (!cardLoader && gsContract.length) {
    //         return onFetchDataChange(gsContract)
    //     } else {
    //         clearInterval(intervalIns)
    //     }
    //     return () => {
    //         clearInterval(intervalIns)
    //     }
    // }, [cardLoader, gsContract])

    const fetchInitialData = useCallback(async () => {
        if (selectedAccount && chainId) {
            return await onFetchRequiredData()
        }
    }, [selectedAccount, chainId, network, accessPool])


    const gsToUsdValue = async () => {
        try {
            const response = await axios.get(GS_TOKEN_VALUE_TO_USD_URL)
            return (response.data["genesis-shards"] && response.data["genesis-shards"]["usd"]) || 1
        } catch (ex) {
            console.log(ex, 'Error in gstoUsd')
            return 1
        }
    }

    const onFetchRequiredData = async () => {
        try {
            setIsLoading(true)
            setGstoUsd(await gsToUsdValue())
            const allContracts = await getAllContracts(chainId)
            let contracts = Array.isArray(allContracts) ? allContracts : []
            let userContracts = await getContractsOfWalletAddress(contracts)
            userContracts = userContracts.map((item: any) => item.contractAddress)
            await createContractInstance(userContracts, allContracts)
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onFetchRequiredData")
            setIsLoading(false)
        }
    }

    const createContractInstance = async (userContracts: any, allContracts: any) => {
        let updatedGsContracts = [] as any
        for (let i = 0; i < allContracts.length; i++) {
            const contract = allContracts[i]
            const isApproved = userContracts.includes(contract.contractAddress)
            // const contractInstance = getGenStakeContract(contract.contractAddress as any, chainId!, library!, selectedAccount!)
            const contractInstance = stakeContract(contract.contractAddress)
            let contractResult = await getInitialValue(contractInstance, contract)
            updatedGsContracts.push(contractResult)
        }
        setGsContract(updatedGsContracts)
        // onFetchDataChange(updatedGsContracts)
    }

    const onFetchDataChange = (gsContract: any) => {
        if (gsContract.length) {
            intervalIns = setInterval(async () => {
                console.log('refresh')
                let updatedGsContracts = [] as any
                for (let i = 0; i < gsContract.length; i++) {
                    const contract = gsContract[i]
                    // const contractInstance = getGenStakeContract(contract.contractAddress as any, chainId!, library!, selectedAccount!)
                    const contractInstance = stakeContract(contract.contractAddress)
                    let contractResult = await getInitialValue(contractInstance, contract)
                    updatedGsContracts.push(contractResult)
                }
                setGsContract(updatedGsContracts)
            }, 8000)
        }
    }

    const getInitialValue = async (instance: any, mixedContract: any) => {
        let stakeEndTimePromise = accessPool ? Promise.resolve(0) : instance.methods.poolExpirationPeriod().call()
        let [endTime, totalStake, totalClaimable, totalWithdraw, totalBalance, tokenAllowance] = await Promise.all([
            stakeEndTimePromise,
            instance.methods.totalGenisis_ShardsStaked().call(),
            instance.methods.stakeInfo_totalReward().call({ from: selectedAccount }),
            instance.methods.stakeInfo_totalAmount().call({ from: selectedAccount }),
            instance.methods.stakeInfo_totalBalance().call({ from: selectedAccount }),
            tokenContract(mixedContract.stakeTokenContract).methods.allowance(selectedAccount, mixedContract.contractAddress).call()
        ])

        endTime = Number(endTime) - moment().unix()
        let isPast = accessPool ? false : endTime < 0;
        let tvlStakeValue = accessPool ? 400000 : 20000
        let tvlAmount = String(etherFromWei(totalStake))
        let totalStakeProgress = Math.floor(Number(tvlAmount) / tvlStakeValue)
        totalClaimable = getTwoDecimalValue(Number(etherFromWei(totalClaimable)))
        totalWithdraw = getTwoDecimalValue(Number(etherFromWei(totalWithdraw)))
        totalBalance = getTwoDecimalValue(Number(etherFromWei(totalBalance)))

        // let seconds = Math.floor((endTime % 60));
        let minutes = Math.floor((endTime % 3600) / 60);
        let hours = Math.floor((endTime % 86400) / 3600);
        let days = Math.floor((endTime % (86400 * 30)) / 86400);

        let timeInString = ""
        if (days <= 0) {
            timeInString = `${hours} ${hours <= 1 ? "Hour" : "Hours"} ${minutes} ${minutes <= 1 ? "minute" : "minutes"} `
        } else {
            timeInString = `${days} ${days <= 1 ? "Day" : "Days"} ${hours} ${hours <= 1 ? "Hour" : "Hours"} `
        }

        let isApproved = false
        if (Number(tokenAllowance) > 0) isApproved = true
        return {
            stakeBalance: totalBalance,
            apr: mixedContract.apy,
            tvl: tvlAmount,
            endTime: timeInString,
            claimAmount: totalClaimable,
            withdrawAmount: totalWithdraw,
            progress: totalStakeProgress,
            stakeInput: "",
            withdrawInput: "",
            isMaxStake: false,
            isMaxWithDraw: false,
            isPast,
            isApproved,
            contractAddress: mixedContract.contractAddress,
            stakeTokenContract: mixedContract.stakeTokenContract,
            isClaimed: false
        }
    }

    const getSelectedAccountBalance = async (tokenAddress: any) => {
        const gsTokenInstance = getGenTokenContract(tokenAddress, chainId!, library!, selectedAccount!)
        const balances = await gsTokenInstance.balanceOf(selectedAccount)
        return etherFromWei(balances)
    }

    const getTwoDecimalValue = (value: any) => {
        const split = String(value).split(".")
        let decimal = ""
        if (split.length > 1) {
            if (split[1].length > 2) {
                for (let i = 0; i < 2; i++) {
                    decimal = decimal + String(split[1]).charAt(i)
                }
            } else {
                decimal = split[1]
            }
            decimal = split[0] + "." + decimal
        } else {
            decimal = String(value)
        }
        return decimal
    }

    const getAllContracts = async (chainId: any) => {
        const response = await axios.get(`${apiBaseUrl}/api/v1/contract`, { params: { type: 'live', chainId, stakeType: accessPool ? 'access' : 'staking' } })
        return response.data.values || []
    }

    const findStakeContractByIndex = (index: any) => {
        const indexedGsContract = gsContract[index]
        return { selectedPool: indexedGsContract }
    }

    const onChangeInputValue = (index: any, e: any) => {
        console.log(index, e.target.name)
        const updatedStake = [...gsContract]
        const { name = "", value = "" } = e.target
        updatedStake[index][name as keyof IGsContract] = value
        setGsContract(updatedStake)
    }

    const onClickStakeMax = async (index: any) => {
        const updatedStake = [...gsContract]
        setCardLoader(updatedStake[index].contractAddress)
        updatedStake[index].stakeInput = getTwoDecimalValue(await getSelectedAccountBalance(updatedStake[index].stakeTokenContract))
        setGsContract(updatedStake)
        setCardLoader('')
    }

    const onClickWithdrawMax = async (index: any) => {
        const updatedStake = [...gsContract]
        updatedStake[index].withdrawInput = getTwoDecimalValue(String(updatedStake[index].stakeBalance) || "0")
        setGsContract(updatedStake)
    }

    const checkForWithdrawMax = async (contractAddress: String, walletAddress: String) => {
        const response = await axios.get(`${apiBaseUrl}/api/v1/stake`, { params: { contractAddress, walletAddress } })
        const walletMaxValue = response.data.values && response.data.values.length ? response.data.values[0] : undefined
        return (walletMaxValue && walletMaxValue.totalStakeValue) || 0
    }

    const onClickStake = async (index: Number) => {
        try {
            const { selectedPool } = findStakeContractByIndex(index)
            if (!selectedPool.stakeInput) return
            if (Number(selectedPool.stakeInput) <= 0) return
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId!, library!, selectedAccount!)
            setCardLoader(selectedPool.contractAddress)
            const newSelectedPoolRes = await getInitialValue(contractInstance, selectedPool)
            let tvlStakeValue = accessPool ? 40000000 : 2000000
            if ((Number(selectedPool.stakeInput) + Number(newSelectedPoolRes.tvl)) > tvlStakeValue) {
                setModalOpen({
                    open: true,
                    message: `Currently you can stake ${tvlStakeValue - Number(newSelectedPoolRes.tvl)} tokens`
                })
                setCardLoader('')
                return
            }
            const args = [
                etherToWei(String(selectedPool.stakeInput))
            ]
            const sendObj = {
                contractAddress: selectedPool.contractAddress,
                amount: selectedPool.stakeInput,
                walletAddress: selectedAccount
            }

            await axios.post(`${apiBaseUrl}/api/v1/stake/update`, sendObj)
            await genStake.estimateGas
                .stakeTokens(...args, {})

                .then((estimatedGasLimit) => {
                    return genStake
                        .stakeTokens(...args, {
                            value: null,
                            gasLimit: calculateGasMargin(estimatedGasLimit),
                        })
                        .then(async (response: TransactionResponse) => {
                            await response.wait().then(async waitResponse => {
                                console.log(waitResponse, "waitResponse")
                                const updatedUserStake = await getInitialValue(contractInstance, selectedPool)
                                console.log(updatedUserStake, "updatedUserStake")
                                const updatedGsContracts = [...gsContract]
                                updatedGsContracts[index as any] = updatedUserStake
                                setGsContract(updatedGsContracts)
                            }).catch(err => console.log(err, "Error in genToken methods"))
                        })
                })
            setCardLoader('')
        } catch (ex) {
            console.log(ex, "Error in onClickStake")
            setCardLoader('')
        }
    }

    const onClickWithdraw = async (index: Number) => {
        try {
            const { selectedPool } = findStakeContractByIndex(index)
            if (!selectedPool.withdrawInput) return
            if (Number(selectedPool.withdrawInput) < 0) return
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId!, library!, selectedAccount!)
            setCardLoader(selectedPool.contractAddress)
            // const dbWithdrawAmount = await checkForWithdrawMax(selectedPool.contractAddress, String(selectedAccount))
            if (Number(selectedPool.withdrawInput) > Number(selectedPool.stakeBalance)) {
                setCardLoader('')
                setModalOpen({
                    open: true,
                    message: `You don't have enough amount to withdraw`
                })
                return
            }
            const args = [
                etherToWei(selectedPool.withdrawInput)
            ]
            await genStake.estimateGas
                .unstakeTokens(...args, {})
                .then((estimatedGasLimit) => {
                    return genStake
                        .unstakeTokens(...args, {
                            value: null,
                            gasLimit: calculateGasMargin(estimatedGasLimit),
                        })
                        .then(async (response: TransactionResponse) => {
                            await response.wait().then(async waitResponse => {
                                console.log(waitResponse, "waitResponse")
                                const sendObj = {
                                    contractAddress: selectedPool.contractAddress,
                                    amount: selectedPool.withdrawInput,
                                    walletAddress: selectedAccount
                                }

                                const response = await axios.post(`${apiBaseUrl}/api/v1/stake/unstake`, sendObj)
                                console.log(response.data)
                                const updatedUserStake = await getInitialValue(contractInstance, selectedPool)
                                console.log(updatedUserStake, "updatedUserStake")
                                const updatedGsContracts = [...gsContract]
                                updatedGsContracts[index as any] = updatedUserStake
                                setGsContract(updatedGsContracts)
                            }).catch(err => console.log(err, "Error in genToken methods"))
                        })
                })
            setCardLoader('')
        } catch (ex) {
            console.log(ex, "Error in onClickWithdraw")
            setCardLoader('')
        }
    }

    const onClickClaimReward = async (index: any) => {
        try {
            const { selectedPool } = findStakeContractByIndex(index)
            if (selectedPool.claimAmount === 0) return
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId!, library!, selectedAccount!)
            setCardLoader(selectedPool.contractAddress)

            await genStake.estimateGas
                .claimReward({})
                .then((estimatedGasLimit) => {
                    return genStake
                        .claimReward({
                            value: null,
                            gasLimit: calculateGasMargin(estimatedGasLimit),
                        })
                        .then(async (response: TransactionResponse) => {
                            await response.wait().then(async (waitResponse) => {
                                console.log(waitResponse, "waitResponse")
                                const transactionReceipt = waitResponse as any
                                let receiptReturnValues = transactionReceipt.events[2].data
                                // console.log()
                                receiptReturnValues = parseInt(String(receiptReturnValues), 16) // convert hex to decimal
                                receiptReturnValues = etherFromWei(noExponents(receiptReturnValues)) // convert decimal (wei) to ether
                                console.log(receiptReturnValues, "receiptReturnValues")

                                const sendObj = {
                                    contractAddress: selectedPool.contractAddress,
                                    walletAddress: selectedAccount,
                                    returnValues: receiptReturnValues
                                }

                                const response = await axios.post(`${apiBaseUrl}/api/v1/stake/claim`, sendObj)
                                console.log(response.data)
                                const updatedUserStake = await getInitialValue(contractInstance, selectedPool)
                                console.log(updatedUserStake, "updatedUserStake")
                                const updatedGsContracts = [...gsContract]
                                updatedGsContracts[index as any] = updatedUserStake
                                setGsContract(updatedGsContracts)

                            }).catch(err => console.log(err, "Error in genToken methods"))
                        })
                })
            setCardLoader('')
        } catch (ex) {
            console.log(ex, "Error in onClickClaimReward")
            setCardLoader('')
        }
    }

    const onClickClaimWithdraw = async (index: any) => {
        try {
            const { selectedPool } = findStakeContractByIndex(index)
            console.log(selectedPool.withdrawAmount, "selectedPool.withdrawAmount")
            if (selectedPool.withdrawAmount === 0) return
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId!, library!, selectedAccount!)
            setCardLoader(selectedPool.contractAddress)

            await genStake.estimateGas
                .claimAndWithdrawAll({})
                .then((estimatedGasLimit) => {
                    return genStake
                        .claimAndWithdrawAll({
                            value: null,
                            gasLimit: calculateGasMargin(estimatedGasLimit),
                        })
                        .then(async (response: TransactionResponse) => {
                            await response.wait().then(async waitResponse => {
                                console.log(waitResponse, "waitResponse")
                                const transactionReceipt = waitResponse as any
                                let receiptReturnValues = transactionReceipt.events[3].data

                                receiptReturnValues = parseInt(String(receiptReturnValues), 16) // convert hex to decimal
                                receiptReturnValues = etherFromWei(noExponents(receiptReturnValues)) // convert decimal (wei) to ether
                                console.log(receiptReturnValues, "receiptReturnValues")
                                const sendObj = {
                                    contractAddress: selectedPool.contractAddress,
                                    walletAddress: selectedAccount,
                                    returnValues: receiptReturnValues
                                }
                                const response = await axios.post(`${apiBaseUrl}/api/v1/stake/withdraw`, sendObj)
                                console.log(response.data)
                                const updatedUserStake = await getInitialValue(contractInstance, selectedPool)
                                console.log(updatedUserStake, "updatedUserStake")
                                const updatedGsContracts = [...gsContract]
                                updatedGsContracts[index as any] = updatedUserStake
                                setGsContract(updatedGsContracts)
                            }).catch(err => console.log(err, "Error in genToken methods"))
                        })
                })
            setCardLoader('')
        } catch (ex) {
            console.log(ex, "Error in onClickClaimWithdraw")
            setCardLoader('')
        }
    }

    const onClickApprove = async (index: any) => {
        try {
            const { selectedPool } = findStakeContractByIndex(index)
            // const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId!, library!, selectedAccount!)
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genToken = getGenTokenContract(String(selectedPool.stakeTokenContract), chainId!, library!, selectedAccount!)

            setCardLoader(selectedPool.contractAddress)
            const args = [
                selectedPool.contractAddress,
                (String(etherToWei(208969354)))
            ]
            await genToken.estimateGas
                .approve(...args, {})
                .then((estimatedGasLimit) => {
                    return genToken
                        .approve(...args, {
                            value: null,
                            gasLimit: calculateGasMargin(estimatedGasLimit),
                        })
                        .then(async (response: TransactionResponse) => {
                            await response.wait().then(async waitResponse => {
                                console.log(waitResponse, "waitResponse")
                                const sendObj = {
                                    contractAddress: selectedPool.contractAddress,
                                    amount: 0,
                                    walletAddress: selectedAccount
                                }
                                await axios.post(`${apiBaseUrl}/api/v1/stake/update`, sendObj)
                                const updatedUserStake = await getInitialValue(contractInstance, selectedPool)
                                console.log(updatedUserStake, "updatedUserStake")
                                const updatedGsContracts = [...gsContract]
                                updatedGsContracts[index as any] = updatedUserStake
                                setGsContract(updatedGsContracts)
                            }).catch(err => console.log(err, "Error in genToken methods"))
                        })
                })
            setCardLoader('')
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setCardLoader('')
        }
    }

    const getContractsOfWalletAddress = async (contracts: any) => {
        const stringTypeContracts = contracts.map((item: any) => item.contractAddress).join(',')
        const response = await axios.get(`${apiBaseUrl}/api/v1/stake`, { params: { contractAddress: stringTypeContracts, walletAddress: selectedAccount || "0xfEFa30Dec275Db4C056fF66F7dbC65e42901343a" } })
        return response.data.values || []
    }

    const onCloseModal = () => {
        setModalOpen({
            open: false,
            message: ''
        })
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div className="loading-wrapper">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                </div>
            </div>
        )
    }

    if (gsContract.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <h2 style={{ color: "#000" }}>No Live Stake available on this network</h2>
            </div>
        )
    }

    return (
        <div className="claim-card">
            {cardLoader ? <div className="disable-page-loading"></div> : null}
            {gsContract.map((cardDetails: IGsContract, index: number) => {
                return <ClaimCard
                    key={index}
                    index={index}
                    accessPool={accessPool}
                    gstoUsd={gstoUsd}
                    cardDetails={cardDetails}
                    cardLoader={cardLoader}
                    onClickStake={onClickStake}
                    onClickWithdraw={onClickWithdraw}
                    onChangeInputValue={onChangeInputValue}
                    onClickStakeMax={onClickStakeMax}
                    onClickWithdrawMax={onClickWithdrawMax}
                    onClickClaimReward={onClickClaimReward}
                    onClickClaimWithdraw={onClickClaimWithdraw}
                    onClickApprove={onClickApprove}
                />
            })}
            <InfoModal
                open={modalOpen.open}
                message={modalOpen.message}
                goBack={onCloseModal}
            />
        </div>
    )
}