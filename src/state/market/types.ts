export interface BaseProject {
    id: string
    name: string
    ticketAddress: string
    dexAddress? : string
    genNFTAddress? : string
    marketAddress?: string
    returnNFTAddress?: string
    marketPlaceAddress?: string
    report: string
    bgImage: any
    projectImage?: string
    fundsTarget: string
    subPrivate: string
    subPublic: string
    timeline: {date: number, title: string}[]
    whitelistForm: WhitelistForm
    endDate: string
    ticketData?: {numTickets: number, ticketsPurchased: number, price: number}[]
    startDate?: string
    openSeaURL: string,
    nfTradeURL: string,
    preIdo?: string
    subSheet?: string
    projectType?: string
    projectDuration?: string

    projectShortCode?: string
    socialLinks?: SocialLinksForGenIDOProject
    logoImage? : string
    perTokenPrice? : string
    projectDescription? : string
    totalSuppliedTokenSize?: string
    initialSuppliedTokenSize?: string
    hardCapValue?: string
    distributionDetails? : string
    
    // openSeaUrl?: string
    // nfTradeUrl?: string
  }

  
  export interface WhitelistForm {
    black?: string
    gold?: string
    pink?: string
    silver?: string
    'open community'?: string
  } 

  export interface SocialLinksForGenIDOProject {
    twitterURL?: string
    telegramURL?: string
    mediumURL?: string
    websiteURL?: string
  } 
  
  export interface ExtendedProject extends BaseProject {
    isPast?: boolean
  }
  
  // todo: update it later
  export class Card {

    // Note : We make it optional below properties and added new Properties
    // image source
    src: string
    name: string
    // total amount card
    total: string
    // remaining amount
    remain: string
  
    balance: string
    description: string
  
    price: string
    index: number

    currentProjectId?: any

    // New Properties
    networkChainIdValue?: number
    networkChainName? : string
    recordId?: number
    nftBuyer?: string
    nftContract?: string
    nftState?: string 
    nftSeller?: string
    nftTokenId?: string 
    nftPrice?: number 
    numberOfNFTHolding?: number
    baseURIOfNFT?: string 
    nameOfNFT?: string 
    nameOfNFTProject?: string
    symbolOfNFT?: string 
    symbolOfNFTProject?: string 
    tokenURIOfNFT?: string
    nftMetaDataImageURL?: string
    nftMetaDataName?: string 
    nftMetaDataDescription?: string 
    nftAttributes?: any
    nftLevels?: any
    nftStats?: any
    nftContractType?: string
    lastCreatedAtNFT?: string
    lastUpdatedAtNFT?: string
    nftMetaData?: any
    nftCollectionMetaData?: any

    constructor({
      src,
      name,
      total,
      remain,
      balance,
      description,
      price,
      index,
      networkChainIdValue,
      networkChainName,
      recordId,
      nftBuyer,
      nftContract,
      nftState, 
      nftSeller,
      nftTokenId, 
      nftPrice, 
      numberOfNFTHolding,
      baseURIOfNFT, 
      nameOfNFT, 
      nameOfNFTProject,
      symbolOfNFT, 
      symbolOfNFTProject, 
      tokenURIOfNFT,
      nftMetaDataImageURL,
      nftMetaDataName, 
      nftMetaDataDescription, 
      nftAttributes,
      nftLevels,
      nftStats,
      nftContractType,
      lastCreatedAtNFT,
      lastUpdatedAtNFT,
      nftMetaData,
      nftCollectionMetaData
    }: {
      src: string
      name: string
      total: string
      remain: string
      balance: string
      description: string
      address: string,
      price: string,
      index: number,
      networkChainIdValue: number
      networkChainName?: string
      recordId?: number
      nftBuyer?: string
      nftContract?: string
      nftState?: string 
      nftSeller?: string
      nftTokenId?: string 
      nftPrice?: number 
      numberOfNFTHolding?: number
      baseURIOfNFT?: string 
      nameOfNFT?: string 
      nameOfNFTProject?: string
      symbolOfNFT?: string 
      symbolOfNFTProject?: string 
      tokenURIOfNFT?: string
      nftMetaDataImageURL?: string
      nftMetaDataName?: string 
      nftMetaDataDescription?: string 
      nftAttributes?: any,
      nftLevels?: any,
      nftStats?: any,
      nftContractType?: string
      lastCreatedAtNFT?: string
      lastUpdatedAtNFT?: string
      nftMetaData?: any
      nftCollectionMetaData?: any
    }) {
      this.src = src
      this.name = name
      this.total = total
      this.remain = remain
      this.balance = balance
      this.description = description
      this.price = price
      this.index = index

      // New Properties
      this.networkChainIdValue = networkChainIdValue
      this.networkChainName = networkChainName
      this.recordId = recordId
      this.nftBuyer = nftBuyer
      this.nftContract = nftContract
      this.nftState = nftState 
      this.nftSeller = nftSeller
      this.nftTokenId = nftTokenId
      this.nftPrice = nftPrice
      this.numberOfNFTHolding = numberOfNFTHolding
      this.baseURIOfNFT = baseURIOfNFT
      this.nameOfNFT = nameOfNFT 
      this.nameOfNFTProject = nameOfNFTProject
      this.symbolOfNFT = symbolOfNFT 
      this.symbolOfNFTProject = symbolOfNFTProject 
      this.tokenURIOfNFT = tokenURIOfNFT
      this.nftMetaDataImageURL = nftMetaDataImageURL
      this.nftMetaDataName = nftMetaDataName
      this.nftMetaDataDescription = nftMetaDataDescription
      this.nftAttributes = nftAttributes
      this.nftLevels = nftLevels
      this.nftStats = nftStats
      this.nftContractType = nftContractType
      this.lastCreatedAtNFT = lastCreatedAtNFT
      this.lastUpdatedAtNFT = lastUpdatedAtNFT
      this.nftMetaData = nftMetaData
      this.nftCollectionMetaData = nftCollectionMetaData
    }
  }
  