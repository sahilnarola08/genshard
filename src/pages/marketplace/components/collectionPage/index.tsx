import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import downArrow from '../../../../images/marketplace/downArrow.svg'
import likeIcon from '../../../../images/marketplace/Like.png'
import filterIcon from '../../../../images/marketplace/Filter.png'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './style.sass'
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin, getContract, shortenAddress } from '../../../../utils'
import { abi as GEN_MARKETPLACE_ABI } from '../../../../contracts/GenMarketPlace.json';
import GEN_NFT_MARKETPLACE_ABI from '../../../../contracts/GenNFTMarketPlace.json';
import { parseEther } from 'ethers/lib/utils'
import { KYC_STATUS } from '../../../../state/application/reducer'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useAddPopup } from '../../../../state/application/hooks'
import { isVideoFormat } from '../../../market/helper'
import PaginationComp from '../individualProfile/profileSide/pagination'
import { useEffect, useState } from 'react'
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA } from '../../../../constants'
import LoaderComp from '../../../../shared/components/LoaderComponent'
import { IUserNFT } from '../..'
import { addItemsToCart, removeItemsFromCart } from '../../../../state/user/actions'
import { UserCartItem } from '../../../../state/user/types'
import useCart from '../../../../hooks/useCart'
import Noimage from '../../../../images/no_image_available.jpeg';


export const sellingDropdown = [
  {
    label: 'Recently Listed',
    value: "recently_listed",
  },
  {
    label: 'Recently Sold',
    value: "recently_sold",
  },
  {
    label: 'Recently Minted',
    value: "new",
  },
  {
    label: 'Price (High - Low)',
    value: "price_high",
  },
  {
    label: 'Price (Low - High)',
    value: "price_low",
  },
  {
    label: 'Highest Last Sale',
    value: "highest_last_sale",
  },
]

