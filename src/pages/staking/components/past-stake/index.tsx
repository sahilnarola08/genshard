import { useState, useEffect, useCallback } from "react"
import './style.sass';
import { useWeb3Contract, useWeb3FromWei, useWeb3ToWei } from '../../../../hooks/useContract'
import { useActiveWeb3React } from "../../../../hooks/web3";
import moment from "moment"
import { IGsContract, IStakingProps } from "../../../../state/staking/types";
import axios from "axios"
import GEN_TOKEN_ABI from "../../../../constants/abis/erc20.json"
import { useSelector } from "react-redux";
import { AppState } from "../../../../state";
import { calculateGasMargin, getGenStakeContract, getGenTokenContract } from "../../../../utils";
import { TransactionResponse } from "@ethersproject/providers";
import { noExponents } from "../../staking.helpers";
import RetiredCard from "../retired-card";
import { abi as GEN_STAKE_ABI } from "../../../../contracts/GenStakes.json"

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

export default function LiveStake(props: IStakingProps) {

    const stakeContract = useWeb3Contract(GEN_STAKE_ABI)

    const network = useSelector((state: AppState) => state.application.network)
    const etherFromWei = useWeb3FromWei()
    const etherToWei = useWeb3ToWei()
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()

    const [gsContract, setGsContract] = useState<Array<IGsContract>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [cardLoader, setCardLoader] = useState<String>('')
    const [gstoUsd, setGstoUsd] = useState<number>(1)

    useEffect(() => {
        if (!library || !chainId || !selectedAccount) {
            alert('Connect metamask')
            return
        } else {
            fetchInitialData()
        }
    }, [selectedAccount, chainId, network])

    const fetchInitialData = useCallback(async () => {
        if (selectedAccount && chainId) {
            return await onFetchRequiredData()
        }
        return {}
    }, [selectedAccount, chainId, network])


    const gsToUsdValue = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=genesis-shards&vs_currencies=usd')
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
            // userContracts = userContracts.map((item: any) => item.contractAddress)
            await createContractInstance(userContracts, allContracts)
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onFetchRequiredData")
            setIsLoading(false)
        }
    }

    const createContractInstance = async (userContracts: any, allContracts: any) => {
        if (!library || !chainId || !selectedAccount) {
            alert('Connect metamask')
            return
        }
        let updatedGsContracts = [] as any
        for (let i = 0; i < allContracts.length; i++) {
            const contract = allContracts[i]
            const isContractExists = userContracts.find((item: any) => item.contractAddress === contract.contractAddress)
            if (!isContractExists) continue
            const contractInstance = stakeContract(contract.contractAddress as any)
            let contractResult = await getInitialValue(contractInstance, contract)
            updatedGsContracts.push(contractResult)
        }
        setGsContract(updatedGsContracts)
    }

    const getInitialValue = async (instance: any, mixedContract: any) => {
        let [endTime, totalStake, totalClaimable, totalWithdraw, totalBalance] = await Promise.all([
            instance.methods.poolExpirationPeriod().call(),
            instance.methods.totalGenisis_ShardsStaked().call(),
            instance.methods.stakeInfo_totalReward().call({ from: selectedAccount }),
            instance.methods.stakeInfo_totalAmount().call({ from: selectedAccount }),
            instance.methods.stakeInfo_totalBalance().call({ from: selectedAccount }),
            // instance.methods.maxGenisis_ShardsStaked().call(),
        ])

        endTime = Number(endTime) - moment().unix()
        let isPast = endTime < 0;
        let tvlAmount = String(etherFromWei(totalStake))
        let totalStakeProgress = Math.floor(Number(tvlAmount) / 12500)
        totalClaimable = parseFloat(Number(etherFromWei(totalClaimable)).toFixed(2))
        totalWithdraw = parseFloat(Number(etherFromWei(totalWithdraw)).toFixed(2))
        totalBalance = parseFloat(Number(etherFromWei(totalBalance)).toFixed(2))

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

        let isClaimed = true
        if (Number(totalWithdraw) > 0) isClaimed = false

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
            isApproved: true,
            contractAddress: mixedContract.contractAddress,
            stakeTokenContract: mixedContract.stakeTokenContract,
            isClaimed
        }
    }

    const getAllContracts = async (chainId: any) => {
        const response = await axios.get(`${apiBaseUrl}/api/v1/contract`, { params: { type: 'past', chainId, stakeType: 'staking' } })
        return response.data.values || []
        // createContractInstance(response.data.values)
    }

    const findStakeContractByIndex = (index: any) => {
        const indexedGsContract = gsContract[index]
        // const indexedContractInstance = contractInstance[index]
        return { selectedPool: indexedGsContract }
    }

    const onClickClaimWithdraw = async (index: any) => {
        try {
            if (!library || !chainId || !selectedAccount) {
                alert('Connect metamask')
                return
            }
            const { selectedPool } = findStakeContractByIndex(index)
            console.log(selectedPool.withdrawAmount, "selectedPool.withdrawAmount")
            if (selectedPool.withdrawAmount === 0) return
            const contractInstance = stakeContract(selectedPool.contractAddress as any)
            const genStake = getGenStakeContract(selectedPool.contractAddress as any, chainId, library, selectedAccount)
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

    const getContractsOfWalletAddress = async (contracts: any) => {
        const stringTypeContracts = contracts.map((item: any) => item.contractAddress).join(',')
        console.log(stringTypeContracts, "stringTypeContracts")
        const response = await axios.get(`${apiBaseUrl}/api/v1/stake`, { params: { contractAddress: stringTypeContracts, walletAddress: selectedAccount || "0xfEFa30Dec275Db4C056fF66F7dbC65e42901343a" } })
        return response.data.values || []
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
                <h2 style={{ color: "#000" }}>No Past Stake available on this network</h2>
            </div>
        )
    }

    return (
        <div className="claim-card">
            {gsContract.map((cardDetails: IGsContract, index: number) => {
                return <RetiredCard
                    key={index}
                    index={index}
                    gstoUsd={gstoUsd}
                    cardDetails={cardDetails}
                    cardLoader={cardLoader}
                    onClickClaimWithdraw={onClickClaimWithdraw}

                />
            })}
        </div>
    )
}

// 208969354 * 10^18 or (to wei)'