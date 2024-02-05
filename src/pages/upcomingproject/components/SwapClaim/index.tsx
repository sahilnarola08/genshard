import moment from "moment";
import { Web3Provider } from '@ethersproject/providers'
import { useState, useEffect, useCallback } from "react";
import { timeline } from "../ProjectProfile";
import { abi as GEN_DEX_ABI } from "../../../../contracts/GenIDO.json"
import { abi as GEN_STACKING_CONTRACT_ABI } from "../../../../contracts/StakeTESTToken.json"
import { abi as USDT_ABI } from '../../../../contracts/USDT.json'
import { abi as GENNFT_ABI } from '../../../../contracts/GenNFT.json'
import { network, NetworkSymbol } from "../../../../../src/connectors"
import { ExternalLink } from '../../../../theme'

import "./style.sass"
import {
  useContractTicket,
  useGenFactory,
  useGenTicket,
  useWeb3Contract,
} from "../../../../hooks/useContract"
import { calculateGasMargin, getContract, getERC20Contract } from "../../../../utils";
import { useActiveWeb3React } from "../../../../hooks/web3";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { useAddPopup } from "../../../../state/application/hooks";
import { changeKYC } from "../../../../state/application/actions";
import { useApproveForGenPad } from "../../../../state/ticket/hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber, ethers, providers } from "ethers";
import { MaxUint256 } from '@ethersproject/constants'
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import LoaderComp from "../../../../shared/components/LoaderComponent";
//import {abi as ERC20_ABI} from '../../../../contracts/IERC20.json'
import { Contract } from "@ethersproject/contracts";
import { ERC20_ABI } from "../../../../constants/abis/erc20";
import { KYC_STATUS } from "../../../../state/application/reducer";
import axios from "axios";
import SnsWebSdk from "@sumsub/websdk/types/SnsWebSdk";
import { useDispatch } from "react-redux";
import { getApplyWhiteListData, applyForBuyAnAllocation } from "../API/ApiCall";
import clelebrateIcon from "../../../../images/lounchpad/celebrate-icon.svg";
import VoteProfile from "../../../../images/vote-profile-img.svg"
import binanceLogo from "../../../../images/binance-logo.svg"
import voteIcon from "../../../../images/vote-icon.svg"
import secureLock from "../../../../images/lounchpad/secure-lock.svg"
import ModelCard from "../../../homepage/components/GenPad/model-card/model-card";
import Footercmp from "../../../../shared/components/footercmp/footercmp";


var _ = require("lodash");

