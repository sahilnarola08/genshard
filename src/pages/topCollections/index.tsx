import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table } from 'reactstrap'
import { apiBaseUrl, MORALIST_API_KEY, MORALIS_API_SERVER_URL } from '../../constants'
import { shortenAddress } from '../../utils'
import { INftCollection } from '../marketplace'
import "./style.sass"
import { useHistory, useRouteMatch } from 'react-router-dom';
import LoaderComp from '../../shared/components/LoaderComponent'

const days = ["1", "7", "15", "30", "All"]

const toTitleCase = (s) => {
  if (typeof (s) === 'string' && s.length > 0) {
    const words = s.split(' ')
    if (Array.isArray(words) && words.length > 0) {
      if (words.length === 1) {
        const word = words[0]
        const matches = word.charAt(0).match(/\w+/i)
        const lines = word.split('\n')
        if (Array.isArray(lines) && lines.length > 1) {
          return lines.map(line => {
            return toTitleCase(line)
          }).join('\n')
        } else if (Array.isArray(matches)) {
          return word.split('').map((c, i) => {
            if (i === 0) {
              return c.toUpperCase()
            }
            return c.toLowerCase()
          }).join('')
        } else {
          return word.charAt(0).concat(toTitleCase(word.slice(1)))
        }
      } else {
        return words.map(word => toTitleCase(word)).join(' ')
      }
    }
  }
  return ''
}

