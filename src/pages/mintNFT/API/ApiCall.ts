import axios from "axios";
import { BigNumber } from "ethers";
import { start } from "repl";
import { GET_COLLECTION_CATEGORY_DATA, GET_BLOCKCHAIN_LIST_DATA, POST_CREATE_COLLECTION_DATA, GET_COLLECTION_LIST_DATA, POST_MINT_NFT_DATA, POST_VERIFY_COLLECTION_DATA, PRECHECK_CREATE_COLLECTION_DATA } from "../../../constants"

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
    Authorization: `Bearer ${getAuthorizationAccessToken()}`,
    "Content-Type": "multipart/form-data"
  };
}

const getListOfCategoriesDataURL = GET_COLLECTION_CATEGORY_DATA
const getAllBlockchainListDataURL = GET_BLOCKCHAIN_LIST_DATA
const postCreateCollectionCallDataURL = POST_CREATE_COLLECTION_DATA
const getAllCollectionListDataURL = GET_COLLECTION_LIST_DATA
const postMintNFTCallDataURL = POST_MINT_NFT_DATA
const postVerifyCollectionDataURL = POST_VERIFY_COLLECTION_DATA
const preCheckCreateCollectionCallDataURL = PRECHECK_CREATE_COLLECTION_DATA

const getCollectionCategoriesData = async () => {
  console.log('Hahahah33', getListOfCategoriesDataURL)
  // , { params: { nftId: dbCollections.map(collection => String(collection.nftId)), walletAddress: selectedAccount } }
  const res: any = await axios.get(getListOfCategoriesDataURL, { headers: headers })
  console.log('getCollectionCategoriesData', res);
  return res;
};

const getBlockchainListData = async (chainType: string) => {
  console.log('getBlockchainListData', getAllBlockchainListDataURL + `?type=${chainType}`)
  // , { params: { nftId: dbCollections.map(collection => String(collection.nftId)), walletAddress: selectedAccount } }
  const res: any = await axios.get(getAllBlockchainListDataURL + `?type=${chainType}`, { headers: headers })
  console.log('getBlockchainListData', res);
  return res;
};

const getCollectionListData = async (userId: string, chainId: number) => {
  console.log('getCollectionListData', getAllCollectionListDataURL + userId)
  const res: any = await axios.get(getAllCollectionListDataURL + userId, { headers: headers, params: { chainId } })
  console.log('getCollectionListData', res);
  return res;
};

const postCreateCollectionCallBack = async (name: string, userId: string, customCollectionUrl: string, chainId: number, url: string, assetType: number, ownerOf: string, symbol: string, description: string, category: string, links: [], creatorEarnings: [], paymentTokens: [], logoImage: any, featuredImage: any, bannerImage: any, isExplicitSensitive: boolean) => {
  let bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("user", userId);
  bodyFormData.append("customCollectionUrl", customCollectionUrl);
  bodyFormData.append("chainId", chainId.toString());
  bodyFormData.append("url", url);
  bodyFormData.append("assetType", assetType.toString());
  bodyFormData.append("ownerOf", ownerOf);
  bodyFormData.append("symbol", symbol);
  bodyFormData.append("description", description);
  bodyFormData.append("category", category);

  //Using map()
  var dataMap = links.map((Obj, i) =>
    bodyFormData.append(`links[${i}]`, JSON.stringify(Obj))
  )

  var dataMap1 = creatorEarnings.map((Obj, i) =>
    bodyFormData.append(`creatorEarnings[${i}]`, JSON.stringify(Obj))
  )

  var dataMap2 = paymentTokens.map((Obj, i) =>
    bodyFormData.append(`paymentTokens[${i}]`, JSON.stringify(Obj))
  )

  bodyFormData.append("isExplicitSensitive", isExplicitSensitive ? '1' : '0');

  console.log('logoImagelogoImage', logoImage, featuredImage);

  if (logoImage != undefined) {
    console.log("logoImagelogoImagelogoImage", logoImage);
    bodyFormData.append("logoImage", logoImage.file || '');
  }
  if (featuredImage != undefined) {
    bodyFormData.append("featuredImage", featuredImage.file || '');
  }
  if (bannerImage != undefined) {
    bodyFormData.append("bannerImage", bannerImage.file || '');
  }

  // const res : any = {}
  const res: any = await axios({
    method: "post",
    url: postCreateCollectionCallDataURL,
    data: bodyFormData,
    headers: postBodyHeaders(),
  })
  console.log('postCreateCollectionCallBack', bodyFormData, res);
  return res;
};


const postMintNFTCallBack = async (name: string, userId: string, nftCollectionId: string, nftAsset: any, chainId: number, description: string, propertyArray: [], levelsArray: [], statsArray: [], externalLink: string, unlockableContent: string, isExplicitSensitive: boolean, supply: number) => {
  let bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("user", userId);
  bodyFormData.append("nftCollection", nftCollectionId);

  if (nftAsset != undefined) {
    console.log("mintNFTImagemintNFTImage", nftAsset);
    bodyFormData.append("nftAsset", nftAsset || '');
  }

  bodyFormData.append("chainId", chainId.toString());
  bodyFormData.append("description", description);

  var nftAttributesData = {}
  var nftAttributesDataMap = propertyArray.map((Obj: any, i: number) =>
    nftAttributesData[Obj.type] = Obj.name
  )
  console.log('nftAttributesData', nftAttributesData);
  bodyFormData.append('nftAttributes', JSON.stringify(nftAttributesData))

  var dataMap = propertyArray.map((Obj, i) =>
    bodyFormData.append(`property[${i}]`, JSON.stringify(Obj))
  )

  var dataMap1 = levelsArray.map((Obj, i) =>
    bodyFormData.append(`levels[${i}]`, JSON.stringify(Obj))
  )

  var dataMap2 = statsArray.map((Obj, i) =>
    bodyFormData.append(`stats[${i}]`, JSON.stringify(Obj))
  )

  bodyFormData.append("externalLink", externalLink);
  bodyFormData.append("unlockableContent", unlockableContent);
  bodyFormData.append("isExplicitSensitive", isExplicitSensitive ? '1' : '0');
  bodyFormData.append("supply", supply.toString());

  console.log('mintNFTImage', nftAsset);

  // const res : any = {}
  const res: any = await axios({
    method: "post",
    url: postMintNFTCallDataURL,
    data: bodyFormData,
    headers: postBodyHeaders(),
  })
  console.log('postMintNFTCallBack', bodyFormData, res);
  return res;
};

const verifyCollectionDataCallback = async (collectionAddress: string) => {
  console.log("verifyCollectionDataCallback Req Body : ", collectionAddress);
  const res: any = await axios.post(postVerifyCollectionDataURL, {
    "collectionAddress": collectionAddress
  }, { headers: headers })
  console.log('verifyCollectionDataCallback Res', res);
  return res;
};

const preCheckCreateCollectionData = async (collectionName: string, customCollectionUrl: string) => {
  console.log("preCheckCreateCollectionDataCallback Req Body : ", collectionName, customCollectionUrl);
  const res: any = await axios.post(preCheckCreateCollectionCallDataURL, {
    "name": collectionName,
    "customCollectionUrl": customCollectionUrl
  }, { headers: headers })
  console.log('preCheckCreateCollectionDataCallback Res', res);
  return res;
};

export { getCollectionCategoriesData, getBlockchainListData, postCreateCollectionCallBack, getCollectionListData, postMintNFTCallBack, verifyCollectionDataCallback, preCheckCreateCollectionData };