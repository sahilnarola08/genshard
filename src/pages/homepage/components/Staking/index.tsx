import { useState, useMemo, useEffect } from "react"
import "./style.sass"
import ReactSlider from "react-slick";
import { useWeb3Contract, useWeb3FromWei, useWeb3ToWei } from "../../../../hooks/useContract";
import { useActiveWeb3React } from "../../../../hooks/web3";
import Button from "../../../../shared/components/buttons";
import CustomModal from "../../../../shared/components/CustomModal";
import { useWalletModalToggle } from "../../../../state/application/hooks";
import { calculateGasMargin, getGenGSKContract, getGenPadStakingContract, valueToTokenDecimal } from "../../../../utils";
import Progressbar from "../ProgressBar";
import StakeCalculator from "../StakeCalculator";
import { abi as GEN_GSK_ABI } from "../../../../contracts/GenGsk.json"
import { abi as GET_PAD_STAKE_ABI } from "../../../../contracts/GenpadStaking.json"
import { PANCAKESWAP_REDIRECT_URL, DEFAULT_APPROVE_VALUE, GENPAD_STAKING_ADDRESS, GENPAD_STAKING_TOKEN_ADDRESS, GS_TOKEN_VALUE_TO_USD_URL } from "../../../../constants";
import { AppState } from "../../../../state";
import { useSelector } from "react-redux";
import { TransactionResponse } from "@ethersproject/providers";
import moment from "moment";
import axios from "axios"
import StakeBg from '../../../../images/staking/staking-bg-img.svg';
import SentnlLogo from '../../../../images/staking/sentnl-logo.svg';
import moneyBag from '../../../../images/staking/money-bag.svg';
import stakingTicket from '../../../../images/staking/staking-ticket.svg';
import getMorIicketImg from '../../../../images/staking/get-mor-ticket-img.svg';
import exelerateProjectImg from '../../../../images/staking/exelerate-project-img.svg';
import explorEcosystemImg from '../../../../images/staking/explor-ecosystem-img.svg';
import checkIdoImg from '../../../../images/staking/check-ido-img.svg';
import partnerImg from '../../../../images/staking/partner-img.svg';
import clelebrateIcon from "../../../../images/lounchpad/celebrate-icon.svg";
import LevelImg from '../../../../images/staking/level-img.svg';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import Footercmp from "../../../../shared/components/footercmp/footercmp";
import SimilarProjectSlider from "../../../upcomingproject/components/similar-project-slider-comp/similar-project-slider";
import Stakingtable from "./components/staking table/staking-table";

const slickSampleImages = [
    {
        url: 'https://i.picsum.photos/id/929/536/354.jpg?hmac=6-9nWH5utY9SvvzHQ6sNvHDu2aTIBBMby0SYzOcAj-g'
    },
    {
        url: 'https://i.picsum.photos/id/354/536/354.jpg?hmac=Cg_lBMyZ3vSaPBHfHNmQWwyExzUML5XBp2wdgD47crA'
    },
    {
        url: 'https://i.picsum.photos/id/277/536/354.jpg?hmac=xH1eLTnydQBJjBRiTDaKbklGUBnHcO63i5jsC6aqoL8'
    },
    {
        url: 'https://i.picsum.photos/id/398/536/354.jpg?hmac=3QyV-PACx18kZX7AqRy4b9jJuXs67SIYPsGkpYVFGqc'
    },
]

const estimatedAPYByTierId: any = {
    0: 10,
    1: 20,
    2: 30,
    3: 40
}

export const aGSInfoByTotalaGs = [
    {
        startName: '',
        endName: 'Silver Tier',
        agsMin: 0,
        agsMax: 2000,
        color: '#c3c3c3'
    },
    {
        startName: 'Silver Tier',
        endName: 'Pink Tier',
        agsMin: 2000,
        agsMax: 7500,
        color: '#c3c3c3'
    },
    {
        startName: 'Pink Tier',
        endName: 'Gold Tier',
        agsMin: 7500,
        agsMax: 15000,
        color: '#f165ff'
    },
    {
        startName: 'Gold Tier',
        endName: 'Black Tier',
        agsMin: 15000,
        agsMax: 30000,
        color: '#d2af00'
    },
    {
        startName: 'Black Tier',
        endName: '',
        agsMin: 30000,
        agsMax: Infinity,
        color: '#000000'
    },
]