const TopCollections = () => {
  const { path } = useRouteMatch()
  const history = useHistory();
  const [selectedDay, setSelectedDay] = useState(days[4])
  const [collections, setCollections] = useState<any[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  const [msg, setMsg] = useState("Please Wait")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCollections([])
    fetchDurationWiseData(selectedDay)
  }, [selectedDay])

  const fetchDurationWiseData = async (selectedDayDuration: any) => {
    try {
      setIsLoading(true)
      console.log("URL : ", apiBaseUrl + "/api/v1/marketplace/nft/collection/get/all?limit=5&sortBy=top_selling&withStats=true&duration=" + selectedDayDuration);
      await axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/collection/get/all?limit=5&sortBy=top_selling&withStats=true&duration=${selectedDayDuration}`).then(async ({ data }) => {
        console.log('TopCollectionsTopCollections', data);

        const topSellingDataArray = data?.values || []
        console.log('topSellingDataArray', topSellingDataArray);
        const topSellingFinalDataArray = topSellingDataArray && topSellingDataArray?.map(async (collectionDetailsData, index) => {
          console.log("indexindexindex", index);

          let fetchDataOfNFTOwners = await fetchNFTOwners(collectionDetailsData?.collectionAddress, collectionDetailsData?.chainId)
          let getNFTOwnersCount = await Promise.resolve(fetchDataOfNFTOwners)
          console.log("indexindexindex111", index, fetchDataOfNFTOwners, getNFTOwnersCount);

          let collectionDetObj = {
            collectionAssetType: collectionDetailsData?.assetType,
            collectionBannerImage: collectionDetailsData?.bannerImage,
            collectionBaseUri: collectionDetailsData?.baseUri,
            collectionCategory: collectionDetailsData?.category,
            collectionChainId: collectionDetailsData?.chainId,
            collectionAddress: collectionDetailsData?.collectionAddress,
            collectionId: collectionDetailsData?.collectionId,
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
            collectionTotalOwners: getNFTOwnersCount, //collectionDetailsData?.totalOwners,
            collectionTotalVolume: collectionDetailsData?.totalVolume,
            collectionTotalSales: collectionDetailsData?.totalSales,
            collectionURL: collectionDetailsData?.url,
            collectionUser: collectionDetailsData?.user,
            collectionRecordId: collectionDetailsData?._id
          }

          return collectionDetObj
        }) || []

        let topSellingFinalDataArrayResults = await Promise.all(topSellingFinalDataArray)
        console.log('topSellingFinalDataArrayResults', topSellingFinalDataArrayResults);
        setCollections(topSellingFinalDataArrayResults || [])
        setIsLoading(false)
      })
    } catch (error) {
      setIsLoading(false)
      console.error(error);
    }
  };

  const fetchNFTOwners = async (nftAddress: string, platformChain?: any) => {
    try {
      const networkName = (Number(platformChain) === 137 ? 'matic' : Number(platformChain) === 80001 ? 'matic testnet' : Number(platformChain) === 56 ? 'bsc' : Number(platformChain) === 97 ? 'bsc testnet' : Number(platformChain) === 5 ? 'goerli' : Number(platformChain) === 4690 ? 'iotx testnet' : Number(platformChain) === 4689 ? 'iotx' : Number(platformChain) === 1666700000 ? 'one testnet' : Number(platformChain) === 1666600000 ? 'one' : Number(platformChain) === 43113 ? 'avalanche testnet' : Number(platformChain) === 43114 ? 'avalanche' : String("eth").toLowerCase())
      const options = {
        method: 'GET',
        url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/owners`,
        params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true', limit: 100, cursor: null },
        headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
      };

      // console.log('nftOwners options', options);

      return await axios
        .request(options as any)
        .then(async function (response) {
          console.log("nftOwnersnftOwnersnftOwnersnftOwners", response.data);
          const nftOwners = await response.data; //await Web3Api.token.getTokenIdOwners(options as any);
          console.log("counter data", Number(nftOwners?.total) || 0);
          return Number(nftOwners?.total) || 0
        })
        .catch(function (error) {
          console.error(error);
          return 0
        });
    } catch (error) {
      console.error(error);
      return 0
    }
    return 0
  };

  return (
    <>
    {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      <div className='top-collections'>
        <div className='top-collections-wrapper'>
          <div className='top-collections-text'>
            Top Collections
          </div>
          <hr className='top-collection-text-line' />
          <div className="days-wrapper">
            {
              days?.map((day) => <div className={day === selectedDay ? "day selected-day" : 'day'} onClick={() => setSelectedDay(day)}>{day === "1" ? `${day} day` : day != "All" ? `${day} days` : `All`}</div>)
            }
          </div>
          {
            collections.length > 0 ? <div className="top-collection-table-wrapper">
              <Table
                responsive
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ITEM</th>
                    <th>VOLUME</th>
                    <th>BEST OFFER</th>
                    <th>FLOOR PRICE</th>
                    <th>TOTAL SALES</th>
                    <th>TOTAL ITEMS</th>
                    <th>TOTAL OWNERS</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !loader && collections?.map((tData: any, ind: any) => <tr>
                      <td scope="row">{ind + 1}</td>
                      <td>
                        <div className="collections-item-wrapper" onClick={() => history.push(`/collection/${tData?.collectionChainId}/${tData?.collectionAddress}`)}>
                          <div className="collections-item-img">
                            <img src={tData?.collectionLogoImage} alt="nft" />
                          </div>
                          <div className="item-labels">
                            <div className="main-label">{toTitleCase(tData?.collectionName)}</div>
                            <div className="sub-label">Created By {tData?.collectionUser && tData?.collectionUser?.name.length > 0 ? tData?.collectionUser?.name : tData?.collectionUser?.walletAddress ? shortenAddress(tData?.collectionUser?.walletAddress) : "Unnamed"}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {`${Number(tData?.collectionTotalVolume || 0)?.toFixed(4)} ${(Number(tData?.collectionChainId) == 97 || Number(tData?.collectionChainId) == 56 ? 'WBNB' : Number(tData?.collectionChainId) == 5 || Number(tData?.collectionChainId) == 1 ? 'WETH' : Number(tData?.collectionChainId) == 4689 || Number(tData?.collectionChainId) == 4690 ? 'WIOTX' : Number(tData?.collectionChainId) == 1666600000 || Number(tData?.collectionChainId) == 1666700000 ? 'WONE' : Number(tData?.collectionChainId) == 43113 || Number(tData?.collectionChainId) == 43114 ? 'WAVAX' : Number(tData?.collectionChainId) == 137 || Number(tData?.collectionChainId) == 80001 ? 'WMATIC' : "WETH")}`}
                        {/* {`${tData?.collectionTotalVolume} `} {(tData?.collectionChainId === 97 || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())} */}
                      </td>
                      <td>
                        {`${Number(tData?.collectionTopPrice || 0)?.toFixed(4)} ${(Number(tData?.collectionChainId) == 97 || Number(tData?.collectionChainId) == 56 ? 'WBNB' : Number(tData?.collectionChainId) == 5 || Number(tData?.collectionChainId) == 1 ? 'WETH' : Number(tData?.collectionChainId) == 4689 || Number(tData?.collectionChainId) == 4690 ? 'WIOTX' : Number(tData?.collectionChainId) == 1666600000 || Number(tData?.collectionChainId) == 1666700000 ? 'WONE' : Number(tData?.collectionChainId) == 43113 || Number(tData?.collectionChainId) == 43114 ? 'WAVAX' : Number(tData?.collectionChainId) == 137 || Number(tData?.collectionChainId) == 80001 ? 'WMATIC' : "WETH")}`}
                      </td>
                      <td>
                        {`${Number(tData?.collectionLowestPrice || 0)?.toFixed(4)} ${(Number(tData?.collectionChainId) == 97 || Number(tData?.collectionChainId) == 56 ? 'WBNB' : Number(tData?.collectionChainId) == 5 || Number(tData?.collectionChainId) == 1 ? 'WETH' : Number(tData?.collectionChainId) == 4689 || Number(tData?.collectionChainId) == 4690 ? 'WIOTX' : Number(tData?.collectionChainId) == 1666600000 || Number(tData?.collectionChainId) == 1666700000 ? 'WONE' : Number(tData?.collectionChainId) == 43113 || Number(tData?.collectionChainId) == 43114 ? 'WAVAX' : Number(tData?.collectionChainId) == 137 || Number(tData?.collectionChainId) == 80001 ? 'WMATIC' : "WETH")}`}
                      </td>
                      <td>
                        {tData?.collectionTotalSales || 0}
                      </td>
                      <td>
                        {tData?.collectionTotalItems || 0}
                      </td>
                      <td>
                        {tData?.collectionTotalOwners || 0}
                      </td>
                    </tr>)
                  }
                </tbody>
              </Table>
            </div>
              // : loader ? <div className='explore-nfts-wrapper'>
              //   <div className='collection-loader'><span>Loading Collections...</span>
              //   </div>
              // </div>
                : <div className="no-listing-data">
                  <img src="/images/no-listing-data.svg" alt="no listing" />
                  <div className="description">No Collections Available</div>
                </div>
          }
        </div>
      </div>
    </>
  )
}

export default TopCollections