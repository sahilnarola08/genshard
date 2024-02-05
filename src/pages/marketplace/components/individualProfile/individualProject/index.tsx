import { useEffect, useState, useRef } from 'react'
import moment from "moment";
import BackIcon from '../../../../../images/marketplace/back-back.svg'
import garenImage from '../../../../../images/marketplace/you_belong_to_me_by_aquasixio-d799lr2 1.png'
import LikeIcon from '../../../../../images/marketplace/Like.png'
import HideIcon from '../../../../../images/marketplace/HideVector.svg'
import TableModal from './modal'
import NFTPageModal from './modal/placeBidModal'
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom'
import { Users } from 'react-feather'
import ApexCharts from '../../customChart'
import { AppState } from '../../../../../state'
import { useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import { isVideoFormat } from '../../../../market/helper'
import './style.sass'
// import { useMoralisWeb3Api } from "react-moralis";
import NftOwnerModal from './modal/nftOwnerModal'
import { apiBaseUrl, GEN_NFT_MARKETPLACE_ADDRESS_DATA, GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA, MORALIST_API_KEY, MORALIS_API_SERVER_URL } from '../../../../../constants'
import { useActiveWeb3React } from '../../../../../hooks/web3'
import { calculateGasMargin, getContract, getERC20Contract, getEtherscanLink, shortenAddress, getScrollPercent, getScrollPercentOfElement } from '../../../../../utils'
import { abi as GS_MARKETPLACE_ABI } from '../../../../../contracts/GSMarketPlace1.json';
import { useWeb3Contract } from '../../../../../hooks/useContract'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { useAddPopup } from '../../../../../state/application/hooks'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../../../state/transactions/hooks'
import LoaderComp from '../../../../../shared/components/LoaderComponent'
import { useApproveForBuyNowMarketPlace, useApproveForListPostingERC1155, useApproveForListPostingERC721 } from '../../../../../state/ticket/hooks'
import { abi as ERC1155_ABI } from '../../../../../contracts/IERC1155.json';
import { abi as ERC721_ABI } from '../../../../../contracts/IERC721.json';
import { Repeat, Wind, List, Navigation } from 'react-feather'
import { useIPFS } from '../../../../../hooks/useIPFS';
import DetailsModal from './modal/detailsModal';
import ApproveModal from '../../approveModal';
import PurchaseSuccessModal from '../../purchaseSuccessModal';
import BidaModal from './modal/bidModal';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import axios from 'axios';
import { Card } from '../../../../../state/market/types';
import {
  verifyCollectionDataCallback
} from '../../../../mintNFT/API/ApiCall';
import { abi as GEN_NFT_OPEN_STORE_ERC721_ABI } from '../../../../../contracts/GenShardsOpenStoreERC721.json'
import { abi as GEN_NFT_OPEN_STORE_ERC1155_ABI } from '../../../../../contracts/GenShardsOpenStoreERC1155.json'
import Downarrow from '../../../../../images/marketplace/downArrow.svg';
import { addUserVoteForNFT, getAllNFTListingActivityData, getAllNFTListingData, getAllNFTListingTransactionData, getAllNFTSalesData, getCollectionDetailsAndStatsData, getNFTDetailsData, getNftVotesByTokens, isUserVotedForNFT, postCreateNFTListingTransactionCallBack } from '../../../API/ApiCall';
import useUserAuth from '../../../../../hooks/useUserAuth';
import StatsLevelProgressBar from '../../../../mintNFT/StatsLevelProgressBar';
import { NetworkChainId } from '../../../../../connectors';
import { useTokenLikes } from '../../../../../hooks/tokens';
import Grid from '../../../../../images/grid.svg';
import Person from '../../../../../images/person.svg';
import Shapes from '../../../../../images/shapes.svg';

function GardenofEden() {
  const { resolveLink } = useIPFS();
  const [infiniteLoader, setInfiniteLoader] = useState(false)
  const [transferInfiniteLoader, setTransferInfiniteLoader] = useState(false)
  const [listingInfiniteLoader, setListingInfiniteLoader] = useState(false)
  const [offerInfiniteLoader, setOfferInfiniteLoader] = useState(false)
  const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
  const tokenLikes = useSelector((state: AppState) => state.token.tokenLikes)

  const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()
  const { getTokenLikes } = useTokenLikes()

  const itemsLimit = 25
  const transferItemsLimit = 10
  const listingItemsLimit = 10
  const offerItemsLimit = 10

  //NFTOwners
  const itemLoadingRef = useRef(false)
  const totalItemsRef = useRef(0)
  const fetchedTotalItemsRef = useRef(0)
  const nextCursor = useRef(undefined)

  //Transfer History
  const transferItemLoadingRef = useRef(false)
  const transferTotalItemsRef = useRef(0)
  const transferFetchedTotalItemsRef = useRef(0)
  const transferNextCursor = useRef(undefined)

  //Listing History
  const listingItemLoadingRef = useRef(false)
  const listingTotalItemsRef = useRef(0)
  const listingFetchedTotalItemsRef = useRef(0)
  const listingNextCursor = useRef(0)

  //Offer History
  const offerItemLoadingRef = useRef(false)
  const offerTotalItemsRef = useRef(0)
  const offerFetchedTotalItemsRef = useRef(0)
  const offerNextCursor = useRef(0)

  const params = useParams<{ nftcontractaddress: string, tokenid: string }>()
  const bottomImges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const drop = ["Transfers", "Sales", "Listings", "Offers"]
  const checkUserApproveBuyNowForMarketPlace = useApproveForBuyNowMarketPlace()
  const { account, chainId, library } = useActiveWeb3React()
  const location: any = useLocation();
  const network = useSelector((state: AppState) => state.application.network)
  const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
  const [modalOpen, setModalOpen] = useState(false)
  const [nftOwnerModal, setNftOwnerModal] = useState<boolean>(false)
  const [isSelfOwnedNFT, setIsSelfOwnedNFT] = useState<boolean>(false)
  const [detailsModal, setDetailsModal] = useState<boolean>(false)
  const [approveModal, setApproveModal] = useState<boolean>(false)
  const [isRefreshListingData, setIsRefreshListingData] = useState<boolean>(false)
  const [auctionItemObj, setAuctionItemObj] = useState<any>()
  const [selectedDrop, setselectedDrop] = useState<any>()

  const [nftOwnerModalData, setNftOwnerModalData] = useState<any[]>([])
  const [listingDataSet, setListingDataSet] = useState<any[]>([])
  const [allListingDataSet, setAllListingDataSet] = useState<any[]>([])
  const [dutchAuctionListingDataSet, setDutchAuctionListingDataSet] = useState<any[]>([])
  const [allDutchAuctionListingDataSet, setAllDutchAuctionListingDataSet] = useState<any[]>([])
  const [allAuctionListingDataSet, setAllAuctionListingDataSet] = useState<any[]>([])
  const [saleDataSet, setSaleDataSet] = useState<any[]>([])
  const [offerDataSet, setOfferDataSet] = useState<any[]>([])
  const [allOfferDataSet, setAllOfferDataSet] = useState<any[]>([])
  const [auctionItemDataSet, setAuctionItemDataSet] = useState<any[]>([])
  const [wethtoUsd, setWethtoUsd] = useState<number>(1)
  const [transfersDataSet, setTransfersDataSet] = useState<any[]>([])
  const [moreNFTsDataSet, setMoreNFTsDataSet] = useState<any[]>([])
  const [currentProjectData, setCurrentProjectData] = useState<any>({})
  const [tradeFilter, setTradeFilter] = useState(false)
  const [bidModal, setBidModal] = useState<boolean>(false)
  const genMarketPlaceContract = useWeb3Contract(GS_MARKETPLACE_ABI)
  const nftOwnerModalToggle = () => setNftOwnerModal(!nftOwnerModal)
  const addErrorPopup = useAddPopup();
  console.log("location garden => ", location.state);
  const [msg, setMsg] = useState("Please Wait")
  const addTransaction = useTransactionAdder()
  const [isLoading, setIsLoading] = useState(false)
  const wethAddress = GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA[network]
  const checkUserApproveForListERC1155 = useApproveForListPostingERC1155()
  const checkUserApproveForListERC721 = useApproveForListPostingERC721()
  const chainIdOfAPICallBack = NetworkChainId[network]
  const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
  const [lowListingPriceObj, setLowListingPriceObj] = useState<any>({})
  const [highAuctionListingPriceObj, setHighAuctionListingPriceObj] = useState<any>({})
  const [nftOwnersCursorValue, setNftOwnersCursorValue] = useState("")
  const [transfersCursorValue, setTransfersCursorValue] = useState("")
  const [getSelectedOption, setGetSelectedOption] = useState("")
  const [nftCollectionName, setNftCollectionName] = useState("")
  const [nftOwnerAddress, setNftOwnerAddress] = useState("")
  const [totalNFTOwners, setTotalNFTOwners] = useState(0)
  const [totalTradeHistory, setTotalTradeHistory] = useState(0)
  const [beginingTimestampGraph, setBeginingTimestampGraph] = useState<any>()
  const [nftChainIdValue, setNftChainIdValue] = useState<any>()
  const statusArray = ['0', '1', '2', '3'];
  const [creatorFeesForNFT, setCreatorFeesForNFT] = useState(0.0)
  const [commissionInfoForNFT, setCommissionInfoForNFT] = useState(0.0)
  const [collectionDet, setCollectionDet] = useState<any>({})
  const [favoriteDetails, setFavoriteDetails] = useState<{ totalLikes: number, isFavorite: boolean }>({ totalLikes: 0, isFavorite: false })

  const tempChartData = [
    {
      "id": 1,
      "listingItemId": "15",
      "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      "listingTokenID": "1",
      "listingItemDuration": "1227903",
      "listingPriceDetails": "0.20004",
      "listingAmount": "1",
      "listingAssetType": "2",
      "listingTime": "1642458959",
      "listingItemStatus": "2"
    },
    {
      "id": 2,
      "listingItemId": "16",
      "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      "listingTokenID": "1",
      "listingItemDuration": "1227903",
      "listingPriceDetails": "0.5002",
      "listingAmount": "1",
      "listingAssetType": "2",
      "listingTime": "1645137359",
      "listingItemStatus": "2"
    },
    {
      "id": 3,
      "listingItemId": "17",
      "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      "listingTokenID": "1",
      "listingItemDuration": "1227903",
      "listingPriceDetails": "0.1000009",
      "listingAmount": "1",
      "listingAssetType": "2",
      "listingTime": "1647988559",
      "listingItemStatus": "2"
    },
    {
      "id": 4,
      "listingItemId": "18",
      "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      "listingTokenID": "1",
      "listingItemDuration": "1227903",
      "listingPriceDetails": "0.80005",
      "listingAmount": "1",
      "listingAssetType": "2",
      "listingTime": "1650321359",
      "listingItemStatus": "2"
    },
    {
      "id": 5,
      "listingItemId": "19",
      "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      "listingTokenID": "1",
      "listingItemDuration": "1227903",
      "listingPriceDetails": "0.950006",
      "listingAmount": "1",
      "listingAssetType": "2",
      "listingTime": "1656714959",
      "listingItemStatus": "2"
    }
  ]

  const isRealValue = (obj: any) => {
    return obj && obj !== 'null' && obj !== 'undefined';
  }

  const levelsData = []
  const statsData = []

  const [filterGraphData, setFilterGraphData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const sekkingOptions = [
    "Last 7 days",
    "Last 14 days",
    "Last 30 days",
    "Last 60 days",
    "Last 90 days",
    "Last year",
    "All time"
  ]

  const [selectedPriceHistoryFilter, setSelectedPriceHistoryFilter] = useState(sekkingOptions[sekkingOptions?.length - 1])

  const [nftDataItem, setNftDataItem] = useState({} as Card)
  console.log("currentProjectData => ", currentProjectData);

  const { path } = useRouteMatch()

  const detailsModalToggle = () => setDetailsModal(!detailsModal)
  const approveModalToggle = () => setApproveModal(!approveModal)

  const bidModalToggle = () => setBidModal(!bidModal)
  const tradeFilterToggle = () => setTradeFilter(!tradeFilter)

  const allProperties = [{ trait_type: 'TGE', value: 'TBD' }
    , { trait_type: 'Vesting', value: '5 Days' }
    , { trait_type: 'Size', value: '5' }
    , { trait_type: 'Type', value: 'Pink' }
    , { trait_type: 'Token', value: 'ANAND' }]

  // const Web3Api = useMoralisWeb3Api();

  const wethToUsdValue = async () => {
    try {
      let getkeyValue = (network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd' + '&ids=' + getkeyValue.toLocaleLowerCase())
      return (response.data[getkeyValue.toLocaleLowerCase()] && response.data[getkeyValue.toLocaleLowerCase()]["usd"]) || 1
    } catch (ex) {
      console.log(ex, 'Error in gstoUsd')
      return 1
    }
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const fetchTokenIdMetadata = async (nftAddress: string, tokenId: string) => {

    // const tokenIdMetadataOptions = {
    //   address: nftAddress,
    //   token_id: tokenId,
    //   chain: networkName,
    // };

    setIsLoading(true)
    setMsg("Please wait")

    const tokenIdMetadataOptions = {
      method: 'GET',
      url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/${tokenId}`,
      params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true' },
      headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
    };
    console.log("tokenIdMetadataOptions", tokenIdMetadataOptions);

    try {
      await axios
        .request(tokenIdMetadataOptions as any)
        .then(async function (response) {
          console.log(response.data);
          const nftItem = await response.data //await Web3Api.token.getTokenIdMetadata(tokenIdMetadataOptions as any);
          console.log("fetchTokenIdMetadata Res", nftItem);

          const nftCollectionMetadata = {}
          const nftMetaDataJson = JSON.parse(nftItem?.metadata as any)
          let balanceOfNFT = 0 //Number(nftItem?.amount) ?? 0
          const baseURIOfNFT = ''
          let nameOfNFT = ''
          let nameOfNFTProject = nftMetaDataJson?.name ?? ''
          let symbolOfNFT = ''
          let symbolOfNFTProject = nftMetaDataJson?.symbol ?? ''
          const tokenURIOfNFT = nftItem?.token_uri ?? ''
          const nftContractType = nftItem?.contract_type ?? ''

          try {
            const nftTokenMarketContract = getContract(nftAddress, nftContractType == "ERC721" ? GEN_NFT_OPEN_STORE_ERC721_ABI : GEN_NFT_OPEN_STORE_ERC1155_ABI, library!, account!)
            if (!nftTokenMarketContract) throw new Error('No Contract!')
            let ownerAddress = ''
            let tokenBalanceOfNFTS = 0
            if (nftContractType == "ERC721") {
              try {
                ownerAddress = await nftTokenMarketContract.ownerOf(tokenId)
              } catch (error) {
                console.log('Failed to retried Owner Verification Information from Contract');
              }
              if (ownerAddress?.toLowerCase() === account?.toLowerCase()) {
                setIsSelfOwnedNFT(true)
                tokenBalanceOfNFTS = 1
              }
              else {
                setIsSelfOwnedNFT(false)
              }
              balanceOfNFT = Number(tokenBalanceOfNFTS)
            }
            else {
              try {
                tokenBalanceOfNFTS = await nftTokenMarketContract.balanceOf(account!, tokenId)
              } catch (error) {
                console.log('Failed to retried Owner Verification Information from Contract');
              }
              balanceOfNFT = Number(tokenBalanceOfNFTS)
              if (Number(tokenBalanceOfNFTS) > 0) {
                setIsSelfOwnedNFT(true)
              }
              else {
                setIsSelfOwnedNFT(false)
              }
            }

            console.log('getCreatorInfo', parseUnits("100"));
            try {
              let getCreatorInfo = await nftTokenMarketContract.royaltyInfo(Number(tokenId), parseUnits("100"))
              console.log('getCreatorInfo', getCreatorInfo, formatUnits(getCreatorInfo[1]));
              setCreatorFeesForNFT(getCreatorInfo && getCreatorInfo.length > 0 ? Number(formatUnits(getCreatorInfo[1] || "0")) : 0)
            } catch (error) {
              console.log('Failed to retried Owner Verification Information from Contract');
            }

            try {
              // getComissionsInfo
              const getContractComissionInfo: any = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getComissionsInfo().call()
              console.log('getContractComissionInfo', getContractComissionInfo);
              setCommissionInfoForNFT(getContractComissionInfo && getContractComissionInfo?._comissionSet > 0 ? getContractComissionInfo?._comissionSet / 10 : 0)
            } catch (error) {
              console.log('Failed to retried Owner Verification Information from Contract');
            }

          } catch (error) {
            setIsSelfOwnedNFT(false)
            console.log('Failed to retried Owner Verification Information from Contract');
          }

          let nftImage = ''
          let nftName = nameOfNFT
          let nftDescription = ''
          let nftAttributes = []

          if (isRealValue(nftItem?.metadata)) {
            nftImage = resolveLink(nftMetaDataJson?.image)
            nftName = nftMetaDataJson?.name
            nftDescription = nftMetaDataJson?.description
            nftAttributes = nftMetaDataJson?.attributes
          } else if (tokenURIOfNFT) {
            try {
              await fetch(tokenURIOfNFT)
                .then((response) => response.json())
                .then((data) => {
                  nftImage = resolveLink(data?.image ? data?.image : data?.image_url ? data?.image_url : '')
                  nftName = data?.name
                  nftDescription = data?.description
                  nftAttributes = data?.attributes
                });
            } catch (error) {
              console.log('Failed to retried assets information from tokenURI');
            }
          }

          console.log("Logologogogoog", nftName, tokenURIOfNFT, nftItem?.metadata);

          const nftDataItemObj = {
            recordId: 1,
            nftBuyer: "0x0000000000000000000000000000000000000000",
            nftContract: nftAddress,
            nftState: "0",
            //@ts-ignore
            nftSeller: nftItem?.owner_of ?? "", //location?.state?.nftSeller ?? "", //
            nftTokenId: tokenId,
            nftPrice: 0,
            numberOfNFTHolding: balanceOfNFT,
            baseURIOfNFT: baseURIOfNFT,
            nameOfNFT: nftName,
            nameOfNFTProject: nameOfNFTProject,
            symbolOfNFT: symbolOfNFT,
            symbolOfNFTProject: symbolOfNFTProject,
            tokenURIOfNFT: tokenURIOfNFT,
            nftContractType: nftContractType,
            nftMetaData: nftMetaDataJson,
            nftCollectionMetaData: nftCollectionMetadata,
            nftMetaDataImageURL: nftImage,
            nftMetaDataName: nftName,
            nftMetaDataDescription: nftDescription,
            nftAttributes: nftAttributes,
            src: nftImage,
            name: nftName,
            total: "0",
            remain: "0",
            balance: "0",
            description: nftDescription, //ticketMeta?.description,
            price: "0",
            networkChainIdValue: chainIdOfAPICallBack,
            networkChainName: networkName.toUpperCase(),
            index: Number(nftItem?.token_id)
          } as Card;

          console.log('nftDataItemObjnftDataItemObj', nftDataItemObj);
          setCurrentProjectData(nftDataItemObj)
          setIsLoading(false)
          setMsg("Please wait")
          await getAllOtherBlockchainNFTData(nftAddress, tokenId, nftDataItemObj)
        })
        .catch(function (error) {
          setIsLoading(false)
          setMsg("Please wait")
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: "No metadata found! Try again later",
              description: "",
              withExternalLink: false,
            }
          });
          const nftDataItemObj = {
            nftContract: nftAddress,
            nftTokenId: tokenId
          } as Card;
          console.log('nftDataItemObjnftDataItemObj ERR', nftDataItemObj);
          setCurrentProjectData(nftDataItemObj)
          getAllOtherBlockchainNFTData(nftAddress, tokenId, nftDataItemObj)
          console.error(error);
        });
    }
    catch (error: any) {
      setIsLoading(false)
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: "No metadata found! Try again later",
          description: "",
          withExternalLink: false,
        }
      });
      const nftDataItemObj = {
        nftContract: nftAddress,
        nftTokenId: tokenId
      } as Card;
      console.log('nftDataItemObjnftDataItemObj ERR', nftDataItemObj);
      setCurrentProjectData(nftDataItemObj)
      getAllOtherBlockchainNFTData(nftAddress, tokenId, nftDataItemObj)
    }
  };

  const fetchTokenIdMetadataFromBackend = async (nftAddress: string, tokenId: string) => {

    setIsLoading(true)
    setMsg("Retrieiving NFT Details")

    try {
      await getNFTDetailsData(
        nftAddress,
        tokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const mintNFTData = await res.data
          console.log('mintNFTData', mintNFTData);
          if (mintNFTData.values.length > 0) {
            let nftItem = mintNFTData.values[0]
            let balanceOfNFT = Number(nftItem?.supply) ?? 0
            const baseURIOfNFT = ''
            const nameOfNFT = nftItem?.name ?? ''
            const nameOfNFTProject = nftItem?.nftCollection?.name ?? ''
            const symbolOfNFT = ''
            const symbolOfNFTProject = '' //nftCollectionMetadata?.symbol ?? ''
            const tokenURIOfNFT = nftItem?.jsonUrl ?? ''
            const nftContractType = nftItem?.nftCollection?.assetType === 1 ? 'ERC721' : nftItem?.nftCollection?.assetType === 2 ? 'ERC1155' : ''

            try {
              const nftTokenMarketContract = getContract(nftAddress, nftContractType == "ERC721" ? GEN_NFT_OPEN_STORE_ERC721_ABI : GEN_NFT_OPEN_STORE_ERC1155_ABI, library!, account!)
              if (!nftTokenMarketContract) throw new Error('No Contract!')
              let ownerAddress = ''
              let tokenBalanceOfNFTS = 0
              if (nftContractType == "ERC721") {
                try {
                  ownerAddress = await nftTokenMarketContract.ownerOf(tokenId)
                } catch (error) {
                  console.log('Failed to retried Owner Verification Information from Contract');
                }

                if (ownerAddress?.toLowerCase() === account?.toLowerCase()) {
                  setIsSelfOwnedNFT(true)
                  tokenBalanceOfNFTS = 1
                }
                else {
                  setIsSelfOwnedNFT(false)
                }
                balanceOfNFT = Number(tokenBalanceOfNFTS)
              }
              else {
                try {
                  tokenBalanceOfNFTS = await nftTokenMarketContract.balanceOf(account!, tokenId)
                } catch (error) {
                  console.log('Failed to retried Owner Verification Information from Contract');
                }
                balanceOfNFT = Number(tokenBalanceOfNFTS)

                if (Number(tokenBalanceOfNFTS) > 0) {
                  setIsSelfOwnedNFT(true)
                }
                else {
                  setIsSelfOwnedNFT(false)
                }
              }

              console.log('getCreatorInfo Initial', nftTokenMarketContract, Number(tokenId), parseEther("100"));
              try {
                let getCreatorInfo = await nftTokenMarketContract.royaltyInfo(Number(tokenId), parseEther("100"))
                console.log('getCreatorInfo', getCreatorInfo, formatUnits(getCreatorInfo[1]));
                setCreatorFeesForNFT(getCreatorInfo && getCreatorInfo.length > 0 ? Number(formatUnits(getCreatorInfo[1] || "0")) : 0)
              } catch (error) {
                console.log('Failed to retried getCreatorInfo Information from Contract');
              }

              try {

                // getComissionsInfo
                const getContractComissionInfo: any = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getComissionsInfo().call()
                console.log('getContractComissionInfo', getContractComissionInfo);
                setCommissionInfoForNFT(getContractComissionInfo && getContractComissionInfo?._comissionSet > 0 ? getContractComissionInfo?._comissionSet / 10 : 0)
              } catch (error) {
                console.log('Failed to retried getContractComissionInfo from Contract');
              }

            } catch (error) {
              setIsSelfOwnedNFT(false)
              console.log('Failed to retried Owner Verification Information from Contract');
            }

            let nftImage = ''
            let nftName = nameOfNFT
            let nftDescription = ''
            let nftAttributes = []
            let nftLevels = []
            let nftStats = []

            if (isRealValue(nftItem?.nftAsset)) {
              nftImage = resolveLink(nftItem?.nftAsset)
              nftName = nftItem?.name
              nftDescription = nftItem?.description
              nftAttributes = nftItem?.property ?? []
              nftLevels = nftItem?.levels ?? []
              nftStats = nftItem?.stats ?? []
            } else if (tokenURIOfNFT) {
              try {
                await fetch(tokenURIOfNFT)
                  .then((response) => response.json())
                  .then((data) => {
                    nftImage = resolveLink(data?.image ? data?.image : data?.image_url ? data?.image_url : '')
                    nftName = data?.name
                    nftDescription = data?.description
                    nftAttributes = data?.attributes
                  });
              } catch (error) {
                console.log('Failed to retried assets information from tokenURI');
              }
            }
            const platformChain = Number(nftItem?.chainId)
            const nftNetworkName = (Number(platformChain) === 137 ? 'matic' : Number(platformChain) === 80001 ? 'matic testnet' : Number(platformChain) === 56 ? 'bsc' : Number(platformChain) === 97 ? 'bsc testnet' : Number(platformChain) === 5 ? 'goerli' : Number(platformChain) === 4690 ? 'iotx testnet' : Number(platformChain) === 4689 ? 'iotx' : Number(platformChain) === 1666700000 ? 'one testnet' : Number(platformChain) === 1666600000 ? 'one' : Number(platformChain) === 43113 ? 'avalanche testnet' : Number(platformChain) === 43114 ? 'avalanche' : String("eth").toLowerCase())
            const nftDataItemObj = {
              recordId: 1,
              nftBuyer: "0x0000000000000000000000000000000000000000",
              nftContract: nftAddress ?? "",
              nftState: "0",
              //@ts-ignore
              nftSeller: "", //location?.state?.nftSeller ?? "", //
              nftTokenId: tokenId,
              nftPrice: 0,
              numberOfNFTHolding: balanceOfNFT,
              baseURIOfNFT: baseURIOfNFT,
              nameOfNFT: nftName,
              nameOfNFTProject: nameOfNFTProject,
              symbolOfNFT: symbolOfNFT,
              symbolOfNFTProject: symbolOfNFTProject,
              tokenURIOfNFT: tokenURIOfNFT,
              nftContractType: nftContractType,
              nftMetaData: {},
              nftCollectionMetaData: {},
              nftMetaDataImageURL: nftImage,
              nftMetaDataName: nftName,
              nftMetaDataDescription: nftDescription,
              nftAttributes: nftAttributes,
              nftLevels: nftLevels,
              nftStats: nftStats,
              src: nftImage,
              name: nftName,
              total: "0",
              remain: "0",
              balance: "0",
              description: nftDescription, //ticketMeta?.description,
              price: "0",
              networkChainIdValue: platformChain,
              networkChainName: nftNetworkName.toUpperCase(),
              index: 0
            } as Card;

            console.log('nftDataItemObjnftDataItemObj', nftDataItemObj);
            setCurrentProjectData(nftDataItemObj)
            await getAllOtherBlockchainNFTData(nftAddress, tokenId, nftDataItemObj)
          }
          else {
            fetchTokenIdMetadata(nftAddress, tokenId)
          }
        }
        else {
          fetchTokenIdMetadata(nftAddress, tokenId)
        }
      }).catch(err => {
        console.log(err.message || 'Error while getting collection data ')
        fetchTokenIdMetadata(nftAddress, tokenId)
      })
    }
    catch (error: any) {
      fetchTokenIdMetadata(nftAddress, tokenId)
    }
  };

  const getAllOtherBlockchainNFTData = async (nftAddress: any, tokenId: any, nftDataItemObject?: any) => {
    try {
      postVerifyCollectionCallback(nftAddress ?? '')
      setTransfersCursorValue("")
      setNftOwnersCursorValue("")
      setAuctionItemDataSet([])

      setDutchAuctionListingDataSet([])
      setAllDutchAuctionListingDataSet([])

      setAllListingDataSet([])
      setListingDataSet([])
      setSaleDataSet([])

      setOfferDataSet([])
      setAllOfferDataSet([])

      setNftOwnerModalData([])
      setTransfersDataSet([])
      setMoreNFTsDataSet([])
      setselectedDrop("Transfers")

      nextCursor.current = undefined
      fetchedTotalItemsRef.current = 0
      totalItemsRef.current = 0
      if (nftDataItemObject && nftDataItemObject?.nftContractType) {
        await fetchNFTOwners(nftDataItemObject?.nftContractType ?? '', nftAddress, tokenId, undefined)
      }
      transferNextCursor.current = undefined
      transferFetchedTotalItemsRef.current = 0
      transferTotalItemsRef.current = 0

      //Listing History
      listingNextCursor.current = 0
      listingFetchedTotalItemsRef.current = 0
      listingNextCursor.current = 0

      //Offer History
      offerNextCursor.current = 0
      offerFetchedTotalItemsRef.current = 0
      offerNextCursor.current = 0

      await fetchAllTokenIds(nftAddress)
      if (nftDataItemObject && nftDataItemObject?.nftContractType) {
        await fetchWalletTokenIdTransfers(nftDataItemObject?.nftContractType ?? '', nftAddress, tokenId, undefined)
      }
      var getAllListedItemIds: any = []
      var getAllOfferedItemIds: any = []
      var getAllAuctionItemIds: any = []
      var getAllDutchAuctionItemIds: any = []

      var getAllItemIdsArray = await Promise.all(statusArray.map(async (i) => {
        // getComissionsInfo
        const getStatusWiseArrayDT: any = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getAllItemIdss(nftAddress, tokenId, i).call()
        console.log('getStatusWiseArrayDT', getStatusWiseArrayDT);
        getAllListedItemIds = [].concat(getAllListedItemIds, getStatusWiseArrayDT.allListedItemIds);
        getAllOfferedItemIds = [].concat(getAllOfferedItemIds, getStatusWiseArrayDT.allOfferedItemIds);
        getAllAuctionItemIds = [].concat(getAllAuctionItemIds, getStatusWiseArrayDT.allAuctionedItemIds);
        getAllDutchAuctionItemIds = [].concat(getAllDutchAuctionItemIds, getStatusWiseArrayDT.allDutchItemIds);
        return
      }));

      console.log('getAllItemIdsArray', getAllItemIdsArray, nftAddress, tokenId);
      console.log('getAllListedItemIds', getAllListedItemIds);
      console.log('getAllOfferedItemIds', getAllOfferedItemIds);
      console.log('getAllAuctionItemIds', getAllAuctionItemIds);
      console.log('getAllDutchAuctionItemIds', getAllDutchAuctionItemIds);

      await fetchAuctionDetails(nftDataItemObject, getAllAuctionItemIds.filter(unique) ?? [], nftAddress, tokenId)
      await fetchListingDetails(nftDataItemObject, getAllListedItemIds.filter(unique) ?? [], nftAddress, tokenId)
      await fetchOfferDetails(nftDataItemObject, getAllOfferedItemIds.filter(unique) ?? [], nftAddress, tokenId)
      await fetchDutchAuctionDetails(nftDataItemObject, getAllDutchAuctionItemIds.filter(unique) ?? [], nftAddress, tokenId)
      setIsLoading(false)
    }
    catch (error: any) {
    }
  };

  const fetchAuthToken = async () => {
    try {
      if (account && account !== storedAddress && library) {
        return await getUserAuthToken()
      }
    }
    catch (error: any) {
    }
  };

  const fetchCollectionMetadata = async (nftAddress: string) => {

    const collectionMetadataOptions = {
      method: 'GET',
      url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/metadata`,
      params: { chain: networkName },
      headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
    };

    console.log("collectionMetadataOptions", collectionMetadataOptions);

    try {
      await axios
        .request(collectionMetadataOptions as any)
        .then(async function (response) {
          console.log(response.data);
          const nftItem = await response.data //await Web3Api.token.getTokenIdMetadata(tokenIdMetadataOptions as any);
          console.log("fetchCollectionMetadata Res", nftItem);
          let collectionDetObj = {
            collectionAssetType: nftItem?.contract_type === "ERC721" ? 1 : nftItem?.contract_type === "ERC1155" ? 2 : 0,
            collectionBannerImage: "",
            collectionBaseUri: "",
            collectionBlockNumber: "",
            collectionCategory: "",
            collectionChainId: "",
            collectionAddress: nftItem?.token_address,
            collectionId: "",
            collectionCreatedDate: "",
            collectionCreatorAddress: "",
            collectionCreatorEarnings: "",
            collectionCustomCollectionURL: "",
            collectionDescription: "",
            collectionFeaturedImage: "",
            collectionIsConfirmed: "",
            collectionIsExplicitSensitive: "",
            collectionIsVerified: "",
            collectionIsVisibleForPromotion: "",
            collectionJsonURL: "",
            collectionLinks: "",
            collectionLogoImage: "",
            collectionLowestPrice: 0,
            collectionName: nftItem?.name,
            collectionOwnerOf: "",
            collectionPaymentTokens: "",
            collectionSymbol: nftItem?.symbol,
            collectionTopPrice: 0,
            collectionTotalItems: 0,
            collectionTotalOwners: 0,
            collectionTotalVolume: 0,
            collectionTotalSales: 0,
            collectionUpdatedDate: "",
            collectionURL: "",
            collectionUser: "",
            collectionRecordId: ""
          }
          setCollectionDet(collectionDetObj)
          // setNftCollectionName(nftItem?.name ?? '')
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    catch (error: any) {
    }
  };

  const fetchCollectionMetadataFromBackend = async (nftAddress: string) => {
    try {
      await getCollectionDetailsAndStatsData(
        nftAddress
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const collectionDetailsData = await res.data
          console.log('collectionDetailsData', collectionDetailsData);
          if (collectionDetailsData) {
            let collectionDetObj = {
              collectionAssetType: collectionDetailsData?.assetType,
              collectionBannerImage: collectionDetailsData?.bannerImage,
              collectionBaseUri: collectionDetailsData?.baseUri,
              collectionBlockNumber: collectionDetailsData?.blockNumber,
              collectionCategory: collectionDetailsData?.category,
              collectionChainId: collectionDetailsData?.chainId,
              collectionAddress: collectionDetailsData?.collectionAddress,
              collectionId: collectionDetailsData?.collectionId,
              collectionCreatedDate: collectionDetailsData?.createdDate,
              collectionCreatorAddress: collectionDetailsData?.creatorAddress,
              collectionCreatorEarnings: collectionDetailsData?.creatorEarnings,
              collectionCustomCollectionURL: collectionDetailsData?.customCollectionUrl,
              collectionDescription: collectionDetailsData?.description,
              collectionFeaturedImage: collectionDetailsData?.featuredImage,
              collectionIsConfirmed: collectionDetailsData?.isConfirmed,
              collectionIsExplicitSensitive: collectionDetailsData?.isExplicitSensitive,
              collectionIsVerified: collectionDetailsData?.isVerified,
              collectionIsVisibleForPromotion: collectionDetailsData?.isVisibleforPromotion,
              collectionJsonURL: collectionDetailsData?.jsonUrl,
              collectionLinks: collectionDetailsData?.links,
              collectionLogoImage: collectionDetailsData?.logoImage,
              collectionLowestPrice: collectionDetailsData?.lowestPrice,
              collectionName: collectionDetailsData?.name,
              collectionOwnerOf: collectionDetailsData?.ownerOf,
              collectionPaymentTokens: collectionDetailsData?.paymentTokens,
              collectionSymbol: collectionDetailsData?.symbol,
              collectionTopPrice: collectionDetailsData?.topPrice,
              collectionTotalItems: collectionDetailsData?.totalItems,
              collectionTotalOwners: collectionDetailsData?.totalOwners,
              collectionTotalVolume: collectionDetailsData?.totalVolume,
              collectionTotalSales: collectionDetailsData?.totalSales,
              collectionUpdatedDate: collectionDetailsData?.updatedDate,
              collectionURL: collectionDetailsData?.url,
              collectionUser: collectionDetailsData?.user,
              collectionRecordId: collectionDetailsData?._id
            }
            setCollectionDet(collectionDetObj)
          }
          else {
            fetchCollectionMetadata(nftAddress)
          }
        }
        else {
          fetchCollectionMetadata(nftAddress)
        }
      }).catch(err => {
        console.log(err.message || 'Error while getting collection data ')
        fetchCollectionMetadata(nftAddress)
      })
    }
    catch (error: any) {
      fetchCollectionMetadata(nftAddress)
    }
  };

  const postVerifyCollectionCallback = async (collectionAddress: string) => {
    try {
      await verifyCollectionDataCallback(collectionAddress).then(async (res: any) => {
        if (res?.status === 200) {
          console.log("verifyCollectionDataCallback", res?.message)
        }
        else {
          console.log("verifyCollectionDataCallback", res?.error)
        }
      })
    }
    catch (error: any) {
      console.log("verifyCollectionDataCallback error", error)
    }
  };

  const fetchAllTokenIds = async (nftAddress: string) => {
    try {
      // const options = {
      //   address: location?.state?.nftContract,
      //   chain: networkName,
      //   limit: 10
      // };
      const options = {
        method: 'GET',
        url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}`,
        params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true', limit: 10 },
        headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
      };

      await axios
        .request(options as any)
        .then(async function (response) {
          console.log("fetchAllTokenIds Res", response.data);
          const NFTs = await response.data; //await Web3Api.token.getAllTokenIds(options as any);
          console.log("NFTs", NFTs);
          const moreNFTs = NFTs?.result || []

          const fetchMoreActiveItemsObjArray = moreNFTs && moreNFTs?.map(async (nftItem: any, index: number) => {

            let nftMetaDataJson = JSON.parse(nftItem?.metadata)
            let nftMasterName = nftItem?.name ?? ''
            let nftName = nftItem?.name ?? ''
            let nftSymbol = nftItem?.symbol ?? ''
            let tokenURIOfNFT = nftItem?.token_uri ?? ''
            let nftImage = ''
            let nftDescription = ''
            let nftAttributes = ''

            if (nftItem?.metadata) {
              nftImage = resolveLink(nftMetaDataJson?.image)
              nftName = nftMetaDataJson?.name
              nftDescription = nftMetaDataJson?.description
              nftAttributes = nftMetaDataJson?.attributes
            } else if (nftItem?.tokenURIOfNFT) {
              try {
                await fetch(nftItem?.tokenURIOfNFT)
                  .then((response) => response.json())
                  .then((data) => {
                    nftImage = resolveLink(data?.image ? data?.image : data?.image_url ? data?.image_url : '')
                    nftName = data?.name
                    nftDescription = data?.description
                    nftAttributes = data?.attributes
                  });
              } catch (error) {
                console.log('Failed to retried assets information from tokenURI');
              }
            }

            return {
              recordId: Number(index) + 1,
              nftAmount: nftItem?.amount ?? '0',
              nftBlockNumberMinted: nftItem?.block_number_minted,
              nftContractType: nftItem?.contract_type ?? '',
              nftMetaData: nftMetaDataJson,
              nftName: nftName && nftName.length > 0 ? nftName : nftMasterName,
              nftSymbol: nftSymbol,
              nftTokenAddress: nftItem?.token_address ?? "",
              nftTokenHash: nftItem?.token_hash ?? "",
              nftTokenId: nftItem?.token_id,
              nftTokenURI: tokenURIOfNFT,
              nftImage: nftImage,
              nftDescription: nftDescription,
              networkChainIdValue: chainIdOfAPICallBack,
              networkChainName: networkName.toUpperCase(),
              nftAttributes: nftAttributes
            };

          }) || []
          const fetchMoreActiveItemsDataArray = await Promise.all(fetchMoreActiveItemsObjArray)
          console.log("fetchMoreActiveItemsDataArray", fetchMoreActiveItemsDataArray);
          const tokens = fetchMoreActiveItemsDataArray.map((item: any) => ({ tokenAddress: item.nftTokenAddress, tokenId: item.nftTokenId }))
          getTokenLikes(tokens)
          setMoreNFTsDataSet((prev: any) => [...prev, ...fetchMoreActiveItemsDataArray])

        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWalletTokenIdTransfers = async (contractType: string, nftAddress: string, tokenId: string, cursorValue?: string) => {
    console.log("transfersCursorValue", cursorValue);
    try {
      // const options = {
      //   address: location?.state?.nftContract,
      //   token_id: location?.state?.nftTokenId + '',
      //   cursor: cursorValue ? cursorValue : null,
      //   chain: networkName,
      //   limit: 25
      // };

      const options = {
        method: 'GET',
        url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/${tokenId}/transfers`,
        params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true', limit: transferItemsLimit, cursor: cursorValue ? cursorValue : null, },
        headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
      };
      console.log("transfersCursorValue Options", options);

      await axios
        .request(options as any)
        .then(async function (response) {
          console.log("fetchWalletTokenIdTransfers Res", response.data);
          const transfers = await response.data //await Web3Api.token.getWalletTokenIdTransfers(options as any);
          const transfersCursorVal = (transfers as any).cursor;
          transferNextCursor.current = (transfers as any).cursor
          transferTotalItemsRef.current = (transfers as any).total

          setTransfersCursorValue(transfersCursorVal)
          console.log("transfersCursorValue Result", transfersCursorVal);
          console.log("transfersCursorValue transfers", transfers);
          const transfersDetails = transfers?.result || []
          console.log("transfersDetails", transfersDetails);
          transfersDetails.length > 0 && transfersDetails.map((item: any, ind: number) => {
            if (item?.from_address.toLowerCase() === "0x0000000000000000000000000000000000000000".toLowerCase()) {
              setBeginingTimestampGraph(moment(item?.block_timestamp!).unix())
              return
            }
          })

          setTotalTradeHistory(Number(transfers?.total) || 0)
          setTransfersDataSet((prev: any) => [...prev, ...transfersDetails])
          console.log("transfersDetailsDataSet", transfersDetails);
          transferFetchedTotalItemsRef.current = transferFetchedTotalItemsRef.current + transfersDetails.length
          console.log("transfersDetailsDataSet", transferFetchedTotalItemsRef.current);
          if (transferItemLoadingRef.current) setTransferInfiniteLoader(prev => !prev)
          transferItemLoadingRef.current = false
          console.log("transfers", transfers);
        })
        .catch(function (error) {
          transferItemLoadingRef.current = false
          setTransferInfiniteLoader(prev => !prev)
          console.error(error);
        });
    } catch (error) {
      transferItemLoadingRef.current = false
      setTransferInfiniteLoader(prev => !prev)
      console.error(error);
    }
  };

  function dateCheck(from, to, check) {
    var fDate, lDate, cDate;
    fDate = Number(from) //Date.parse(from);
    lDate = Number(to) //Date.parse(to);
    cDate = Number(check) //Date.parse(check);
    console.log('fDate', fDate, lDate, cDate)
    if ((cDate <= lDate && cDate >= fDate)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchNFTLikedDetails()
  }, [params, storedAddress])

  const addUserVoteToNFT = async () => {
    try {
      if (!chainId || !account) return
      setIsLoading(true)
      setMsg("Please sign transaction from metamask")
      await fetchAuthToken()
      const vote = favoriteDetails.isFavorite ? 0 : 1
      setMsg(`${vote ? "Adding to" : "Remving from"} favorites`)
      const { nftcontractaddress = "", tokenid = "" } = params
      const sendObj = {
        tokenAddress: nftcontractaddress,
        tokenId: tokenid,
        chainId: chainId,
        vote: favoriteDetails.isFavorite ? 0 : 1
      }
      await addUserVoteForNFT(sendObj)
      await fetchNFTLikedDetails()
      setIsLoading(false)
      setMsg("Please wait")
    } catch (ex) {
      setMsg("Please wait")
      setIsLoading(false)
    }

  }

  const fetchNFTLikedDetails = async () => {
    const { nftcontractaddress = "", tokenid = "" } = params
    const [tokenLikes, isFavorite] = await Promise.all([
      getNftVotesByTokens([{ tokenAddress: nftcontractaddress, tokenId: tokenid }]),
      isUserVotedForNFT(nftcontractaddress, tokenid)
    ])
    const totalLikes = tokenLikes[0] && tokenLikes[0].totalLikes || 0
    setFavoriteDetails({ totalLikes, isFavorite })
  }

  useEffect(() => {
    fetchTokenIdMetadataFromBackend(params.nftcontractaddress, params.tokenid)
    fetchCollectionMetadataFromBackend(params.nftcontractaddress)
  }, [params, isRefreshListingData, network, account!, chainId])

  useEffect(() => {
    console.log("selectedPriceHistoryFilter", selectedPriceHistoryFilter);
    if (selectedPriceHistoryFilter === "All time") {
      console.log("-------------------", selectedPriceHistoryFilter);
      // setFilterGraphData(tempChartData)
      //chartData?.length <= 1 ? 
      var sorted_Results = chartData.sort((a, b) => {
        return new Date(a.itemSellTime).getTime() -
          new Date(b.itemSellTime).getTime()
      });
      setFilterGraphData([{
        "itemId": "0",
        "itemNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
        "itemTokenId": 1,
        "itemPrice": "0.000000",
        "itemSellTime": beginingTimestampGraph,
        "itemChainId": nftChainIdValue
      }, ...sorted_Results]) // : chartData
    }
    else {
      let dateTo = moment().unix() //moment(new Date()).format('DD-MM-YYYY');
      let dateFrom
      if (selectedPriceHistoryFilter === "Last year") {
        dateFrom = moment().subtract(1, "y").startOf('year').unix();
        dateTo = moment().subtract(1, "y").endOf("year").unix();
      }
      else if (selectedPriceHistoryFilter === "Last 7 days") {
        dateFrom = moment().subtract(7, 'd').unix() // moment().subtract(7, 'd').format('DD-MM-YYYY');
      }
      else if (selectedPriceHistoryFilter === "Last 14 days") {
        dateFrom = moment().subtract(14, 'd').unix();
      }
      else if (selectedPriceHistoryFilter === "Last 30 days") {
        dateFrom = moment().subtract(30, 'd').unix();
      }
      else if (selectedPriceHistoryFilter === "Last 60 days") {
        dateFrom = moment().subtract(60, 'd').unix();
      }
      else if (selectedPriceHistoryFilter === "Last 90 days") {
        dateFrom = moment().subtract(90, 'd').unix();
      }
      console.log('dateFrom', dateFrom);
      console.log('dateTo', dateTo);
      let resultsArray = [] as any
      // const filterPriceHistoryData = tempChartData.map((item: any) => {
      //   const sellPriceDate = Number(item?.sellTime)
      //   if (dateCheck(dateFrom, dateTo, sellPriceDate)) {
      //     return item;
      //   }
      // }).filter(e => e)

      // setFilterGraphData(filterPriceHistoryData?.length === 1 ? [{
      //   "id": 0,
      //   "listingItemId": "19",
      //   "listingNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
      //   "listingSeller": "0xAeF1ACC2F91B348d544ff3B44db9AB9ACfB80b0f",
      //   "listingTokenID": "1",
      //   "listingItemDuration": "1227903",
      //   "listingPriceDetails": "0.000000",
      //   "listingAmount": "1",
      //   "listingAssetType": "2",
      //   "listingTime": "1657665359",
      //   "listingItemStatus": "2"
      // }, ...filterPriceHistoryData] : filterPriceHistoryData)

      const filterPriceHistoryData = chartData.map((item: any) => {
        const sellPriceDate = Number(item?.itemSellTime) //Number(item?.itemTime) + Number(item?.itemDuration)
        if (dateCheck(dateFrom, dateTo, sellPriceDate)) {
          return item;
        }
      }).filter(e => e)

      var sorted_Results = filterPriceHistoryData.sort((a, b) => {
        return new Date(a.itemSellTime).getTime() -
          new Date(b.itemSellTime).getTime()
      });

      //filterPriceHistoryData?.length > 0 ? 
      setFilterGraphData([{
        "itemId": "0",
        "itemNFTContractAddress": "0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229",
        "itemTokenId": 1,
        "itemPrice": "0.000000",
        "itemSellTime": beginingTimestampGraph,
        "itemChainId": nftChainIdValue
      }, ...sorted_Results]) // : filterPriceHistoryData


      console.log('filterPriceHisoryData', sorted_Results);
    }
  }, [selectedPriceHistoryFilter, chartData, beginingTimestampGraph, nftChainIdValue, network, account!, chainId])

  const fetchNFTOwners = async (contractType: string, nftAddress: string, tokenId: string, cursorValue?: string) => {
    console.log("nftOwnersCursorValue", cursorValue);
    // const options = {
    //   address: location?.state?.nftContract,
    //   token_id: location?.state?.nftTokenId + '',
    //   chain: networkName,
    //   cursor: cursorValue ? cursorValue : null,
    //   limit: 25
    // };
    try {
      const options = {
        method: 'GET',
        url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/${tokenId}/owners`,
        params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true', limit: itemsLimit, cursor: cursorValue ? cursorValue : null },
        headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
      };

      console.log('nftOwners options', options);

      await axios
        .request(options as any)
        .then(async function (response) {
          console.log("fetchNFTOwners Res", response.data);
          const nftOwners = await response.data; //await Web3Api.token.getTokenIdOwners(options as any);
          const nftOwnersCursorVal = (nftOwners as any).cursor;
          nextCursor.current = (nftOwners as any).cursor
          totalItemsRef.current = (nftOwners as any).total
          setTotalNFTOwners(Number(nftOwners.total) || 0)
          setNftOwnersCursorValue(nftOwnersCursorVal)
          const fetchOwnerDetails = nftOwners?.result || []

          if (contractType === "ERC721") {
            setNftOwnerAddress(fetchOwnerDetails[0].owner_of ?? "")
          }

          setNftOwnerModalData((prev: any) => [...prev, ...fetchOwnerDetails])
          fetchedTotalItemsRef.current = fetchedTotalItemsRef.current + fetchOwnerDetails.length
          if (itemLoadingRef.current) setInfiniteLoader(prev => !prev)
          itemLoadingRef.current = false
          console.log('nftOwnerModalData.total >>>>>>>>>>>>>>>>>>>>>', nftOwners.total);

        })
        .catch(function (error) {
          itemLoadingRef.current = false
          setInfiniteLoader(prev => !prev)
          console.error(error);
        });
    } catch (error) {
      itemLoadingRef.current = false
      setInfiniteLoader(prev => !prev)
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("selectedDrop => ", selectedDrop);
  }, [selectedDrop])

  useEffect(() => {
    fetchPriceHistoryDetails(params.nftcontractaddress, params.tokenid)
  }, [params, allListingDataSet, allOfferDataSet, allDutchAuctionListingDataSet, allAuctionListingDataSet, network, account!, chainId])

  const fetchPriceHistoryDetails = async (nftAddress: any, tokenId: any) => {
    // try {
    //   let getkeyValue = (network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())
    //   setNftChainIdValue(getkeyValue)
    //   let fetchPriceHistoryArray = [] as any
    //   console.log("listingItem111 => ", allListingDataSet, allOfferDataSet, auctionItemDataSet);
    //   allListingDataSet.map((listingItem, ind) => {
    //     console.log("listingItem => ", listingItem);
    //     if (listingItem?.listingItemStatus === 2) {
    //       fetchPriceHistoryArray.push({ itemChainId: getkeyValue, itemId: listingItem?.listingItemId, itemNFTContractAddress: listingItem?.listingNFTContractAddress, itemTokenId: listingItem?.listingTokenID, itemStartDate: listingItem?.listingStartDate, itemPrice: listingItem?.listingPriceDetails, itemEndDate: listingItem?.listingEndDate, itemStatus: listingItem?.listingItemStatus, itemSellTime: listingItem?.sellTime })
    //     }
    //   })

    //   allOfferDataSet.map((offerItem, ind) => {
    //     console.log("offerItem => ", offerItem);
    //     if (offerItem?.offerItemStatus === 2) {
    //       fetchPriceHistoryArray.push({ itemChainId: getkeyValue, itemId: offerItem?.offerItemId, itemNFTContractAddress: offerItem?.offerNFTContractAddress, itemTokenId: offerItem?.offerTokenID, itemStartDate: offerItem?.offerStartDate, itemPrice: offerItem?.offerPriceDetails, itemEndDate: offerItem?.offerEndDate, itemStatus: offerItem?.offerItemStatus, itemSellTime: offerItem?.sellTime })
    //     }
    //   })

    //   // auctionItemDataSet.length > 0 && auctionItemDataSet[0]?.auctionBidsArray.map((auctionBidItem, ind) => {
    //   //   if (auctionBidItem?.bidStatus === 2) {
    //   //     fetchPriceHistoryArray.push({itemChainId: getkeyValue, itemId: auctionBidItem?.bidAuctionItemId, itemNFTContractAddress: auctionItemDataSet[0]?.auctionNFTContractAddress, itemTokenId: auctionItemDataSet[0]?.auctionTokenID, itemStartDate: auctionBidItem?.auctionStartDate ?? 0, itemPrice: auctionBidItem?.bidPrice, itemEndDate: auctionBidItem?.auctionEndDate, itemStatus: auctionBidItem?.bidStatus, itemSellTime: auctionItemDataSet[0]?.sellTime })
    //   //   }
    //   // })

    //   // all.length > 0 && auctionItemDataSet[0]?.auctionBidsArray.map((auctionBidItem, ind) => {
    //   //   if (auctionBidItem?.bidStatus === 2) {
    //   //     fetchPriceHistoryArray.push({itemChainId: getkeyValue, itemId: auctionBidItem?.bidAuctionItemId, itemNFTContractAddress: auctionItemDataSet[0]?.auctionNFTContractAddress, itemTokenId: auctionItemDataSet[0]?.auctionTokenID, itemStartDate: auctionBidItem?.auctionStartDate ?? 0, itemPrice: auctionBidItem?.bidPrice, itemEndDate: auctionBidItem?.auctionEndDate, itemStatus: auctionBidItem?.bidStatus, itemSellTime: auctionItemDataSet[0]?.sellTime })
    //   //   }
    //   // })

    //   console.log('fetchPriceHistoryArray', fetchPriceHistoryArray);
    //   setChartData(fetchPriceHistoryArray)

    // } catch (error) {
    //   console.log('fetchPriceHistoryDetails error', error);
    // }

    let getkeyValue = (network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())
    setNftChainIdValue(getkeyValue)
    try {
      return await getAllNFTSalesData(
        1000, 0, nftAddress!, tokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const getAllSalesData = await res.data
          console.log("getAllSalesData : ", getAllSalesData);
          const salesTransactionDataArray = getAllSalesData?.values || []
          const getSalesTransactionDataArray = salesTransactionDataArray && salesTransactionDataArray?.map(async (item, index) => {
            return { id: index + 1, itemChainId: getkeyValue, itemId: 0, itemNFTContractAddress: item?.nftListing && item?.nftListing?.tokenAddress, itemTokenId: item?.nftListing && item?.nftListing?.tokenId, itemStartDate: item?.nftListing && item?.nftListing?.startTime, itemPrice: item?.sellPerAskPrice, itemEndDate: item?.nftListing && item?.nftListing?.endTime, itemSellTime: item?.sellTime };
          }) || []

          let getAllSalesDataArrayResults = await Promise.all(getSalesTransactionDataArray)
          console.log('getAllSalesDataArrayResults', getAllSalesDataArrayResults);
          setChartData(getAllSalesDataArrayResults)
        }
        else {
          setIsLoading(false);
          setMsg("Please wait")
        }
      }).catch(err => {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting Sales Activity listing data ')
      })
    } catch (error) {
      setIsLoading(false);
      setMsg("Please wait")
      console.log('Wallet Sales Data Fetching error', error);
    }
  };

  const fetchDutchAuctionDetails = async (currentProjectObj: any, getListedDutchAuctionItemIdsArray: [], nftContract?: any, nftTokenId?: any) => {
    setWethtoUsd(await wethToUsdValue())
    if (!genMarketPlaceContractAddress) return
    try {
      await getAllNFTListingData(
        4, 50, 0, nftContract, nftTokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const dutchAuctionAPIData = await res.data
          // listingNextCursor.current = (dutchAuctionAPIData as any).skip + 1
          // listingTotalItemsRef.current = (dutchAuctionAPIData as any).total
          console.log("dutchAuctionAPIData : ", dutchAuctionAPIData);

          const dutchAuctionListingDBDataArray = dutchAuctionAPIData?.values || []
          const dutchAuctionListingDataArray = dutchAuctionListingDBDataArray && dutchAuctionListingDBDataArray?.map(async (item, index) => {
            let currentPrice = item?.listingStartPrice - (moment().unix() - item?.startTime) * ((item?.listingStartPrice - item?.listingEndPrice) / (item?.endTime - item?.startTime));
            return { id: index + 1, recordId: item?._id, dutchAuctionListedUser: item?.user ?? {}, dutchAuctionListingChainId: item?.chainId, dutchAuctionListingItemId: item?.nftItemId, dutchAuctionListingNFTContractAddress: item?.tokenAddress, dutchAuctionListingActualRemainingQuantity: item?.actualRemainingQuantity, dutchAuctionListingNftMetaDataURL: item?.nftMetaDataURL, dutchAuctionListingCreatedDate: item?.createdDate, dutchAuctionListingUpdatedDate: item?.updatedDate, dutchAuctionListingSeller: item?.fromAddress, dutchAuctionListingTokenID: item?.tokenId, dutchAuctionListingStartDate: item?.startTime, dutchAuctionListingPriceDetails: item?.listingStartPrice, dutchAuctionListingAmount: item?.quantity, dutchAuctionListingAssetType: item?.assetType ?? 0, dutchAuctionListingEndDate: item?.endTime, dutchAuctionSellTime: item?.sellTime, dutchAuctionListingItemStatus: item?.status, dutchAuctionListingEndPriceDetails: item?.listingEndPrice, dutchAuctionListingCurrentPriceDetails: currentPrice };
          }) || []

          let dutchAuctionListingDataArrayResults = await Promise.all(dutchAuctionListingDataArray)
          setAllDutchAuctionListingDataSet(dutchAuctionListingDataArrayResults)

          //(item?.listingSeller.toLowerCase() === account!.toLowerCase())
          let filterDutchAuctionListingDataArrayResults = dutchAuctionListingDataArrayResults.filter((item: any) => (item?.dutchAuctionListingItemStatus === 1) && item?.dutchAuctionListingItemId && (Number(item?.dutchAuctionListingEndDate) >= Number(moment().unix())))
          setDutchAuctionListingDataSet((prev: any) => [...prev, ...filterDutchAuctionListingDataArrayResults])
          console.log('filterDutchAuctionListingDataArrayResults', filterDutchAuctionListingDataArrayResults);

          // listingFetchedTotalItemsRef.current = listingFetchedTotalItemsRef.current + filterDutchAuctionListingDataArrayResults.length
          // if (listingItemLoadingRef.current) setListingInfiniteLoader(prev => !prev)
          // listingItemLoadingRef.current = false
        }
        else {
          // listingItemLoadingRef.current = false
          // setListingInfiniteLoader(prev => !prev)
          setIsLoading(false);
          setMsg("Please wait")
        }
      }).catch(err => {
        // listingItemLoadingRef.current = false
        // setListingInfiniteLoader(prev => !prev)
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting NFT listing data ')
      })
    } catch (error) {
      setIsLoading(false);
      setMsg("Please wait")
      console.log('getListingData error', error);
    }
  };

  const fetchListingDetails = async (currentProjectObj: any, getListedItemIdsArray: [], nftContract?: any, nftTokenId?: any) => {
    setWethtoUsd(await wethToUsdValue())
    if (!genMarketPlaceContractAddress) return
    try {
      await getAllNFTListingData(
        1, listingItemsLimit, listingNextCursor.current, nftContract, nftTokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const listingAPIData = await res.data
          listingNextCursor.current = (listingAPIData as any).skip + 1
          listingTotalItemsRef.current = (listingAPIData as any).total
          console.log("listingAPIData : ", listingAPIData);

          const listingDBDataArray = listingAPIData?.values || []
          const listingDataArray = listingDBDataArray && listingDBDataArray?.map(async (item, index) => {
            return { id: index + 1, recordId: item?._id, listedUser: item?.user ?? {}, listingChainId: item?.chainId, listingItemId: item?.nftItemId, listingNFTContractAddress: item?.tokenAddress, listingActualRemainingQuantity: item?.actualRemainingQuantity, listingNftMetaDataURL: item?.nftMetaDataURL, listingCreatedDate: item?.createdDate, listingUpdatedDate: item?.updatedDate, listingSeller: item?.fromAddress, listingTokenID: item?.tokenId, listingStartDate: item?.startTime, listingPriceDetails: item?.listingStartPrice, listingAmount: item?.quantity, listingAssetType: item?.assetType ?? 0, listingEndDate: item?.endTime, sellTime: item?.sellTime, listingItemStatus: item?.status };
          }) || []

          let listingDataArrayResults = await Promise.all(listingDataArray)
          setAllListingDataSet(listingDataArrayResults)

          //(item?.listingSeller.toLowerCase() === account!.toLowerCase())
          // (item?.listingSeller.toLowerCase() === account?.toLowerCase()) &&
          let filterListingDataArrayResults = listingDataArrayResults.filter((item: any) => (item?.listingItemStatus === 1) && item?.listingItemId && (Number(item?.listingEndDate) >= Number(moment().unix())))
          let filterSaleDataArrayResults = listingDataArrayResults.filter((item: any) => (item?.listingItemStatus === 2) && item?.listingItemId)
          console.log("filterListingDataArrayResults", listingDataArrayResults, filterListingDataArrayResults, filterSaleDataArrayResults);

          // let sortedArray = filterListingDataArrayResults.sort((a: any, b: any) => (Number(a?.listingPriceDetails) > Number(b?.listingPriceDetails)) ? 1 : -1)
          const listingPricesArray = filterListingDataArrayResults.map((item: any) => Number(item?.listingPriceDetails))
          const lowestPrice = Math.min.apply(null, listingPricesArray);
          const lowListedItem = filterListingDataArrayResults.find((item: any) => Number(item?.listingPriceDetails) == lowestPrice)
          setLowListingPriceObj(lowListedItem)

          console.log("Low ListedItem", lowListedItem);
          console.log("saleDataSet", filterSaleDataArrayResults);
          setSaleDataSet((prev: any) => [...prev, ...filterSaleDataArrayResults])
          setListingDataSet((prev: any) => [...prev, ...filterListingDataArrayResults])
          console.log('listingDataArrayResults', filterListingDataArrayResults);

          listingFetchedTotalItemsRef.current = listingFetchedTotalItemsRef.current + filterListingDataArrayResults.length
          if (listingItemLoadingRef.current) setListingInfiniteLoader(prev => !prev)
          listingItemLoadingRef.current = false
        }
        else {
          listingItemLoadingRef.current = false
          setListingInfiniteLoader(prev => !prev)
          setIsLoading(false);
          setMsg("Please wait")
        }
      }).catch(err => {
        listingItemLoadingRef.current = false
        setListingInfiniteLoader(prev => !prev)
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting NFT listing data ')
      })

      // console.log('aaa', currentProjectObj?.nftContract, currentProjectObj?.nftTokenId, account!, getListedItemIdsArray);

      // let getItemIdWiseListingData = Array.prototype.concat.apply([], getListedItemIdsArray);
      // getItemIdWiseListingData = getItemIdWiseListingData.filter((item: any) => (item != "0"))
      // console.log('getItemIdWiseListingData --> ', getItemIdWiseListingData);

      // const listingDataArray = getItemIdWiseListingData && getItemIdWiseListingData?.map(async (item, index) => {
      //   const getFixedPriceItemDetails = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getFixedPriceItem(item).call()
      //   // Details :  asset   address :  0x442Fe9FA65a9a273621CC4c4b125534772a24e5a
      //   // startPrice   uint96 :  100000000000000
      //   // tokenId   uint128 :  2
      //   // amount   uint128 :  1
      //   // seller   address :  0x02c72B4E5E530f4701aB048Cf70d5Ae742e49165
      //   // assetType   uint8 :  2
      //   // listingTime   uint128 :  1656342494
      //   // listingDuration   uint128 :  86400
      //   // status   uint8 :  1
      //   console.log("ddddd", Number(getFixedPriceItemDetails?.startDate), Number(getFixedPriceItemDetails?.endDate));
      //   console.log('hellohello', Number(getFixedPriceItemDetails?.endDate), Number(moment().unix()), (Number(getFixedPriceItemDetails?.endDate) >= Number(moment().unix())));

      //   const itemPriceDetails = getFixedPriceItemDetails?.startPrice && formatEther(getFixedPriceItemDetails?.startPrice)

      //   return { id: index + 1, listingItemId: item, listingNFTContractAddress: getFixedPriceItemDetails?.asset, listingSeller: getFixedPriceItemDetails?.seller, listingTokenID: getFixedPriceItemDetails?.tokenId, listingStartDate: getFixedPriceItemDetails?.startDate, listingPriceDetails: itemPriceDetails, listingAmount: getFixedPriceItemDetails?.amount, listingAssetType: getFixedPriceItemDetails?.assetType, listingEndDate: getFixedPriceItemDetails?.endDate, sellTime: getFixedPriceItemDetails?.sellTime, listingItemStatus: getFixedPriceItemDetails?.status };
      // }) || []
      // let listingDataArrayResults = await Promise.all(listingDataArray)
      // console.log("listingDataArrayResults11", listingDataArrayResults, currentProjectObj);
      // setAllListingDataSet(listingDataArrayResults)

      // //(item?.listingSeller.toLowerCase() === account!.toLowerCase())
      // let filterListingDataArrayResults = listingDataArrayResults.filter((item: any) => (item?.listingItemStatus === "1") && (item?.listingSeller.toLowerCase() === currentProjectObj?.nftSeller?.toLowerCase()) && (Number(item?.listingEndDate) >= Number(moment().unix())))
      // let filterSaleDataArrayResults = listingDataArrayResults.filter((item: any) => (item?.listingItemStatus === "2"))
      // console.log("filterListingDataArrayResults", filterListingDataArrayResults);

      // // let sortedArray = filterListingDataArrayResults.sort((a: any, b: any) => (Number(a?.listingPriceDetails) > Number(b?.listingPriceDetails)) ? 1 : -1)
      // const listingPricesArray = filterListingDataArrayResults.map((item: any) => Number(item?.listingPriceDetails))
      // const lowestPrice = Math.min.apply(null, listingPricesArray);
      // const lowListedItem = filterListingDataArrayResults.find((item: any) => Number(item?.listingPriceDetails) == lowestPrice)
      // setLowListingPriceObj(lowListedItem)

      // console.log("Low ListedItem", lowListedItem);
      // console.log("saleDataSet", filterSaleDataArrayResults);
      // setSaleDataSet(filterSaleDataArrayResults)
      // setListingDataSet(filterListingDataArrayResults)
      // console.log('listingDataArrayResults', filterListingDataArrayResults);
    } catch (error) {
      setMsg("Please wait")
      setIsLoading(false)
      console.log('getListingData error', error);
    }
  };

  const fetchOfferDetails = async (currentProjectObj: any, getOfferItemIdsArray: [], nftContract?: any, nftTokenId?: any) => {
    if (!genMarketPlaceContractAddress) return
    try {
      await getAllNFTListingData(
        2, offerItemsLimit, offerNextCursor.current, nftContract, nftTokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const offerAPIData = await res.data
          offerNextCursor.current = (offerAPIData as any).skip + 1
          offerTotalItemsRef.current = (offerAPIData as any).total
          console.log("offerAPIData : ", offerAPIData);

          const offerDBDataArray = offerAPIData?.values || []
          const offersDataArray = offerDBDataArray && offerDBDataArray?.map(async (item, index) => {
            return { id: index + 1, recordId: item?._id, offerUser: item?.user ?? {}, offerChainId: item?.chainId, offerItemId: item?.nftItemId, offerNFTContractAddress: item?.tokenAddress, offerActualRemainingQuantity: item?.actualRemainingQuantity, offerNftMetaDataURL: item?.nftMetaDataURL, offerCreatedDate: item?.createdDate, offerUpdatedDate: item?.updatedDate, offerBuyer: item?.fromAddress, offerTokenID: item?.tokenId, offerStartDate: item?.startTime, offerPriceDetails: item?.listingStartPrice, offerAmount: item?.quantity, offerAssetType: item?.assetType ?? 0, offerEndDate: item?.endTime, sellTime: item?.sellTime, offerItemStatus: item?.status };
          }) || []
          let offerDataArrayResults = await Promise.all(offersDataArray)
          setAllOfferDataSet(offerDataArrayResults)
          console.log('offerDataArrayResults', offerDataArrayResults);
          let filterOfferDataArrayResults = offerDataArrayResults.filter((item: any) => (item.offerItemStatus === 1) && item?.offerItemId && (Number(item?.offerEndDate) >= Number(moment().unix())))
          setOfferDataSet(filterOfferDataArrayResults)
          console.log('OFFER filterOfferDataArrayResults', filterOfferDataArrayResults);

          offerFetchedTotalItemsRef.current = offerFetchedTotalItemsRef.current + filterOfferDataArrayResults.length
          if (offerItemLoadingRef.current) setOfferInfiniteLoader(prev => !prev)
          offerItemLoadingRef.current = false
        }
        else {
          offerItemLoadingRef.current = false
          setOfferInfiniteLoader(prev => !prev)
          setIsLoading(false);
          setMsg("Please wait")
        }
      }).catch(err => {
        offerItemLoadingRef.current = false
        setOfferInfiniteLoader(prev => !prev)
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting NFT listing data ')
      })
    } catch (error) {
      offerItemLoadingRef.current = false
      setOfferInfiniteLoader(prev => !prev)
      setIsLoading(false);
      setMsg("Please wait")
      console.log('getOfferData error', error);
    }
  };

  const fetchAuctionDetails = async (currentProjectObj: any, getAuctionItemIdsArray: [], nftContract?: any, nftTokenId?: any) => {
    if (!genMarketPlaceContractAddress) return
    try {
      await getAllNFTListingData(
        3, 20, 0, nftContract, nftTokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const auctionAPIData = await res.data
          console.log("auctionAPIData : ", auctionAPIData);

          const auctionDBDataArray = auctionAPIData?.values || []
          const auctionDataArray = auctionDBDataArray && auctionDBDataArray?.map(async (item, index) => {
            let bidInfosArray = await fetchAuctionTransactionDetails(item, currentProjectObj, nftContract, nftTokenId, getAuctionItemIdsArray)
            let bidInfoArrayResults = bidInfosArray as Array<any> //await Promise.all(bidInfosArray ?? [])
            console.log("bidInfoArrayResults", bidInfoArrayResults);

            const auctionBidListingPricesArray = bidInfoArrayResults.map((biditem: any) => Number(biditem?.bidPrice))
            const highestPriceBid = Math.max.apply(null, auctionBidListingPricesArray);
            console.log("highestPriceBid", highestPriceBid, bidInfosArray, bidInfoArrayResults, auctionBidListingPricesArray);
            const highlyBidListedItem = bidInfoArrayResults.find((bidAuctionItem: any) => Number(bidAuctionItem?.bidPrice) == Number(highestPriceBid))
            return { id: index + 1, recordId: item?._id, auctionUser: item?.user ?? {}, auctionChainId: item?.chainId, auctionItemId: item?.nftItemId, auctionNFTContractAddress: item?.tokenAddress, auctionActualRemainingQuantity: item?.actualRemainingQuantity, auctionNftMetaDataURL: item?.nftMetaDataURL, auctionCreatedDate: item?.createdDate, auctionUpdatedDate: item?.updatedDate, auctionSeller: item?.fromAddress, auctionTokenID: item?.tokenId, auctionStartDate: item?.startTime, auctionPriceDetails: item?.listingStartPrice, auctionAmount: item?.quantity, auctionAssetType: item?.assetType ?? 0, auctionEndDate: item?.endTime, sellTime: item?.sellTime, auctionItemStatus: item?.status, auctionBidsArray: bidInfoArrayResults, highlyBidListedItem: highlyBidListedItem };
          }) || []

          let auctionDataArrayResults = await Promise.all(auctionDataArray)
          setAllAuctionListingDataSet(auctionDataArrayResults)
          console.log('auctionDataArrayResults', auctionDataArrayResults);
          let filterAuctionDataArrayResults = auctionDataArrayResults.filter((item: any) => (item.auctionItemStatus === 1) && item.auctionItemId && (Number(item?.auctionEndDate) >= Number(moment().unix()))) //&& (item?.auctionSeller.toLowerCase() === account!.toLowerCase()) 
          setAuctionItemDataSet(filterAuctionDataArrayResults)
          console.log('Auction filterAuctionDataArrayResults', filterAuctionDataArrayResults);
        }
        else {
          setIsLoading(false);
          setMsg("Please wait")
        }
      }).catch(err => {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting NFT Auction listing data ')
      })
    } catch (error) {
      setIsLoading(false);
      setMsg("Please wait")
      console.log('getAuctionData error', error);
    }
    // try {
    //   console.log('currentProjectObj Auction Part ==> ', currentProjectObj?.nftContract, currentProjectObj?.nftTokenId, account!);

    //   //getAuctionPriceItemDetails
    //   // const getAuctionPriceItemDetailsObj = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getAuctionPriceItemDetails(currentProjectObj?.nftContract, currentProjectObj?.nftTokenId, currentProjectObj?.nftSeller!).call()

    //   // var getAuctionItemIdsArray = await Promise.all(statusArray.map(async (i) => {
    //   //   return await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getAllAuctionedIds(currentProjectObj?.nftContract, currentProjectObj?.nftTokenId, i).call()
    //   // }));
    //   let getAuctionPriceItemDetailsObj = Array.prototype.concat.apply([], getAuctionItemIdsArray);
    //   getAuctionPriceItemDetailsObj = getAuctionPriceItemDetailsObj.filter((item: any) => (item != "0"))
    //   console.log('getAuctionPriceItemDetailsObj --> ', getAuctionPriceItemDetailsObj);

    //   const auctionsDataArray = getAuctionPriceItemDetailsObj && getAuctionPriceItemDetailsObj?.map(async (item, index) => {
    //     const getAuctionItemDetails = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.getAuctionItem(item).call()

    //     // Details :  asset   address :  0x442Fe9FA65a9a273621CC4c4b125534772a24e5a
    //     // offerPrice   uint96 :  100000000000000
    //     // tokenId   uint128 :  2
    //     // amount   uint128 :  1
    //     // seller   address :  0x02c72B4E5E530f4701aB048Cf70d5Ae742e49165
    //     // assetType   uint8 :  2
    //     // auctionTime   uint128 :  1656342494
    //     // auctionDuration   uint128 :  86400
    //     // status   uint8 :  1

    //     //bidCount & bidInfo Details for auction Items
    //     const bidCounterDetails = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.bidCount(item).call()

    //     // let bidInfosArray = [] as any
    //     // const bidInfosArray = Array.from(Array(bidCounterDetails), async (e, i) => {
    //     //   const bidInfoDetails = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.bidInfo(item, i + 1).call()
    //     //   const bidPriceDetails = bidInfoDetails?.bidPrice && formatEther(bidInfoDetails?.bidPrice)
    //     //   const bidItemObject = { id: i + 1, bidAuctionItemId: bidInfoDetails?.auctionItemId, bidderAddress: bidInfoDetails?.bidder, bidPrice: bidPriceDetails, bidTime: bidInfoDetails?.bidTime, bidStatus: bidInfoDetails?.status };
    //     //   return bidItemObject
    //     //   // bidInfosArray.push(...bidInfosArray, bidItemObject)
    //     // })

    //     // console.log("bidCounterDetails", bidCounterDetails);
    //     let bidInfosArray = [] as any
    //     bidInfosArray = bidCounterDetails > 0 && await Promise.all(Array.from(Array(Number(bidCounterDetails)))?.map(async (itemPosition: any, i: number) => {
    //       console.log("bidCounterDetailsp", item, i + 1);
    //       const bidInfoDetails = await genMarketPlaceContract(genMarketPlaceContractAddress).methods.bidInfo(item, i + 1).call()
    //       const bidPriceDetails = bidInfoDetails?.bidPrice && formatEther(bidInfoDetails?.bidPrice)
    //       const bidItemObject = { id: i + 1, bidAuctionItemId: bidInfoDetails?.auctionItemId, bidderAddress: bidInfoDetails?.bidder, bidPrice: bidPriceDetails, bidTime: bidInfoDetails?.bidTime, bidStatus: bidInfoDetails?.status };
    //       console.log("bidCounterDetailsq", bidItemObject);
    //       return bidItemObject
    //     })) || []
    //     let bidInfoArrayResults1 = Array.prototype.concat.apply([], bidInfosArray);
    //     let bidInfoArrayResults = await Promise.all(bidInfosArray)
    //     const auctionBidListingPricesArray = bidInfoArrayResults.map((biditem: any) => Number(biditem?.bidPrice))
    //     const highestPriceBid = Math.max.apply(null, auctionBidListingPricesArray);
    //     console.log("highestPriceBid", bidInfoArrayResults1, highestPriceBid, bidInfosArray, bidInfoArrayResults, auctionBidListingPricesArray);
    //     const highlyBidListedItem = bidInfoArrayResults.find((bidAuctionItem: any) => Number(bidAuctionItem?.bidPrice) == Number(highestPriceBid))

    //     // console.log("item, bidCounterDetails, bidInfosArray", item, bidCounterDetails, bidInfosArray);

    //     const itemPriceDetails = getAuctionItemDetails?.offerPrice && formatEther(getAuctionItemDetails?.offerPrice)
    //     const auctionItemObject = { id: index + 1, auctionItemId: item, auctionNFTContractAddress: getAuctionItemDetails?.asset, auctionSeller: getAuctionItemDetails?.seller, auctionTokenID: getAuctionItemDetails?.tokenId, auctionStartDate: getAuctionItemDetails?.startDate, auctionPriceDetails: itemPriceDetails, auctionAmount: getAuctionItemDetails?.amount, auctionAssetType: getAuctionItemDetails?.assetType, auctionEndDate: getAuctionItemDetails?.endDate, sellTime: getAuctionItemDetails?.sellTime, auctionItemStatus: getAuctionItemDetails?.status, auctionBidsArray: bidInfoArrayResults, highlyBidListedItem: highlyBidListedItem };
    //     console.log("auctionItemObject", auctionItemObject);
    //     return auctionItemObject;
    //   }) || []

    //   let auctionDataArrayResults = await Promise.all(auctionsDataArray)
    //   console.log('auctionDataArrayResults', auctionDataArrayResults);
    //   let filterAuctionDataArrayResults = auctionDataArrayResults.filter((item: any) => (item.auctionItemStatus === "1") && (Number(item?.auctionEndDate) >= Number(moment().unix()))) //&& (item?.auctionSeller.toLowerCase() === account!.toLowerCase()) 
    //   setAuctionItemDataSet(filterAuctionDataArrayResults)

    //   // // let sortedArray = filterListingDataArrayResults.sort((a: any, b: any) => (Number(a?.listingPriceDetails) > Number(b?.listingPriceDetails)) ? 1 : -1)
    //   // const auctionListingPricesArray = filterAuctionDataArrayResults.map((item: any) => Number(item?.auctionPriceDetails))
    //   // const highestPrice = Math.max.apply(null, auctionListingPricesArray);
    //   // const highListedItem = filterAuctionDataArrayResults.find((item: any) => Number(item?.auctionPriceDetails) == highestPrice)
    //   // setHighAuctionListingPriceObj(highListedItem)
    //   console.log('filterAuctionDataArrayResults', filterAuctionDataArrayResults);
    // } catch (error) {
    //   console.log('getAuctionData error', error);
    // }
  };

  const fetchAuctionTransactionDetails = async (auctionListObject: any, currentProjectObj: any, nftContract?: any, nftTokenId?: any, getAuctionItemIdsArray?: []) => {
    if (!genMarketPlaceContractAddress) return
    try {
      return await getAllNFTListingTransactionData(
        3, 50, 0, auctionListObject?._id, nftContract, nftTokenId
      ).then(async (res: any) => {
        if (res?.status === 200) {
          const auctionBidsTransactionAPIData = await res.data
          // offerNextCursor.current = (offerAPIData as any).skip + 1
          // offerTotalItemsRef.current = (offerAPIData as any).total
          console.log("auctionBidsTransactionAPIData : ", auctionBidsTransactionAPIData);

          const auctionDBBidsTransactionDataArray = auctionBidsTransactionAPIData?.values || []
          const auctionBidsTransactionDataArray = auctionDBBidsTransactionDataArray && auctionDBBidsTransactionDataArray?.map(async (item, index) => {
            return { id: index + 1, bidRecordId: item?._id, bidNFTListing: item?.nftListing, bidAuctionItemId: auctionListObject?.nftItemId, sellerAddress: item?.sellerAddress, bidderAddress: item?.buyerAddress, bidSellTime: item?.sellTime, bidPrice: item?.sellPerAskPrice, bidQuantity: item?.quantity, bidListingType: item?.listingType, bidUserAcceptanceDateTime: item?.userAcceptanceDateTime, bidTime: auctionListObject?.endTime, bidStatus: item?.status, bidCreatedDate: item?.createdDate, bidUpdatedDate: item?.updatedDate, bidIsConfirmed: item?.isConfirmed };
          }) || []

          let auctionBidsTransactionDataArrayResults = await Promise.all(auctionBidsTransactionDataArray)
          console.log('auctionBidsTransactionDataArrayResults', auctionBidsTransactionDataArrayResults);
          return auctionBidsTransactionDataArrayResults

          // offerFetchedTotalItemsRef.current = offerFetchedTotalItemsRef.current + filterOfferDataArrayResults.length
          // if (offerItemLoadingRef.current) setOfferInfiniteLoader(prev => !prev)
          // offerItemLoadingRef.current = false
        }
        else {
          // offerItemLoadingRef.current = false
          // setOfferInfiniteLoader(prev => !prev)
          setIsLoading(false);
          setMsg("Please wait")
        }
        return []
      }).catch(err => {
        // offerItemLoadingRef.current = false
        // setOfferInfiniteLoader(prev => !prev)
        setIsLoading(false);
        setMsg("Please wait")
        console.log(err.message || 'Error while getting NFT Auction listing data ')
      })
    } catch (error) {
      // offerItemLoadingRef.current = false
      // setOfferInfiniteLoader(prev => !prev)
      setIsLoading(false);
      setMsg("Please wait")
      console.log('getAuctionData error', error);
    }
    return []
  };

  const handleBuyNowListing = async (listingItem: any) => {
    console.log("handleBuyNowListing Fired", listingItem);
    if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

    try {
      setIsLoading(true)
      setMsg("Buy Now Listing")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber | any>,
        value: BigNumber | null
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
      var itemIdsArray: any = [listingItem?.listingItemId!]
      var amountsPerItemArray: any = [listingItem?.listingActualRemainingQuantity!]
      method = market.buyFixedPriceItems
      estimate = market.estimateGas.buyFixedPriceItems
      args = [
        itemIdsArray,
        amountsPerItemArray
      ]

      console.log("data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('unlistFixedPriceItemRes', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'Listing Bought Request Placed Successfully.'
              });
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to Buy FiledPrice Item listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const handleBuyNowDutchAuctionListing = async (dutchAuctionListingItem: any) => {
    console.log("handleBuyNowDutchAuctionListing Fired", dutchAuctionListingItem);
    if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

    try {
      setIsLoading(true)
      setMsg("Buy Now Auction Listing")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber | any>,
        value: BigNumber | null
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
      // var dataArray: any = dutchAuctionListingItem?.dutchAuctionListingItemId!
      method = market.buyDutchAuction
      estimate = market.estimateGas.buyDutchAuction
      args = [
        dutchAuctionListingItem?.dutchAuctionListingItemId!
      ]

      console.log("data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('buyDutchAuctionRes', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'Dutch Auction Item Buy Request Placed Successfully.'
              });
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to Buy FiledPrice Item listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const handleApproveOfBuyNowListingExceptTheOwner = async (listingItem: any) => {
    console.log("BuyNowListingExceptTheOwner Clicked", listingItem);

    if ((Number(listingItem?.listingStartDate) >= Number(moment().unix()))) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: `You can't buy this item until ${moment.unix(listingItem?.listingStartDate).format("MMM DD, YYYY hh:mmA")}`,
          description: '',
          withExternalLink: false,
        }
      });
    }
    else {
      try {
        await fetchAuthToken()
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
        setIsLoading(true);
        setMsg("Please wait")
        await postCreateNFTListingTransactionCallBack(
          listingItem?.recordId! + '', listingItem?.listingSeller, account!, listingItem?.listingPriceDetails, listingItem?.listingActualRemainingQuantity
        ).then(async (res: any) => {
          if (res?.status === 200) {

            const erc20 = getERC20Contract(wethAddress, chainId, library, account)
            if (!erc20) throw new Error('No UNI Contract!')

            console.log('erc20Addres', erc20);

            const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)

            if (Number(formatEther(getAllowanceForWETHMarket)) >= (Number(listingItem?.listingPriceDetails) * Number(listingItem?.listingAmount))) {
              console.log("Direct Buy Listing because of default approved done");
              setMsg("Buy Listing")
              await handleBuyNowListing(listingItem);
            }
            else {
              setMsg("Approve")
              console.log("checkUserApproveBuyNowForMarketPlace Request ====> ", listingItem, parseUnits(Number(listingItem?.listingPriceDetails) + ''));
              const data = await checkUserApproveBuyNowForMarketPlace(wethAddress, genMarketPlaceContractAddress, parseUnits(Number(Number(listingItem?.listingPriceDetails) * Number(listingItem?.listingAmount)).toFixed(10) + ''))
              console.log("is Success from checkUserApproveBuyNowForMarketPlace ====> ", data);
              if (data.status) {
                console.log("Successfully Approved");
                setMsg("Buy Listing")
                await handleBuyNowListing(listingItem);
              }
              else {
                setIsLoading(false);
                setMsg("Please wait")
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
          console.log(err.message || 'Error while creating NFT listing Transaction data ')
        })
      } catch (error: any) {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(error || 'Error while validate check of creating NFT Listing Transaction data ')
      }
    }
  }

  const handleApproveOfBuyNowDutchAuctionListingExceptTheOwner = async (dutchAuctionListingItem: any) => {
    console.log("handleApproveOfBuyNowDutchAuctionListingExceptTheOwner Clicked", dutchAuctionListingItem);

    if ((Number(dutchAuctionListingItem?.dutchAuctionListingStartDate) >= Number(moment().unix()))) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: `You can't buy this item until ${moment.unix(dutchAuctionListingItem?.dutchAuctionListingStartDate).format("MMM DD, YYYY hh:mmA")}`,
          description: '',
          withExternalLink: false,
        }
      });
    }
    else {
      try {
        await fetchAuthToken()
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
        setIsLoading(true);
        setMsg("Please wait")
        await postCreateNFTListingTransactionCallBack(
          dutchAuctionListingItem?.recordId! + '', dutchAuctionListingItem?.dutchAuctionListingSeller, account!, dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails, dutchAuctionListingItem?.dutchAuctionListingActualRemainingQuantity
        ).then(async (res: any) => {
          if (res?.status === 200) {

            const erc20 = getERC20Contract(wethAddress, chainId, library, account)
            if (!erc20) throw new Error('No UNI Contract!')

            console.log('erc20 dutch Auction', erc20);

            const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)
            console.log('getAllowanceForWETHMarket', getAllowanceForWETHMarket, Number(formatEther(getAllowanceForWETHMarket)), (Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails) * Number(dutchAuctionListingItem?.dutchAuctionListingAmount)));

            if (Number(formatEther(getAllowanceForWETHMarket)) >= (Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails) * Number(dutchAuctionListingItem?.dutchAuctionListingAmount))) {
              console.log("Direct Buy Listing because of default approved done");
              setMsg("Buy Listing")
              await handleBuyNowDutchAuctionListing(dutchAuctionListingItem);
            }
            else {
              setMsg("Approve")
              console.log("checkUserApproveBuyNowForMarketPlace Request ====> ", dutchAuctionListingItem, parseUnits(Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails).toFixed(10) + ''));
              const data = await checkUserApproveBuyNowForMarketPlace(wethAddress, genMarketPlaceContractAddress, parseUnits(Number(Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails) * Number(dutchAuctionListingItem?.dutchAuctionListingAmount)).toFixed(10) + ''))
              console.log("is Success from checkUserApproveBuyNowForMarketPlace ====> ", data);
              if (data.status) {
                console.log("Successfully Approved");
                setMsg("Buy Listing")
                await handleBuyNowDutchAuctionListing(dutchAuctionListingItem);
              }
              else {
                setIsLoading(false);
                setMsg("Please wait")
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
          console.log(err.message || 'Error while creating NFT Dutch Auction listing Transaction data ')
        })
      } catch (error: any) {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(error || 'Error while validate check of creating NFT Dutch Auction Listing Transaction data ')
      }
    }
  }

  const cancelAuctionByUser = async (auctionItem: any) => {
    console.log("cancelAuctionByUser Clicked", auctionItem);
    if (!genMarketPlaceContractAddress) return

    try {
      await fetchAuthToken()
      setIsLoading(true)
      setMsg("Cancel Auction")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber>,
        value: BigNumber | null
      console.log('market11');
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

      console.log('market', market);

      method = market.cancelAuction
      estimate = market.estimateGas.cancelAuction
      args = [
        auctionItem?.auctionItemId!
      ]

      console.log("cancelAuctionByUser data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('cancelAuctionByUserRes', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'Auction Cancel Request Placed Successfully.'
              });
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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

    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to remove listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const cancelDutchAuctionByUser = async (dutchAuctionItem: any) => {
    console.log("cancelDutchAuctionByUser Clicked", dutchAuctionItem);
    if (!genMarketPlaceContractAddress) return

    try {
      await fetchAuthToken()
      setIsLoading(true)
      setMsg("Cancel Dutch Auction Now")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber>,
        value: BigNumber | null
      console.log('market11');
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

      console.log('market', market);

      method = market.cancelDutchAuction
      estimate = market.estimateGas.cancelDutchAuction
      args = [
        dutchAuctionItem?.dutchAuctionListingItemId!
      ]
      console.log("cancelDutchAuctionByUser data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('cancelDutchAuctionByUserRes', response);
              addTransaction(response, {
                summary:
                  'Dutch Auction Cancel Request Placed Successfully.'
              });
              setIsLoading(false)
              setMsg("Please wait")
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to remove listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const moveOnWithSelectedNFT = async (listingItem: any, nftTokenAddress: any, nftTokenId: any) => {
    history.push(`/assets/${nftTokenAddress}/${nftTokenId}`, listingItem)
    window.scrollTo(0, 0)
  }

  const makeBidOnAuctionExceptOwner = async (auctionItem: any) => {
    if ((Number(auctionItem?.auctionStartDate) >= Number(moment().unix()))) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: `You can't Bid one this Auction item until ${moment.unix(auctionItem?.auctionStartDate).format("MMM DD, YYYY hh:mmA")}`,
          description: '',
          withExternalLink: false,
        }
      });
    }
    else {
      bidModalToggle()
    }
  }

  const finishAuctionByUser = async (auctionItem: any) => {
    console.log("finishAuctionByUser Clicked", auctionItem);
    if (!genMarketPlaceContractAddress) return

    if (auctionItem.auctionBidsArray.length == 0) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: `No Bid yet.`,
          description: '',
          withExternalLink: false,
        }
      });
    }
    else {
      try {
        await fetchAuthToken()
        setIsLoading(true)
        setMsg("Finish Auction Now")
        let estimate,
          method: (...args: any) => Promise<TransactionResponse>,
          args: Array<number | string | BigNumber>,
          value: BigNumber | null
        console.log('market11');
        const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

        console.log('market', market);

        method = market.finishAuction
        estimate = market.estimateGas.finishAuction
        args = [
          auctionItem?.auctionItemId!
        ]

        console.log("finishAuctionByUser data", args);

        await estimate(...args, {})
          .then(estimatedGasLimit =>
            method(...args, {
              ...({}),
              gasLimit: calculateGasMargin(estimatedGasLimit)
            })
              .then(async (response: any) => {
                const waitResponse = await response.wait();
                console.log('finishAuctionByUserRes', response);
                setIsLoading(false)
                setMsg("Please wait")
                addTransaction(response, {
                  summary:
                    'Auction Finished Successfully.'
                });
                setIsRefreshListingData(e => !e);
              })
              .catch((err: any) => {
                setIsLoading(false)
                setMsg("Please wait")
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
            setMsg("Please wait")
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
      } catch (err: any) {
        setIsLoading(false)
        setMsg("Please wait")
        console.log('Failed to remove listing error', err.message);
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: err.message,
            description: '',
            withExternalLink: false,
          }
        });
      }
    }
  }

  const UnListingByUser = async (listingItem: any) => {
    console.log("UnListingByUser Clicked", listingItem);
    if (!genMarketPlaceContractAddress) return

    try {
      await fetchAuthToken()
      setIsLoading(true)
      setMsg("Remove Listing")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber>,
        value: BigNumber | null
      console.log('market11');
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

      console.log('market', market);

      method = market.unlistFixedPriceItem
      estimate = market.estimateGas.unlistFixedPriceItem
      args = [
        listingItem?.listingItemId!
      ]

      console.log("data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('unlistFixedPriceItemRes', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'UnListing Request Placed Successfully.'
              });
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to remove listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const handleAcceptOfferByNFTOwner = async (offerItem: any) => {
    console.log("handleAcceptOfferByNFTOwner Fired", offerItem);
    if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

    try {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber>,
        value: BigNumber | null
      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
      method = market.acceptOffer
      estimate = market.estimateGas.acceptOffer
      args = [
        offerItem?.offerItemId!,
        offerItem?.offerActualRemainingQuantity!
      ]

      console.log("acceptOffer data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('acceptOffer Response', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'Offer Accepted Successfully.'
              });
              setIsRefreshListingData(e => !e);
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
              console.log('error buy failed11 acceptOffer', err);
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
          setMsg("Please wait")
          console.log('inner estimate error acceptOffer', err);
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to acceptOffer Item listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const handleApproveOfAcceptOfferByNFTOwner = async (offerItem: any) => {
    console.log("handleAcceptOfferByNFTOwner Clicked", offerItem);

    if ((Number(offerItem?.offerStartDate) >= Number(moment().unix()))) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: `You can't accept this offer item until ${moment.unix(offerItem?.offerStartDate).format("MMM DD, YYYY hh:mmA")}`,
          description: '',
          withExternalLink: false,
        }
      });
    }
    else {
      try {
        await fetchAuthToken()
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
        setIsLoading(true);
        setMsg("Please wait")
        await postCreateNFTListingTransactionCallBack(
          offerItem?.recordId! + '', account!, offerItem?.offerBuyer, offerItem?.offerPriceDetails, offerItem?.offerActualRemainingQuantity
        ).then(async (res: any) => {
          if (res?.status === 200) {
            if (currentProjectData?.nftContractType === "ERC721") {
              // call getApproved to  
              console.log("ERC721 Contract");
              const nftContractAddress = getContract(currentProjectData?.nftContract, ERC721_ABI, library!, account!)
              if (!nftContractAddress) throw new Error('No Contract!')

              const isApprovedAddressOfERC721 = await nftContractAddress.getApproved(currentProjectData?.nftTokenId)
              console.log("isApprovedAddressOfERC721 Address isApprovedOrNot handleAcceptOfferByNFTOwner", isApprovedAddressOfERC721);
              setIsLoading(true)

              if (isApprovedAddressOfERC721.toLowerCase() === genMarketPlaceContractAddress!.toLowerCase()) {
                console.log("Direct AcceptOffer");
                setMsg("Accepting Offer")
                await handleAcceptOfferByNFTOwner(offerItem);
              }
              else {
                setMsg("Approve")
                const data = await checkUserApproveForListERC721(currentProjectData?.nftContract, genMarketPlaceContractAddress!, currentProjectData?.nftTokenId)
                console.log("is Success====> ", data);
                if (data.status) {
                  console.log("Successfully Fired Approve");
                  setMsg("Accepting Offer")
                  await handleAcceptOfferByNFTOwner(offerItem);
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
              console.log("Direct AcceptOffer isApprovedOrNotERC1155", isApprovedOrNotERC1155);
              setIsLoading(true)
              if (Boolean(isApprovedOrNotERC1155)) {
                console.log("Direct AcceptOffer");
                setMsg("Accepting Offer")
                await handleAcceptOfferByNFTOwner(offerItem);
              }
              else {
                setMsg("Approve")
                const data = await checkUserApproveForListERC1155(currentProjectData?.nftContract, genMarketPlaceContractAddress!)
                console.log("is Success====> ", data);
                if (data.status) {
                  console.log("Successfully Fired setApprovalForAll");
                  setMsg("Accepting Offer")
                  await handleAcceptOfferByNFTOwner(offerItem);
                }
                else {
                  setIsLoading(false);
                  setMsg("Please wait")
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
          console.log(err.message || 'Error while creating NFT listing Transaction data ')
        })
      } catch (error: any) {
        setIsLoading(false);
        setMsg("Please wait")
        console.log(error || 'Error while validate check of creating NFT Listing Transaction data ')
      }
    }
  }

  const cancelOfferByUser = async (offerItem: any) => {
    console.log("cancelOfferByUser Clicked", offerItem);
    if (!genMarketPlaceContractAddress) return

    try {
      await fetchAuthToken()
      setIsLoading(true)
      setMsg("Cancelling Offer")
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string | BigNumber>,
        value: BigNumber | null

      const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

      console.log('market', market);

      method = market.cancelOffer
      estimate = market.estimateGas.cancelOffer
      args = [
        offerItem?.offerItemId!
      ]

      console.log("cancel offer data", args);

      await estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
            .then(async (response: any) => {
              const waitResponse = await response.wait();
              console.log('cancelOffer Response', response);
              setIsLoading(false)
              setMsg("Please wait")
              addTransaction(response, {
                summary:
                  'Offer Removed Successfully.'
              });
              setIsRefreshListingData(e => !e)
            })
            .catch((err: any) => {
              setIsLoading(false)
              setMsg("Please wait")
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
          setMsg("Please wait")
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
    } catch (err: any) {
      setIsLoading(false)
      setMsg("Please wait")
      console.log('Failed to remove listing error', err.message);
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: err.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  // const fetchMoreData = (sourcePath: string) => {
  //   setTimeout(() => {
  //     if (sourcePath === "TradeHistory") {
  //       fetchWalletTokenIdTransfers(params.nftcontractaddress, params.tokenid, transfersCursorValue)
  //     }
  //     else if (sourcePath === "NftOwners") {
  //       fetchNFTOwners(params.nftcontractaddress, params.tokenid, nftOwnersCursorValue)
  //     }
  //   }, 1500);
  // };

  const handleScrollOfTradeHistory = (e) => {

    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log("scrolled", transferNextCursor.current, bottom, e.target.scrollHeight - e.target.scrollTop, e.target.clientHeight, transferItemLoadingRef.current, transferTotalItemsRef.current, transferFetchedTotalItemsRef.current)

    if (transferNextCursor.current && bottom && !transferItemLoadingRef.current && transferTotalItemsRef.current > transferFetchedTotalItemsRef.current) {
      console.log("scrolled above 85% of the page loading next items")
      transferItemLoadingRef.current = true
      setTransferInfiniteLoader(prev => !prev)
      fetchWalletTokenIdTransfers(currentProjectData?.nftContractType ?? '', params.nftcontractaddress, params.tokenid, transferNextCursor.current)
    } else {
      setTransferInfiniteLoader(false)
    }

    // const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    // if (bottom && (Number(totalTradeHistory) != Number(transfersDataSet.length))) {
    //   console.log('Fetch more list items of TradeHistory!')
    //   fetchMoreData("TradeHistory")
    // }
  }

  const handleScrollOfNFTOwners = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log("scrolled", nextCursor.current, bottom, e.target.scrollHeight - e.target.scrollTop, e.target.clientHeight, itemLoadingRef.current, totalItemsRef.current, fetchedTotalItemsRef.current)

    if (nextCursor.current && bottom && !itemLoadingRef.current && totalItemsRef.current > fetchedTotalItemsRef.current) {
      console.log("scrolled above 85% of the page loading next items")
      itemLoadingRef.current = true
      setInfiniteLoader(prev => !prev)
      fetchNFTOwners(currentProjectData?.nftContractType ?? '', params.nftcontractaddress, params.tokenid, nextCursor.current)
    } else {
      setInfiniteLoader(false)
    }

    // const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    // if (bottom && (Number(totalNFTOwners) != Number(nftOwnerModalData.length))) {
    //   console.log('header bottom reached')
    //   console.log('Fetch more list items of owners!')
    //   fetchMoreData("NftOwners")
    // }
  }

  const videoFormat = isVideoFormat(currentProjectData?.src);
  const toggle = () => {
    setModalOpen(!modalOpen)
  }

  const [modalActive, setModalActive] = useState(false)

  const toggleModal = () => {
    setModalActive(!modalActive)
  }

  const [sellModal, setSellModal] = useState(false)

  const toggleSellModal = () => {
    setSellModal(!sellModal)
  }

  const history = useHistory()
  console.log(favoriteDetails, "favoriteDetails")
  return (
    <>
      {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      <div className="project-conatainer">
        <TableModal toggle={toggle} isOpen={modalOpen} currentProjectData={currentProjectData} lowListingPriceObj={lowListingPriceObj} setIsRefreshListingData={setIsRefreshListingData} wethtoUsd={wethtoUsd} />
        <NFTPageModal
          currentProjectData={currentProjectData}
          toggle={toggleModal}
          isOpen={modalActive}
          title="MAKE OFFER"
          quantityLabel="Quantity"
          priceLabel="Price"
          offerExpirationLabel="Offer Expiration"
          addFundBtn="Add Funds"
          successBtn="Make Offer"
          wethtoUsd={wethtoUsd}
          creatorFeesForNFT={creatorFeesForNFT}
          commissionInfoForNFT={commissionInfoForNFT}
        />
        <NFTPageModal
          currentProjectData={currentProjectData}
          numberOfHoldings={currentProjectData?.numberOfHoldings ?? 1}
          toggle={toggleSellModal}
          isOpen={sellModal}
          selectedOption={getSelectedOption}
          title="SELL"
          quantityLabel="Quantity"
          priceLabel="Price per item"
          offerExpirationLabel="Schedule"
          successBtn="Post Listing"
          setIsRefreshListingData={setIsRefreshListingData}
          footerText="Genesis Shards charges no listing fees"
          wethtoUsd={wethtoUsd}
          creatorFeesForNFT={creatorFeesForNFT}
          commissionInfoForNFT={commissionInfoForNFT}
        />
        <section className="project-section">
          <div className="container">
            <div className="content-wrapper">
              <div className="left-arrow" onClick={() => history.goBack()}>
                <img
                  src={BackIcon}
                  alt="Left Arrow"
                  title="Left Arrow"
                  className="left-arrow-img"
                />
              </div>
              <div className="img-block">
                {
                  videoFormat ?
                    <ReactPlayer
                      className="img-wrapper"
                      width={'100%'} height={'100%'}
                      playing={true} loop={true} muted={true}
                      url={currentProjectData?.src} />
                    : <img src={currentProjectData?.src && currentProjectData?.src.split('.').pop() !== "svg+xml" ? currentProjectData?.src : `/images/noimageavailable.png`} alt=""
                    />
                }
                {/* <ReactPlayer
                  className="img-wrapper"
                  width={'100%'} height={'100%'} playing={true} muted={true}
                  url={currentProjectData?.src} loop={true}
                /> */}
              </div>
              <div className="content-block">
                <div className="content-block-wrapper">
                  {/* <div className="small-title"></div> */}
                  <div className="createdByowner" onClick={() => window.open(`http://${new URL(window.location.href).host}/collection/${Number(currentProjectData?.networkChainIdValue)}/${currentProjectData?.nftContract}`, "_blank")}>{collectionDet && collectionDet?.collectionName && collectionDet?.collectionName != "" ? collectionDet?.collectionName : `Un-Identified Collection`}</div>
                  <div className="like-badge" onClick={addUserVoteToNFT} style={{ cursor: "pointer" }}>
                    <div className="img-container">
                      <img
                        style={!favoriteDetails.isFavorite ? { opacity: 0.3 } : {}}
                        className="heart-icon"
                        src={LikeIcon}
                        alt="Heart Icon"
                        title="Heart Icon"
                      />
                    </div>
                    <div className="like-count">{favoriteDetails.totalLikes}</div>
                  </div>
                </div>
                <div className="hero-title fs-3">{currentProjectData?.name ?? ''}</div>
                {currentProjectData?.nftContractType === "ERC721" && <div className="owned-by-url" >OWNED BY <span className="owner" onClick={() => window.open(chainId && getEtherscanLink(chainId, nftOwnerAddress || '', "address"), "_blank")}>{nftOwnerAddress.length > 1 ? `${shortenAddress(nftOwnerAddress || '')}` : ""}</span></div>}
                {currentProjectData?.nftContractType === "ERC1155" &&
                  <div className='own-nft-detail'>
                    {console.log('--------------------------gggggg',totalNFTOwners)}
                    <div className="owned-by" onClick={() => nftOwnerModalToggle()} >
                      <Users />
                      <span className="owner">Total Owners</span> 
                      {/* {totalNFTOwners}  */}
                    </div>
                    {/* <div className="owned-by" >
                     <img className='owned-by-icon' src={Grid} alt="" />
                      <span className="owner">{totalNFTOwners} items</span>
                    </div>
                    <div className="owned-by" >
                    <img className='owned-by-icon' src={Person} alt="" />
                      <span className="owner"> You own {totalNFTOwners}</span>
                    </div>
                    <div className="owned-by">
                    <img className='owned-by-icon' src={Shapes} alt="" />
                      <span className="owner">Domain names</span>
                    </div> */}
                  </div>
                }
                <NftOwnerModal
                  nftOwnerModalData={nftOwnerModalData}
                  nftOwnerModal={nftOwnerModal}
                  nftOwnerModalToggle={nftOwnerModalToggle}
                  infiniteLoader={infiniteLoader}
                  handleScrollOfNFTOwners={handleScrollOfNFTOwners}
                />
                <div className="nft-desc">Description of the NFT</div>
                <div className="note">
                  {currentProjectData?.description ?? ''}
                </div>

                <div className="buy-eth">
                  {(!isSelfOwnedNFT && lowListingPriceObj && Object.keys(lowListingPriceObj).length > 0) && <div className="eth-digits">{lowListingPriceObj?.listingPriceDetails} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</div>}
                  <div className="buy-eth-and-details">
                    {(!isSelfOwnedNFT && lowListingPriceObj && Object.keys(lowListingPriceObj).length > 0) && <button
                      className="buy-cta"
                      onClick={() => setModalOpen(true)}
                    >
                      BUY
                    </button>}
                    {
                      <div className="detail-cta-wrapper">
                        <div className='detail-cta'>
                          <button onClick={() => detailsModalToggle()}>Details</button>
                          <img src={Downarrow} alt="down" />
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <DetailsModal isOpen={detailsModal} toggle={detailsModalToggle} currentProjectData={currentProjectData} creatorFeesForNFT={creatorFeesForNFT} />
                <ApproveModal isOpen={approveModal} toggle={approveModalToggle} currentProjectData={currentProjectData} creatorFeesForNFT={creatorFeesForNFT} />

                {/* <div className="buy-eth">
                  <div className="eth-digits">{currentProjectData?.price} {(network === 'BSC' || network === 'T-BSC' ? 'BNB' : network === 'GOERLI' ? 'GETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'IOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'ONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AVAX' : String(network).toUpperCase())}</div>
                  <button
                    className="buy-cta"
                    onClick={() => setModalOpen(true)}
                  >
                    BUY
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
        <section className="properties-section">
          <div className="properties-header">Properties</div>
          <div className="all-properties">
            {
              (typeof currentProjectData?.nftAttributes === 'object' && currentProjectData?.nftAttributes !== null && !Array.isArray(currentProjectData?.nftAttributes))
                ?
                // const result = Object.keys(currentProjectData?.nftAttributes).map((key) => [Number(key), obj[key]]);
                Object.keys(currentProjectData?.nftAttributes).map((key) => <div className="property">
                  <div className='type'>{key}</div>
                  <div className="value">{currentProjectData?.nftAttributes[key]}</div>
                </div>)
                :
                currentProjectData?.nftAttributes?.map((property) => <div className="property">
                  <div className='type'>{property?.trait_type ?? property?.type ?? ""}</div>
                  <div className="value">{property?.value ?? property?.name ?? ""}</div>
                </div>)
            }
          </div>
          {
            currentProjectData?.nftLevels?.length ? <div className="levels-header">Levels</div> : null
          }
          {
            currentProjectData?.nftLevels?.map((nftLevel, ind) => <StatsLevelProgressBar key={ind} label={nftLevel?.name} value={nftLevel?.min} total={nftLevel?.max} />)
          }
          {
            currentProjectData?.nftStats?.length ? <div className="levels-header">Stats</div> : null
          }
          {
            currentProjectData?.nftStats?.map((nftStat, ind) => <StatsLevelProgressBar key={ind} label={nftStat?.name} value={nftStat?.min} total={nftStat?.max} />)
          }
          {/* {typeof(currentProjectData?.nftLevels) != "undefined" && currentProjectData?.nftLevels !== null && currentProjectData && currentProjectData?.nftLevels && <div className="levels-header">Levels</div>}
          {typeof(currentProjectData?.nftLevels) != "undefined" && currentProjectData?.nftLevels !== null && currentProjectData && currentProjectData?.nftLevels && <div className='show-input-level-details'>
            {
              currentProjectData?.nftLevels.length > 0 && currentProjectData?.nftLevels?.map((item) => {
                const { name, min, max } = item
                return <StatsLevelProgressBar label={name} value={min} total={max} />
              })
            }
          </div>} */}

          {/* {currentProjectData && currentProjectData?.nftStats.length > 0 && <div className="levels-header">Stats</div>}
          {currentProjectData && currentProjectData?.nftStats.length > 0 && <div className='show-input-level-details'>
            {
              currentProjectData?.nftStats?.map((item) => {
                const { name, min, max } = item
                return <StatsLevelProgressBar label={name} value={min} total={max} />
              })
            }
          </div>} */}
        </section>
        <section className="price-history">
          <div className="container">
            <div className="section-header">
              <div className="block-title title">Price History</div>
              <div className="dropdown-wrapper">
                <div className="selectselling">
                  <select onChange={(e) => setSelectedPriceHistoryFilter(e.target.value)}>
                    {
                      sekkingOptions?.map((option, ind) => {
                        return (
                          <option value={option} key={ind} selected={ind === sekkingOptions.length - 1}>{option}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <ApexCharts chartData={filterGraphData} />
          </div>
        </section>
        <section className="project-detail">
          <div className="container">
            <div className="project-title block-title">
              Details about the project
            </div>
            <p className="project-text">
            This collection has no description yet. Contact the owner of this collection about setting it up on GenShards!.
             </p>
          </div>
        </section>
        <section className="table-sections">
          <div className="container">

            <div className="offer-block">
              <div className="block-title offer-title">Auction Listings</div>
              {/* {isSelfOwnedNFT ?
                          <td><button className="unlistItem-cta" onClick={() => finishAuctionByUser(auctionItem)}>Finish</button>
                            <button className="unlistItem-cta" onClick={() => cancelAuctionByUser(auctionItem)}>Cancel</button>
                          </td> : <></>} */}
              {console.log("-----------****** ", auctionItemDataSet[0]?.auctionBidsArray)
              }
              {auctionItemDataSet.length > 0 && auctionItemDataSet[0]?.auctionBidsArray?.length > 0 ? <div className="table-wrapper offer-table-wrapper">
                <table className="offer-table">
                  <thead>
                    <tr className="header-row">
                      <td className="header-cell">Price</td>
                      <td className="header-cell">Price in USD</td>
                      <td className="header-cell">Expiration</td>
                      <td className="header-cell">From</td>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionItemDataSet[0]?.auctionBidsArray.map((auctionBidItem, ind) =>
                      <tr key={ind}>
                        <td className="first-cell">{Number(auctionBidItem?.bidPrice).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                        <td>${(Number(auctionBidItem?.bidPrice) * Number(wethtoUsd)).toFixed(5)}</td>
                        <td>{moment(moment.unix(Number(auctionBidItem?.bidTime)).format()).fromNow()}</td>
                        <td className="last-cell">{auctionBidItem?.bidderAddress ? `${shortenAddress(auctionBidItem?.bidderAddress || '')}` : ''}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div> : <div className="no-offer-data">
                <img src="/images/no-offer-data.svg" alt="no offers" />
                <div className="description">{auctionItemDataSet.length > 0 ? "No Bid Items on this Auctions Yet" : "No Active Auctions yet"}</div>
              </div>}
              <div>

                {auctionItemDataSet.length >= 1
                  ? <div className="top-bid-expiry-label">
                    {`Sale ends ${moment.unix(Number(auctionItemDataSet[0]?.auctionEndDate)).toLocaleString()}`}

                    {/* {`Sale ends ${moment.unix(Number(auctionItemDataSet[0]?.auctionTime) + Number(auctionItemDataSet[0]?.auctionItemDuration)).format("MMMM DD, YYYY")} at ${moment.unix(Number(auctionItemDataSet[0]?.auctionTime) + Number(auctionItemDataSet[0]?.auctionItemDuration)).format("hh:mm A ZZ")} `} */}
                  </div>
                  : <div style={{ height: "0px" }}></div>}

                {auctionItemDataSet.length >= 1
                  ? <div className="top-bid-label">
                    {isSelfOwnedNFT ? (Number(auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice) >= Number(auctionItemDataSet[0]?.auctionPriceDetails))
                      ? `Top bid  -- Reserve price of ${auctionItemDataSet[0]?.auctionPriceDetails || 0} ${(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())} met!. (${auctionItemDataSet[0]?.auctionAmount} quantity available.)`
                      : `Minimum bid -- Reserve price of ${auctionItemDataSet[0]?.auctionPriceDetails || 0} ${network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()} not met!. (${auctionItemDataSet[0]?.auctionAmount} quantity available.)`
                      : (Number(auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice) >= Number(auctionItemDataSet[0]?.auctionPriceDetails)) ? "Top bid  -- Reserve price met!." + ` (${auctionItemDataSet[0]?.auctionAmount} quantity available.)` : "Minimum bid -- Reserve price not met." + ` (${auctionItemDataSet[0]?.auctionAmount} quantity available.)`}
                  </div>
                  : <div style={{ height: "0px" }}></div>}

                {auctionItemDataSet.length >= 1
                  ? <div className="amount-weth">
                    <img src="/images/weth.svg" alt="weth" />
                    <span>{(Number(auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice) >= Number(auctionItemDataSet[0]?.auctionPriceDetails)) ? (auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice || 0.00) : (auctionItemDataSet[0]?.auctionPriceDetails || 0.00)}</span>
                    <span>(${(((Number(auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice) >= Number(auctionItemDataSet[0]?.auctionPriceDetails)) ? (auctionItemDataSet[0]?.highlyBidListedItem?.bidPrice || 0.00) : (auctionItemDataSet[0]?.auctionPriceDetails || 0.00)) * Number(wethtoUsd)).toFixed(2)})</span>
                  </div>
                  : <div style={{ height: "0px" }}></div>}

              </div>
              {auctionItemDataSet.length >= 1
                ? (auctionItemDataSet[0]?.auctionSeller.toLowerCase() !== account!.toLowerCase())
                  ? <button className="place-bid" onClick={() => makeBidOnAuctionExceptOwner(auctionItemDataSet[0])}>Make Bid On Auction</button> :
                  <div className="finish-cancel-wrapper">
                    <button className="place-bid" onClick={() => finishAuctionByUser(auctionItemDataSet[0])}>Finish</button>
                    <button className="place-bid" onClick={() => cancelAuctionByUser(auctionItemDataSet[0])}>Cancel</button>
                  </div>
                : <div style={{ height: "59px" }}></div>}
              <BidaModal isOpen={bidModal} toggle={bidModalToggle} auctionItem={auctionItemDataSet.length >= 1 ? auctionItemDataSet[0] : {} as any} setIsRefreshListingData={setIsRefreshListingData} wethtoUsd={wethtoUsd} nftContractAddress={params.nftcontractaddress!} nftTokenId={params.tokenid!} />
            </div>

            <div className="listings-block">
              <div className="block-title listings-title">Dutch Auction Listings</div>
              {dutchAuctionListingDataSet.length > 0 ? <div className="table-wrapper listings-table-wrapper">
                <table className="listings-table">
                  <thead>
                    <tr className="header-row">
                      <td className="header-cell">Start Price</td>
                      <td className="header-cell">End Price</td>
                      <td className="header-cell">Current Price</td>
                      <td className="header-cell">Price in USD</td>
                      <td className="header-cell">Quantity</td>
                      <td className="header-cell">Expiration</td>
                      <td className="header-cell">From</td>
                      <td className="header-cell"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {dutchAuctionListingDataSet.map((dutchAuctionListingItem, ind) => {
                      return (
                        <tr key={ind}>
                          <td>{Number(dutchAuctionListingItem?.dutchAuctionListingPriceDetails).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                          <td>{Number(dutchAuctionListingItem?.dutchAuctionListingEndPriceDetails).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                          <td>{Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                          <td>${(Number(dutchAuctionListingItem?.dutchAuctionListingCurrentPriceDetails) * Number(wethtoUsd)).toFixed(5)}</td>
                          <td>{Number(dutchAuctionListingItem?.dutchAuctionListingAmount)}</td>
                          <td>{moment(moment.unix(Number(dutchAuctionListingItem?.dutchAuctionListingEndDate)).format()).fromNow()}</td>
                          <td>{dutchAuctionListingItem?.dutchAuctionListingSeller ? `${shortenAddress(dutchAuctionListingItem?.dutchAuctionListingSeller || '')}` : ''}</td>
                          <td>
                            {dutchAuctionListingItem?.dutchAuctionListingSeller.toLowerCase() !== account!.toLowerCase() ?
                              <button className="buyNowListing-cta" onClick={() => handleApproveOfBuyNowDutchAuctionListingExceptTheOwner(dutchAuctionListingItem)}>Buy Now</button> :
                              <button className="unlistItem-cta" onClick={() => cancelDutchAuctionByUser(dutchAuctionListingItem)}>Cancel</button>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div> : <div className="no-listing-data">
                <img src="/images/no-listing-data.svg" alt="no listing" />
                <div className="description">No Dutch Auction Listed Item Available Yet</div>
              </div>}
              {/* {isSelfOwnedNFT && auctionItemDataSet.length === 0 ?
                <button className="place-bid" onClick={() => {
                  setGetSelectedOption("DutchAuction")
                  toggleSellModal()
                }}>
                  Create Dutch Auction
                </button> : <div style={{ height: "59px" }}></div>} */}
            </div>

            <div className="offer-block">
              <div className="block-title offer-title">Offers</div>
              {offerDataSet.length > 0 ? <div className="table-wrapper offer-table-wrapper">
                <table className="offer-table">
                  <thead>
                    <tr className="header-row">
                      <td className="header-cell">Price</td>
                      <td className="header-cell">Price in USD</td>
                      <td className="header-cell">Quantity</td>
                      <td className="header-cell">Expiration</td>
                      <td className="header-cell">From</td>
                      <td className="header-cell"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {offerDataSet.map((offerItem, ind) =>
                      <tr key={ind}>
                        <td className="first-cell">{Number(offerItem?.offerPriceDetails).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                        <td>${(Number(offerItem?.offerPriceDetails) * Number(wethtoUsd)).toFixed(5)}</td>
                        <td>{Number(offerItem?.offerAmount)}</td>
                        {/* new Date(Number(getOfferItemDetails?.offerTime) + Number(getOfferItemDetails?.offerDuration)) */}
                        <td>{moment(moment.unix(Number(offerItem?.offerEndDate)).format()).fromNow()}</td>
                        <td className="last-cell">{offerItem?.offerBuyer ? `${shortenAddress(offerItem?.offerBuyer || '')}` : ""}</td>
                        {(!isSelfOwnedNFT && offerItem?.offerBuyer.toLowerCase() === account!.toLowerCase()) ?
                          <td><button className="unlistItem-cta" onClick={() => cancelOfferByUser(offerItem)}>Cancel</button></td> :
                          isSelfOwnedNFT ?
                            <td><button className="buyNowListing-cta" onClick={() => handleApproveOfAcceptOfferByNFTOwner(offerItem)}>Accept</button></td> : <></>}
                      </tr>)}
                  </tbody>
                </table>
              </div> : <div className="no-offer-data">
                <img src="/images/no-offer-data.svg" alt="no offers" />
                <div className="description">No Offers Yet</div>
              </div>}
              {(currentProjectData?.nftContractType === "ERC1155") || (currentProjectData?.nftContractType === "ERC721" && !isSelfOwnedNFT) ? <button className="place-bid" onClick={toggleModal}>
                Make Offer
              </button> : <div style={{ height: "59px" }}></div>}
            </div>

            <div className="listings-block">
              <div className="block-title listings-title">Listings</div>
              {listingDataSet.length > 0 ? <div className="table-wrapper listings-table-wrapper">
                <table className="listings-table">
                  <thead>
                    <tr className="header-row">
                      <td className="header-cell">Price</td>
                      <td className="header-cell">Price in USD</td>
                      <td className="header-cell">Quantity</td>
                      <td className="header-cell">Expiration</td>
                      <td className="header-cell">From</td>
                      <td className="header-cell"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {listingDataSet.map((listingItem, ind) => {
                      return (
                        <tr key={ind}>
                          <td>{Number(listingItem?.listingPriceDetails).toFixed(5)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                          <td>${(Number(listingItem?.listingPriceDetails) * Number(wethtoUsd)).toFixed(5)}</td>
                          <td>{Number(listingItem?.listingAmount)}</td>
                          <td>{moment(moment.unix(Number(listingItem?.listingEndDate)).format()).fromNow()}</td>
                          <td>{listingItem?.listingSeller ? `${shortenAddress(listingItem?.listingSeller || '')}` : ''}</td>
                          <td>
                            {!isSelfOwnedNFT ?
                              <button className="buyNowListing-cta" onClick={() => handleApproveOfBuyNowListingExceptTheOwner(listingItem)}>Buy Now</button> :
                              <button className="unlistItem-cta" onClick={() => UnListingByUser(listingItem)}>Remove</button>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div> : <div className="no-listing-data">
                <img src="/images/no-listing-data.svg" alt="no listing" />
                <div className="description">No Listing Data Yet</div>
              </div>}
              {isSelfOwnedNFT && auctionItemDataSet.length === 0 ?
                <button className="place-bid" onClick={() => {
                  setGetSelectedOption("Listing")
                  toggleSellModal()
                }}>
                  Sell
                </button> : <div style={{ height: "59px" }}></div>}
            </div>

            <div className="trade-history">
              <div className="trade-label-filter">
                <div className="block-title trade-title">Trade History</div>
                <div className="trade-history">
                  <Dropdown isOpen={tradeFilter} toggle={tradeFilterToggle}>
                    <DropdownToggle caret className='width: 100%'>
                      {selectedDrop ? selectedDrop : drop[0]}
                    </DropdownToggle>
                    <DropdownMenu style={{ left: "0px"}}>
                      {
                        drop?.map((drp) =>
                          <DropdownItem  onClick={() => setselectedDrop(drp)}>
                            {drp}
                          </DropdownItem>)
                      }
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              {(transfersDataSet.length > 0 && selectedDrop === "Transfers") ?
                <div className="trade-block"> <div className="table-wrapper listings-table-wrapper" onScroll={(e) => handleScrollOfTradeHistory(e)}>
                  <table className="listings-table" id="tradeHistoryScroll">
                    <thead>
                      <tr className="header-row">
                        <td className="header-cell">Event</td>
                        <td className="header-cell">Unit Price</td>
                        <td className="header-cell">From</td>
                        <td className="header-cell">To</td>
                        <td className="header-cell">Date</td>
                      </tr>
                    </thead>
                    <tbody>
                      {transfersDataSet.map((listingItem, ind) => {
                        return (
                          <tr key={ind}>
                            <td> {listingItem?.from_address.toLowerCase() === "0x0000000000000000000000000000000000000000".toLowerCase() ? <div className="event-wrapper"> <img src="/images/mint-icon.svg" alt="mint" /> <span>Minted</span></div> : <div className="event-wrapper"> <img src="/images/transfer-icon.svg" alt="transfer" /> <span>Transfer</span></div>} </td>
                            <td></td>
                            <td className="redirect-from" >{listingItem?.from_address.toLowerCase() === "0x0000000000000000000000000000000000000000".toLowerCase() ? "NullAddress" : listingItem?.from_address ? `${shortenAddress(listingItem?.from_address || '')}` : ''}</td>
                            <td className="redirect-to">{listingItem?.to_address ? `${shortenAddress(listingItem?.to_address || '')}` : ''}</td>
                            <td className='redirect-date' onClick={() => window.open(chainId && getEtherscanLink(chainId, listingItem?.transaction_hash || '', "transaction"), "_blank")}>
                              {moment(listingItem?.block_timestamp!).fromNow()}<Navigation />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {transferInfiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
                </div> </div>
                : (allListingDataSet.length > 0 && selectedDrop === "Listings") ?
                  <div className="trade-block"> <div className="table-wrapper listings-table-wrapper" onScroll={(e) => handleScrollOfTradeHistory(e)}>
                    <table className="listings-table" id="tradeHistoryScroll">
                      <thead>
                        <tr className="header-row">
                          <td className="header-cell">Event</td>
                          <td className="header-cell">Unit Price</td>
                          <td className="header-cell">From</td>
                          <td className="header-cell">To</td>
                          <td className="header-cell">Date</td>
                          <td className="header-cell">Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {allListingDataSet.map((listingItem, ind) => {
                          return (
                            <tr key={ind}>
                              <td><div className="event-wrapper"><img src="/images/list-icon.svg" alt="list" /> <span>List</span></div></td>
                              <td>{Number(listingItem?.listingPriceDetails)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                              <td className="redirect-from">{listingItem?.listingSeller ? `${shortenAddress(listingItem?.listingSeller || '')}` : ''}</td>
                              <td style={{ width: '200px' }}>-</td>
                              <td>{moment(moment.unix(Number(listingItem?.listingEndDate)).format()).fromNow()}</td>
                              <td>{listingItem?.listingItemId && listingItem?.listingItemStatus === 1 ? "InProgress" : listingItem?.listingItemId && listingItem?.listingItemStatus === 2 ? "Transferred" : listingItem?.listingItemId && listingItem?.listingItemStatus === 3 ? "Expired/Cancel" : "UnConfirmed"}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div> </div>
                  : (saleDataSet.length > 0 && selectedDrop === "Sales") ?
                    <div className="trade-block"> <div className="table-wrapper listings-table-wrapper" onScroll={(e) => handleScrollOfTradeHistory(e)}>
                      <table className="listings-table" id="tradeHistoryScroll">
                        <thead>
                          <tr className="header-row">
                            <td className="header-cell">Event</td>
                            <td className="header-cell">Unit Price</td>
                            <td className="header-cell">From</td>
                            <td className="header-cell">To</td>
                            <td className="header-cell">Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {saleDataSet.map((listingItem, ind) => {
                            return (
                              <tr key={ind}>
                                <td><div className="event-wrapper"><img src="/images/sale-icon.svg" alt="sale" /> <span>Sale</span></div></td>
                                <td>{Number(listingItem?.listingPriceDetails)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                                <td style={{ width: '200px' }}></td>
                                <td className="redirect-from">{listingItem?.listingSeller ? `${shortenAddress(listingItem?.listingSeller || '')}` : ''}</td>
                                <td>{moment(moment.unix(Number(listingItem?.sellTime)).format()).fromNow()}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div> </div>
                    : (allOfferDataSet.length > 0 && selectedDrop === "Offers") ?
                      <div className="trade-block"> <div className="table-wrapper listings-table-wrapper" onScroll={(e) => handleScrollOfTradeHistory(e)}>
                        <table className="listings-table" id="tradeHistoryScroll">
                          <thead>
                            <tr className="header-row">
                              <td className="header-cell">Event</td>
                              <td className="header-cell">Unit Price</td>
                              <td className="header-cell">From</td>
                              <td className="header-cell">To</td>
                              <td className="header-cell">Date</td>
                              <td className="header-cell">Status</td>
                            </tr>
                          </thead>
                          <tbody>
                            {allOfferDataSet.map((offerItem, ind) => {
                              return (
                                <tr key={ind}>
                                  <td><div className="event-wrapper"><img src="/images/offer-icon.svg" alt="offer" /> <span>Offer</span></div></td>
                                  <td className="first-cell">{Number(offerItem?.offerPriceDetails)} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</td>
                                  <td className="redirect-from">{offerItem?.offerBuyer ? `${shortenAddress(offerItem?.offerBuyer || '')}` : ''}</td>
                                  <td style={{ width: '200px' }}></td>
                                  <td>{moment(moment.unix(Number(offerItem?.offerEndDate)).format()).fromNow()}</td>
                                  <td>{offerItem?.offerItemId && offerItem?.offerItemStatus === 1 ? "InProgress" : offerItem?.offerItemId && offerItem?.offerItemStatus === 2 ? "Transferred" : offerItem?.offerItemId && offerItem?.offerItemStatus === 3 ? "Expired/Cancel" : "UnConfirmed"}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div> </div>
                      : <div className="no-listing-data">
                        <img src="/images/no-trade-history-data.svg" alt="no trade" />
                        <div className="description">No Trading History Data Available.</div>
                      </div>}

            </div>


            <div className="project-block">
              <div className="block-title project-title">
                More from the project
              </div>
            </div>
            {moreNFTsDataSet.length > 0 ?
              <div className="project-block">
                <div className="project-list">
                  {moreNFTsDataSet.map((listingItem, ind) => {
                    const totalLikes = tokenLikes && tokenLikes[`${String(listingItem.nftTokenAddress).toLowerCase()}_${listingItem.nftTokenId}`] || 0
                    return (
                      <div className="project-wrapper" onClick={() => moveOnWithSelectedNFT(listingItem, listingItem?.nftTokenAddress, listingItem?.nftTokenId)}>
                        <div className="img-wrapepr">
                          <div className="like-badge">
                            <div className="img-container">
                              <img
                                className="heart-icon"
                                src={LikeIcon}
                                alt="Heart Icon"
                                title="Heart Icon"
                              />
                            </div>
                            <div className="like-count">{totalLikes}</div>
                          </div>
                          {
                            isVideoFormat(listingItem?.nftImage) ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={listingItem?.nftImage} loop={false} />
                              : <img src={listingItem?.nftImage && listingItem?.nftImage.split('.').pop() !== "svg+xml" ? listingItem?.nftImage : `/images/noimageavailable.png`} alt="" loading="lazy" />
                          }
                        </div>
                        <div className="content">
                          <div className="created-by">{collectionDet && collectionDet?.collectionAddress && collectionDet?.collectionAddress != "" ? shortenAddress(collectionDet?.collectionAddress) : `Un-Identified Collection`}</div>
                          <div className="title-block">
                            <div className="project-title">{listingItem?.nftName || ''}</div>
                            <div className="hide-block">
                              {/* <img
                              src={HideIcon}
                              alt="Hide Icon"
                              title="Hide Icon"
                              className="hide-icon"
                            />
                            <span className="hide">Hide</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="view-collection-wrapper"><button onClick={() => history.push(`/collection/${currentProjectData?.networkChainIdValue}/${currentProjectData?.nftContract}`)}>View Collection</button></div>
              </div> :
              <div className="no-listing-data">
                <img src="/images/no-trade-history-data.svg" alt="no trade" />
                <div className="description">No More Collection Data Available.</div>
              </div>}

          </div>
        </section>
      </div>
    </>
  )
}

export default GardenofEden