const approveValue = DEFAULT_APPROVE_VALUE || ""

enum BUTTON_LABELS {
    CONNECT_WALLET = 'CONNECT WALLET',
    APPROVE = "APPROVE",
    STAKE = "STAKE",
}


function GenpadStaking() {

    // states
    const [currentValue, setCurrentValue] = useState(1)
    const [openModal, setOpenModal] = useState(false)
    const [congratulationsPart, setCongratulationsPart] = useState(false)
    const [buttonLabel, setButtonLabel] = useState<BUTTON_LABELS>(BUTTON_LABELS.CONNECT_WALLET)
    const [stakeInfo, setStakeInfo] = useState<any>({})
    const [balance, setBalance] = useState<any>(0)
    const [inputBalance, setInputBalance] = useState<any>('')
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const [selectedDurationTier, setSelectedDurationTier] = useState<any>(null)

    const toggleWalletModal = useWalletModalToggle()
    const etherFromWei = useWeb3FromWei()
    const etherToWei = useWeb3ToWei()
    const { account, chainId, library } = useActiveWeb3React()
    const network = useSelector((state: AppState) => state.application.network)

    const [selectedMenu, setselectedMenu] = useState("Stake");
    const [projectMenu, setProjectMenu] = useState(["Stake"]);

    let tokenContract: any = null;
    let getTokenBscAbi = useWeb3Contract(GEN_GSK_ABI)
    let getTokenAbi = useWeb3Contract(GEN_GSK_ABI)
    const genpadStakeContract = useWeb3Contract(GET_PAD_STAKE_ABI)

    if (Number(chainId) === 4 || Number(chainId) === 56) {
        tokenContract = getTokenBscAbi
    } else {
        tokenContract = getTokenAbi
    }

    let contractAddress = GENPAD_STAKING_ADDRESS[4]
    let tokenAddress = GENPAD_STAKING_TOKEN_ADDRESS[4]

    if (Number(chainId) === 97) {
        contractAddress = GENPAD_STAKING_ADDRESS[97]
        tokenAddress = GENPAD_STAKING_TOKEN_ADDRESS[97]
    }
    useEffect(() => {
        if (projectMenu.length < 2) {
            setProjectMenu([...projectMenu, "Leaderboard"])
        }
    }, [selectedMenu])



    useEffect(() => {
        gsToUsdValue()
        if (account && chainId && network && library) {
            onInitialSetUp()
            setOpenModal(false)
        }
    }, [account, chainId, network, library])

    const onInitialSetUp = async () => {
        try {
            setIsLoading(true)
            const combinedResponse = await Promise.all([
                checkIfApproved(),
                onFetchUserbalance(),
                onGetStakeInfo(),
                onGetStakeInfoTotalReward(),
                stakeInfoProtocol(),
                getTokenDecimalValue()
            ])
            const [isApproved, userbalance, stakeInfo, stakeTotalReward, rewardAndAgsValue, tokenDecimal] = combinedResponse

            const { ags = "0", amount = "0", id = "0", startTime = "0", endTime = "", since = "" } = stakeInfo
            // console.log({ rewardAndAgsValue, tokenDecimal })
            // const durationByTierId = await onGetStakesDetailsByTierId(Number(id))
            // const { duration = '' } = durationByTierId
            // const totalTime = moment().unix() - Number(Number(startTime) - Number(duration))
            setStakeInfo({
                totalaGs: Number(etherFromWei(ags)),
                stakedAmount: valueToTokenDecimal(amount, tokenDecimal),
                tier: Number(id),
                startTime: Number(startTime),
                endTime: Number(endTime),
                // duration,
                // totalTime,
                stakeTotalReward: Number(stakeTotalReward),
                rewardAndAgsValue,
                tokenDecimal
            })
            setSelectedDurationTier(Number(id))
            if (!account) setButtonLabel(BUTTON_LABELS.CONNECT_WALLET)
            else if (!Number(isApproved)) setButtonLabel(BUTTON_LABELS.APPROVE)
            else setButtonLabel(BUTTON_LABELS.STAKE)
            setIsLoading(false)
            setInputBalance(0)
        } catch (ex: any) {
            setIsLoading(false)
            console.log(ex.message, 'Error in onInitialSetUp')
        }
    }

    const onClickSubmit = () => {
        switch (buttonLabel) {
            case BUTTON_LABELS.CONNECT_WALLET: return toggleWalletModal()
            case BUTTON_LABELS.APPROVE: return onClickApprove()
            case BUTTON_LABELS.STAKE: return setOpenModal(true)
            default: return
        }
    }

    const onGetStakesDetailsByTierId = async (tierId: Number) => {
        try {
            console.log(contractAddress, tierId, "contractAddress")
            return await genpadStakeContract(contractAddress).methods.stakes(tierId).call({ from: account })
        } catch (ex) {
            console.log(ex, 'Error in onGetStakesDetailsByTierId')
            return {}
        }
    }

    const stakeInfoProtocol = async () => {
        try {
            return await genpadStakeContract(contractAddress).methods.stakeInfoProtocol().call()
        } catch (ex) {
            console.log(ex, 'Error in stakeInfoProtocol')
            return {}
        }
    }

    const onGetStakeInfo = async () => {
        try {
            return await genpadStakeContract(contractAddress).methods.stakeInfo(account!).call()
        } catch (ex) {
            console.log(ex, 'Error in onGetStakeInfo')
            return {}
        }
    }

    const onGetStakeInfoTotalReward = async () => {
        try {
            let totalRewards = await genpadStakeContract(contractAddress).methods.stakeInfo_totalReward(account!).call()
            totalRewards = Number(etherFromWei(totalRewards))
            return totalRewards
        } catch (ex) {
            console.log(ex, 'Error in onGetStakeInfoTotalReward')
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

    const getTokenDecimalValue = async () => {
        try {
            return Number(await tokenContract(tokenAddress).methods.decimals().call())
        } catch (ex) {
            return 0
        }
    }

    const onFetchUserbalance = async () => {
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
            const genPadStaking = getGenPadStakingContract(contractAddress, chainId!, library!, account!)
            setIsLoading(true)
            const rewardMethod = isStakeEnded ? "claimAndWithdrawAll" : "claimReward"
            const args = [] as any
            const estimatedGasLimit = await genPadStaking.estimateGas[rewardMethod](...args, {})
            const transactionResponse: TransactionResponse = await genPadStaking[rewardMethod](...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await onInitialSetUp()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setIsLoading(false)
        }
    }

    const onClickStake = async () => {
        try {
            if (selectedDurationTier === null || !inputBalance) return
            const genPadStaking = getGenPadStakingContract(contractAddress, chainId!, library!, account!)
            setIsLoading(true)
            const args = [etherToWei(String(inputBalance)), selectedDurationTier]
            const estimatedGasLimit = await genPadStaking.estimateGas.stake(...args, {})
            const transactionResponse: TransactionResponse = await genPadStaking.stake(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            await transactionResponse.wait()
            await onInitialSetUp()
            setIsLoading(false)
            setOpenModal(false)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setIsLoading(false)
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
            await onInitialSetUp()
            setIsLoading(false)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setIsLoading(false)
        }
    }

    const onClickMax = () => {
        setInputBalance(balance)
    }

    const gsToUsdValue = async () => {
        try {
            const response = await axios.get(GS_TOKEN_VALUE_TO_USD_URL)
            setCurrentValue((response.data["genesis-shards"] && response.data["genesis-shards"]["usd"]) || 1)
        } catch (ex) {
            console.log(ex, 'Error in gstoUsd')
        }
    }

    const { totalaGs = '', stakedAmount = '', tier = "0", startTime = '', endTime = '', stakeTotalReward = '', rewardAndAgsValue } = stakeInfo

    const totalGSKstaked = Number(stakeTotalReward / 2).toFixed(2)

    const totalRewardInDollar = totalaGs * currentValue
    let remainingTime = ''

    let duration = Number(endTime) - moment().unix()

    let minutes = Math.floor(Number(duration) / 60)
    let hours = Math.floor(Number(duration) / 3600)
    let days = Math.floor(Number(duration) / 86400)

    if (days > 0) remainingTime = `${days} Days`
    else if (days <= 0 && hours > 0) remainingTime = `${hours} Hrs`
    else if (hours <= 0 && minutes > 0) remainingTime = `${minutes} min`
    else remainingTime = `0 min`

    let isStakeEnded = Number(endTime) < moment().unix()

    const selectedaGsInfo = useMemo(() => {
        let findaGs = aGSInfoByTotalaGs.find(agsInfo => (Number(totalaGs) >= agsInfo.agsMin) && (Number(totalaGs) < agsInfo.agsMax))
        return findaGs
    }, [totalaGs])

    const tierProgress = useMemo(() => {
        if (!selectedaGsInfo) return 0
        const { agsMin = 0, agsMax = 0 } = selectedaGsInfo
        if (agsMax === Infinity) return 100
        return Math.round((Number(totalaGs) - agsMin) / (agsMax - agsMin)) * 100
    }, [selectedaGsInfo, totalaGs])

    const [screenSize, setScreenSize] = useState(getCurrentDimension());

    function getCurrentDimension() {
        return {
            width: window.innerWidth,
        }
    }

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])


    return (
        <div className="genpad-staking-container">
            {isLoading ? <div className="single-card-loader">
                <img
                    className="loading-icon"
                    src="/images/icons/loading.svg"
                    alt="loading"
                />
            </div> : null}
            {/* <h1 className="staking-heading">STAKING</h1> */}

            {/* <div className="staking-item">
                <div className="staking-heading-item">
                    <Button className="outline--highlight active">GS Staking</Button>
                </div>

                <div className="staking-details-item">
                    <div className="staking-detail">
                        <div>
                            <div className="d-flex-space tier-progress-title">
                                <span>{selectedaGsInfo?.startName}</span>
                                <span>{selectedaGsInfo?.endName}</span>
                            </div>
                            <Progressbar progress={tierProgress} />
                        </div>
                        <h1>{totalaGs || "0"} aGS</h1>
                        <div className="d-flex-space project-numbers">
                            <span>Estimated APY</span>
                            <span>{estimatedAPYByTierId[tier] || 0}%</span>
                        </div>
                        <div className="d-flex-space project-numbers">
                            <span>Total Staked</span>
                            <span>GS {Number(stakedAmount).toFixed(2)}</span>
                        </div>
                        <div className="d-flex-space project-numbers">
                            <span>Total Value</span>
                            <span>${totalRewardInDollar.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="staking-assets">
                        <StakingSlider />
                    </div>
                </div>

                {Number(stakeTotalReward) > 0 ? <div className="pending-rewards-item">
                    <span>Pending Rewards</span>
                    <h1>{totalGSKstaked}<span>&nbsp;GS&nbsp;</span>&nbsp;{" & "}&nbsp;{totalGSKstaked}&nbsp;<span>&nbsp;GSK</span></h1>
                    <Button className="outline--highlight active" onClick={() => onClickClaimRewards(isStakeEnded)}>{`Claim ${isStakeEnded ? 'Withdraw' : ''}`}</Button>
                </div> : null}

                <div className="connect-wallet-item">
                    <Button className="outline--highlight active" onClick={onClickSubmit}>{buttonLabel}</Button>
                </div>

                <div className='d-flex-space lock-in-item'>
                    <span>
                        Lock Tokens for
                    </span>
                    <span>
                        {remainingTime}
                    </span>
                </div>

                <div className='get-gs-item'>
                    <a href={PANCAKESWAP_REDIRECT_URL} target="_blank" rel="noreferrer">Get GS <span>{"->"}</span></a>
                </div>
            </div> */}

            <div className="staking-sec">
                {/* <img src={StakeBg} className="stake-bg-img img-fluid position-absolute start-0" alt="" /> */}
                <div className="container container-maxwidth position-relative bg-index">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="text-start">
                                <p className="back-btn">HOME <i className="ri-arrow-right-s-line"></i> stake</p>
                                <h2 className="heading-new-2 mt-lg-5">Stake</h2>
                                <p className="heading-new-5 my-lg-4 mt-lg-4 mt-3 ">Stake your $GS to gain access to some of the top-tier IDOs</p>
                                <p className="paragraph-new fw-lighter">Exclusive IDOs <br />
                                    Stake a minimum of 2500 GS tokens to get access to exclusive IDOs - the higher you stake, the higher your allocation
                                    <br />
                                    <br />
                                    Earn High Rewards <br />
                                    Get disproportionate gains by increasing your staked amount and lock-in duration
                                </p>
                                <div className="chain-btn mt-3 d-lg-block d-md-block d-none">
                                    <p className="paragraph-new fw-bold">You are connected to the Chain</p>
                                    <button onClick={() => setOpenModal(true)}>Network Connected</button>
                                </div>
                                <div className="Performance-sec mt-lg-5 mt-md-4 mt-3">
                                    <p className="heading-new-5 d-lg-block d-md-block d-none">Past Performance</p>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-6 col-6">
                                            <div className="Performance-card mb-lg-3 mb-3 ">
                                                <p className="Performance-number">75M</p>
                                                <p className="paragraph-new-small mb-0">Total GS Staked</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-6 col-6">
                                            <div className="Performance-card mb-lg-3 mb-3">
                                                <p className="Performance-number">720</p>
                                                <p className="paragraph-new-small mb-0">Avg. Locked Days</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-6 col-12">
                                            <div className="Performance-card mb-lg-3 mb-3">
                                                <p className="Performance-number">7M</p>
                                                <p className="paragraph-new-small mb-0">GS Earned by Stakers</p>
                                            </div>
                                        </div>
                                        <div className="platform-btn mt-4 d-lg-block d-none">
                                            <p className="py-0 m-0">Platform Audited by <img src={SentnlLogo} className='img-fluid ms-1' alt="" /></p>
                                        </div>
                                        {/* <div className="Performance-logo mt-5">
                                            <p className="py-2 m-0">Platform Audited by <img src={SentnlLogo} alt="" /></p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="staking-detais-part">
                                {screenSize && screenSize.width < 992 &&
                                    <div className="stake-top-info">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-4 col-md-4 col-6">
                                                <div className="stake-top-info-box">
                                                    <img src={moneyBag} className="img-fluid" alt="" />
                                                    <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Stake at least 10,000 GS to be eligible for Symbiote Private IDOs</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-6 ">
                                                <div className="stake-top-info-box">
                                                    <img src={stakingTicket} className="img-fluid" alt="" />
                                                    <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Win allocation tickets based your staked GS % in the total pool</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-6 mt-lg-0 mt-mb-0 mt-3">
                                                <div className="stake-top-info-box">
                                                    <img src={getMorIicketImg} className="img-fluid" alt="" />
                                                    <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Stake more to get more allocation tickets in your favourite IDOs!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="stakingdata my-lg-5 my-md-4 my-3 mb-lg-5 mb-4">
                                    {projectMenu.map((menu: any, id: number) => (
                                        <button key={id}
                                            className={selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "}
                                            onClick={() => setselectedMenu(menu)}
                                        >
                                            {menu}
                                        </button>
                                    ))}
                                </div>
                                {selectedMenu === "Stake" &&
                                    <>
                                        {screenSize && screenSize.width > 992 &&
                                            <div className="stake-top-info">
                                                <div className="row justify-content-center">
                                                    <div className="col-lg-4 col-md-4 col-6">
                                                        <div className="stake-top-info-box">
                                                            <img src={moneyBag} className="img-fluid" alt="" />
                                                            <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Stake at least 10,000 GS to be eligible for Symbiote Private IDOs</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-6 ">
                                                        <div className="stake-top-info-box">
                                                            <img src={stakingTicket} className="img-fluid" alt="" />
                                                            <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Win allocation tickets based your staked GS % in the total pool</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-6 mt-lg-0 mt-mb-0 mt-3">
                                                        <div className="stake-top-info-box">
                                                            <img src={getMorIicketImg} className="img-fluid" alt="" />
                                                            <p className="paragraph-new fw-bold mt-lg-4 mt-md-4 mt-3 mb-lg-0 mb-md-0 mb-3 ">Stake more to get more allocation tickets in your favourite IDOs!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="stake-key-info">
                                            <div className="boxes row">
                                                <div className="col-lg-3 col-md-3 col-12">
                                                    <h2 className="heading-new-2 mb-lg-0 mb-md-0 mb-3">Key <br /> Info</h2>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-6">
                                                    <div className="key-box background-primary mb-lg-0 mb-md-0 mb-3">
                                                        <p className="paragraph-new mb-3">Pending <br /> Rewards</p>
                                                        <h4 className="heading-new-4">$145,000</h4>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-6">
                                                    <div className="key-box background-local mb-lg-0 mb-md-0 mb-3">
                                                        <p className="paragraph-new mb-3">Current <br /> Staked Amount</p>
                                                        <h4 className="heading-new-4">$145,000</h4>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-6">
                                                    <div className="key-box background-yellow mb-lg-0 mb-md-0 mb-3">
                                                        <p className="paragraph-new mb-3">Staking <br /> Duration Left </p>
                                                        <h4 className="heading-new-4 color-yellow">$145,000</h4>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-6">
                                                    <p className="paragraph-new-medium fw-bold mt-lg-4 mt-md-3 mt-0 mb-lg-3 mb-md-2 mb-0">Locked until : 12 May 2023 1PM UTC</p>
                                                    <p className="paragraph-new-medium fw-lighter mb-0" style={{ color: "#E49F3A" }}>Your stake duration is about to expire, stake again to get uninterrupted access to private IDOs</p>
                                                </div>
                                            </div>
                                        </div>
                                        {!congratulationsPart &&
                                            <>
                                                <StakeCalculator
                                                    onClose={() => setOpenModal(false)}
                                                    onClickStake={onClickStake}
                                                    balance={balance}
                                                    stakeInfo={stakeInfo}
                                                    currentValue={currentValue}
                                                    inputBalance={inputBalance}
                                                    selectedDurationTier={selectedDurationTier}
                                                    setSelectedDurationTier={setSelectedDurationTier}
                                                    setInputBalance={setInputBalance}
                                                    onClickMax={onClickMax}
                                                    setCongratulationsPart={setCongratulationsPart}
                                                />
                                            </>
                                        }
                                        {/* <div className="d-flex justify-content-between">
                                            <div className="Currently-stake-btn d-flex">
                                                <p>Currently Staked Amount:</p>
                                                <button>$282,292,229</button>
                                            </div>
                                            <div className="Currently-stake-btn d-flex">
                                                <p>Time Left:</p>
                                                <button>1d 21h 22m</button>
                                            </div>
                                        </div>
                                        <div className="level-sec mt-lg-5">
                                            <h3>Levels</h3>
                                            <div className="d-flex mt-4 justify-content-between">
                                                <div className="black-level">
                                                    <div className="level-profile"></div>
                                                    <p className="my-3">Black</p>
                                                    <p className="m-0">36,000 GS <br /> 6x allocation</p>
                                                </div>
                                                <div>
                                                    <img src={LevelImg} className="mt-2" alt="" />
                                                </div>
                                                <div className="black-level">
                                                    <div className="level-profile" style={{ background: "#F7CD46" }}></div>
                                                    <p className="my-3">Gold</p>
                                                    <p className="m-0">18,000 GS <br /> 3x allocation</p>
                                                </div>
                                                <div>
                                                    <img src={LevelImg} className="mt-2" alt="" />
                                                </div>
                                                <div className="black-level">
                                                    <div className="level-profile" style={{ background: "#FF00B8" }}></div>
                                                    <p className="my-3">Pink</p>
                                                    <p className="m-0">6000 GS <br /> 2x allocation</p>
                                                </div>
                                                <div>
                                                    <img src={LevelImg} className="mt-2" alt="" />
                                                </div>
                                                <div className="black-level">
                                                    <div className="level-profile" style={{ background: "#D6D6D6" }}></div>
                                                    <p className="my-3">Silver</p>
                                                    <p className="m-0">3000 GS <br /> 1x allocation</p>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="Tier-sec mt-5">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <CircularProgressbar
                                                    value={tierProgress}
                                                    text={selectedaGsInfo?.endName}
                                                    strokeWidth={5}
                                                    styles={buildStyles({
                                                        textColor: "white",
                                                        pathColor: "#65DB6A",
                                                    })}
                                                    className="Tier-circle"
                                                />
                                                <div className="text-start tier-gs">
                                                    <p className="gs-1">80 GS</p>
                                                    <p className="gs-2">140 GS remaining to <br /> complete Tier 1</p>
                                                </div>
                                                <div className="total-stake">
                                                    <p className="m-0 Estimated">Estimated APY</p>
                                                    <p className="my-0 text-end">20%</p>
                                                    <p className="m-0 Estimated">Total Staked</p>
                                                    <p className="my-0 text-end">GSK 244,484,229</p>
                                                    <p className="m-0 Estimated">Total Value</p>
                                                    <p className="my-0 text-end">$ 573,594.449322</p>
                                                </div>
                                            </div>
                                        </div>  */}

                                        {/* <div className="Pending-Rewards-sec mt-5">
                                            <div className="d-flex Pending-sec">
                                                <div className="Pending">Pending Rewards</div>
                                                <div className="d-flex justify-content-between Pending-count">
                                                    <p>3392 GS</p>
                                                    <p className="mx-lg-4">&</p>
                                                    <p>3392 GS</p>
                                                </div>
                                                <div className="Pending-btn">
                                                    <button>Claim</button>
                                                </div>
                                            </div>
                                        </div> 

                                                <div className="d-flex justify-content-center lock-tokens-sec my-4">
                                            <p >Lock Tokens for</p>
                                            <p>XX Days</p>
                                        </div>
                                        <button className="stake-btn mb-4">Stake</button>
                                        <div className='get-gs-item'>
                                            <a href={PANCAKESWAP_REDIRECT_URL} target="_blank" rel="noreferrer">Get GS <i className="ri-login-box-line"></i></a>
                                        </div> */}

                                        {congratulationsPart &&
                                            <>
                                                <div className="congrets-top-part mt-5">
                                                    <div className="">
                                                        <img src={clelebrateIcon} className="img-fluid" alt="" />
                                                    </div>
                                                    <h3 className="heading-new-3">Congratulations <br /> on your staking</h3>
                                                </div>
                                                <SimilarProjectSlider />
                                            </>
                                        }
                                    </>
                                }
                                {selectedMenu === "Leaderboard" &&
                                    <>
                                        <Stakingtable />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="other-services mt-lg-5 mt-4">
                        <h4 className="heading-new-3 text-start mb-4 ">Other services on Symbiote</h4>
                        <div className="row">
                            <div className="col-lg-3 col-6 mb-lg-0 mb-md-3 mb-3">
                                <div className="service-card">
                                    <div className="card-img">
                                        <img src={exelerateProjectImg} className="img-fluid" alt="" />
                                    </div>
                                    <h4 className="heading-new-4 mt-4 mb-0">ACCELERATE<br />projects</h4>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6 mb-lg-0 mb-md-3 mb-3">
                                <div className="service-card">
                                    <div className="card-img">
                                        <img src={explorEcosystemImg} className="img-fluid" alt="" />
                                    </div>
                                    <h4 className="heading-new-4 mt-4 mb-0">Explore our<br />Ecosystem</h4>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6 mb-lg-0 mb-md-3 mb-3">
                                <div className="service-card">
                                    <div className="card-img">
                                        <img src={checkIdoImg} className="img-fluid" alt="" />
                                    </div>
                                    <h4 className="heading-new-4 mt-4 mb-0">Check out<br />our IDOs</h4>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6 mb-lg-0 mb-md-3 mb-3">
                                <div className="service-card">
                                    <div className="card-img">
                                        <img src={partnerImg} className="img-fluid" alt="" />
                                    </div>
                                    <h4 className="heading-new-4 mt-4 mb-0">Want to become<br />our Partner?</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footercmp />
            </div>
        </div>
    )
}

export default GenpadStaking

function StakingSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        width: 300,
        arrows: false,
        autoplay: false,
        beforeChange: (prev: any, next: any) => {
            setCurrentSlide(next)
        },
        appendDots: (dots: any) => (
            <div style={{ bottom: "-40px", left: "-17px" }}>
                <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
        customPaging: (i: any) => (
            <div
                style={{
                    width: '10px',
                    height: '10px',
                    border: '1px solid #117DCC',
                    borderRadius: '50%',
                    background: i === currentSlide ? "#117DCC" : ""
                }}
            />
        )
    };

    return <ReactSlider {...settings}>
        {
            slickSampleImages.map((image, index) => {
                return <div key={index} className="staking-assets-div">
                    <img src={image.url} alt="" />
                </div>
            })
        }
    </ReactSlider>
}