function SellingPlace({
  nftsData,
  tickets,
  selectedSortBy,
  filters,
  setSelectedSortBy,
  setIsOpened,
  setRefreshData,
  onSort,
  totalNumberOfResults,
  getInitialFetchActiveItemsData,
  infiniteLoader = false
}: any) {

  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const history = useHistory()
  const network = useSelector((state: AppState) => state.application.network)
  const genNFTMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
  const kycStatus = useSelector((state: AppState) => state.application.kyc_status)
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState("Please Wait")

  const userCart = useSelector((state: AppState) => state.user.userCart)
  const tokenLikes = useSelector((state: AppState) => state.token.tokenLikes)
  const cartItems = (account && chainId) && userCart && userCart[account!] && userCart[account!][chainId!] || []

  const [imgSrc, setImgSrc] = useState("/images/noimageavailable.png");
  const HandleError = () => setImgSrc("/images/noimageavailable.png");

  // const userCart = useSelector((state: AppState) => state.user.userCart)
  const { addToCart, removeFromCart, isLoading: cartLoader } = useCart()

  const onBuyNow = async (ticket: any) => {

    if (genNFTMarketPlaceContractAddress === undefined) return
    const market = getContract(genNFTMarketPlaceContractAddress, GEN_NFT_MARKETPLACE_ABI, library!, account!)
    if (!market) throw new Error('No NFT MarketPlace Contract Found!')

    setIsLoading(true);
    setMsg("Buy NFT")

    // Older Changes will be there in comment
    // const { marketPlaceAddress } = ticket.currentProject;
    // if (marketPlaceAddress === undefined) return

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<number | string>,
      value: BigNumber | null

    // const market = getContract(marketPlaceAddress, GEN_MARKETPLACE_ABI, library!, account!)

    method = market.createMarketSale //market.buy
    estimate = market.estimateGas.createMarketSale //market.estimateGas.buy

    // Older Method
    // args = [
    //   ticket?.index,
    //   1
    // ]

    args = [
      ticket?.nftContract,
      ticket?.recordId
    ]

    value = parseEther(ticket?.nftPrice + '')
    console.log('args2', parseEther(ticket?.nftPrice + ''), args, value);

    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          addTransaction(response, {
            summary:
              'Purchased Gen NFT Successfully.'
          })
          setIsLoading(false);
          setMsg("Please Wait")
          setRefreshData((prev: boolean) => !prev);
        }).catch((err: any) => {
          setIsLoading(false);
          setMsg("Please Wait")
          console.log('error', err);
          let e = err.code === 4001 ? err : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
          if (err.code !== 4001) e = JSON.parse(e);
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
              description: e.data?.originalError?.message ?? '',
              withExternalLink: false,
            }
          });
        })
      )
      .catch((err: any) => {
        setIsLoading(false);
        setMsg("Please Wait")
        console.log('error', err);
        let e = err.code === 4001 ? err : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
        if (err.code !== 4001) e = JSON.parse(e);
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
            description: e.data?.originalError?.message ?? '',
            withExternalLink: false,
          }
        });
      })

  }

  const handleClick = async (ticket: any) => {
    // if (kycStatus !== KYC_STATUS.VERIFIED) {
    //   addErrorPopup({
    //     txn: {
    //       hash: '',
    //       success: false,
    //       summary: "KYC Not Verified",
    //       description: 'Complete your KYC to allow for buying an NFT',
    //       withExternalLink: false,
    //     }
    //   });
    //   return
    // }

    onBuyNow(ticket);
  }

  const totalShowing = Number((nftsData.length + tickets.length))

  const selectedSortByValue = sellingDropdown.find(item => item.value === selectedSortBy)

  const compLoader = isLoading || cartLoader

  return (
    <div className="main_content">
      {compLoader && <LoaderComp msg={msg} isOpen={compLoader} onClose={() => { }} />}
      <div className="hero_wrapper">
        <div className="nav">
          <div className="title">Showing {totalShowing ?? 0} results</div>
          {/* {tickets.length} of */}
          <div className="filter_icon" onClick={() => setIsOpened(true)}>
            <div className="filter">FILTERS</div>
            <img src={filterIcon} alt="filter icon" />
          </div>
          <div className="sort">
            <div className="select_selling">
              <select
                name="best selling"
                id="best_selling"
                className="currency"
                value={selectedSortByValue?.value || ""}
                onChange={(e) => setSelectedSortBy(e.target.value)}
              >
                <option value="test" style={{ display: 'none' }}>Default</option>
                {sellingDropdown.map((sellingData) => {
                  return (
                    <option value={sellingData.value}>{sellingData.label}</option>
                  )
                })}
              </select>
              <div className="dropdown_arrow">
                <img src={downArrow} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="garen_wraper row">
          {nftsData?.map((nftItem: any, index: number) => {
            console.log('nftsDatanftsData', nftItem);
            
            const nftAsset = nftItem.nftImage
            const cartItem = cartItems.find(item => item.tokenAddress === nftItem.tokenAddress && item.tokenId === String(nftItem.tokenId))
            const totalLikes = tokenLikes && tokenLikes[`${String(nftItem.tokenAddress).toLowerCase()}_${nftItem.tokenId}`] || 0
            return (
              <NftItemCard
                key={index}
                selectedChainId={filters.chainId || 0}
                tokenAddress={nftItem.tokenAddress}
                tokenId={String(nftItem.tokenId)}
                nftAsset={nftAsset}
                nftName={nftItem.nftName || "Unnamed"}
                listingPrice={nftItem.listingPrice}
                cartItem={cartItem}
                removeCartItem={removeFromCart}
                addToCart={addToCart}
                nftListings={nftItem.nftListings}
                offerPrice={nftItem.offerPrice}
                ownerAddress={nftItem.user.walletAddress}
                totalLikes={totalLikes}
              />
            )
          })}

          {tickets.length ?
            <>
              {tickets?.map((ticket: any, index) => {
                const cartItem = cartItems.find(item => item.tokenAddress === ticket.nftContract && item.tokenId === String(ticket?.nftTokenId))
                const totalLikes = tokenLikes && tokenLikes[`${String(ticket.nftContract).toLowerCase()}_${ticket.nftTokenId}`] || 0
                return (
                  <NftItemCard
                    key={index}
                    selectedChainId={filters.chainId || 0}
                    tokenAddress={ticket?.nftContract}
                    tokenId={String(ticket?.nftTokenId)}
                    nftAsset={ticket?.nftMetaDataImageURL || ""}
                    nftName={ticket.nameOfNFT || "Unnamed"}
                    listingPrice={ticket.nftPrice}
                    cartItem={cartItem}
                    removeCartItem={removeFromCart}
                    addToCart={addToCart}
                    totalLikes={totalLikes}
                  />
                )
              })}
            </>
            : (
              totalShowing > 0 ? null : <div style={{ color: '#00000', textAlign: 'center', height: '100%' }} className="no-data-found">No Projects Available!</div>
            )}
        </div>
        {infiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
      </div>
    </div >
  )
}

export default SellingPlace