const SwapClaim = (selectedProjectData: any) => {
  console.log('selectedProjectDataselectedProjectData', selectedProjectData);
  const [congratulation, setCongratulation] = useState<boolean>(false);
  const [allocationValue, setAllocationValue] = useState<number>();
  const genDex = useWeb3Contract(GEN_DEX_ABI)
  const genToken = useWeb3Contract(ERC20_ABI)
  const genDexStacking = useWeb3Contract(GEN_STACKING_CONTRACT_ABI, "staking")
  const { account, chainId, library } = useActiveWeb3React()
  const genDexAddress = selectedProjectData?.data?.data?.dexAddress;
  const addErrorPopup = useAddPopup();
  const checkUserApproveGenpad = useApproveForGenPad()
  const [msg, setMsg] = useState("Please Wait")
  const addTransaction = useTransactionAdder()
  const [isLoading, setIsLoading] = useState(false)
  const [isAllowedForAllocation, setIsAllowedForAllocation] = useState(false)
  const [isProjectActive, setIsProjectActive] = useState(false)
  const [tge, setTge] = useState(0);
  const [tokenAllocationBought, setTokenAllocationBought] = useState(0);
  const [position, setPosition] = useState(0);
  const [stackingAmount, setStackingAmount] = useState(0);
  const [maxAllocPerUserPerTier, setMaxAllocPerUserPerTier] = useState(0);
  const [lowAllocPerUserPerTier, setLowAllocPerUserPerTier] = useState(0);
  const [tierLevel, setTierLevel] = useState(0);
  const [isSuccessfullyClaim, setIsSuccessfullyClaim] = useState(false);
  const [getWinnerCounts, setGetWinnerCounts] = useState(0);
  const [availableBalanceBUSD, setAvailableBalanceBUSD] = useState(0);
  const [availableBalanceSymbol, setAvailableBalanceSymbol] = useState('');
  const [getAirDoppedInfoIndex, setGetAirDoppedInfoIndex] = useState(0);
  const [getAirDoppedInfoIsAirDopped, setGetAirDoppedInfoIsAirDopped] = useState(false);
  const KYC_BASE = process.env.REACT_APP_KYC_ENDPOINT!
  const dispatch = useDispatch();
  const [kycStatus, setKYCStatus] = useState<KYC_STATUS>(KYC_STATUS.NOT_SET)
  const [accessToken, setAccessToken] = useState<string>()

  let getUSDTDecimals = 0
  let getTokenDecimals = 0
  let underlyingToken = ''

  const getTGE = async () => {
    setIsLoading(true);
    console.log("TGGGG Self Enter", genDexAddress, account);
    if (!genDexAddress || account === undefined) {
      setIsLoading(false);
      return
    }
    try {
      console.log("TGGGG come enter");
      const tge = await genDex(genDexAddress).methods.TGE().call()
      setTge(tge);

      const isProjectActive = await genDex(genDexAddress).methods.active().call()
      setIsProjectActive(isProjectActive)

      let getBCProjectInfo = await genDex(genDexAddress).methods.getProjectInfo().call()

      let usdtAccountAddress = getBCProjectInfo?._usdt //await genDex(genDexAddress).methods.usdt().call()
      console.log(usdtAccountAddress)
      const usdtMarket = getContract(usdtAccountAddress, USDT_ABI, library!, account!)
      if (!usdtMarket) throw new Error('No Contract!')

      getUSDTDecimals = await usdtMarket.decimals()

      const getWalletBalanceSymbolOfAccount = await usdtMarket.symbol()
      const getWalletBalanceOfAccount = await usdtMarket.balanceOf(account!)
      console.log("TGGGG getBalanceOfAccount", formatUnits(getWalletBalanceOfAccount, getUSDTDecimals));
      setAvailableBalanceBUSD((getWalletBalanceOfAccount && getUSDTDecimals) && formatUnits(getWalletBalanceOfAccount, getUSDTDecimals))
      setAvailableBalanceSymbol(getWalletBalanceSymbolOfAccount)

      underlyingToken = getBCProjectInfo?._underlyingToken //await genDex(genDexAddress).methods.underlyingToken().call()
      const erc20 = new Contract(underlyingToken as string, ERC20_ABI, library)
      if (!erc20) throw new Error('No Contract!')

      getTokenDecimals = await erc20.decimals()

      const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
      const tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)

      const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted// await genDex(genDexAddress).methods.minAllocationPermitted().call()
      setLowAllocPerUserPerTier(Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))

      const purchases = await genDex(genDexAddress).methods.purchases(account!).call()

      setTokenAllocationBought(purchases?.tokenAllocationBought && formatUnits(purchases?.tokenAllocationBought, getTokenDecimals))
      setPosition(purchases?.position)

      const getWinnerCounts = selectedProjectData?.data?.data?.whitelistWinnerCount //[25,40,55,80] //await genDex(genDexAddress).methods.getWinnerCounts().call()// PSV
      let totalNumberOfWinners = 0;
      getWinnerCounts?.map((item: any, index: any) => {
        totalNumberOfWinners += Number(item)
      })
      console.log("getBalanceOfAccount11", totalNumberOfWinners, getWinnerCounts)
      setGetWinnerCounts(totalNumberOfWinners)
      console.log("getBalanceOfAccount")


      let localTierLevelVal = 0
      try {
        // == "staking"
        const stackingAmt = await genDexStacking(process.env.REACT_APP_GENDEX_STACKING_BSC_TESTNET!).methods.stakeInfo(account!).call()
        console.log("TGGGG stackingAmt", stackingAmt, formatEther(stackingAmt.amount));

        if (stackingAmt.amount && formatEther(stackingAmt.amount)) {
          const finalStackingAmount = formatEther(stackingAmt.amount)

          if (Number(finalStackingAmount) >= 30000) {
            localTierLevelVal = 0
          } else if (Number(finalStackingAmount) >= 15000 && Number(finalStackingAmount) < 30000) {
            localTierLevelVal = 1
          } else if (Number(finalStackingAmount) >= 7500 && Number(finalStackingAmount) < 15000) {
            localTierLevelVal = 2
          } else if (Number(finalStackingAmount) >= 2000 && Number(finalStackingAmount) < 7500) {
            localTierLevelVal = 3
          } else {
            localTierLevelVal = 4
          }
          setTierLevel(localTierLevelVal)
          console.log("TGGGG localTierLevelVal", localTierLevelVal, formatEther(stackingAmt.amount));
          setStackingAmount(stackingAmt.amount && formatEther(stackingAmt.amount))

          const maxAllocPerUser = getBCProjectInfo?._maxTokenAllocPerUserPerTier[localTierLevelVal] //await genDex(genDexAddress).methods.maxAllocPerUserPerTier(localTierLevelVal).call() //not
          console.log("TGGGG maxAllocPerUser", maxAllocPerUser);
          setMaxAllocPerUserPerTier(Number(maxAllocPerUser && formatUnits(maxAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))

          // setMaxAllocPerUserPerTier(maxAllocPerUser && formatUnits(maxAllocPerUser, getUSDTDecimals))

          let projectStartTime = await genDex(genDexAddress).methods.startTime().call()
          const enableFCFSProjectTime = getBCProjectInfo?._guranteedSaleDuration //await genDex(genDexAddress).methods.guranteedSaleDuration().call()
          console.log("enableFCFSProjectTime", enableFCFSProjectTime);
          let enableFcfsSaleForObj = (Number(enableFCFSProjectTime) + Number(projectStartTime ?? 0) <= Number(moment().unix())) ? true : false
          console.log("enableFcfsSaleForObj", enableFcfsSaleForObj);
          setEnableFcfsSale(enableFcfsSaleForObj);

        }
      } catch (error) {
        console.log("TGGGG stackingAmt", error);
        localTierLevelVal = 4
        setTierLevel(localTierLevelVal)
        setStackingAmount(0)
        setMaxAllocPerUserPerTier(0)
      }

      setIsLoading(false);
    } catch (error) {
      console.log("TGGGG stackingAmt", error);
      setIsLoading(false);
    }

  }

  const getAirdropInfo = async () => {
    try {
      console.log('getAirDoppedInfoResponsegetAirDoppedInfoResponse111');
      const contractAddress: any = selectedProjectData?.data?.data?.genNFTAddress
      const privateKey: any = process.env.REACT_APP_GENNFT_WALLET_PRIVATE_KEY
      const signer = new ethers.Wallet(
        privateKey,
        // == "staking"
        new Web3Provider(network(NetworkSymbol.BSC_NETWORK_TESTNET).provider as any)
      );
      const contract = new ethers.Contract(contractAddress, GENNFT_ABI, signer);
      const args = [account]

      const getAirDoppedInfoResponse = await contract.getAirDoppedInfo(...args)
      console.log('getAirDoppedInfoResponsegetAirDoppedInfoResponse', getAirDoppedInfoResponse);

      setGetAirDoppedInfoIsAirDopped(getAirDoppedInfoResponse.isAirDropped)
      setGetAirDoppedInfoIndex(parseInt(getAirDoppedInfoResponse.id, 16))
      console.log('getAirDoppedInfoResponse', parseInt(getAirDoppedInfoResponse.id, 16), getAirDoppedInfoResponse, account)
    } catch (err: any) {
      setGetAirDoppedInfoIsAirDopped(false)
      setGetAirDoppedInfoIndex(0)
    }
  }

  console.log('SwapClaim Details : ', tokenAllocationBought, position, stackingAmount, tierLevel);

  const getRedeemedAndRedeemableTokens = (tge: number, type: string): any => {

    let redeemablePercentage = 0;
    let redeemedPercentage = 0;
    let tranche = Number(position)

    for (let i = 0; i < Number(selectedProjectData?.data?.arrayOfWeightages.length); i++) {
      if (i < Number(tranche)) {
        redeemedPercentage += Number(selectedProjectData?.data?.arrayOfWeightages![i] ?? 0);
      }
      //console.log(arrayOfTranches[i], Number(tge) + Number(arrayOfTranches[i]), Number(moment().unix()), Number(tge) + Number(arrayOfTranches[i])<= Number(moment().unix()))
      //if (Number(tge) + Number(arrayOfTranches[i]) <= Number(moment().unix())) {
      if (Number(tge) + Number(selectedProjectData?.data?.arrayOfTranches![i] ?? 0) <= Number(moment().unix())) {
        redeemablePercentage += Number(selectedProjectData?.data?.arrayOfWeightages![i] ?? 0);
      } else {
        break;
      }
    }

    let actualRedeemablePercentage = Number(redeemablePercentage) - Number(redeemedPercentage)
    // console.log('total', Math.round(Number(selectedProjectData?.data?.tokenAllocationBought!)).toFixed(2));
    // console.log('redeemable', (Number(selectedProjectData?.data?.tokenAllocationBought!) * (Number(actualRedeemablePercentage) / 100)).toFixed(2));
    // console.log('redeemed', Math.round((Number(selectedProjectData?.data?.tokenAllocationBought) * (Number(redeemedPercentage) / 100))).toFixed(2))

    return (type == "redeemable") ? (Number(tokenAllocationBought) * (Number(actualRedeemablePercentage) / 100)) : (Number(tokenAllocationBought) * (Number(redeemedPercentage) / 100));
  }

  async function getNewAccessToken() {
    const res = await axios.get(KYC_BASE + `get-access-token?userAddress=${account!}`)
    return res.data.token
  }

  async function getKYCStatus() {
    try {
      const res = await axios.get(KYC_BASE + `get-applicant-status?userAddress=${account!}`)
      return res.data
    } catch (e) {
      console.log(e)
      return e
    }
  }

  useEffect(() => {
    dispatch(changeKYC(kycStatus))
  }, [kycStatus])

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getNewAccessToken()
        setAccessToken(token)
        const result = await getKYCStatus()
        if (result.code === 404) {
          await axios.post(KYC_BASE + `create-applicant`, {
            userAddress: account!
          })
        }
        //setKYCStatus(KYC_STATUS.VERIFIED);
        setKYCStatus(
          result.code === 404
            ? KYC_STATUS.NOT_VERIFIED
            : result.review.reviewStatus === 'init'
              ? KYC_STATUS.NOT_VERIFIED
              : result.review.reviewResult.reviewAnswer === 'GREEN'
                ? KYC_STATUS.VERIFIED
                : KYC_STATUS.NOT_VERIFIED)
      } catch (err) {
        //setKYCStatus(KYC_STATUS.VERIFIED);
        setKYCStatus(KYC_STATUS.NOT_VERIFIED);
      }
    }
    if (account) {
      getAccessToken()
    }
  }, [account])

  useEffect(() => {
    getTGE();
    getAirdropInfo();
    checkApplyForWhitelist();
    setMsg("Please wait")
  }, [selectedProjectData, isSuccessfullyClaim, account, chainId])

  const handleBuyAllocation = async (usdtDecimals: number, stackedAmount: number) => {

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<number | string | BigNumber>,
      value: BigNumber | null

    const market = getContract(genDexAddress, GEN_DEX_ABI, library!, account!)
    method = market.buyAnAllocation
    estimate = market.estimateGas.buyAnAllocation
    args = [
      parseUnits(allocationValue + '', usdtDecimals),
      parseEther(stackedAmount + '')
    ]

    await estimate(...args, {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...({}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        })
          .then(async (response: any) => {
            const waitResponse = await response.wait();
            addTransaction(response, {
              summary:
                'Allocation Request Placed Successfully.'
            })
            setTimeout(function () { getAirdropInfo(); }, 5000);
            // const contractAddress: any = selectedProjectData?.data?.data?.genNFTAddress
            // const privateKey: any = process.env.REACT_APP_GENNFT_WALLET_PRIVATE_KEY
            // console.log('ethers.privateKey', privateKey, account, contractAddress, new Web3Provider(network(NetworkSymbol.GOERLI).provider as any))
            // const signer = new ethers.Wallet(
            //   privateKey,
            //   new Web3Provider(network(NetworkSymbol.GOERLI).provider as any)
            // );
            // const contract = new ethers.Contract(contractAddress, GENNFT_ABI, signer);

            // try {
            //   const args = [account]
            //   const getAirDoppedInfoResponse = await contract.getAirDoppedInfo(...args)
            //   setGetAirDoppedInfoIsAirDopped(getAirDoppedInfoResponse.isAirDropped)
            //   setGetAirDoppedInfoIndex(parseInt(getAirDoppedInfoResponse.id, 16))
            //   console.log('getAirDoppedInfoResponse', parseInt(getAirDoppedInfoResponse.id, 16), getAirDoppedInfoResponse, account)

            //   if (Boolean(getAirDoppedInfoResponse.isAirDropped) == false) {
            //     setMsg("Minting NFT")
            //     const estimatedGasLimit = await contract.estimateGas.airDrop(...args, {})
            //     console.log('estimatedGasLimit', estimatedGasLimit)
            //     const transactionResponse: TransactionResponse = await contract.airDrop(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            //     const airDropResponse = await transactionResponse.wait()
            //     console.log(airDropResponse)
            //     if (airDropResponse.status) {
            //       const args = [account]
            //       const getAirDoppedInfoRes = await contract.getAirDoppedInfo(...args)
            //       setGetAirDoppedInfoIsAirDopped(getAirDoppedInfoRes.isAirDropped)
            //       setGetAirDoppedInfoIndex(parseInt(getAirDoppedInfoRes.id, 16))
            //       addErrorPopup({
            //         txn: {
            //           hash: '',
            //           success: true,
            //           summary: "Mint NFT Successfully.",
            //           description: '',
            //           withExternalLink: false,
            //         }
            //       });
            //     } else {
            //       addErrorPopup({
            //         txn: {
            //           hash: '',
            //           success: false,
            //           summary: "Failed to Mint NFT.",
            //           description: '',
            //           withExternalLink: false,
            //         }
            //       });
            //     }
            //   }

            // } catch (err: any) {
            //   addErrorPopup({
            //     txn: {
            //       hash: '',
            //       success: false,
            //       summary: "Failed to Mint NFT.",
            //       description: '',
            //       withExternalLink: false,
            //     }
            //   });
            // }
            // setCongratulation(true);
            setIsSuccessfullyClaim(true)
            setIsLoading(false)
          })
          .catch((err: any) => {
            setIsLoading(false)
            console.log('error buy failed11', err);
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e);
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              }
            });
          })
      )
      .catch((err: any) => {
        setIsLoading(false)
        console.log('inner estimate error', err);
        let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
        if (err.code === -32603) { }
        else if (err.code !== 4001) e = JSON.parse(e);
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
            description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
            withExternalLink: false,
          }
        });
      })
  }

  const [enableFcfsSale, setEnableFcfsSale] = useState(false);
  const [raisedProjectUSDT, setRaisedProjectUSDT] = useState(0);


  const checkApplyForWhitelist = async () => {
    console.log("selectedProjectData", selectedProjectData);
    // if (kycStatus == KYC_STATUS.VERIFIED) {
    const projectId: any = selectedProjectData?.data?.data?._id;
    if (account === undefined) return
    await getApplyWhiteListData(account!, projectId, true).then((res) => {
      let isCheckedAllowed = (res?.status === 200 && res?.data?.status === true) ? true : false
      console.log('getApplyWhiteListDatares', res, isCheckedAllowed)
      setIsAllowedForAllocation(isCheckedAllowed)
    })
    // }
    // else {
    //   addErrorPopup({
    //     txn: {
    //       hash: '',
    //       success: false,
    //       summary: 'Please complete your KYC Verification to participate into allocation.',
    //       description: '',
    //       withExternalLink: false,
    //     }
    //   });
    // }
  }

  const handleApprove = async () => {

    if (!genDexAddress || !library || !chainId || !account) return
    console.log(account, "========>");
    let getBCProjectInfo = await genDex(genDexAddress).methods.getProjectInfo().call()

    let usdtAccountAddress = getBCProjectInfo?._usdt //await genDex(genDexAddress).methods.usdt().call()
    console.log(usdtAccountAddress)
    const usdtMarket = getContract(usdtAccountAddress, USDT_ABI, library!, account!)
    if (!usdtMarket) throw new Error('No Contract!')

    getUSDTDecimals = await usdtMarket.decimals()

    let underlyingToken = getBCProjectInfo?._underlyingToken //await genDex(genDexAddress).methods.underlyingToken().call()
    const erc20 = new Contract(underlyingToken as string, ERC20_ABI, library)
    if (!erc20) throw new Error('No Contract!')
    getTokenDecimals = await erc20.decimals()

    // Get lowTierAllocPerUser
    let lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted // await genDex(genDexAddress).methods.minAllocationPermitted().call()
    // let getParticipantsDetails = await genDex(genDexAddress).methods.getParticipantsDetails().call();//not    


    // const enableFCFSProjectTime = await genDex(data?.dexAddress).methods.guranteedSaleDuration().call()
    // console.log("enableFCFSProjectTime", enableFCFSProjectTime, Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0), Number(moment().unix()), Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0) <= Number(moment().unix()));
    // setEnableFcfsSale((Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0) <= Number(moment().unix())) ? true : false)

    const getAmountRaisedProject = await genDex(genDexAddress).methods.getAmountRaised().call()
    console.log("getAmountRaisedProject", getAmountRaisedProject);
    setRaisedProjectUSDT(getAmountRaisedProject && formatUnits(getAmountRaisedProject, getUSDTDecimals))

    let projectStartTime = await genDex(genDexAddress).methods.startTime().call()
    const enableFCFSProjectTime = getBCProjectInfo?._guranteedSaleDuration //await genDex(genDexAddress).methods.guranteedSaleDuration().call()
    console.log("enableFCFSProjectTime", enableFCFSProjectTime);
    let enableFcfsSaleForObj = (Number(enableFCFSProjectTime) + Number(projectStartTime ?? 0) <= Number(moment().unix())) ? true : false
    console.log("enableFcfsSale", enableFcfsSaleForObj);
    setEnableFcfsSale(enableFcfsSaleForObj);

    const purchases = await genDex(genDexAddress).methods.purchases(account!).call()
    const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
    const tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)
    let tokenAllocationBought = purchases?.tokenAllocationBought && formatUnits(purchases?.tokenAllocationBought, getTokenDecimals)
    let totalPartcipationValue = Number(tokenAllocationBought) / Number(tokensforUSDProject);

    // if (getParticipantsDetails && getParticipantsDetails?.flat()?.includes(account)) {
    //   getParticipantsDetails?.map((item: any, index: any) => {
    //     if (item[0] === account) {
    //       totalPartcipationValue += Number(formatUnits(item[1], getUSDTDecimals))
    //     }
    //   })
    // }
    console.log(account, "test========>", totalPartcipationValue);

    let maxAllocPerUserPerTier = 0.0
    let finalmaxPermittedAllocation = 0.0
    let minPermittedAllocation = 0.0

    let maxAllocationPermitted = getBCProjectInfo?._maxTokenAllocationPermitted //await genDex(genDexAddress).methods.maxTokenAllocationPermitted().call()
    console.log(account, "tettte111========>", maxAllocationPermitted);
    try {
      let getLowTokenAllocationForUser = Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals))
      minPermittedAllocation = (getLowTokenAllocationForUser != 0) ? (getLowTokenAllocationForUser / Number(tokensforUSDProject)) : 0
      maxAllocPerUserPerTier = getBCProjectInfo?._maxTokenAllocPerUserPerTier[tierLevel] //await genDex(genDexAddress).methods.maxTokenAllocPerUserPerTier(tierLevel).call() //not
      finalmaxPermittedAllocation = !enableFcfsSaleForObj ? Number(maxAllocPerUserPerTier && formatUnits(maxAllocPerUserPerTier, getTokenDecimals)) / Number(tokensforUSDProject) : 0 //Number(maxAllocationPermitted && formatUnits(maxAllocationPermitted, getTokenDecimals)) / Number(tokensforUSDProject) 
      console.log(account, "tettte========>", minPermittedAllocation, tierLevel, maxAllocPerUserPerTier, maxAllocationPermitted, finalmaxPermittedAllocation);
    } catch (error) {
      let getLowTokenAllocationForUser = Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals))
      minPermittedAllocation = (getLowTokenAllocationForUser != 0) ? (getLowTokenAllocationForUser / Number(tokensforUSDProject)) : 0
      maxAllocPerUserPerTier = minPermittedAllocation
      finalmaxPermittedAllocation = maxAllocPerUserPerTier
    }


    console.log("testtesttest========>", totalPartcipationValue, finalmaxPermittedAllocation);

    // console.log(account, "minPermittedAllocation========>", minPermittedAllocation);
    const isProjectActive = await genDex(genDexAddress).methods.active().call()
    setIsProjectActive(isProjectActive)

    const isError = {
      msg: '',
      error: false
    }

    let userInputOfBUSD = Number(allocationValue ?? 0) //* Number(selectedProjectData?.data?.tokensPerUSD ? selectedProjectData?.data?.tokensPerUSD : selectedProjectData?.data?.data?.perTokenPrice)).toFixed(2)
    console.log(account, "minPermittedAllocation========>", userInputOfBUSD, minPermittedAllocation, finalmaxPermittedAllocation);
    if (moment().unix() - Number(projectStartTime) <= 0) {
      isError.msg = `Either market is not active or not started yet.`;
      isError.error = true;
    }
    else if (!isProjectActive) {
      isError.msg = `Market is closed.`;
      isError.error = true;
    }
    else if (enableFcfsSaleForObj === false && isAllowedForAllocation === false) {
      isError.msg = `You haven't applied for whitelist to participate into guaranted allocation. Please try during FCFS Sale duration.`;
      isError.error = true;
    }
    else if (tierLevel > 3) {
      isError.msg = `You haven't staked enough GS tokens to participate.`;
      isError.error = true;
    } else if (!Number(userInputOfBUSD)) {
      isError.msg = `Please enter required ${availableBalanceSymbol || 'GS'} value for submitting request for allocation.`;
      isError.error = true;
    }
    else if (Number(userInputOfBUSD) > (Number(finalmaxPermittedAllocation) - Number(totalPartcipationValue))) {
      isError.msg = `You can't enter amount more than ${Number(Number(finalmaxPermittedAllocation) - Number(totalPartcipationValue)).toFixed(2)} ${availableBalanceSymbol || 'GS'} to submit your request for allocation.`;
      isError.error = true;
    }
    else if (!enableFcfsSaleForObj) {
      if (enableFcfsSaleForObj && !Number(userInputOfBUSD) || (Number(userInputOfBUSD) < Number(minPermittedAllocation) && totalPartcipationValue === 0)) {
        isError.msg = `You need to enter minimum ${minPermittedAllocation.toFixed(2)} ${availableBalanceSymbol || 'GS'} to participate into this project.`;
        isError.error = true;
      }
    }

    isError.error && addErrorPopup({
      txn: {
        hash: '',
        success: false,
        summary: isError.msg,
        description: '',
        withExternalLink: false,
      }
    });

    if (!isError.error && allocationValue) {
      setIsLoading(true);
      setMsg("Processing Request")
      try {
        console.log('------->Proceed to Buy Now');
        let getBCProjectInfo = await genDex(genDexAddress).methods.getProjectInfo().call()
        let usdtAccountAddress = getBCProjectInfo?._usdt  //await genDex(genDexAddress).methods.usdt().call()
        console.log(usdtAccountAddress)
        const usdtMarket = getContract(usdtAccountAddress, USDT_ABI, library!, account!)
        if (!usdtMarket) throw new Error('No Contract!')
        getUSDTDecimals = await usdtMarket.decimals()

        let underlyingToken = getBCProjectInfo?._underlyingToken  //await genDex(genDexAddress).methods.usdt().call()
        const erc20 = new Contract(underlyingToken as string, ERC20_ABI, library)
        if (!erc20) throw new Error('No Contract!')

        getTokenDecimals = await erc20.decimals()

        const getAllowanceForUSDTToDexMarket = await usdtMarket.allowance(account!, genDexAddress!)
        const projectId: any = selectedProjectData?.data?.data?._id;
        if (account === undefined) return
        const numberOfTokens = Number(Number(allocationValue ?? 0) * Number(selectedProjectData?.data?.tokensPerUSD ? selectedProjectData?.data?.tokensPerUSD : selectedProjectData?.data?.data?.perTokenPrice))
        console.log('numberOfTokens', numberOfTokens);

        await applyForBuyAnAllocation(account!, projectId, parseUnits(numberOfTokens + '', getTokenDecimals).toString(), stackingAmount, enableFcfsSale, getTokenDecimals, getUSDTDecimals).then(async (res: any) => {
          if (res?.status === 200) {
            if (Number(formatUnits(getAllowanceForUSDTToDexMarket, Number(getUSDTDecimals))) >= allocationValue) {
              console.log("Direct Buy Allocation");
              setMsg("Buy An Allocation")
              await handleBuyAllocation(getUSDTDecimals, stackingAmount);
            }
            else {
              setMsg("Approve")
              const data = await checkUserApproveGenpad(genDexAddress, parseUnits(allocationValue + '', getUSDTDecimals))
              console.log("is Success====> ", data);
              if (data.status) {
                console.log("Successfully Purchased");
                setMsg("Buy An Allocation")
                await handleBuyAllocation(getUSDTDecimals, stackingAmount);
              }
              else {
                setIsLoading(false);
              }
            }
          }
          else {
            setIsLoading(false);
            setMsg("Please Wait")
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: 'Unable to processed your request on this time. Please try again later.',
                description: '',
                withExternalLink: false,
              }
            });
          }
        })
      } catch (error) {
        setIsLoading(false);
        setMsg("Please Wait")
      }
    }
  }

  const viewNFT = async () => {
    console.log("View NFT Fired");
    setCongratulation(false)
  }

  const handleClaim = async () => {
    setMsg("Claiming Tokens")
    setIsLoading(true);
    const args: any = [
    ]
    const genDexIDO = getContract(genDexAddress, GEN_DEX_ABI, library!, account!)
    genDexIDO.estimateGas
      .redeem(...args, {})
      .then((estimatedGasLimit) => {
        return genDexIDO
          .redeem(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            const waitResponse = await response.wait();
            if (waitResponse.status) {
              setIsLoading(false);
              // add the transaction to store and show the popup
              addTransaction(response, {
                summary: `Tokens Redeemed Successfully.`,
              })
              setIsSuccessfullyClaim(true)
            }
            else {
              setIsLoading(false);
            }
          })
          .catch((err: any) => {
            setIsLoading(false);
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e);
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              }
            });
          });
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log('error', err);
        let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
        if (err.code === -32603) { }
        else if (err.code !== 4001) e = JSON.parse(e);
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
            description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
            withExternalLink: false,
          }
        });
      });
  }

  return (
    <>
    <div className="swapClaimSection">
      {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      <div className="winner-details">
        <div className="numOfWinner">
          <p className="paragraph-new-medium color-white-new">Total Number Of Winners</p>
          <div className="count-number">{getWinnerCounts}</div>
        </div>
        <div className="guarantedAllocation">
          {/* {(enableFcfsSale) ? "FCFS sale is live now"
            : (Number(stackingAmount) < 2000) ?
              <> */}
          {/* <span style={{ color: 'red' }}>Unfortunately, you did not win a guarateed allocation for this IDO Pool.</span>
                <br />
                <span style={{ color: '#848484' }}> Thanks for participating!</span> */}
          {/* </> : 
              <> */}
          <p className="paragraph-new-medium">You have a guaranteed allocation for the {selectedProjectData?.data?.data?.name} IDO pool</p>
          <span>worth {maxAllocPerUserPerTier.toFixed(2)} {availableBalanceSymbol || 'GS'}</span>
          {/* </>
          } */}
        </div>
      </div>
      <div className="swap">
        <h5 className="heading-new-5 fw-bolder mb-3">Swap</h5>
        <div className="swapContent">
          {/* <div className="details">
            <div className="title">Wallet balance</div>
            <div className="value">3000 BUSD</div>
          </div>
          <div className="details">
            <div className="title">Enter Amount</div>
            <div className="inptBUSD">
              <input type="number" />
              <span className="value">BUSD</span>
            </div>
          </div>
          <div className="willReceive">
            <div className="receive">You will receive</div>
            <div className="amnt">
              <span className="receiveAmnt">XXX</span> PRJX
            </div>
          </div>
          <div className="approveSwapping">
            You need to approve before Swapping
          </div>
          <button className="approve">APPROVE</button> */}
          {congratulation && (
            <>
              <div className="details">
                <p className="mb-0 paragraph-new-medium color-white-new w-50">Wallet balance</p>
                {/* <div className="paragraph-new-medium color-white-new">{availableBalanceBUSD + " " + availableBalanceSymbol || ' GS'}</div> */}
                <div className="paragraph-new-medium color-white-new">
                  <span className="paragraph-new-medium color-white-new me-2">{availableBalanceBUSD}</span>{availableBalanceSymbol || 'GS'}
                </div>
              </div>
              <div className="details my-4">
                <div className="paragraph-new-medium color-white-new w-50">Enter Amount</div>
                <div className="inptBUSD">
                  <input type="number" className="paragraph-new-medium color-white-new me-0" value={allocationValue} onChange={(e: any) => setAllocationValue(e.target.value)} onWheel={(e: any) => e.target.blur()} />
                  <span className="paragraph-new-medium color-white-new">{availableBalanceSymbol || 'GS'}</span>
                </div>
              </div>
              <div className="details">
                <div className="paragraph-new-medium color-white-new w-50">You will receive</div>
                <div className="paragraph-new-medium color-white-new">
                  <span className="paragraph-new-medium color-white-new me-2" style={{ color: "#54C4FC" }}>{Number((allocationValue ?? 0) * Number(selectedProjectData?.data?.tokensPerUSD ? selectedProjectData?.data?.tokensPerUSD : selectedProjectData?.data?.data?.perTokenPrice)).toFixed(2)}</span>{selectedProjectData?.data?.data?.projectShortCode}
                </div>
              </div>
              <div className="paragraph-new-medium text-center mt-5" style={{ color: "#6B6B6B" }}>You need to approve before Swapping</div>
              {/* <div className="approveNotes">
                Minimum amount to proceed {lowAllocPerUserPerTier.toFixed(2) || 0} {availableBalanceSymbol || 'GS'} is required.
              </div> */}
              <div className="text-center mt-4">
                <button
                  className="new-color-button fw-light"
                  onClick={handleApprove}
                  disabled={(moment().unix() - selectedProjectData?.data?.data?.endDate) > 0 || !isProjectActive}
                >
                  Approve
                </button>
              </div>
            </>
          )}
          {!congratulation && (
            <>
              <div className="clelebrateIcon-part">
                <div className="top-celebration">
                  <div className="left-part">
                    <img src={clelebrateIcon} className="img-fluid mb-3" alt="" />
                    <div className="congratulationsText">Congratulations!</div>
                    <div className="paragraph-new-medium mt-3 mb-2">Now, get your own, unique <br /> NFT for this project</div>
                    {/* <button className="mintNFT" onClick={viewNFT}>
                    <a style={{ color: '#FFFFFF', fontWeight: 400 }} href={`https://testnets.opensea.io/assets/bsc-testnet/${selectedProjectData?.data?.data?.genNFTAddress}/${getAirDoppedInfoIndex}`} target={'_blank'}>
                      VIEW NFT
                    </a>
                  </button> */}
                  </div>
                  <div className="center-line"></div>
                  <div className="right-part">
                    <h4 className="heading-new-4 fw-bolder">Why don’t you explore our more of our Private Sales for more allocations?</h4>
                    <button className="new-color-button mt-4">Explore more Private Sales</button>
                  </div>
                </div>
                <div className="bottom-feature-content mt-lg-5 mt-3">
                  <p className="paragraph-new-medium fw-bold mb-lg-5 mb-3">Featured Private Sales</p>
                  <div className="row">
                    <div className="col-lg-6">
                      <ModelCard />
                    </div>
                    <div className="col-lg-6 d-lg-block d-md-block d-none">
                      <ModelCard />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="claim">
        <h5 className="heading-new-5 fw-bolder mb-3">Claim</h5>
        <div className="claimContent">
          {(Number(tokenAllocationBought) > 0) ?
            <>
              <div className="details">
                <div className="paragraph-new-medium color-white-new">Claim Type</div>
                <div className="paragraph-new-medium color-white-new">{tierLevel === 0 ? 'Tier 0' : tierLevel === 1 ? 'Tier 1' : tierLevel === 2 ? 'Tier 2' : tierLevel === 3 ? 'Tier 3' : 'No Tier Assigned'}</div>
              </div>
              <div className="details my-4">
                <div className="paragraph-new-medium color-white-new">Vesting Schedule</div>
                <div className="paragraph-new-medium color-white-new">{
                  selectedProjectData?.data?.arrayOfWeightages?.length > 0 ? `${selectedProjectData?.data?.arrayOfWeightages?.[0]}% at TGE, from 2nd Month linear vesting in ${selectedProjectData?.data?.arrayOfWeightages?.length - 1} months` : "-"
                }</div>
              </div>
              <div className="details">
                <div className="paragraph-new-medium color-white-new">Total Bought Tokens</div>
                <div className="paragraph-new-medium color-white-new">{Number(tokenAllocationBought).toFixed(2) || 0}</div>
              </div>
              <div className="details my-4">
                <div className="paragraph-new-medium color-white-new">Claimable tokens</div>
                <div className="paragraph-new-medium color-white-new">{getRedeemedAndRedeemableTokens(tge, "redeemable").toFixed(2) || 0}</div>
              </div>
              <div className="details">
                <div className="paragraph-new-medium color-white-new">You have Claimed</div>
                <div className="paragraph-new-medium color-white-new">{getRedeemedAndRedeemableTokens(tge, "redeemed").toFixed(2) || 0}/{Number(tokenAllocationBought!).toFixed(2) || 0}</div>
              </div>
              <div className="claimAction text-center mt-4">
                <button
                  className="new-color-button fw-light"
                  onClick={handleClaim}
                // disabled={Number(position!) >= Number(selectedProjectData?.data?.arrayOfTranches!.length) || (moment().unix() - tge) < 0}
                >
                  CLAIM
                </button>
                {/* <button
              className="viewNFTBtn"
              onClick={() => window.open(`https://testnets.opensea.io/assets/bsc-testnet/${selectedProjectData?.data?.data?.genNFTAddress}/${getAirDoppedInfoIndex}`, '_blank')}
              disabled={!getAirDoppedInfoIsAirDopped}
            >
              VIEW NFT
            </button> */}
              </div>
            </> :
            <div className="">
                <div className="text-center">
                  <img src={secureLock} className="img-fluid" alt="" />
                </div>
                <h5 className="claim-text mt-3">CLAIM</h5>
                <h5 className="heading-new-5 fw-bolder mt-4 text-center" style={{color: "#A3A3A3"}}>Claiming is only permitted once you <br /> have Swapped</h5>
            </div>
          }
        </div>

      </div>
      {selectedProjectData?.cardTitle === "Ended" && <div className="cardTypeLabel">Base Allocation = ${lowAllocPerUserPerTier}</div>}
      {selectedProjectData?.cardTitle === "Upcoming" && <div className="cardTypeLabel">Registration will open soon</div>}
      {selectedProjectData?.cardTitle === "LIVE" && <>
        <div className="timeLime">TIMELIME</div>
        <ul className="timeline-main-container">
          <div className="timeline-background-container">
            <div className="timeline-background" />
          </div>
          {_.map(timeline, (item: { title: string; date: number }) => {
            return (
              <li
                className={`timeline-item-container ${item.date < moment().unix() ? "select-timeline-item" : ""
                  }`}
              >
                <div className="ball-outer">
                  <div className="ball-middle">
                    <div className="ball-inner" />
                  </div>
                </div>
                {/* <div className="timeline-date">
                    {moment.unix(item.date).format("Do MMM YYYY")}
                  </div> */}
                <div className="timeline-title" style={{ color: (item.date < moment().unix()) ? '#FF0071' : '' }}> - {item.title}</div>
              </li>
            );
          })}
        </ul>
      </>}
      
    </div>
    </>
  );
};

export default SwapClaim;
