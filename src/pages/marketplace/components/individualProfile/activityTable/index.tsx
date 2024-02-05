import "./style.sass"

import soldIcon from '../../../../../images/marketplace/soldIcon.svg'
import boughtIcon from '../../../../../images/marketplace/boughtIcon.svg'
import AccountMobileRoute from "../../accountRoute"
import { useTransactionAdder } from "../../../../../state/transactions/hooks"
import { useEffect, useState } from "react"
import { AppState } from "../../../../../state"
import { useSelector } from "react-redux"
import { useAddPopup } from "../../../../../state/application/hooks"
import useUserAuth from "../../../../../hooks/useUserAuth"
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA } from "../../../../../constants"
import { useHistory, useRouteMatch } from "react-router-dom"
import { useActiveWeb3React } from "../../../../../hooks/web3"
import LoaderComp from "../../../../../shared/components/LoaderComponent"
import { getAllNFTListingActivityData } from "../../../API/ApiCall"
import moment from "moment"
import { shortenAddress } from "../../../../../utils"

const ActivityTable = () => {

    const data = [
        {
            item: "Garden of Eden",
            price: "0.1 ETH",
            qty: 1,
            from: "address1",
            to: "address2",
            time: "25th Sep '21",
            icon: boughtIcon,
            type: "BOUGHT"
        }, {
            item: "T Rex",
            price: "0.8 ETH",
            qty: 5,
            from: "address1",
            to: "address2",
            time: "13th Oct '21",
            icon: soldIcon,
            type: "SOLD"
        }, {
            item: "Jurrasic Panda",
            price: "0.7 ETH",
            qty: 1,
            from: "address1",
            to: "address2",
            time: "31th Aug '21",
            icon: soldIcon,
            type: "SOLD"
        }, {
            item: "Saurabh Hasi",
            price: "0.01 ETH",
            qty: 3,
            from: "address1",
            to: "address2",
            time: "7th Nov '21",
            icon: boughtIcon,
            type: "BOUGHT"
        }, {
            item: "Cryptocat",
            price: "0.4 ETH",
            qty: 1,
            from: "address1",
            to: "address2",
            time: "5th Sep '21",
            icon: boughtIcon,
            type: "BOUGHT"
        }
    ]

    const { account, chainId, library } = useActiveWeb3React()
    const [isRefreshOfferListingData, setIsRefreshOfferListingData] = useState<boolean>(false)
    const history = useHistory()
    const { path } = useRouteMatch()

    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const userId = useSelector((state: AppState) => state.user && state.user.userId)
    const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()
    const addErrorPopup = useAddPopup();
    const [listofActivities, setListofActivities] = useState<any>([])
    const accessToken = useSelector((state: AppState) => state.user && state.user.access_token)
    const network = useSelector((state: AppState) => state.application.network)
    const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const [msg, setMsg] = useState("Please Wait")
    const addTransaction = useTransactionAdder()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (accessToken && chainId) {
            getUserActivities()
        }
    }, [accessToken, chainId, isRefreshOfferListingData])

    const getUserActivities = async () => {
        const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
        try {

            return await getAllNFTListingActivityData(
              50, 0, account!
            ).then(async (res: any) => {
              if (res?.status === 200) {
                const getAllActivitiesData = await res.data
                // offerNextCursor.current = (offerAPIData as any).skip + 1
                // offerTotalItemsRef.current = (offerAPIData as any).total
                console.log("getAllActivitiesData : ", getAllActivitiesData);
      
                const acitivitiesTransactionDataArray = getAllActivitiesData?.values || []
                const getActivityTransactionDataArray = acitivitiesTransactionDataArray && acitivitiesTransactionDataArray?.map(async (item, index) => {
                    let collectionNameValue = "Un-Identified Collection"
                    console.log('Load URL', item?.nftListing?.nftMetaDataURL);
                    try {
                        await fetch(item?.nftListing && item?.nftListing?.nftMetaDataURL)
                          .then((response) => response.json())
                          .then((data) => {
                            // {
                            //     "name": "Neo Pointer #1",
                            //     "symbol": "Neo",
                            //     "description": "This is my test collection NFT. ",
                            //     "image": "https://cloudfront.genshards.com/genshards-marketplace/637519fc554673b01d232a4f/1/6399409239d823b16173f418/nfts/0.jpeg",
                            //     "external_url": "https://genshards.com",
                            //     "attributes": [
                            //         {
                            //             "trait_type": "Look",
                            //             "value": "Awesome"
                            //         },
                            //         {
                            //             "trait_type": "Character",
                            //             "value": "Zombie"
                            //         }
                            //     ]
                            // }
                            console.log("nftMetaDataURLnftMetaDataURL", data);
                            collectionNameValue = data?.name
                          });
                      } catch (error) {
                        console.log('Failed to retried assets information from tokenURI');
                      }
                    return { id: index + 1, collectionName: collectionNameValue, buyerAddress: item?.buyerAddress, chainId: item?.nftListing && item?.nftListing?.chainId, createdDate: item?.createdDate, isConfirmed: item?.isConfirmed, listingType: item?.listingType, nftListing: item?.nftListing, quantity: item?.quantity, sellPerAskPrice: item?.sellPerAskPrice, sellTime: item?.sellTime, sellerAddress: item?.sellerAddress, status: item?.status, updatedDate: item?.updatedDate, userAcceptanceDateTime: item?.userAcceptanceDateTime, activityRecordId: item?._id };
                }) || []
      
                let getAllActivityDataArrayResults = await Promise.all(getActivityTransactionDataArray)
                console.log('getAllActivityDataArrayResults', getAllActivityDataArrayResults);
                setListofActivities(getAllActivityDataArrayResults)
      
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
            }).catch(err => {
              // offerItemLoadingRef.current = false
              // setOfferInfiniteLoader(prev => !prev)
              setIsLoading(false);
              setMsg("Please wait")
              console.log(err.message || 'Error while getting Wallet Activity listing data ')
            })
          } catch (error) {
            // offerItemLoadingRef.current = false
            // setOfferInfiniteLoader(prev => !prev)
            setIsLoading(false);
            setMsg("Please wait")
            console.log('Wallet Activity Data Fetching error', error);
          }
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

    return (
        <>
        {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
        <div className="activity_table">
            {/* <AccountMobileRoute />  */}
            <div className="activity-main-label">ACTIVITY</div>
            {listofActivities.length > 0 ? <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">ITEM</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">QTY</th>
                            <th scope="col">FROM</th>
                            <th scope="col">TO</th>
                            <th scope="col">TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listofActivities.map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <img src={item?.buyerAddress.toLowerCase() === account!.toLowerCase() ? boughtIcon : soldIcon} alt="sold/bought icon" />
                                    <br />
                                    <span>{item?.buyerAddress.toLowerCase() === account!.toLowerCase() ? "BOUGHT" : "SOLD"}</span>
                                </td>
                                <td data-label="ITEM" className="item-wrapper"  onClick={() => history.push(`/assets/${item?.nftListing?.tokenAddress}/${item?.nftListing?.tokenId}`, item)}>
                                    <div className="item-text">
                                        <p>{item?.collectionName ?? "Un-Identified Collection"}</p>
                                        <small>{item?.nftListing && shortenAddress(item?.nftListing?.tokenAddress)}</small>
                                    </div>
                                </td>
                                <td data-label="PRICE">{`${Number(item?.sellPerAskPrice).toFixed(5)} ${(Number(item?.chainId) == 97 || Number(item?.chainId) == 56 ? 'WBNB' : Number(item?.chainId) == 5 || Number(item?.chainId) == 1 ? 'WETH' : Number(item?.chainId) == 4689 || Number(item?.chainId) == 4690 ? 'WIOTX' : Number(item?.chainId) == 1666600000 || Number(item?.chainId) == 1666700000 ? 'WONE' : Number(item?.chainId) == 43113 || Number(item?.chainId) == 43114 ? 'WAVAX' : Number(item?.chainId) == 137 || Number(item?.chainId) == 80001 ? 'WMATIC' : "WETH")}`}</td>
                                <td data-label="QTY">{item?.quantity}</td>
                                <td data-label="FROM">{item?.sellerAddress && shortenAddress(item?.sellerAddress)}</td>
                                <td data-label="TO">{item?.buyerAddress && shortenAddress(item?.buyerAddress)}</td>
                                <td data-label="TIME">{moment(Number(item?.sellTime) * 1000).format("lll")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> : <div className="no-offer-data">
                <img src="/images/no-offer-data.svg" alt="no offers" />
                <div className="description">No Activities Done Yet</div>
              </div>}
        </div>
        </>
    )
}

export default ActivityTable