interface INftItemCard {
  tokenAddress: string
  tokenId: string,
  selectedChainId: Number,
  nftAsset: string
  nftName: string,
  listingPrice?: number
  totalQuantity?: number,
  ownerAddress?: string,
  chainId?: number,
  cartItem?: UserCartItem,
  nftListings?: INftListingType[]
  offerPrice?: number,
  auctionPrice?: number,
  lastSoldPrice?: number,
  totalLikes?: number,
  removeCartItem?: (itemId: string) => void,
  addToCart?: (
    id: string,
    tokenAddress: string,
    tokenId: string,
    name: string,
    nftAsset: string,
    price: number,
    quantity: number,
    itemId: number,
    fromAddress: string
  ) => void
}

interface INftListingType {
  _id: string,
  listingStartPrice: number,
  quantity: number,
  actualRemainingQuantity: number,
  startTime: number,
  endTime: number,
  assetType: number,
  nftItemId: number,
  fromAddress: string,
}

export const NftItemCard = (props: INftItemCard) => {

  const {
    tokenAddress,
    tokenId,
    nftAsset,
    nftName,
    listingPrice,
    addToCart,
    cartItem,
    removeCartItem,
    nftListings,
    selectedChainId,
    totalLikes
  } = props
  const videoFormat = isVideoFormat(nftAsset);
  const { chainId } = useActiveWeb3React()
  // const userCart = useSelector((state: AppState) => state.user.userCart)

  // const cartChainId = userCart.chainId || 0

  let showAddToCart = false
  let lowestPriceListing = {} as INftListingType
  if (nftListings && nftListings?.length > 0) {
    showAddToCart = true
    let price = nftListings[0].listingStartPrice
    lowestPriceListing = nftListings[0]
    nftListings.forEach((listing, index) => {
      if (index === 0) return
      if (price > listing.listingStartPrice) {
        price = listing.listingStartPrice
        lowestPriceListing = listing
      }
    })
  }

  const onAddToCart = () => {
    const { _id, listingStartPrice = 0, actualRemainingQuantity = 0, nftItemId = 0, fromAddress = "" } = lowestPriceListing
    if (!_id || !listingStartPrice || !actualRemainingQuantity || !nftItemId) return
    // if (cartChainId  && selectedChainId != cartChainId) return
    addToCart!(
      _id,
      tokenAddress,
      tokenId,
      nftName,
      nftAsset,
      listingStartPrice,
      actualRemainingQuantity,
      nftItemId,
      fromAddress
    )
  }

  // console.log(selectedChainId, cartChainId, "chainIdchainIdchainId")

  return <div className="col-xxl-3 col-xl-4 col-lg-3 col-md-6 col-sm-4">
    <div className="px-1 py-3">
      <Link
        className="garen"
        to={`/assets/${tokenAddress}/${tokenId}`}
      // onClick={() => history.push()}
      >
        <div className="garen_img">
          {
            videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={nftAsset} loop={false} />
              : <img src={nftAsset && nftAsset.split('.').pop() !== "svg+xml" ? nftAsset : `/images/noimageavailable.png`} alt="" loading="lazy" />
          }
          <div className="heart">
            <div className="heart_img">
              <img src={likeIcon} alt="Heart" />
            </div>
            <div className="heart_text">{totalLikes}</div>
          </div>
        </div>
        <div className="silver_section">
          <div className="eden">
            <p className="eden_text">{nftName}</p>
            {/* <button onClick={(e) => {
                e.stopPropagation();
                handleClick(ticket);
              }}>BUY NOW</button> */}
          </div>
          <div className="silver_lake">
            <p className="price">
              PRICE <span>{listingPrice || 0} {(Number(selectedChainId) == 97 || Number(selectedChainId) == 56 ? 'WBNB' : Number(selectedChainId) == 5 || Number(selectedChainId) == 1 ? 'WETH' : Number(selectedChainId) == 4689 || Number(selectedChainId) == 4690 ? 'WIOTX' : Number(selectedChainId) == 1666600000 || Number(selectedChainId) == 1666700000 ? 'WONE' : Number(selectedChainId) == 43113 || Number(selectedChainId) == 43114 ? 'WAVAX' : Number(selectedChainId) == 137 || Number(selectedChainId) == 80001 ? 'WMATIC' : "WETH")}</span>
            </p>
            <p className="lake">{`${shortenAddress(tokenAddress)}`}</p>
          </div>
        </div>
        {showAddToCart ? <div className="nft-item-add-to-cart" onClick={e => { e.stopPropagation(); e.preventDefault() }}>

          {cartItem?.id ?
            <button onClick={() => removeCartItem!(cartItem?.id)}>
              Remove from Cart
            </button>
            : <button onClick={onAddToCart}>
              Add to Cart
            </button>}
        </div> : null}

      </Link>
    </div >
  </div >
}