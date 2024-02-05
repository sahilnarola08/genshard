import axios from "axios";
import { BigNumber } from "ethers";
import { start } from "repl";
import { POST_CREATE_NFTLISTING_DATA, GET_NFT_DETAILS_DATA, UPDATE_MARKETPLACE_USER, GET_COLLECTION_DETAILS_DATA, GET_NFTLISTING_TRANSACTION_DATA, GET_NFTLISTING_DATA, POST_CREATE_NFTLISTING_TRANSACTION_DATA, apiBaseUrl } from "../../../constants"

const getAuthorizationAccessToken = () => {
  const authorization = JSON.parse(localStorage.getItem("authorization") as any)
  if (authorization && authorization.access_token) {
    return authorization.access_token
  }
  return ""
}

const headers = {
  token: process.env.REACT_APP_BASE_TOKEN
};

const postBodyHeaders = () => {
  return {
    Authorization: `Bearer ${getAuthorizationAccessToken()}`
  };
}

const postCreateNFTListingCallDataURL = POST_CREATE_NFTLISTING_DATA
const postCreateNFTListingTransactionCallDataURL = POST_CREATE_NFTLISTING_TRANSACTION_DATA
const getAllNFTListingDataURL = GET_NFTLISTING_DATA
const getAllNFTListingTransactionDataURL = GET_NFTLISTING_TRANSACTION_DATA
const getCollectionDetailsDataURL = GET_COLLECTION_DETAILS_DATA
const getNFTDetailsDataURL = GET_NFT_DETAILS_DATA
const updatemrketplaceUser = UPDATE_MARKETPLACE_USER

const getNftVotesByTokens = async (tokensData: {tokenAddress: string, tokenId: string}[]): Promise<{tokenAddress: string, tokenId: string, totalLikes: number}[]> => {
  try {
    const { data = {} } = await axios.post(`${apiBaseUrl}/api/v1/marketplace/nft/votes/get`, { tokens: tokensData })
    const { tokens = [] } = data || {}
    return tokens
  } catch (ex: any) {
    console.error(ex.message)
    return []
  }
}

