import React, { useEffect, useMemo, useState } from 'react'
import { Modal, ModalBody, ModalHeader, Button, Alert } from 'reactstrap'
import './style.sass'

import AddFundModal from '../addFundModal'
import BuyNowModal from '../successModal'

import { abi as ERC1155_ABI } from '../../../../../../../contracts/IERC1155.json';
import { abi as ERC721_ABI } from '../../../../../../../contracts/IERC721.json';
import { abi as GS_MARKETPLACE_ABI } from '../../../../../../../contracts/GSMarketPlace1.json';
import bidSuccess from '../../../../../../../images/marketplace/bidSuccess.png'
import sellSuccess from '../../../../../../../images/marketplace/sellSuccess.png'
import downIcon from '../../../../../../../images/marketplace/downArrow.svg'
import upIcon from '../../../../../../../images/marketplace/arrowup.svg'
import { useRef } from 'react'
import LoaderComp from '../../../../../../../shared/components/LoaderComponent'
import { calculateGasMargin, daysToSeconds, getContract, getERC20Contract } from '../../../../../../../utils'
import { useAddPopup } from '../../../../../../../state/application/hooks'
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber, ethers, providers } from "ethers";
import { MaxUint256 } from '@ethersproject/constants'
import { useActiveWeb3React } from '../../../../../../../hooks/web3'
import { useTransactionAdder } from '../../../../../../../state/transactions/hooks'
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA, GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA } from '../../../../../../../constants'
import { useSelector } from 'react-redux';
import { AppState } from '../../../../../../../state'
import moment from 'moment'
import { Info } from 'react-feather'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApproveForBuyNowMarketPlace, useApproveForListPostingERC1155, useApproveForListPostingERC721 } from '../../../../../../../state/ticket/hooks'
import { RangePicker } from 'react-minimal-datetime-range'
import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';
import { postCreateNFTListingCallBack } from '../../../../../API/ApiCall'
import useUserAuth from '../../../../../../../hooks/useUserAuth'
import { DateRangePicker } from "rsuite";
import './style.css';
import { addDays } from 'date-fns';



interface PlaceBidProps {
  currentProjectData: any
  numberOfHoldings?: number
  title: string
  addFundBtn?: string
  successBtn?: string
  quantityLabel: string
  priceLabel: string
  offerExpirationLabel: string
  isOpen?: boolean
  selectedOption?: string
  toggle?: () => void
  footerText?: string,
  setIsRefreshListingData?: any,
  wethtoUsd: number
  creatorFeesForNFT?: any,
  commissionInfoForNFT?: any
}

