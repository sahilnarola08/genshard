import { TransactionResponse } from '@ethersproject/providers'
import { useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../../../hooks/web3'
import Button from "../../../../shared/components/buttons"
import Modal from "../../../../shared/components/modal"
import EndAdornmentInput from "../../../../shared/components/staking/EndAdornmentInput"
import { calculateGasMargin, getGenGSKContract, getGenGskSwapContract } from '../../../../utils'
import GskSwapConfirm from "./gsk-swap-modal"
import { abi as GEN_GSK_ABI } from "../../../../contracts/GenGsk.json"
import { abi as GEN_GSK_SWAP_ABI } from "../../../../contracts/GenGskSwap.json"
import "./style.sass"
import { useWeb3Contract, useWeb3FromWei, useWeb3ToWei } from '../../../../hooks/useContract'
import { AppState } from '../../../../state'
import { useSelector } from 'react-redux'
import arrowRight from "../../../../images/community/arrow-right-circle.svg"

const tokenAddress = "0x81ff4bbD38c8149A45F779838f6be4d99d714A88"
const contractAddress = "0x9238a48A83B788A1C009A5A8471a9FbDEd87F3A8"
const approveValue = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

const convertedGskPriceMap = [
    {
        start: 0.15,
        end: 0.30,
        valuePerGs: 25 // in percentage
    },
    {
        start: 0.30,
        end: 0.60,
        valuePerGs: 50 // in percentage
    },
    {
        start: 0.60,
        end: 1.25,
        valuePerGs: 75 // in percentage
    },
    {
        start: 1.25,
        end: 2.50,
        valuePerGs: 100 // in percentage
    },
    {
        start: 2.50,
        end: 100000,
        valuePerGs: 100 // in percentage
    },
]

export default function GskSwap() {

    const { account, chainId, library } = useActiveWeb3React()

    const [gskValue, setGskValue] = useState(0)
    const [gsPriceInUSD, setGsPriceInUSD] = useState<Number>(0)
    const [confirmModal, setConfirmModal] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isApproved, setIsApproved] = useState<Boolean>(false)

    const network = useSelector((state: AppState) => state.application.network)

    const etherToWei = useWeb3ToWei()
    const etherFromWei = useWeb3FromWei()
    const gskswapContract = useWeb3Contract(GEN_GSK_SWAP_ABI)
    let tokenContract: any = null;
    let getTokenBscAbi = useWeb3Contract(GEN_GSK_ABI)
    let getTokenAbi = useWeb3Contract(GEN_GSK_ABI)

    if (Number(chainId) === 4 || Number(chainId) === 56) {
        tokenContract = getTokenBscAbi
    } else {
        tokenContract = getTokenAbi
    }

    useEffect(() => {
        refreshContractDetails()
    }, [account, chainId, network])

    const refreshContractDetails = async () => {
        const gsPriceInUSD = await getGsToGskPrice()
        setGsPriceInUSD(Number(Number(gsPriceInUSD).toFixed(3)))

        const isApproved = await checkIfApproved()
        if (Number(isApproved)) {
            setIsApproved(true)
        }
    }

    const onClickGskMax = async () => {
        try {
            const balance = await tokenContract(tokenAddress).methods.balanceOf(account).call()
            return setGskValue(Number(etherFromWei(balance)))
        } catch (ex) {
            return setGskValue(0)
        }
    }

    const getGsToGskPrice = async () => {
        try {
            const contractInstance = gskswapContract(contractAddress)
            const priceValue = await contractInstance.methods.fetchPriceGsUsd_x(String('1000000000000000000')).call()
            return etherFromWei(priceValue)
        } catch (ex) {
            return 0
        }
    }

    const checkIfApproved = async () => {
        try {
            return await tokenContract(tokenAddress).methods.allowance(account, contractAddress).call()
        } catch (ex) {
            return 0
        }
    }

    const onClickApprove = async () => {
        try {
            const genToken = getGenGSKContract(tokenAddress, chainId!, library!, account!)
            setIsLoading(true)
            const args = [contractAddress, approveValue]
            const estimatedGasLimit = await genToken.estimateGas.approve(...args, {})
            const transactionResponse: TransactionResponse = await genToken.approve(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await refreshContractDetails()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setIsLoading(false)
        }
    }

    const onClickConfirmSwap = async () => {
        try {
            const genPlaceBid = getGenGskSwapContract(contractAddress, chainId!, library!, account!)
            setIsLoading(true)
            setConfirmModal(false)
            const args = [etherToWei(String(gskValue))]
            const estimatedGasLimit = await genPlaceBid.estimateGas.swapGskGS(...args, {})
            const transactionResponse: TransactionResponse = await genPlaceBid.swapGskGS(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await refreshContractDetails()
            setIsConfirmed(true)
            setConfirmModal(true)
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickConfirmSwap")
            setIsLoading(false)
        }
    }

    const onCloseModal = () => {
        setGskValue(0)
        setIsConfirmed(false)
        setConfirmModal(false)
    }

    const convertedGskPricePerGs = useMemo(() => {
        const findRange = convertedGskPriceMap.find(range => (range.start <= gsPriceInUSD && gsPriceInUSD <= range.end))
        if (findRange) {
            const weightPerGsk = 1 * findRange.valuePerGs / 100
            return weightPerGsk
        } else return 0.25
    }, [gsPriceInUSD])

    return (
        <div className="gsk-swap-container">
            {
                isLoading ? <div className='gsk-swap-container-loader'>
                    <div className="loading-wrapper">
                        <img
                            className="loading-icon"
                            src="/images/icons/loading.svg"
                            alt="loading"
                        />
                    </div>
                </div> : null
            }
            <div className="gsk-swap-item">
                <div className="swap-text-container">
                    <h1 className="">Swap your $GSK to earn $GS</h1>
                </div>
                <div className="swap-content-container">
                    <div className="swap-content-item">
                        <div className="swap-title" >
                            <h2>SWAP</h2>
                        </div>
                        <div className="horizontal-line"></div>
                        <div className="swap-input-container">
                            <EndAdornmentInput
                                value={gskValue || ''}
                                name="gskvalue"
                                onChange={(e: any) => setGskValue(e.target.value)}
                                placeholder="Enter Amount In GSK"
                                fullWidth
                                isMax
                                onClickMax={onClickGskMax}
                            />
                        </div>
                        <div className="down-arrow-circle">
                            <div className="down-arrow-img">
                                <img src={arrowRight} alt="" />
                            </div>
                        </div>

                        <div className="swap-input-container">
                            <EndAdornmentInput
                                value={convertedGskPricePerGs * gskValue || ''}
                                name="convertedGsValue"
                                placeholder="Converted Amount in GS"
                                disabled
                                fullWidth
                            />
                        </div>

                        <div className="price">
                            <div>Price: {convertedGskPricePerGs} GS Per GSK</div>
                        </div>
                        <div className="btn-wrapper">
                            <Button className="btn" onClick={() => {
                                if (!isApproved) onClickApprove()
                                else setConfirmModal(true)
                            }}>
                                {!isApproved ? 'APPROVE' : 'CONFIRM SWAP'}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
            <Modal
                isOpen={confirmModal}
                onClose={onCloseModal}
                kycChanges
            >
                <GskSwapConfirm
                    isConfirmed={isConfirmed}
                    gskValue={gskValue}
                    convertedGskPricePerGs={convertedGskPricePerGs}
                    onClickConfirmSwap={onClickConfirmSwap}
                    onCloseModal={onCloseModal}
                />
            </Modal>
        </div>
    )
}