const isUserVotedForNFT = async (tokenAddress: string, tokenId: string): Promise<boolean> => {
  try {
    const { data = {} } = await axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/is_favorite/${tokenAddress}/${tokenId}`, { headers: postBodyHeaders() })
    const { isFavorite = false } = data as { isFavorite: boolean }
    return isFavorite
  } catch (ex: any) {
    console.error(ex.message)
    return false
  }
}

const addUserVoteForNFT = async (voteData: any): Promise<void> => {
  try {
    await axios.post(`${apiBaseUrl}/api/v1/marketplace/nft/votes/add`, voteData, { headers: postBodyHeaders() })
  } catch (ex: any) {
    console.error(ex.message)
  }
}


const getAllNFTListingData = async (operationType: number, itemsLimit: number, skipCounter: number, tokenAddress: any, tokenId: string, status?: string) => {
  let urlStr = getAllNFTListingDataURL + `?type=${operationType}&limit=${itemsLimit}&skip=${skipCounter}&tokenAddress=${tokenAddress}&tokenId=${tokenId}`
  if (status === "1") {
    urlStr = urlStr + `&status=${status}`
  }
  console.log('getAllNFTListingData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getAllNFTListingData Res', res);
  return res;
};

const getAllNFTListingActivityData = async (itemsLimit: number, skipCounter: number, walletAddress: any) => {
  let urlStr = getAllNFTListingTransactionDataURL + `?limit=${itemsLimit}&skip=${skipCounter}&walletAddress=${walletAddress}&isSell=${true}`
  console.log('getAllNFTListingActivityData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getAllNFTListingActivityData Res', res);
  return res;
};

const getAllNFTSalesData = async (itemsLimit: number, skipCounter: number, tokenAddress?: any, tokenId?: string) => {
  let urlStr = getAllNFTListingTransactionDataURL + `?limit=${itemsLimit}&skip=${skipCounter}&tokenAddress=${tokenAddress}&tokenId=${tokenId}&isSell=${true}`
  console.log('getAllNFTSalesData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getAllNFTSalesData Res', res);
  return res;
};

const getNFTDetailsData = async (collectionAddress: any, tokenId: string) => {
  let urlStr = getNFTDetailsDataURL + collectionAddress + `?tokenId=${tokenId}`
  console.log('getNFTDetailsData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getNFTDetailsData Res', res);
  return res;
};

const upadteUserData = async () => {
  let urlStr = updatemrketplaceUser
  console.log('updatemrketplaceUser', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('updatemrketplaceUser Res', res);
  return res;
};

const getCollectionDetailsAndStatsData = async (collectionAddress: any) => {
  let urlStr = getCollectionDetailsDataURL + collectionAddress
  console.log('getCollectionDetailsAndStatsData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getCollectionDetailsAndStatsData Res', res);
  return res;
};

const getAllNFTListingTransactionData = async (operationType: number, itemsLimit: number, skipCounter: number, recordId: any, tokenAddress?: any, tokenId?: string, status?: string) => {
  let urlStr = getAllNFTListingTransactionDataURL + `?type=${operationType}&limit=${itemsLimit}&skip=${skipCounter}&nftListingId=${recordId}&includeUnconfirmed=${false}` //&tokenAddress=${tokenAddress}&tokenId=${tokenId}
  if (status === "1") {
    urlStr = urlStr + `&status=${status}`
  }
  console.log('getAllNFTListingTransactionData', urlStr)
  const res: any = await axios.get(urlStr, { headers: postBodyHeaders() })
  console.log('getAllNFTListingTransactionData Res', res);
  return res;
};

const postCreateNFTListingCallBack = async (fromAddress: any, tokenAddress: any, chainIDValue: any, assetType: any, tokenId: string, listingType: number, listingStartPrice: number, quantity: number, startTime: any, endTime: any, nftMetaDataURL: string, listingEndPrice?: number) => {
  // let bodyFormData = new FormData();
  // bodyFormData.append("fromAddress", name);
  // bodyFormData.append("tokenAddress", userId);
  // bodyFormData.append("tokenId", customCollectionUrl);
  // bodyFormData.append("listingType", chainId.toString());
  // bodyFormData.append("listingStartPrice", url);
  // bodyFormData.append("quantity", assetType.toString());
  // bodyFormData.append("startTime", ownerOf);
  // bodyFormData.append("endTime", symbol);
  // bodyFormData.append("nftMetaDataURL", description);

  const bodyParams = {
    "fromAddress": fromAddress,
    "tokenAddress": tokenAddress,
    "tokenId": tokenId,
    "listingType": listingType,
    "listingStartPrice": listingStartPrice.toString(),
    "quantity": quantity,
    "startTime": startTime,
    "endTime": endTime,
    "nftMetaDataURL": nftMetaDataURL,
    "chainId": chainIDValue,
    "assetType": assetType
  }

  if (listingType === 4) {
    bodyParams["listingEndPrice"] = listingEndPrice?.toString()
  }

  console.log("postCreateNFTListingCallBack Body Param : ", bodyParams);

  const res: any = await axios.post(postCreateNFTListingCallDataURL, bodyParams, { headers: postBodyHeaders() })

  // const res : any = {}
  // const res: any = await axios({
  //   method: "post",
  //   url: postCreateNFTListingCallDataURL,
  //   data: bodyFormData,
  //   headers: postBodyHeaders(),
  // })
  console.log('postCreateNFTListingCallBack', res);
  return res;
};

const postCreateNFTListingTransactionCallBack = async (nftListingId: any, sellerAddress: any, buyerAddress: any, sellPerAskPrice: any, quantity: any) => {

  // console.log("postCreateNFTListingCallBack Body Param : ", {
  //   "fromAddress": fromAddress,
  //   "tokenAddress": tokenAddress,
  //   "tokenId": tokenId,
  //   "listingType": listingType,
  //   "listingStartPrice": listingStartPrice,
  //   "quantity": quantity,
  //   "startTime": startTime,
  //   "endTime": endTime,
  //   "nftMetaDataURL": nftMetaDataURL
  // });

  const res: any = await axios.post(postCreateNFTListingTransactionCallDataURL, {
    "nftListingId": nftListingId,
    "sellerAddress": sellerAddress,
    "buyerAddress": buyerAddress,
    "sellPerAskPrice": sellPerAskPrice.toString(),
    "quantity": quantity
  }, { headers: postBodyHeaders() })

  console.log('postCreateNFTListingTransactionCallBack', res);
  return res;
};

export {
  getNftVotesByTokens,
  isUserVotedForNFT,
  addUserVoteForNFT,
  getAllNFTListingData,
  getAllNFTSalesData,
  getNFTDetailsData,
  getAllNFTListingActivityData,
  getCollectionDetailsAndStatsData,
  getAllNFTListingTransactionData,
  postCreateNFTListingCallBack,
  postCreateNFTListingTransactionCallBack,
  upadteUserData,
};