const NFTPageModal = ({
  currentProjectData,
  numberOfHoldings,
  title,
  addFundBtn,
  successBtn,
  quantityLabel,
  priceLabel,
  offerExpirationLabel,
  isOpen,
  selectedOption,
  toggle,
  setIsRefreshListingData,
  footerText,
  wethtoUsd,
  creatorFeesForNFT,
  commissionInfoForNFT
}: PlaceBidProps) => {

  const sellOption = [
    {
      url: '/images/fixed-price.svg',
      title: 'Fixed Price'
    },
    {
      url: '/images/time-auction.svg',
      title: 'Timed Auction'
    }
  ]

  const bidMethods = [
    {
      label: "Sell to highest bidder",
      value: 'highest'
    },
    {
      label: "Sell with declining price",
      value: 'lowest'
    }
  ]


  const now = new Date();
  // const [ranges, setRanges] = useState("");
  const todayY = now.getFullYear();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();
  const $passwordWrapperRef = useRef(null);
  const $pinWrapperRef = useRef(null);
  const $activationWrapperRef = useRef(null);
  const [showCalendarPicker, setShowCalendarPicker] = useState(true);
  const [hour, setHour] = useState('01');
  const [minute, setMinute] = useState('01');
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [date, setDate] = useState(String(now.getDate()).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));

  const network = useSelector((state: AppState) => state.application.network)
  const wethAddress = GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA[network]
  const { account, chainId, library } = useActiveWeb3React()
  console.log('currentProjectData NFT', currentProjectData, currentProjectData?.numberOfNFTHolding);
  const [msg, setMsg] = useState("Please Wait")
  const [isLoading, setIsLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [quantity, setQuantity] = useState<any>(0)
  const [price, setPrice] = useState<any>()
  // const [dateTime, setDateTime] = useState({ date: '', time: '' })
  const [dateTime, setDateTime] = useState<any[]>([])
  const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false)
  console.log("dateTime =>", dateTime);
  const [selectedMethod, setSelectedMethod] = useState(bidMethods[0].value)

  const [selectedSellOptn, setselectedSellOptn] = useState(sellOption[0]?.title)
  // const [timeQunatity, setTimeQunatity] = useState<any>(1)
  const [startingPrice, setStartingPrice] = useState<any>()
  const [endingPrice, setEndingPrice] = useState<any>()
  const [includeReverse, setiIcludeReverse] = useState(false)
  const [timedPrice, setTimedPrice] = useState<any>()
  const checkUserApproveForListERC1155 = useApproveForListPostingERC1155()
  const checkUserApproveForListERC721 = useApproveForListPostingERC721()
  const addErrorPopup = useAddPopup();
  const addTransaction = useTransactionAdder()
  const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
  const checkUserApproveForPlaceABid = useApproveForBuyNowMarketPlace()
  const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
  const userId = useSelector((state: AppState) => state.user && state.user.userId)

  const [isquantity, setisQuantity] = useState(false)
  const [alert, setAlert] = useState(false)
  const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()

  const dateDifference = (stateDateTimeObj: any, endDateTimeObj: any) => {
    // console.log("11111111", new Date(dateTimeObj.date + ' ' + dateTimeObj.time).getTime());
    // console.log("222222222 ", new Date().getTime());
    if (stateDateTimeObj === '' || endDateTimeObj === '') return 0

    // console.log("11111111", new Date(stateDateTimeObj).getTime());
    // console.log("222222222 ", new Date(endDateTimeObj).getTime());

    const diffDateTime = new Date(endDateTimeObj).getTime() - new Date(stateDateTimeObj).getTime()
    // console.log("days => ", moment.duration(diffDateTime).days());
    // console.log("hours => ", moment.duration(diffDateTime).hours());
    // console.log("mintus => ", moment.duration(diffDateTime).minutes());
    // console.log("seconds => ", moment.duration(diffDateTime).seconds());
    // return moment.duration(diffDateTime).days() + 'day' + moment.duration(diffDateTime).hours() + 'hour' + moment.duration(diffDateTime).minutes() + "minutes " + moment.duration(diffDateTime).seconds() + 'second'

    return Math.floor(diffDateTime / 1000);
  }

  const fetchAuthToken = async () => {
    try {
      if (account && account !== storedAddress && library) {
        await getUserAuthToken()
      }
    }
    catch (error: any) {
    }
  };

  const handleSell = async () => {
    console.log('handleSell Called');

    console.log('setDateTimesetDateTime', dateTime);

    let nftPrice = parseUnits(price)
    let numberOfNFTsTransfer = currentProjectData?.nftContractType! === "ERC1155" ? quantity : "1" // changes
    let contractPosition = currentProjectData?.nftContractType! === "ERC1155" ? "2" : currentProjectData?.nftContractType! === "ERC721" ? "1" : "0"
    let visibilityDuration = dateDifference(dateTime[0], dateTime[1])
    let startTimeDuration = Math.floor(new Date(dateTime[0]).getTime() / 1000)
    let endTimeDuration = Math.floor(new Date(dateTime[1]).getTime() / 1000)

    if (!genMarketPlaceContractAddress || account === undefined) return

    const args: any = [
      currentProjectData?.nftContract!, //Contract Address of NFT
      nftPrice, //Price Set by user for NFT
      currentProjectData?.nftTokenId!, //NFT TokenID
      numberOfNFTsTransfer, // Number of NFTs wanted to sell
      contractPosition, // 0 -  Undefined. 1 - erc721, 2 - erc1155
      startTimeDuration, // Duration
      endTimeDuration
    ]

    console.log('handleSell args', args, genMarketPlaceContractAddress);

    const genMarketPlaceContract = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
    console.log('genMarketPlaceContract', genMarketPlaceContract);
    try {
      genMarketPlaceContract.estimateGas
        .listFixedPriceItem(...args, {})
        .then((estimatedGasLimit) => {
          return genMarketPlaceContract
            .listFixedPriceItem(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              console.log('handleSell response received');
              const waitResponse = await response.wait();
              if (waitResponse.status) {

                // // add the transaction to store and show the popup
                addTransaction(response, {
                  summary: `Listing Added Successfully.`,
                })
                setIsLoading(false);
                setMsg("Please Wait");
                //@ts-ignore
                toggle()
                toggleBuyNowModal()
                // setSuccessModal(!successModal)
                setIsRefreshListingData(e => !e)
              }
              else {
                setIsLoading(false);
                setMsg("Please Wait");
              }
            })
            .catch((err: any) => {
              setIsLoading(false);
              setMsg("Please Wait");
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
          setMsg("Please Wait");
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
    catch (error: any) {
      console.log('error error', error);
      setIsLoading(false);
      setMsg("Please Wait");
    }
  }

  const handleListAuction = async () => {
    console.log('handleListAuction Called');

    let nftStartingPrice = parseUnits(startingPrice)
    let numberOfNFTsTransfer = currentProjectData?.nftContractType! === "ERC1155" ? quantity : "1" // changes
    let contractPosition = currentProjectData?.nftContractType! === "ERC1155" ? "2" : currentProjectData?.nftContractType! === "ERC721" ? "1" : "0"
    // let visibilityDuration = dateDifference(dateTime[0], dateTime[1])
    let startTimeDuration = Math.floor(new Date(dateTime[0]).getTime() / 1000)
    let endTimeDuration = Math.floor(new Date(dateTime[1]).getTime() / 1000)

    if (!genMarketPlaceContractAddress || account === undefined) return

    const args: any = [
      currentProjectData?.nftContract!, //Contract Address of NFT
      nftStartingPrice, //Price Set by user for NFT
      currentProjectData?.nftTokenId!, //NFT TokenID
      numberOfNFTsTransfer, // Number of NFTs wanted to sell
      contractPosition, // 0 -  Undefined. 1 - erc721, 2 - erc1155
      startTimeDuration, // Duration
      endTimeDuration
    ]

    console.log('handleListAuction args', args, genMarketPlaceContractAddress);

    const genMarketPlaceContract = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
    console.log('genMarketPlaceContract', genMarketPlaceContract);
    try {
      genMarketPlaceContract.estimateGas
        .listAuction(...args, {})
        .then((estimatedGasLimit) => {
          return genMarketPlaceContract
            .listAuction(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              console.log('listAuction response received');
              const waitResponse = await response.wait();
              if (waitResponse.status) {
                setIsLoading(false);
                setMsg("Please Wait");
                // // add the transaction to store and show the popup
                addTransaction(response, {
                  summary: `Auction Listed Successfully.`,
                })
                //@ts-ignore
                toggle()
                toggleBuyNowModal()
                // setSuccessModal(!successModal)
                setIsRefreshListingData(e => !e)
              }
              else {
                setIsLoading(false);
                setMsg("Please Wait");
              }
            })
            .catch((err: any) => {
              setIsLoading(false);
              setMsg("Please Wait");
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
          setMsg("Please Wait");
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
    catch (error: any) {
      console.log('error error', error);
      setIsLoading(false);
      setMsg("Please Wait");
    }

  }

  const handleListDutchAuction = async () => {
    console.log('handleListDutchAuction Called');

    let nftStartingPrice = parseUnits(startingPrice)
    let nftEndingPrice = parseUnits(endingPrice)
    let numberOfNFTsTransfer = currentProjectData?.nftContractType! === "ERC1155" ? quantity : "1" // changes
    let contractPosition = currentProjectData?.nftContractType! === "ERC1155" ? "2" : currentProjectData?.nftContractType! === "ERC721" ? "1" : "0"
    // let visibilityDuration = dateDifference(dateTime[0], dateTime[1])
    let startTimeDuration = Math.floor(new Date(dateTime[0]).getTime() / 1000)
    let endTimeDuration = Math.floor(new Date(dateTime[1]).getTime() / 1000)

    if (!genMarketPlaceContractAddress || account === undefined) return

    const args: any = [
      currentProjectData?.nftContract!, //Contract Address of NFT
      nftStartingPrice, //Price Set by user for NFT
      nftEndingPrice, //nftEndingPrice Set By user for NFT
      currentProjectData?.nftTokenId!, //NFT TokenID
      numberOfNFTsTransfer, // Number of NFTs wanted to sell
      contractPosition, // 0 -  Undefined. 1 - erc721, 2 - erc1155
      startTimeDuration, // Duration
      endTimeDuration
    ]

    console.log('handleListDutchAuction args', args, genMarketPlaceContractAddress);

    const genMarketPlaceContract = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
    console.log('handleListDutchAuction genMarketPlaceContract', genMarketPlaceContract);
    try {
      genMarketPlaceContract.estimateGas
        .listDutchAuction(...args, {})
        .then((estimatedGasLimit) => {
          return genMarketPlaceContract
            .listDutchAuction(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              console.log('listDutchAuction response received');
              const waitResponse = await response.wait();
              if (waitResponse.status) {
                setIsLoading(false);
                setMsg("Please Wait");
                // // add the transaction to store and show the popup
                addTransaction(response, {
                  summary: `Dutch Auction Listed Successfully.`,
                })
                //@ts-ignore
                toggle()
                toggleBuyNowModal()
                // setSuccessModal(!successModal)
                setIsRefreshListingData(e => !e)
              }
              else {
                setIsLoading(false);
                setMsg("Please Wait");
              }
            })
            .catch((err: any) => {
              setIsLoading(false);
              setMsg("Please Wait");
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
          setMsg("Please Wait");
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
    catch (error: any) {
      console.log('error error', error);
      setIsLoading(false);
      setMsg("Please Wait");
    }

  }

  const handleMakeOffer = async () => {
    console.log('handleMakeOffer Called');

    console.log("quantity => ", quantity);
    console.log("price => ", price, parseUnits(price));
    console.log("dateDifference => ", dateDifference(dateTime[0], dateTime[1]));

    let nftPrice = parseUnits(price)
    let numberOfNFTsTransfer = currentProjectData?.nftContractType! === "ERC1155" ? quantity : "1" // changes
    let assetType = currentProjectData?.nftContractType! === "ERC1155" ? 2 : currentProjectData?.nftContractType! === "ERC721" ? 1 : 0
    // let offerDuration = dateDifference(dateTime[0], dateTime[1])
    let startTimeDuration = Math.floor(new Date(dateTime[0]).getTime() / 1000)
    let endTimeDuration = Math.floor(new Date(dateTime[1]).getTime() / 1000)

    if (!genMarketPlaceContractAddress || account === undefined) return

    const args: any = [
      currentProjectData?.nftContract!, //Contract Address of NFT
      nftPrice, //Price Set by user for NFT
      currentProjectData?.nftTokenId!, //NFT TokenID
      numberOfNFTsTransfer, // Number of NFTs wanted to sell
      assetType, // 0 -  Undefined. 1 - erc721, 2 - erc1155
      startTimeDuration, // startTimeDuration
      endTimeDuration //endTimeDuration
    ]

    console.log('handleMakeOffer args', args, genMarketPlaceContractAddress);

    const genMarketPlaceContract = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
    console.log('genMarketPlaceContract', genMarketPlaceContract);
    try {
      genMarketPlaceContract.estimateGas
        .makeOffer(...args, {})
        .then((estimatedGasLimit) => {
          return genMarketPlaceContract
            .makeOffer(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              const waitResponse = await response.wait();
              console.log('PlaceABid Offer response received', waitResponse);
              if (waitResponse.status) {
                setIsLoading(false);
                setMsg("Please Wait");
                // // add the transaction to store and show the popup
                addTransaction(response, {
                  summary: `Offer Listed Successfully.`,
                })
                //@ts-ignore
                toggle()
                toggleBuyNowModal()
                // setSuccessModal(!successModal)
                setIsRefreshListingData(e => !e)
              }
              else {
                setIsLoading(false);
                setMsg("Please Wait");
              }
            })
            .catch((err: any) => {
              setIsLoading(false);
              setMsg("Please Wait");
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
        .catch((error: any) => {
          setIsLoading(false);
          setMsg("Please Wait");
          console.log('error', error);
          try {
            let err = JSON.parse(error)
            console.log('error1', err);
            let e = err?.code === 4001 ? err : err?.code === -32603 ? err.data : (err?.message.length != 0 || err?.message != undefined) ? err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3) : '';
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
          } catch (error: any) {
            console.log('error111', error);
            setIsLoading(false);
            setMsg("Please Wait");
          }

        });
    }
    catch (error: any) {
      console.log('error error', error);
      setIsLoading(false);
      setMsg("Please Wait");
    }
  }

  const handleApprove = async () => {

    if (selectedSellOptn === sellOption[1]?.title) {
      console.log("Section 1");
      console.log("selectedMethod", selectedMethod);
      console.log("quantity => ", quantity);
      console.log("startingPrice => ", startingPrice);
      console.log('setDateTimesetDateTime', dateTime);
      console.log("visibilityDuration => ", dateDifference(dateTime[0], dateTime[1]));
      console.log("endingPrice => ", endingPrice);

    } else {
      console.log("Section 0");
      console.log("quantity => ", quantity, currentProjectData?.numberOfNFTHolding, quantityRef?.current);
      console.log("price => ", price);
      console.log('setDateTimesetDateTime', dateTime);
      console.log("visibilityDuration => ", dateDifference(dateTime[0], dateTime[1]));
    }

    if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

    let visibilityDuration = dateDifference(dateTime[0], dateTime[1])
    console.log(account, "====Approve====>", price, visibilityDuration);

    const isError = {
      msg: '',
      error: false
    }

    let operationType = 1
    let quantityOfOrder = 0
    let startPriceOfOrder = 0
    let endPriceOfOrder = 0
    let startTimeOfOrder = Math.floor((new Date(dateTime[0]).getTime()) / 1000)
    let endTimeOfOrder = Math.floor((new Date(dateTime[1]).getTime()) / 1000)

    if (title === "MAKE OFFER") {
      if (quantity <= 0 || quantity === undefined || isNaN(quantity)) {
        isError.msg = `Please enter minimum 1 quantity to list this item into the market.`;
        isError.error = true;
      }
      else if (price <= 0 || price === undefined || isNaN(price)) {
        isError.msg = `Listing price should be more than ZERO.`;
        isError.error = true;
      }
      else if (dateTime.length == 0) {
        isError.msg = `Please select start and end date time duration for listing this item.`;
        isError.error = true;
      }
      else if (Number(visibilityDuration) < 9000 || isNaN(visibilityDuration) || visibilityDuration === undefined) {
        isError.msg = `NFT visibility duration must must be at least 15 minutes.`;
        isError.error = true;
      }
      operationType = 2
      quantityOfOrder = quantity
      startPriceOfOrder = price
    }
    else {
      if (selectedSellOptn === sellOption[0]?.title) {
        if (quantity <= 0 || quantity === undefined || isNaN(quantity)) {
          isError.msg = `Please enter minimum 1 quantity to list this item into the market.`;
          isError.error = true;
        }
        else if (quantity > Number(currentProjectData?.numberOfNFTHolding)) {
          isError.msg = `You don't have enough quantity that you have entered to list this item into the market.`;
          isError.error = true;
        }
        else if (price <= 0 || price === undefined || isNaN(price)) {
          isError.msg = `Listing price should be more than ZERO.`;
          isError.error = true;
        }
        else if (dateTime.length == 0) {
          isError.msg = `Please select start and end date time duration for listing this item.`;
          isError.error = true;
        }
        else if (Number(visibilityDuration) < 9000 || isNaN(visibilityDuration) || visibilityDuration === undefined) {
          isError.msg = `NFT visibility duration must must be at least 15 minutes.`;
          isError.error = true;
        }
        operationType = 1
        quantityOfOrder = quantity
        startPriceOfOrder = price
      }
      else {
        if (Number(quantity) <= 0 || quantity === undefined || isNaN(quantity)) {
          isError.msg = `Please enter minimum 1 quantity to list this item into the market.`;
          isError.error = true;
        }
        else if (quantity > Number(currentProjectData?.numberOfNFTHolding)) {
          isError.msg = `You don't have enough quantity that you have entered to list this item into the market.`;
          isError.error = true;
        }
        else if (dateTime.length == 0) {
          isError.msg = `Please select start and end date time duration for listing this item.`;
          isError.error = true;
        }
        else if (Number(startingPrice) <= 0 || startingPrice === undefined || isNaN(startingPrice)) {
          isError.msg = `Starting price should be more than ZERO.`;
          isError.error = true;
        }
        else if (Number(visibilityDuration) < 9000 || isNaN(visibilityDuration) || visibilityDuration === undefined) {
          isError.msg = `NFT visibility duration must must be at least 15 minutes.`;
          isError.error = true;
        }
        else if (selectedMethod === "lowest" && (Number(endingPrice) <= 0 || endingPrice === undefined || isNaN(endingPrice))) {
          isError.msg = `Ending price should be more than ZERO.`;
          isError.error = true;
        }
        else if (selectedMethod === "lowest" && (Number(startingPrice) <= Number(endingPrice))) {
          isError.msg = `Ending price must be less than starting price.`;
          isError.error = true;
        }
        if (selectedMethod === "highest") {
          operationType = 3
          quantityOfOrder = quantity
          startPriceOfOrder = startingPrice
        }
        else {
          operationType = 4
          quantityOfOrder = quantity
          startPriceOfOrder = startingPrice
          endPriceOfOrder = endingPrice
        }
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

    let contractPosition = currentProjectData?.nftContractType! === "ERC1155" ? 2 : currentProjectData?.nftContractType! === "ERC721" ? 1 : 0

    if (!isError.error) {
      console.log('------->All are good to go for proceeding approve before listing and offers');
      try {
        await fetchAuthToken()
        setIsLoading(true);
        setMsg("Please wait")
        await postCreateNFTListingCallBack(
          account!, currentProjectData?.nftContract, chainId, contractPosition, currentProjectData?.nftTokenId, operationType, Number(startPriceOfOrder), Number(quantityOfOrder), startTimeOfOrder, endTimeOfOrder, currentProjectData?.tokenURIOfNFT, Number(endPriceOfOrder)
        ).then(async (res: any) => {
          if (res?.status === 200) {
            if (title === "MAKE OFFER") {
              console.log("---- MAKE OFFER => ");
              if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

              const erc20 = getERC20Contract(wethAddress, chainId, library, account)
              if (!erc20) throw new Error('No UNI Contract!')

              const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)


              if (Number(formatEther(getAllowanceForWETHMarket)) >= Number(Number(price) * Number(quantity))) {
                console.log("Direct Buy Listing because of default approved done");
                setMsg("Posting Your Offer")
                await handleMakeOffer();
              }
              else {
                setMsg("Approve")
                const data = await checkUserApproveForPlaceABid(wethAddress, genMarketPlaceContractAddress, parseUnits(Number(Number(price) * Number(quantity)).toFixed(10) + ''))
                console.log("is Success from checkUserApproveForPlaceABid ====> ", data);
                if (data.status) {
                  console.log("Successfully Approved");
                  setMsg("Posting Your Offer")
                  await handleMakeOffer();
                }
                else {
                  setIsLoading(false);
                  setMsg("Please wait")
                }
              }
            }
            else if (title === "SELL") {
              console.log("---- SELL APPROVE => ");
              if (currentProjectData?.nftContractType === "ERC721") {
                // call getApproved to  
                console.log("ERC721 Contract");
                const nftContractAddress = getContract(currentProjectData?.nftContract, ERC721_ABI, library!, account!)
                if (!nftContractAddress) throw new Error('No Contract!')

                const isApprovedAddressOfERC721 = await nftContractAddress.getApproved(currentProjectData?.nftTokenId)
                console.log("isApprovedAddressOfERC721 Address isApprovedOrNot", isApprovedAddressOfERC721);
                setIsLoading(true)

                if (isApprovedAddressOfERC721.toLowerCase() === genMarketPlaceContractAddress!.toLowerCase()) {
                  console.log("Direct ListFixedPriceItem");
                  if (selectedSellOptn === sellOption[0]?.title) {
                    setMsg("List Posting")
                    await handleSell();
                  }
                  else {
                    if (selectedMethod === "highest") {
                      setMsg("List Auction")
                      await handleListAuction();
                    } else {
                      setMsg("List Dutch Auction")
                      await handleListDutchAuction();
                    }
                  }
                }
                else {
                  setMsg("Approve")
                  const data = await checkUserApproveForListERC721(currentProjectData?.nftContract, genMarketPlaceContractAddress!, currentProjectData?.nftTokenId)
                  console.log("is Success====> ", data);
                  if (data.status) {
                    console.log("Successfully Fired Approve");
                    if (selectedSellOptn === sellOption[0]?.title) {
                      setMsg("List Posting")
                      await handleSell();
                    }
                    else {
                      if (selectedMethod === "highest") {
                        setMsg("List Auction")
                        await handleListAuction();
                      } else {
                        setMsg("List Dutch Auction")
                        await handleListDutchAuction();
                      }
                    }
                  }
                  else {
                    setIsLoading(false);
                    setMsg("Please wait")
                  }
                }
              }
              else if (currentProjectData?.nftContractType === "ERC1155") {
                console.log("ERC1155 Contract");
                const nftContractAddress = getContract(currentProjectData?.nftContract, ERC1155_ABI, library!, account!)
                if (!nftContractAddress) throw new Error('No Contract!')

                const isApprovedOrNotERC1155 = await nftContractAddress.isApprovedForAll(account!, genMarketPlaceContractAddress!)
                console.log("Direct ListFixedPriceItem", isApprovedOrNotERC1155);
                setIsLoading(true)
                if (Boolean(isApprovedOrNotERC1155)) {
                  console.log("Direct ListFixedPriceItem");
                  if (selectedSellOptn === sellOption[0]?.title) {
                    setMsg("List Posting")
                    await handleSell();
                  }
                  else {
                    if (selectedMethod === "highest") {
                      setMsg("List Auction")
                      await handleListAuction();
                    } else {
                      setMsg("List Dutch Auction")
                      await handleListDutchAuction();
                    }
                  }
                }
                else {
                  setMsg("Approve")
                  const data = await checkUserApproveForListERC1155(currentProjectData?.nftContract, genMarketPlaceContractAddress!)
                  console.log("is Success====> ", data);
                  if (data.status) {
                    console.log("Successfully Fired setApprovalForAll");
                    if (selectedSellOptn === sellOption[0]?.title) {
                      setMsg("List Posting")
                      await handleSell();
                    }
                    else {
                      if (selectedMethod === "highest") {
                        setMsg("List Auction")
                        await handleListAuction();
                      } else {
                        setMsg("List Dutch Auction")
                        await handleListDutchAuction();
                      }
                    }
                  }
                  else {
                    setIsLoading(false);
                    setMsg("Please wait")
                  }
                }
              }
            }
          }
          else {
            setIsLoading(false);
            setMsg("Please wait")
          }
        }).catch(err => {
          setIsLoading(false);
          setMsg("Please wait")
          console.log(err.message || 'Error while creating NFT listing data ')
        })
      } catch (error: any) {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(error || 'Error while validate check of creating NFT Listing data ')
      }
    }
  }

  const [openAddFundModal, setOpenAddFundModal] = useState(false)
  const toggleAddFundModal = () => {
    setOpenAddFundModal(!openAddFundModal)

  }
  const toggleBuyNowModal = () => {
    setOpenBuyNowModal(!openBuyNowModal)
  }

  const quantityRef = useRef<HTMLInputElement>(null)
  const offerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log("numberOfNFTHolding", currentProjectData?.numberOfNFTHolding);
    setQuantity(currentProjectData && Number(currentProjectData?.numberOfNFTHolding) > 1 && currentProjectData?.nftContractType === "ERC1155" ? Number(currentProjectData?.numberOfNFTHolding) : "1")
    if (currentProjectData?.nftContractType === "ERC721") {
    }
    // document.body.style.overflow = "hidden !important";
    console.log("selectedOptionselectedOption", selectedOption);

    // if(selectedOption === "Listing"){
    //   setselectedSellOptn(sellOption[0]?.title)
    // } else if(selectedOption === "DutchAuction"){
    //   setselectedSellOptn(sellOption[1]?.title)
    //   setSelectedMethod(bidMethods[1].value)
    // }
    // else if(selectedOption === "NormalAuction"){
    //   setselectedSellOptn(sellOption[1]?.title)
    //   setSelectedMethod(bidMethods[0].value)
    // }
  }, [selectedOption])

  const getQuantityValue: Number = useMemo(() => {
    console.log("Calling Me numberOfNFTHolding");
    setQuantity(currentProjectData && Number(currentProjectData?.numberOfNFTHolding) > 1 ? Number(currentProjectData?.numberOfNFTHolding) : "1")
    // const calculatedFarmingValue = Number(currentProjectData?.numberOfNFTHolding)
    return (0)
  }, [currentProjectData?.numberOfNFTHolding])

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleSelect = (range) => {
    setDateTime(range)
  }

  React.useEffect(() => {
    if (isOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  return (
    <>
      {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      <AddFundModal isOpen={openAddFundModal} toggle={toggleAddFundModal} />
      <BuyNowModal
        title="buy now"
        img={title === 'SELL' ? sellSuccess : bidSuccess}
        imgTitle={
          title === 'SELL'
            ? (selectedSellOptn === sellOption[0]?.title) ? 'You successfully listed your NFT for sale' : 'You have successfully created auction for your NFT'
            : "You've successfully placed an offer for this NFT!"
        }
        imgMsg={
          title === 'SELL'
            ? (selectedSellOptn === sellOption[0]?.title) ? "We'll let you know when someone wants to buy this from you" : "We'll let you know when someone placed bid on your NFT auction"
            : "We'll let you know when someone wants to sell this to you "
        }
        dashbord={'Go to NFT'}
        marketplace={'Return to Marketplace'}
        nftContractAddress={currentProjectData?.nftContract!}
        nftTokenId={currentProjectData?.nftTokenId!}
        isOpen={openBuyNowModal}
        toggle={toggleBuyNowModal}
      />
      <Modal
        className="modal_wrapper mobile-table-model top-modal-nft"
        funk={true}
        fade={false}
        isOpen={isOpen}
        toggle={toggle}
      >

        <div className="modal_header_wrapper">
          <ModalHeader className="modal_title" toggle={toggle}>
            {title}
          </ModalHeader>
          <div className="close_btn" onClick={toggle}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 3C9.705 3 3 9.705 3 18C3 26.295 9.705 33 18 33C26.295 33 33 26.295 33 18C33 9.705 26.295 3 18 3ZM18 30C11.385 30 6 24.615 6 18C6 11.385 11.385 6 18 6C24.615 6 30 11.385 30 18C30 24.615 24.615 30 18 30ZM23.385 10.5L18 15.885L12.615 10.5L10.5 12.615L15.885 18L10.5 23.385L12.615 25.5L18 20.115L23.385 25.5L25.5 23.385L20.115 18L25.5 12.615L23.385 10.5Z"
                fill="black"
              />
            </svg>
          </div>
        </div>

        <ModalBody>

          <div className="modal_body_wrapper ">
            {title === "MAKE OFFER" && <> <div className="quantity ">
              <label htmlFor="quantity" className='col-xl-6 col-5'>{quantityLabel}</label>
              <div className="number-input-wrapper col-xl-6 col-7">
                <input type="number" onWheel={(e: any) => e.target.blur()} onChange={(e: any) => setQuantity(
                  e.target.value < 1 || e.target.value === "" ? setisQuantity(true) : e.target.value >= 1 ? setisQuantity(false) : e.target.value)}
                  min={1} value={quantity} disabled={currentProjectData && currentProjectData?.nftContractType === "ERC721" ? true : false} />
                <img
                  className="uparrow"
                  src={upIcon}
                  alt=""
                  onClick={() => setQuantity(quantity + 1 > currentProjectData?.numberOfNFTHolding ? currentProjectData?.numberOfNFTHolding : quantity + 1)}
                />
                {console.log("gggggggggggggggg", isquantity)}
                <img
                  className="downarrow"
                  src={downIcon}
                  alt=""
                  onClick={() => setQuantity(quantity - 1 <= 0 ? 1 : quantity - 1)}
                />
                {isquantity === true ?
                  <Alert className='alert-danger alert' type="error" message="Error" onClick={() => setAlert(true)} >Value must be greater than 1</Alert>
                  : ""
                }
              </div>
            </div>
              <div className="price">
                <label htmlFor="quantity" className='col-xl-6 col-5'>{priceLabel}</label>
                <div className="number-usd-wrapper col-xl-6 col-7">
                  <input type="number" onWheel={(e: any) => e.target.blur()} onChange={(e: any) => setPrice(e.target.value)} />
                  <div className='usd'><span>{price ? (price * Number(wethtoUsd)).toFixed(2) : 0}</span> in USD</div>
                </div>
              </div>
              <div className="offer_expiration ">
                <label htmlFor="quantity" className='col-5'>{offerExpirationLabel}</label>
                <div className="input_wrapper field col-7">
                  <DateRangePicker
                    format="dd-MM-yyyy hh:mm aa"
                    showMeridian
                    onChange={handleSelect}
                    ranges={[
                      {
                        label: 'Today',
                        value: [new Date(), new Date()]
                      },
                      {
                        label: 'Tomorrow',
                        value: [new Date(), addDays(new Date(), 1)]
                      },
                      {
                        label: "Next 7 days",
                        value: [new Date(), addDays(new Date(), 6)]
                      },
                      {
                        label: "Next Month",
                        value: [new Date(), addDays(new Date(), 30)]
                      }
                    ]}
                    defaultCalendarValue={[new Date, new Date]}
                  />

                </div>
              </div></>}

            {title === "SELL" && <>
              <div className="sell-options">{
                sellOption?.map((optn, ind) => <div key={ind} className={selectedSellOptn === optn?.title ? "sell-optn selected-optn" : "sell-optn"} onClick={() => setselectedSellOptn(optn?.title)}>
                  <img src={optn?.url} alt="" />
                  <div className="optn-title">{optn?.title}</div>
                </div>)
              }</div>
              {selectedSellOptn === sellOption[0]?.title && <div>
                <div className="quantity">
                  <label htmlFor="quantity" className='col-xl-6 col-5'>{quantityLabel}</label>
                  <div className="number-input-wrapper col-xl-6 col-7">
                    <input type="number" onWheel={(e: any) => e.target.blur()} onChange={(e: any) => setQuantity(e.target.value ?
                      e.target.value < 1 ? setisQuantity(true) : e.target.value === "" ? setisQuantity(true) : e.target.value >= 1 ? setisQuantity(false) : e.target.value : "")}
                      min={1} max={currentProjectData?.numberOfNFTHolding} disabled={currentProjectData?.nftContractType === "ERC721" ? true : false} value={quantity} />
                    <img
                      className="uparrow"
                      src={upIcon}
                      alt=""
                      onClick={() => setQuantity(quantity + 1 > currentProjectData?.numberOfNFTHolding ? currentProjectData?.numberOfNFTHolding : quantity + 1)}
                    />
                    <img
                      className="downarrow"
                      src={downIcon}
                      alt=""
                      onClick={() => setQuantity(quantity - 1 <= 0 ? 1 : quantity - 1)}
                    />
                    {isquantity === true ?
                      <Alert className='alert-danger alert' type="error" message="Error" onClick={() => setAlert(true)} >Value must be greater than 1</Alert>
                      : ""
                    }
                  </div>
                </div>
                <div className="price">
                  <label htmlFor="quantity" className='col-xl-6 col-5'>{priceLabel}</label>
                  <div className="number-usd-wrapper col-xl-6 col-7">
                    <input type="number" onWheel={(e: any) => e.target.blur()} onChange={(e) => setPrice(e.target.value)
                    } />
                    <div className='usd'><span>{price ? (price * Number(wethtoUsd)).toFixed(2) : 0}</span> in USD</div>
                  </div>
                </div>
                <div className="offer_expiration">
                  <label htmlFor="quantity" className='col-xl-6 col-5'>{offerExpirationLabel}</label>
                  <div className="input_wrapper col-xl-6 col-7" >
                    {/* <div className="number-input-wrapper">
                      <input type="date" min={disablePastDate()} ref={offerRef} onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })
                      } />
                    </div>
                    <input type="time" onChange={(e) => setDateTime({ ...dateTime, time: e.target.value })} /> */}
                    <div className="field">
                      <DateRangePicker
                        format="dd-MM-yyyy hh:mm aa"
                        showMeridian
                        onChange={handleSelect}
                        ranges={[
                          {
                            label: 'Today',
                            value: [new Date(), new Date()]
                          },
                          {
                            label: 'Tomorrow',
                            value: [new Date(), addDays(new Date(), 1)]
                          },
                          {
                            label: "Next 7 days",
                            value: [new Date(), addDays(new Date(), 6)]
                          },
                          {
                            label: "Next Month",
                            value: [new Date(), addDays(new Date(), 30)]
                          }
                        ]}
                        defaultCalendarValue={[new Date(), addDays(new Date(), 6)]}
                      />
                    </div>
                  </div>
                </div>
              </div>}
              {selectedSellOptn === sellOption[1]?.title && <div className="time-auction">

                <div className="time-wrapper">
                  <div className="label col-xl-6 col-5">Method</div>
                  <div className="inputs col-xl-6 col-7">
                    <div className="quantity-wrapper">
                      <select name="Quantity" id="quantity" onChange={(e) => setSelectedMethod(e.target.value)} value={selectedMethod}>
                        {
                          bidMethods?.map((method) => <option value={method?.value}>{method?.label}</option>)
                        }
                      </select>
                      <img
                        className="downarrow"
                        src={downIcon}
                        alt="drop icon"
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="time-wrapper">
                  <div className="label col-xl-6 col-5">Quantity</div>
                  <div className="inputs col-xl-6 col-7">
                    <div className="quantity-wrapper">
                      <input type="number" onWheel={(e: any) => e.target.blur()} onChange={(e) => {
                        setQuantity(e.target.value)
                      }
                      } min={1} max={currentProjectData?.numberOfNFTHolding} disabled={currentProjectData?.nftContractType === "ERC721" ? true : false} value={quantity} />
                      <img
                        className="uparrow"
                        src={upIcon}
                        alt=""
                        onClick={() => setQuantity(quantity + 1 > currentProjectData?.numberOfNFTHolding ? currentProjectData?.numberOfNFTHolding : quantity + 1)}
                      />
                      <img
                        className="downarrow"
                        src={downIcon}
                        alt="drop icon"
                        onClick={() => setQuantity(quantity - 1 <= 0 ? 1 : quantity - 1)}
                      />
                      {isquantity === true ?
                        <Alert className='alert-danger alert' type="error" message="Error" onClick={() => setAlert(true)} >Value must be greater than 1</Alert>
                        : ""
                      }
                    </div>
                  </div>
                </div>



                <div className="time-wrapper time-wrapper-small">
                  <div className="label col-xl-6 col-5">Starting Price</div>
                  <div className="inputs inputs-price-small col-xl-6 col-7">
                    <div className="time-chain">
                      <select name="chain" id="chain">
                        <option value="eth">{network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}</option>
                        {/* <option value="bnb">WBNB</option> */}
                      </select>
                      <img
                        className="downarrow"
                        src={downIcon}
                        alt="drop icon"
                      />
                    </div>
                    <div className="usd-input">
                      <div className="usd">
                        <input type="number" placeholder="0" onChange={(e) => setStartingPrice(e.target.value)} />
                      </div>
                      <div className="usd-covert">{startingPrice?.length ? Number(startingPrice) * Number(wethtoUsd) : 0} in USD</div>
                    </div>
                  </div>
                </div>

                <div className="time-wrapper time-wrapper-small">
                  <div className="label col-xl-6 col-5">Duration</div>
                  <div className="inputs inputs-small col-xl-6 col-7">
                    <div className="input_wrapper">
                      <div className="field">
                        <DateRangePicker
                          format="dd-MM-yyyy hh:mm aa"
                          showMeridian
                          onChange={handleSelect}
                          ranges={[
                            {
                              label: 'Today',
                              value: [new Date(), new Date()]
                            },
                            {
                              label: 'Tomorrow',
                              value: [new Date(), addDays(new Date(), 1)]
                            },
                            {
                              label: "Next 7 days",
                              value: [new Date(), addDays(new Date(), 6)]
                            },
                            {
                              label: "Next Month",
                              value: [new Date(), addDays(new Date(), 30)]
                            }
                          ]}
                          defaultCalendarValue={[new Date(), addDays(new Date(), 6)]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMethod === "lowest" && <div className="time-wrapper">
                  <div className="label col-xl-6 col-5">Ending Price</div>
                  <div className="inputs col-xl-6 col-7">
                    <div className="time-chain">
                      <select name="chain" id="chain">
                        <option value="eth">{network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}</option>
                        {/* <option value="bnb">WBNB</option> */}
                      </select>
                      <img
                        className="downarrow"
                        src={downIcon}
                        alt="drop icon"
                      />
                    </div>
                    <div className="usd-input">
                      <div className="usd">
                        <input type="number" placeholder="0" onWheel={(e: any) => e.target.blur()} onChange={(e) => setEndingPrice(e.target.value)} />
                      </div>
                      <div className="usd-covert">{endingPrice?.length ? Number(endingPrice) * Number(wethtoUsd) : 0} in USD</div>
                    </div>
                  </div>
                </div>}
                {/* <div className="time-wrapper">
                  <div className="label">Include Reserve</div>
                  <div className="inputs">
                    <div className="toggle-switch">
                      <input type="checkbox" id="switch" onChange={(e) => setiIcludeReverse(e.target.checked)} /><label htmlFor="switch">Toggle</label>
                    </div>
                  </div>
                </div>

                {includeReverse && <div className="time-wrapper">
                  <div className="label">Price</div>
                  <div className="inputs">
                    <div className="time-chain">
                      <select name="chain" id="chain">
                        <option value="eth">ETH</option>
                        <option value="bnb">BNB</option>
                      </select>
                      <img
                        className="downarrow"
                        src={downIcon}
                        alt="drop icon"
                      />
                    </div>
                    <div className="usd-input">
                      <div className="usd">
                        <input type="number" placeholder="0" onChange={(e) => setTimedPrice(e.target.value)} />
                      </div>
                      <div className="usd-covert">{timedPrice?.length ? Number(timedPrice) * Number(wethtoUsd) : 0} in USD</div>
                    </div>
                  </div>
                </div>} */}
              </div>}
            </>}

          </div>

          {footerText && <div className="footer-text">{footerText}</div>}
          <div className="fees-wrapper">
            <div className="fees-desc-wrapper">
              <div className="fees-label fees-main-label">Fees</div>
              <div className="fees-info">
                <Info color='black' />
              </div>
            </div>
            <div className="fees-desc-wrapper">
              <div className="fees-label">Service Fee</div>
              <div className="fees-value">{Number(commissionInfoForNFT != 0 ? commissionInfoForNFT / 10 : 0).toFixed(2)}%</div>
            </div>
            <div className="fees-desc-wrapper">
              <div className="fees-label">Creator Fee</div>
              <div className="fees-value">{Number(creatorFeesForNFT).toFixed(2)}%</div>
            </div>
          </div>

          <div
            className={
              addFundBtn && successBtn
                ? 'modal_footer btnspace'
                : 'modal_footer'
            }
          >
            {addFundBtn ? (
              <Button className="bottomBtn1_btn" onClick={toggleAddFundModal}>
                {addFundBtn}
              </Button>
            ) : (
              ''
            )}
            {successBtn ? (
              <Button className="bottomBtn2_btn" onClick={handleApprove}>
                {successBtn}
              </Button>
            ) : (
              ''
            )}
          </div>
        </ModalBody>
      </Modal>

    </>
  )
}

export default NFTPageModal