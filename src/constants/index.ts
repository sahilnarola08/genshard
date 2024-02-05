import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, NetworkSymbol, walletconnect } from '../connectors'
import { BaseProject } from '../state/market/types'
import cardBackground from '../images/card_background.png'

export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const REACT_APP_IS_TEST_MODE = process.env.REACT_APP_IS_TEST_MODE!

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// prod
// export const DIAMOND_HANDS_CONTRACT_ADDRESS = '0xd439Ffa6C9Cda673cE5c3C48b9b84905d63ebB7b'
// export const DIAMOND_HANDS_TOKEN_ADDRESS = '0x9ba4c78b048eeed69f4ed3cfddeda7b51baf7ca8'

// test
export const DIAMOND_HANDS_CONTRACT_ADDRESS = '0x7F7CB826Cd0ce438C5bb8F4B643c8dFc2c1f8281' //'0xAa38a7b867aA88193B6b3e3CA76473362e01657E'
export const DIAMOND_HANDS_TOKEN_ADDRESS =  '0xA08B741104Bc7203502cB318e7410C34f7B78028' //'0x490b6C786AED8b5eb78aECA7F553db12E7cA31cD'
export const COHORT_STAKE_CONTRACT_ADDRESS = "0x032c59183F84772C767F4E22549cE11308aE43b5" // '0xfac0258C22306731F60e457ccF1aA177CD745162'

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || ''

export const GEN_VESTING_ADDRESS = '0x8beed7c4cadbc39207225cdc9f9a75ce7fb08a16'
export const APPLY_IDO_PROJECT_WHITELIST = `${apiBaseUrl}/api/v1/projects/whitelist`
export const APPLY_IDO_PROJECT_BUY_ALLOCATION = `${apiBaseUrl}/api/v1/projects/allocation`

//MarketPlace NODEJS APIs
export const GET_COLLECTION_CATEGORY_DATA = `${apiBaseUrl}/api/v1/marketplace/categories`
export const GET_BLOCKCHAIN_LIST_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/chains/get`
export const GET_ALL_NFTS_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/get`
export const POST_CREATE_COLLECTION_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/collection/create`
export const GET_COLLECTION_LIST_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/collection/get/`
export const POST_MINT_NFT_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/create`
export const POST_VERIFY_COLLECTION_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/collection/verify`
export const PRECHECK_CREATE_COLLECTION_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/collection/check`
export const POST_CREATE_NFTLISTING_DATA = `${apiBaseUrl}/api/v1/marketplace/nftlisting`
export const POST_CREATE_NFTLISTING_TRANSACTION_DATA = `${apiBaseUrl}/api/v1/marketplace/nftlisting/transaction`
export const GET_NFTLISTING_DATA = `${apiBaseUrl}/api/v1/marketplace/nftlisting`
export const GET_NFTLISTING_TRANSACTION_DATA = `${apiBaseUrl}/api/v1/marketplace/nftlisting/transaction`
export const GET_COLLECTION_DETAILS_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/collection/`
export const GET_NFT_DETAILS_DATA = `${apiBaseUrl}/api/v1/marketplace/nft/get/collection/`
export const UPDATE_MARKETPLACE_USER = `${apiBaseUrl}/api/v1/marketplace/user`

//MarketPlace MORALIS APIs Constants
export const MORALIS_API_SERVER_URL = process.env.REACT_APP_MORALIS_API_SERVER_URL
export const MORALIST_API_KEY = process.env.REACT_APP_IS_TEST_MODE! ? process.env.REACT_APP_MORALIS_API_KEY_TEST : process.env.REACT_APP_MORALIS_API_KEY_PROD

export const DEFAULT_APPROVE_VALUE = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export const GENPAD_STAKING_ADDRESS: any = {
  4: "0x89fA8Ffa12c824524f9419AF074D5CA50F3E18Ec",
  97: "0xaD0fD162fF2AeDCF619A6d74Ea35EBF723427c02"
}

export const GENPAD_STAKING_TOKEN_ADDRESS = {
  4: "0x8fA97d7E8C4E8319B6B4b1A3b7b4f7c7Dc99944D",
  97: "0xA08B741104Bc7203502cB318e7410C34f7B78028"
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const UNISWAP_REDIRECT_URL = "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xe0b9a2c3e9f40cf74b2c7f591b2b0cca055c3112"
export const PANCAKESWAP_REDIRECT_URL = "https://pancakeswap.finance/swap?inputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&outputCurrency=0x9ba4c78b048eeed69f4ed3cfddeda7b51baf7ca8"
export const GS_TOKEN_VALUE_TO_USD_URL = "https://api.coingecko.com/api/v3/simple/price?ids=genesis-shards&vs_currencies=usd"

//community links
export const GS_SUBMIT_A_BUG_FORM_URL = "https://forms.gle/TipqnSNxWtWCugLM6"
export const COINGECKO_REDIRECT_LINK = "https://www.coingecko.com/en/coins/genesis-shards"
export const TWITTER_REDIRECT_LINK = "https://twitter.com/GenShards"
export const CMC_REDIRECT_LINK = "https://coinmarketcap.com/currencies/genesis-shards"
export const TELEGRAM_REDIRECT_LINK = "https://t.me/genshardsANN"
export const MEDIUM_REDIRECT_LINK = "https://genesis-shards.medium.com"

export const COINGECKO_ETH_USD = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"

export const OLD_CLAIM_DATA_SHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7-ZU4oZ_8nWUQC0uwY7TjzKyb7-lPSTWtuqPKLJDnhAYPBnusiTm4MPD_L2REaDLTbxe43Ia5gcNz/pub?gid=1296663419&single=true&output=csv'
export const LP_MINING_REDIRECT_URL = "https://genesisshards.defiterm.io/"

// All Projects to show into dashboard section - dropdown
export const PROJECT_WHITELIST = [
  {
    address: '0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    name: 'Sator',
    projectDuration: 'Old'
  },
  {
    address: '0xab45c53c164ac8c2a657bd74d75bf205661cc40e',
    name: 'AcknoLedger',
    projectDuration: 'Old'
  },
  {
    address: '0x3ed83b9ae395ca3de994600fe0f2cd027753b2ee',
    name: 'Amasa',
    projectDuration: 'Old'
  },
  {
    address: '0x7eb6115a3c667d05a6fbccc6c598a5a6ad392e4b',
    name: 'Enjinstarter',
    projectDuration: 'Old'
  },
  {
    address: '0xe0B9a2C3E9f40CF74B2C7F591B2b0CCa055c3112',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  },
  {
    address: '0xd692F640d63e49e71B48f1899Ad0Fbfa8FA33DF0',
    name: 'Unicly',
    projectDuration: 'Old'
  },
  {
    address: '0x37e6f54bc4c2f6fe8386f6923d8aba2cc81f1cd2',
    name: 'Vaulty',
    projectDuration: 'Old'
  },
  {
    address: '0x62EB9234eC26DA725e90A270A452a8d6EB304b0D',
    name: 'CoinBurp',
    projectDuration: 'Old'
  },
  {
    address: '0x4937C9B011350058A1d4d3C4f8D51870a7a45F3a',
    name: 'BaconDAO'
  },
  {
    address: '0x0018A411c2b57474218be2DED576d10Ed748F3d2',
    name: 'Rebaked',
    projectDuration: 'Old'
  },
  {
    address: '0xFFb4Ff24e76605D1bfDCCb9d8F717E5C71439C2a',
    name: 'Mozik',
    projectDuration: 'Old'
  },
  {
    address: '0xF849E438893E2b2A591Bd8e3e42e401aDeb2E352',
    name: 'Unreal Finance',
    projectDuration: 'Old'
  },
  {
    address: '0xece000cd85d38ca467a8b6f3e6a9d5c1d155ec65',
    name: 'Moma',
    projectDuration: 'Old'
  },
  {
    address: '0x49ce90FD09ca07F8c16e073d193DF5c7eD1be655',
    name: 'Crop Finance'
  },
  {
    address: '0x97f945cdd7827579e458502d7a8c9e3157604f3c',
    name: 'Parami',
    projectDuration: 'Old'
  },
  {
    address: '0x266820432937e9437f5cdb1b8e2357ae1588096a',
    name: 'The Dapp List',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_BSC = [
  {
    address: '0x654F029722d89F1b951982dc014E04aF62d3B165',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  },
  {
    address: '0x298e48670db3e00ab2a8072dce46f48a237bc639',
    name: 'Duelist King',
    projectDuration: 'Old'
  },
  {
    address: '0x3eF7ed0B2F34C345CF6D5D49417Ff47C57A40473',
    name: 'Prometheus',
    projectDuration: 'Old'
  },
  {
    address: '0x46c707e6a37F0061D27f105264258aF4B28FC7A4',
    name: 'MeLand',
    projectDuration: 'Old'
  },
  {
    address: '0x2E640603E6bB000131991560C5BB7d6c6a9212e1',
    name: 'Studyum',
    projectDuration: 'Old'
  },
  {
    address: '0xdA6Bcc8F3A934985793e3fb24a48Db377dCF54D5',
    name: 'Himo World',
    projectDuration: 'Old'
  },
  {
    address: '0x4Ff3450ed4BaDbd281e337bb4a8C4C891B07eb06',
    name: 'Metaverse Lab',
    projectDuration: 'Old'
  },
  {
    address: '0x66Db70a764074C028eBB7CA118760260D7D7EC77',
    name: 'Harmony Launcher',
    projectDuration: 'Old'
  },
  {
    address: '0xE95b149e9260eE552aE72C849763f33d7A20468E',
    name: 'World Of Cryptoids',
    projectDuration: 'Old'
  },
  {
    address: '0x87b688412e1E91E9C2995E071dAD7685aD5D5587',
    name: 'AcknoLedger NFT Collection',
    projectType: 'nftCollection',
    projectDuration: 'Old'
  },
  {
    address: '0x17f25CAeD8ee186E87b9311cf9946493de0f96fA',
    name: 'Polker INO',
    projectType: 'nftCollection',
    projectDuration: 'New'
  },
  {
    address: '0x820bF1E40730610C427114F1dFB97864720AbdCE',
    name: '123SWAP',
    projectDuration: 'New'
  },
  {
    address: '0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    name: 'Supernova',
    projectDuration: 'New'
  },
  {
    address: '0x7727C5eA46f473Ea26406F743A27Eb2027cB6BCE',
    name: 'Kala Network',
    projectDuration: 'New'
  },
  {
    address: '0x578CF69a6e4A336084AbB58dA7D9d6301046B64A',
    name: 'Sugar Kingdom',
    projectDuration: 'New'
  },
  {
    address: '0x1feCa8ADaa5927138755690D92EEEDE7E2044bdd',
    name: 'Legion Network',
    projectDuration: 'New'
  },
  {
    address: '0x8e9f838FaAbd6aB0EA82F26ce419d38b0d3545c2',
    name: 'Ikonic',
    projectDuration: 'New'
  },
  {
    address: '0xBcC7d150f9B36584eb30190205Ccd5538bdBE49d',
    name: 'Metacraft',
    projectDuration: 'New'
  },
  {
    address: '0xf7f1b454bc62b362a45f8cfc3bce1f07ee2c49b0',
    name: 'Meta Warriors',
    projectDuration: 'New'
  }
  // {
  //   address: '0xb3006fd4D1934e8050eC1E5beAA1d5BDebF649Ed',
  //   name: 'BSC Test - USDT',
  //   projectDuration: 'New'
  // }
]

export const PROJECT_WHITELIST_MATIC = [
  {
    address: '0xac288128a91d754d5f2c946aee8357e92e6f8f2a',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  },
  {
    address: '0x412Ac7e282377Ae88cE69E0682880a0513c4ddF7',
    name: 'OneRare',
    projectDuration: 'Old'
  },
  {
    address: '0x2988Db8d34df0f21656a4Fee9135235bdC935684',
    name: 'Cheesus Defi',
    projectDuration: 'Old'
  },
  {
    address: '0xfE061EdcFBfACf3F66ddC69baA3b2e32D9a6bf9A',
    name: 'Karmaverse',
    projectDuration: 'New'
  },
  {
    address: '0xdACf7D2651Fe050b4c6cC83a6825D0447aC4D292',
    name: 'SportzChain',
    projectDuration: 'New'
  },
  {
    address: '0x26aa959B4B0B5c509057207406b4C207911ceD44',
    name: 'Aftermath Islands',
    projectDuration: 'New'
  }
  // {
  //   address: '0x18221DE4b590CC32a93e3CdA561CaF1dB8CD744e',
  //   name: 'Matic Test With USDT',
  //   projectDuration: 'New'
  // },
  // {
  //   address: '0x1aa0eFAbB2ACCFaF624e1Cec76e513ed01574c52',
  //   name: 'Matic Test Without USDT',
  //   projectDuration: 'New'
  // },
  // {
  //   address: '0x968f554cBb172120F1A48446AFecc679C62e5d9D',
  //   name: 'Self Matic Test With USDT',
  //   projectDuration: 'New'
  // }
]

export const PROJECT_WHITELIST_IOTEX = [
  {
    address: '0xdD32a228261C00A70bd06C0FEcd3554b8f087895',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
  /*{
    address: '0xa1e5ce61637b1360a57d2ed95a359a0d1e6b4fcb',
    name: 'I-IOTEX',
    projectDuration: 'Old'
  }*/
]

export const PROJECT_WHITELIST_HARMONY = [
  {
    address: '0xb8f4454E6be8a3BA3837F53410A8D5479C294Ad5',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
  /*{
    address: '0x5b0ae869b04f88e4fbf4fb69cef5a0dcb98e27c9',
    name: 'I-HARMONY',
    projectDuration: 'Old'
  },*/
]

export const PROJECT_WHITELIST_AVALANCHE = [
  {
    address: '0xb8f4454E6be8a3BA3837F53410A8D5479C294Ad5',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_GOERLI_NETWORK_TESTNET = [
  {
    address: '0x8eC0538731b948BBC2bafc2e3B24DaB8B1af1537',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  },
  {
    address: '0x49e41662fE06F95a86AeC2ce48675Fb091FF2788',
    name: 'MarketPlace - Test Project 1',
    projectDuration: 'New'
  },
  {
    address: '0xf9591631aB75ebC03a2dBa7C789506b0FDE4348f',
    name: 'MarketPlace - Test Project 2',
    projectDuration: 'New'
  },
  {
    address: '0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229',
    name: 'Image Testing Demo',
    projectDuration: 'New',
  },
  {
    address: '0x85A2421c11f82d8A4fA0616510f33E5aEd374796',
    name: 'Point Demo',
    projectDuration: 'New',
  }
]

export const PROJECT_WHITELIST_MUMBAI_NETWORK_TESTNET = [
  {
    address: '0x74fd403a375b919d9930c8591170230493027dcc',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_IOTEX_NETWORK_TESTNET = [
  {
    address: '0x0e62da7f605c3d2b570a4801c7bca4480483425c',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_HARMONY_NETWORK_TESTNET = [
  {
    address: '0xfD6504Fc3264C93Ee6D30470eFC05FC494D3Bcbd',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_AVALANCHE_NETWORK_TESTNET = [
  {
    address: '0xfD6504Fc3264C93Ee6D30470eFC05FC494D3Bcbd',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const PROJECT_WHITELIST_BSC_NETWORK_TESTNET = [
  {
    address: '0xfD6504Fc3264C93Ee6D30470eFC05FC494D3Bcbd',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  }
]

export const MARKET_WHITELIST = [
  {
    address: '0xab45c53c164ac8c2a657bd74d75bf205661cc40e',
    name: 'AcknoLedger',
    projectDuration: 'Old'
  },
  {
    address: '0x3ed83b9ae395ca3de994600fe0f2cd027753b2ee',
    name: 'Amasa',
    projectDuration: 'Old'
  },
  {
    address: '0x7eb6115a3c667d05a6fbccc6c598a5a6ad392e4b',
    name: 'Enjinstarter',
    projectDuration: 'Old'
  },
  {
    address: '0xcd69d0cb9a567598be63c1d2c22fdc9f053e0cf5',
    name: 'GS',
    projectDuration: 'Old'
  },
  {
    address: '0xf98E7f2645D5a281386d1D8abFfe653Bfc3499c4',
    name: 'Genesis Shards',
    projectDuration: 'Old'
  },
  {
    address: '0xd692F640d63e49e71B48f1899Ad0Fbfa8FA33DF0',
    name: 'Unicly',
    projectDuration: 'Old'
  },
  {
    address: '0x4937C9B011350058A1d4d3C4f8D51870a7a45F3a',
    name: 'BaconDAO',
    projectDuration: 'Old'
  },
  {
    address: '0x0018A411c2b57474218be2DED576d10Ed748F3d2',
    name: 'Rebaked',
    projectDuration: 'Old'
  },
  {
    address: '0xFFb4Ff24e76605D1bfDCCb9d8F717E5C71439C2a',
    name: 'Mozik',
    projectDuration: 'Old'
  },
  {
    address: '0xF849E438893E2b2A591Bd8e3e42e401aDeb2E352',
    name: 'Unreal Finance',
    projectDuration: 'Old'
  },
  {
    address: '0xece000cd85d38ca467a8b6f3e6a9d5c1d155ec65',
    name: 'Moma',
    projectDuration: 'Old'
  },
  {
    address: '0x49ce90FD09ca07F8c16e073d193DF5c7eD1be655',
    name: 'Crop Finance',
    projectDuration: 'Old'
  },
  {
    address: '0x97f945cdd7827579e458502d7a8c9e3157604f3c',
    name: 'Parami',
    projectDuration: 'Old'
  },
  {
    address: '0x266820432937e9437f5cdb1b8e2357ae1588096a',
    name: 'The Dapp List',
    projectDuration: 'Old'
  }
]

// All Projects Data to show into upcoming and live section
export const PROJECTS_DATA_BSC_NETWORK_TESTNET: BaseProject[] = [
]

export const PROJECTS_DATA_IOTEX_NETWORK_TESTNET: BaseProject[] = [
]

export const PROJECTS_DATA_HARMONY_NETWORK_TESTNET: BaseProject[] = [
]

export const PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET: BaseProject[] = [
]

export const PROJECTS_DATA_MUMBAI: BaseProject[] = [
]

export const PROJECTS_DATA_GOERLI: BaseProject[] = [
  {
    id: 'TestingProject1',
    name: 'MarketPlace - Test Project 1',
    ticketAddress: '0x49e41662fE06F95a86AeC2ce48675Fb091FF2788', //'0x16097e1A17854C24b83dceF1887FBb946670dc48', //0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1
    marketAddress: '0x6fd8ab41d8bb755c08cd308a2da4ce306301dd25',
    marketPlaceAddress: '0x221d3B269A55c075dB4c663e6Cc238247B208097', //Original '0x9305bF95f9D21dFd0bbd5059c6DF1Bd842d20436',
    report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
    bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
    fundsTarget: '50K',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL: 'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
    endDate: '1647324900',
    startDate: '1642741200',
    //preIdo: '1643374800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1642741200
      },
      {
        title: 'Whitelist Close',
        date: 1643115600
      },
      {
        title: 'KYC Open',
        date: 1643288400
      },
      {
        title: 'KYC Close',
        date: 1643374800
      },
      {
        title: 'Pool Open',
        date: 1643374800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
      gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
      pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
      silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'tgsTest1',
    name: 'MarketPlace - Test Project 2',
    ticketAddress: '0xf9591631aB75ebC03a2dBa7C789506b0FDE4348f', //'0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1',
    marketAddress: '0xA96A1c952F84d05CB9575B196EEDBa4cC0ac46D2', //'0x1d21fc46baca73ad1b8fe409bedb7befd644442f',
    marketPlaceAddress: '0xB3a353D717D27203a8436f87ed7ef68F5c3Ec5C1',
    report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
    bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
    fundsTarget: '50K',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL: 'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
    endDate: '1647324900',
    startDate: '1642741200',
    //preIdo: '1643374800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1642741200
      },
      {
        title: 'Whitelist Close',
        date: 1643115600
      },
      {
        title: 'KYC Open',
        date: 1643288400
      },
      {
        title: 'KYC Close',
        date: 1643374800
      },
      {
        title: 'Pool Open',
        date: 1643374800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
      gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
      pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
      silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'testingProject123',
    name: 'Image - Testing Project',
    ticketAddress: '0x43e3eDE927b7b4e536BB788A694b1D5FA6abF229',
    marketAddress: '0xb4Ff64ef83A0D19F0F1b2021A00a94514DFcD4F2',
    marketPlaceAddress: '0x29021C29EBD71139aC035faB730e29b050e0B011',
    report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
    bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
    fundsTarget: '50K',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL: 'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
    endDate: '1647324900',
    startDate: '1642741200',
    //preIdo: '1643374800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1642741200
      },
      {
        title: 'Whitelist Close',
        date: 1643115600
      },
      {
        title: 'KYC Open',
        date: 1643288400
      },
      {
        title: 'KYC Close',
        date: 1643374800
      },
      {
        title: 'Pool Open',
        date: 1643374800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
      gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
      pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
      silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  }
]

export const PROJECTS_DATA_HARMONY: BaseProject[] = [
  /*{
    id: 'i-harmony',
    name: 'I-HARMONY',
    ticketAddress: '0x5b0ae869b04f88e4fbf4fb69cef5a0dcb98e27c9',
    marketAddress: '0x7e59bbd821084ff9edefd18fedf63a8615205e3e',
    report: 'https://docsend.com/view/9ixkzxjjk24rfby2',
    bgImage: 'https://drive.google.com/uc?export=view&id=1zBXyx4fMq9HryVoWQiTqLVgpiNSrmdli',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    fundsTarget: '75K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJqcKC9NrlUjSN4-vuep-kU0e_Qeu8cA-QNWDApWrHzAnOZ1Bm0jbM0KKjLT74Mr301Prl3zTTrZiW/pub?gid=95556946&single=true&output=csv',
    endDate: '1636967880',
    startDate: '1634558400',
    //preIdo: '1636795080',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634558400
      },
      {
        title: 'Whitelist Close',
        date: 1634734800
      },
      {
        title: 'KYC Open',
        date: 1634828400
      },
      {
        title: 'KYC Close',
        date: 1635339600
      },
      {
        title: 'Pool Open',
        date: 1636795080
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/i3bCLR5kZWnDcZs39',
      gold: 'https://forms.gle/KnL21uXyr6VgdWKN7',
      pink: 'https://forms.gle/t92LTR5i9M9NLcJV7',
      silver: 'https://forms.gle/K9SHTQXPCftTANDQA',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  }*/
]

export const PROJECTS_DATA_AVALANCHE: BaseProject[] = [
]

export const PROJECTS_DATA_IOTEX: BaseProject[] = [
  /*{
    id: 'i-iotex',
    name: 'I-IOTEX',
    ticketAddress: '0xa1e5ce61637b1360a57d2ed95a359a0d1e6b4fcb',
    marketAddress: '0xa250161912f03d15a98e01541467672bcb29ef41',
    report: 'https://docsend.com/view/9ixkzxjjk24rfby2',
    bgImage: 'https://drive.google.com/uc?export=view&id=1zBXyx4fMq9HryVoWQiTqLVgpiNSrmdli',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    fundsTarget: '75K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJqcKC9NrlUjSN4-vuep-kU0e_Qeu8cA-QNWDApWrHzAnOZ1Bm0jbM0KKjLT74Mr301Prl3zTTrZiW/pub?gid=95556946&single=true&output=csv',
    endDate: '1637499600',
    startDate: '1634558400',
    //preIdo: '1636795080',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634558400
      },
      {
        title: 'Whitelist Close',
        date: 1634734800
      },
      {
        title: 'KYC Open',
        date: 1634828400
      },
      {
        title: 'KYC Close',
        date: 1636981200
      },
      {
        title: 'Pool Open',
        date: 1636981200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/i3bCLR5kZWnDcZs39',
      gold: 'https://forms.gle/KnL21uXyr6VgdWKN7',
      pink: 'https://forms.gle/t92LTR5i9M9NLcJV7',
      silver: 'https://forms.gle/K9SHTQXPCftTANDQA',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  }*/
  /*{
   id: 'i-iotex',
   name: 'I-IOTEX',
   ticketAddress: '0xa1e5ce61637b1360a57d2ed95a359a0d1e6b4fcb',
   marketAddress: '0xa250161912f03d15a98e01541467672bcb29ef41',
   report: 'https://docsend.com/view/9ixkzxjjk24rfby2',
   bgImage: 'https://drive.google.com/uc?export=view&id=1zBXyx4fMq9HryVoWQiTqLVgpiNSrmdli',
   openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
   nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
   fundsTarget: '75K',
   subPrivate: '0',
   subPublic: '0',
   subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJqcKC9NrlUjSN4-vuep-kU0e_Qeu8cA-QNWDApWrHzAnOZ1Bm0jbM0KKjLT74Mr301Prl3zTTrZiW/pub?gid=95556946&single=true&output=csv',
   endDate: '1637499600',
   startDate: '1634558400',
   //preIdo: '1636795080',
   timeline: [
     {
       title: 'Whitelist Open',
       date: 1634558400
     },
     {
       title: 'Whitelist Close',
       date: 1634734800
     },
     {
       title: 'KYC Open',
       date: 1634828400
     },
     {
       title: 'KYC Close',
       date: 1636981200
     },
     {
       title: 'Pool Open',
       date: 1636981200
     }
   ],
   whitelistForm: {
     black: 'https://forms.gle/i3bCLR5kZWnDcZs39',
     gold: 'https://forms.gle/KnL21uXyr6VgdWKN7',
     pink: 'https://forms.gle/t92LTR5i9M9NLcJV7',
     silver: 'https://forms.gle/K9SHTQXPCftTANDQA',
     'open community': 'N/A'
   },
   projectDuration: 'Old'
 }*/
]

export const PROJECTS_DATA_MATIC: BaseProject[] = [
  {
    id: 'onerare',
    name: 'ONE RARE',
    ticketAddress: '0x412Ac7e282377Ae88cE69E0682880a0513c4ddF7',
    marketAddress: '0xd101A46B58825EFbb6A982E1344dd0F07dd169Bf',
    report: 'https://docsend.com/view/87qmg8aag4fu4yaw',
    bgImage: 'https://drive.google.com/uc?export=view&id=1F0kCIy3M02zcJcXAmB8Ic7WBhUuLszJi',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-wsyffhalr2',
    nfTradeURL: 'https://nftrade.com/assets/polygon/0x412ac7e282377ae88ce69e0682880a0513c4ddf7',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOOImgvItfbSNC_CnpJBlGBFpJsktfTAjuxPwro40v6uNjiK3XfKlTjiMBi5tvpDkhpPKacMQePEaA/pub?gid=95556946&single=true&output=csv',
    endDate: '1638018000',
    startDate: '1637240400',
    //preIdo: '1637845200',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1637240400
      },
      {
        title: 'Whitelist Close',
        date: 1637672400
      },
      {
        title: 'KYC Open',
        date: 1637758800
      },
      {
        title: 'KYC Close',
        date: 1637845200
      },
      {
        title: 'Pool Open',
        date: 1637845200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/FRNtPtoDs1VE5E7X6',
      gold: 'https://forms.gle/SkCiFxjHvrWZaF6t5',
      pink: 'https://forms.gle/USDcHw2xa9kkiWjM9',
      silver: 'https://forms.gle/y9YHJhwMxQcWD3DVA',
      'open community': 'https://forms.gle/4UeY8Dgi6CnzJpgq7'
    },
    projectDuration: 'Old'
  },
  {
    id: 'cheesusdefi',
    name: 'CHEESUS DEFI',
    ticketAddress: '0x2988Db8d34df0f21656a4Fee9135235bdC935684',
    marketAddress: '0x11c7B79a094857B1D05A9b27555fE2c8Cb88F97C',
    report: 'https://docsend.com/view/rqg6z9v9y7wxqsvk',
    bgImage: 'https://drive.google.com/uc?export=view&id=1zpIDPbIDQS5f4p9-jFaz8HpIHnDrG7I_',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-ivbynxyery',
    nfTradeURL: 'https://nftrade.com/assets/polygon/0x2988Db8d34df0f21656a4Fee9135235bdC935684',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZhxUnlPmUqVSyCPU7XQUeBDOcRXfomh-aFX5S7S2EWvrjp-z-5bBt4SHJ45D6pZAu4C73S4SIsvvB/pub?gid=95556946&single=true&output=csv',
    endDate: '1639918800',
    startDate: '1636981200',
    //preIdo: '1639746000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1636981200
      },
      {
        title: 'Whitelist Close',
        date: 1637154000
      },
      {
        title: 'KYC Open',
        date: 1637240400
      },
      {
        title: 'KYC Close',
        date: 1639141200
      },
      {
        title: 'Pool Open',
        date: 1639746000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/eCDpxyCnuKzWhqMa8',
      gold: 'https://forms.gle/wiH8xmszjGZbfr7B6',
      pink: 'https://forms.gle/3WeLCYfg74Jihe656',
      silver: 'https://forms.gle/fb8daXXBffV4Jy9Z6',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'karmaverse',
    name: 'KARMAVERSE',
    ticketAddress: '0xfE061EdcFBfACf3F66ddC69baA3b2e32D9a6bf9A',
    marketAddress: '0x22Ef76F3340B3c439C13C94a6De186c1255dbEf3',
    report: 'https://docsend.com/view/k7rvmin48k76xb5e',
    bgImage: 'https://drive.google.com/uc?export=view&id=1dFAG0A2Qx98m2S5WsI5H4opLFmfXcQO0',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-nk46yf2amb', //pending
    nfTradeURL: 'https://nftrade.com/assets/polygon/0xfE061EdcFBfACf3F66ddC69baA3b2e32D9a6bf9A',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUedfWb49lfili5npJqZqoCDUzwVU9skFRNDsxjLVTO5mQirT36t9fpCRv9Tm50ZF9CXAOqzgVdY5J/pub?gid=95556946&single=true&output=csv',
    endDate: '1648548000',
    startDate: '1644930000',
    //preIdo: '1648386000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1644930000
      },
      {
        title: 'Whitelist Close',
        date: 1646744400
      },
      {
        title: 'KYC Open',
        date: 1648299600
      },
      {
        title: 'KYC Close',
        date: 1648386000
      },
      {
        title: 'Pool Open',
        date: 1648386000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/sLSsHSC9sKcKKCZ87',
      gold: 'https://forms.gle/ADAmbKCWMLUrxsdP6',
      pink: 'https://forms.gle/etsY7ypAXHtg5Rai9',
      silver: 'https://forms.gle/YppQQL8z8VHrXY4b9',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'sportzchain',
    name: 'SPORTZCHAIN',
    ticketAddress: '0xdACf7D2651Fe050b4c6cC83a6825D0447aC4D292',
    marketAddress: '0x03390AB0DAc327f1Df892142B26f05d69A6aF030',
    report: 'https://docsend.com/view/5xxwiv62sx66nyqy',
    bgImage: 'https://drive.google.com/uc?export=view&id=10mp-Ecj_0PNadvOW-uyel474DJsDGWZl',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-ggben1x3qn', //pending
    nfTradeURL: 'https://nftrade.com/assets/polygon/0xdACf7D2651Fe050b4c6cC83a6825D0447aC4D292',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhcOipczyzaoY_2mVyphzufSJDqB24HwejQdjEffCVo-fk6w6LBnc3CzavZ0BXRvZaggYNieL1lCf0/pub?gid=95556946&single=true&output=csv',
    endDate: '1662555600',
    startDate: '1660050000',
    // preIdo: '1660741200',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1660050000
      },
      {
        title: 'Whitelist Close',
        date: 1660568400
      },
      {
        title: 'KYC Open',
        date: 1660654800
      },
      {
        title: 'KYC Close',
        date: 1660741200
      },
      {
        title: 'Pool Open',
        date: 1660741200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/nYwj7ef7BVPTPuDU8',
      gold: 'https://forms.gle/ighApz91Z9zLFz8KA',
      pink: 'https://forms.gle/2dqUEqdGZVX4NoZ86',
      silver: 'https://forms.gle/dN9iiD5A4VVgraS47',
      'open community': 'https://forms.gle/nQ5Drf5uJbUv89Vh8'
    },
    projectDuration: 'New'
  },
  {
    id: 'aftermathislands',
    name: 'AFTERMATH ISLANDS',
    ticketAddress: '0x26aa959B4B0B5c509057207406b4C207911ceD44',
    marketAddress: '0x5D76E122a678EE70c7e2d40CFE9e22BFD1d4E9E8',
    report: 'https://docsend.com/view/4asgnjtdkfjb7v9i',
    bgImage: 'https://drive.google.com/uc?export=view&id=19f8QtcHRGVjgGr2R8XMyp8sAns5Ys17_',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-ggben1x3qn', //Update Later on
    nfTradeURL: 'https://nftrade.com/assets/polygon/0x26aa959B4B0B5c509057207406b4C207911ceD44', //Update Later on
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVP-6hIO5M_apWi5Hg_oe-TRiU52sw8j6jUsTR_ikjkLu5OgMGkQJxBrD4MMmbKFtAz_SyzihSkeEb/pub?gid=95556946&single=true&output=csv',
    endDate: '1665835200',
    startDate: '1664283600',
    // preIdo: '1665406800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1664283600
      },
      {
        title: 'Whitelist Close',
        date: 1665147600
      },
      {
        title: 'KYC Open',
        date: 1665234000
      },
      {
        title: 'KYC Close',
        date: 1665406800
      },
      {
        title: 'Pool Open',
        date: 1665406800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/8QDdVfjRL6BkEGFr5',
      gold: 'https://forms.gle/FSZQwGisQ3kfsRji6',
      pink: 'https://forms.gle/ReM9nUZc9w5Af79i7',
      silver: 'https://forms.gle/nD8E1X4NEuwf4kvv9',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  // {
  //   id: 'matictest',
  //   name: 'Matic Test - USDT',
  //   ticketAddress: '0x18221DE4b590CC32a93e3CdA561CaF1dB8CD744e', //'0xd2604c17a3e0288ed6fbceb6cf2b0fdcae13e629', //'0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1',
  //   marketAddress: '0x0150dFAF5Ab8C458BE5Ccf2eAc3C9296A7A09Dc3', //'0x598Cc6002F9F2D7CEd76ea050cc3CD7bc2A3b3d2', //'0x1d21fc46baca73ad1b8fe409bedb7befd644442f',
  //   report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
  //   bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
  //   fundsTarget: '50K',
  //   openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
  //   nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
  //   subPrivate: '0',
  //   subPublic: '0',
  //   subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
  //   endDate: '1646571600',
  //   startDate: '1642741200',
  //   //preIdo: '1645189200',
  //   timeline: [
  //     {
  //       title: 'Whitelist Open',
  //       date: 1642741200
  //     },
  //     {
  //       title: 'Whitelist Close',
  //       date: 1643115600
  //     },
  //     {
  //       title: 'KYC Open',
  //       date: 1643288400
  //     },
  //     {
  //       title: 'KYC Close',
  //       date: 1645189200
  //     },
  //     {
  //       title: 'Pool Open',
  //       date: 1645189200
  //     }
  //   ],
  //   whitelistForm: {
  //     black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
  //     gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
  //     pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
  //     silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
  //     'open community': 'N/A'
  //   },
  //   projectDuration: 'New'
  // },
  // {
  //   id: 'matictest',
  //   name: 'Matic Test - Without USDT',
  //   ticketAddress: '0x1aa0eFAbB2ACCFaF624e1Cec76e513ed01574c52', //'0xd2604c17a3e0288ed6fbceb6cf2b0fdcae13e629', //'0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1',
  //   marketAddress: '0xdB6AeF2dF48A627d8132Cbd48fD41b973719922F', //'0x598Cc6002F9F2D7CEd76ea050cc3CD7bc2A3b3d2', //'0x1d21fc46baca73ad1b8fe409bedb7befd644442f',
  //   report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
  //   bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
  //   fundsTarget: '50K',
  //   openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
  //   nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
  //   subPrivate: '0',
  //   subPublic: '0',
  //   subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
  //   endDate: '1646571600',
  //   startDate: '1642741200',
  //   //preIdo: '1645189200',
  //   timeline: [
  //     {
  //       title: 'Whitelist Open',
  //       date: 1642741200
  //     },
  //     {
  //       title: 'Whitelist Close',
  //       date: 1643115600
  //     },
  //     {
  //       title: 'KYC Open',
  //       date: 1643288400
  //     },
  //     {
  //       title: 'KYC Close',
  //       date: 1645189200
  //     },
  //     {
  //       title: 'Pool Open',
  //       date: 1645189200
  //     }
  //   ],
  //   whitelistForm: {
  //     black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
  //     gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
  //     pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
  //     silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
  //     'open community': 'N/A'
  //   },
  //   projectDuration: 'New'
  // },
  // {
  //   id: 'matictestown',
  //   name: 'Self Matic Test - USDT',
  //   ticketAddress: '0x968f554cBb172120F1A48446AFecc679C62e5d9D', //'0xd2604c17a3e0288ed6fbceb6cf2b0fdcae13e629', //'0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1',
  //   marketAddress: '0x30741d7257c5C55628da16D1C6F7B11138619705', //'0x598Cc6002F9F2D7CEd76ea050cc3CD7bc2A3b3d2', //'0x1d21fc46baca73ad1b8fe409bedb7befd644442f',
  //   report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
  //   bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
  //   fundsTarget: '50K',
  //   openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
  //   nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
  //   subPrivate: '0',
  //   subPublic: '0',
  //   subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
  //   endDate: '1646571600',
  //   startDate: '1642741200',
  //   //preIdo: '1645189200',
  //   timeline: [
  //     {
  //       title: 'Whitelist Open',
  //       date: 1642741200
  //     },
  //     {
  //       title: 'Whitelist Close',
  //       date: 1643115600
  //     },
  //     {
  //       title: 'KYC Open',
  //       date: 1643288400
  //     },
  //     {
  //       title: 'KYC Close',
  //       date: 1645189200
  //     },
  //     {
  //       title: 'Pool Open',
  //       date: 1645189200
  //     }
  //   ],
  //   whitelistForm: {
  //     black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
  //     gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
  //     pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
  //     silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
  //     'open community': 'N/A'
  //   },
  //   projectDuration: 'New'
  // },
]

export const PROJECTS_DATA_BSC: BaseProject[] = [
  /*{
    id: 'vaulty',
    name: 'Vaulty',
    ticketAddress: '0x62EB9234eC26DA725e90A270A452a8d6EB304b0D',
    //marketAddress: '',
    report: 'https://docsend.com/view/wep9y2xyryk38u3p',
    bgImage: 'https://drive.google.com/uc?export=view&id=1ehgSRoUDVFTD_9fJgrWDUoiS2lm3mAqt',
    fundsTarget: '75K',
    subPrivate: '-',
    subPublic: '-',
    startDate: '1627995600',
    preIdo: '1628514000',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnrGlQV21SdZfaFKO8bxaDGuO7vZwPFuxtIxemiv9xLKVfKHm8OFAWXXE1mIgCXago7PeH3KyUiYNd/pub?gid=95556946&single=true&output=csv',
    endDate: '100000000000000000000000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1627995600
      },
      {
        title: 'Whitelist Close',
        date: 1628136000
      },
      {
        title: 'KYC Open',
        date: 1628222400
      },
      {
        title: 'KYC Close',
        date: 1628395200
      },
      {
        title: 'Pool Open',
        date: 1628514000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/uN8rauRaw1ULu7z67',
      gold: 'https://forms.gle/yPCfD6aXPFLEYMg28',
      pink: 'https://forms.gle/FDfhKz6yYCj3ZCG66',
      silver: 'https://forms.gle/zwa4sckZZM717aUK9',
      'open community': 'https://forms.gle/5KAvkDYJqrhrUYuD6',
    },
    projectDuration: 'Old'
  }*/
  {
    id: 'duelistking',
    name: 'DUELIST KING',
    ticketAddress: '0x298e48670db3e00ab2a8072dce46f48a237bc639',
    marketAddress: '0x443a4d29b505a18487d8098af3dd8f4d13bc42b3',
    report: 'https://docsend.com/view/f4aes9i7b99iz5ct',
    bgImage: 'https://drive.google.com/uc?export=view&id=1ElWTXqyXHOQRXYwcQ_i5ie0kmbVTcmvy',
    openSeaURL: '',
    nfTradeURL: 'https://app.nftrade.com/assets/bsc/0x298E48670Db3E00aB2A8072dcE46F48a237BC639',
    fundsTarget: '52.5K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcggsyAFeHFNuwWXMPWxCmvAqpDTfzOB19ZNkPEo-umQfvx2q-nchS4v2NyqDfR-1RB2Xveuni1wTu/pub?gid=95556946&single=true&output=csv',
    endDate: '1635359700',
    startDate: '1634895000',
    //preIdo: '1635253200',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634895000
      },
      {
        title: 'Whitelist Close',
        date: 1635080400
      },
      {
        title: 'KYC Open',
        date: 1635166800
      },
      {
        title: 'KYC Close',
        date: 1635253200
      },
      {
        title: 'Pool Open',
        date: 1635253200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/iZrPAuhWGM8xXDaC7',
      gold: 'https://forms.gle/JuNW1yiQQKtGkBQ6A',
      pink: 'https://forms.gle/zGD5LYB2c2Ypa9tY8',
      silver: 'https://forms.gle/oUbvfGXG9KoG6PJQ9',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'prometheus',
    name: 'PROMETHEUS',
    ticketAddress: '0x3eF7ed0B2F34C345CF6D5D49417Ff47C57A40473',
    marketAddress: '0x59f63a5e4ebfae2ec36651463d388d12327753c9',
    report: 'https://docsend.com/view/mx3pr6w7c74yjsr9',
    bgImage: 'https://drive.google.com/uc?export=view&id=1C3Ac2amo5eFMv5YFTApqBxLMV1CThA1M',
    openSeaURL: '',
    nfTradeURL: 'https://app.nftrade.com/assets/bsc/0x3ef7ed0b2f34c345cf6d5d49417ff47c57a40473',
    fundsTarget: '35K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS94O1uI0LYMVROnwgefbw1OoAT5pehPA828g1yRPxq--PD6fYIXQNyHsqVJAppzSX3VmtPb1FDrl-U/pub?gid=95556946&single=true&output=csv',
    endDate: '1636894800',
    startDate: '1635771600',
    //preIdo: '1636722000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1635771600
      },
      {
        title: 'Whitelist Close',
        date: 1635944400
      },
      {
        title: 'KYC Open',
        date: 1636030800
      },
      {
        title: 'KYC Close',
        date: 1636722000
      },
      {
        title: 'Pool Open',
        date: 1636722000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/U6fgt3P7hUVmMf2D7',
      gold: 'https://forms.gle/7nJpi5chuvxvCk82A',
      pink: 'https://forms.gle/8KEAHh1895ZNWSKK6',
      silver: 'https://forms.gle/KN6gh2EfTZbrvgNc8',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'meland',
    name: 'MELAND',
    ticketAddress: '0x46c707e6a37F0061D27f105264258aF4B28FC7A4',
    marketAddress: '0x51c1BD005DE56d508AE5D17907bc6c07683C272b',
    report: 'https://docsend.com/view/htt6uwuvbtaxxcq8',
    bgImage: 'https://drive.google.com/uc?export=view&id=1o08y3959X7StijjAciNoTkxrVmTYQOVA',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x46c707e6a37f0061d27f105264258af4b28fc7a4',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUXRoPjplxLp-ZUntBC_AbQcrhXxRJL_XF9kf0AZMxuZF_0fkq5ieW4c2NqpQgvNxQ4PbU38Rv7LB4/pub?gid=95556946&single=true&output=csv',
    endDate: '1638968400',
    startDate: '1638450000',
    //preIdo: '1638795600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1638450000
      },
      {
        title: 'Whitelist Close',
        date: 1638622800
      },
      {
        title: 'KYC Open',
        date: 1638709200
      },
      {
        title: 'KYC Close',
        date: 1638795600
      },
      {
        title: 'Pool Open',
        date: 1638795600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/7aDwd9SgNUSNeKKR6',
      gold: 'https://forms.gle/3Z7gyU7dD9SCfjue7',
      pink: 'https://forms.gle/N62dRu6a5AP86eNj7',
      silver: 'https://forms.gle/uBz979HPktdeVZXN8',
      'open community': 'https://gleam.io/competitions/qfaZM-gs-x-melandai-whitelist-contest'
    },
    projectDuration: 'Old'
  },
  {
    id: 'studyum',
    name: 'STUDYUM',
    ticketAddress: '0x2E640603E6bB000131991560C5BB7d6c6a9212e1',
    marketAddress: '0x8B975363E49F38362e9DAb047507F87Ca8C1aC25',
    report: 'https://docsend.com/view/drwkpnjfsgygi6wj',
    bgImage: 'https://drive.google.com/uc?export=view&id=1rnLaXFDuzZohpXmqsF2jZwyp-7VSbTV5',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x2E640603E6bB000131991560C5BB7d6c6a9212e1',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQieFT3whAnT-vqaaq6cBJ856YQnUymmo9BLWDAwu_tlNEKmxfZ__3JwQz1NdCmN-Y4PoFlNPTFEpZe/pub?gid=95556946&single=true&output=csv',
    endDate: '1639746000',
    startDate: '1639141200',
    //preIdo: '1639659600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1639141200
      },
      {
        title: 'Whitelist Close',
        date: 1639400400
      },
      {
        title: 'KYC Open',
        date: 1639573200
      },
      {
        title: 'KYC Close',
        date: 1639659600
      },
      {
        title: 'Pool Open',
        date: 1639659600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/3wuDNo1a5UJXLws29',
      gold: 'https://forms.gle/QrZCV2rHDpEihb4Z6',
      pink: 'https://forms.gle/MsTXz9x52jwmwXMK8',
      silver: 'https://forms.gle/jYK7mFbh2usSPcDM6',
      'open community': 'https://gleam.io/kJxWl/gs-x-studyum-whitelist-contest'
    },
    projectDuration: 'Old'
  },
  {
    id: 'himoworld',
    name: 'HIMO WORLD',
    ticketAddress: '0xdA6Bcc8F3A934985793e3fb24a48Db377dCF54D5',
    marketAddress: '0x49E1ADeC74eBCc9068D5E493b9220d6d023567dB',
    marketPlaceAddress: '0x79DA83A498C3067A161Dd326b5aD9518279E151e',
    returnNFTAddress: '0x093CDEd0488c335258EEbfdFa8C26A5f98331502',
    report: 'https://docsend.com/view/mhtdxc2cffrtgvtc',
    bgImage: 'https://drive.google.com/uc?export=view&id=1KqB7I6nnBKurgZydvddfK-Xzq5Km7T0t',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0xda6bcc8f3a934985793e3fb24a48db377dcf54d5',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdV0LN-_GEWZ8KG3sO55-l8u6EwsDxLpzeDaS5PsW6N9OdDn_duz7dy5iBE0oHaOj12pLicy0gY2Rs/pub?gid=95556946&single=true&output=csv',
    endDate: '1642856400',
    startDate: '1642078800',
    //preIdo: '1642683600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1642078800
      },
      {
        title: 'Whitelist Close',
        date: 1642510800
      },
      {
        title: 'KYC Open',
        date: 1642597200
      },
      {
        title: 'KYC Close',
        date: 1642683600
      },
      {
        title: 'Pool Open',
        date: 1642683600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/zK58oU6daCCYiTwL7',
      gold: 'https://forms.gle/GB3D1ADHi2WsoSj57',
      pink: 'https://forms.gle/ARipEEghnspns3uD9',
      silver: 'https://forms.gle/gyHgGaMppzpqnefeA',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'metaverselab',
    name: 'METAVERSE LAB',
    ticketAddress: '0x4Ff3450ed4BaDbd281e337bb4a8C4C891B07eb06',
    marketAddress: '0xc9A788C7e60D2CE2c34f2fA9d8209aF44fFAE766',
    report: 'https://docsend.com/view/ygijw3tha4fqubgu',
    bgImage: 'https://drive.google.com/uc?export=view&id=1cbm7ydZ6U-emE_ZKHNj-1UmrIFsHvKKO',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x4ff3450ed4badbd281e337bb4a8c4c891b07eb06',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRg7ZIBSim3TcOMZR2dUIMpovVGZ7spERHoc5LGXgtzLCXOfEb7d4_IQl7eTrsVNQHPmeLykv2d3uv6/pub?gid=95556946&single=true&output=csv',
    endDate: '1643979600',
    startDate: '1643377500',
    //preIdo: '1643806800', 
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1643377500
      },
      {
        title: 'Whitelist Close',
        date: 1643634000
      },
      {
        title: 'KYC Open',
        date: 1643720400
      },
      {
        title: 'KYC Close',
        date: 1643806800
      },
      {
        title: 'Pool Open',
        date: 1643806800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/uVDbainqQZ5zJmuz6',
      gold: 'https://forms.gle/9ieiURmGp2rHr8VN8',
      pink: 'https://forms.gle/YjxCNc4ziXWyFrds7',
      silver: 'https://forms.gle/ng2ScSLB5e9i27YR8',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'harmonylauncher',
    name: 'HARMONY LAUNCHER',
    ticketAddress: '0x66Db70a764074C028eBB7CA118760260D7D7EC77',
    marketAddress: '0xdEC5dD3d94a2C79A9CF51c2faa652D01768E3381',
    report: 'https://docsend.com/view/axnzjdxy2wcgi5dm',
    bgImage: 'https://drive.google.com/uc?export=view&id=10h7ImNdyIJ8MmjuXF-2FUVzrpFtgq9Eb',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x66Db70a764074C028eBB7CA118760260D7D7EC77',
    fundsTarget: '40K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9LKAFSYYrWn-ROjookHRupE23mDQnbd4ENVBka2uiktQadUhk2uqARMlyb6Ilqwa5usccsI4sZxv7/pub?gid=95556946&single=true&output=csv',
    endDate: '1644584400',
    startDate: '1643893200',
    // preIdo: '1644411600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1643893200
      },
      {
        title: 'Whitelist Close',
        date: 1644238800
      },
      {
        title: 'KYC Open',
        date: 1644325200
      },
      {
        title: 'KYC Close',
        date: 1644411600
      },
      {
        title: 'Pool Open',
        date: 1644411600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/PjbGTidTToWmuXBQ8',
      gold: 'https://forms.gle/YkPmKweEbTGkK7k87',
      pink: 'https://forms.gle/Qq2zsh5BwFjwk4VK6',
      silver: 'https://forms.gle/N7v6UzMe6jw5fySG7',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'worldofcryptoids',
    name: 'WORLD OF CRYPTOIDS',
    ticketAddress: '0xE95b149e9260eE552aE72C849763f33d7A20468E',
    marketAddress: '0x42608081C14ACeF2014B2d8Aa4DE0678E4dca6e1',
    report: 'https://docsend.com/view/rg7ar683jyhuz6ht',
    bgImage: 'https://drive.google.com/uc?export=view&id=17Wc0L-vTV-IjvN0EZyuc8REIBJx2dDyV',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0xE95b149e9260eE552aE72C849763f33d7A20468E',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVF1bDs-FKHJXPibfm_okSm6Wxnied0xDAlah51XMFbfImC31TuSMPiGiMLTKYMDIyKCVE3oE8BO-h/pub?gid=95556946&single=true&output=csv',
    endDate: '1645621200',
    startDate: '1644325200',
    // preIdo: '1644843600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1644325200
      },
      {
        title: 'Whitelist Close',
        date: 1644670800
      },
      {
        title: 'KYC Open',
        date: 1644757200
      },
      {
        title: 'KYC Close',
        date: 1644843600
      },
      {
        title: 'Pool Open',
        date: 1644843600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/SWvtZCoUgp2oToHP8',
      gold: 'https://forms.gle/1B8vbHoH6Yn6DU3L6',
      pink: 'https://forms.gle/7DnJPAwnJC89ofYo8',
      silver: 'https://forms.gle/ELXMRFoCaGGFJvjL7',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'acknoledgerino',
    name: 'ACKNOLEDGER NFT COLLECTION',
    ticketAddress: '0x87b688412e1E91E9C2995E071dAD7685aD5D5587',
    marketAddress: '0x2687080300B46F5ca9A1687c4d7Fb92a619C7f50',
    report: 'https://docsend.com/view/aagqubngssg3ekf4',
    bgImage: 'https://drive.google.com/uc?export=view&id=1JFuW8ogdhjdd-pgcazuAwCg1e1P00sRS',
    openSeaURL: '',
    nfTradeURL: '',
    fundsTarget: '-',
    subPrivate: '-',
    subPublic: '-',
    //subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR62MYp7o4zot_xl8RtNIv58HKwMzuTYJ4DdOjFExYME1cubXcNyabhFsDW8DluBjeOrSMK0FbGLlqq/pub?gid=95556946&single=true&output=csv',
    endDate: '1645189200',
    startDate: '1634043600',
    //preIdo: '1644584400',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634043600
      },
      {
        title: 'Whitelist Close',
        date: 1634216400
      },
      {
        title: 'KYC Open',
        date: 1634310000
      },
      {
        title: 'KYC Close',
        date: 1644584400
      },
      {
        title: 'Pool Open',
        date: 1644584400
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Pfot55icy4xQ8jHY7',
      gold: 'https://forms.gle/E2CrMvNujKgVoJjs6',
      pink: 'https://forms.gle/2AUuXgd2GhryLzJh6',
      silver: 'https://forms.gle/e3eRC219aHzXJeYA7',
      'open community': 'N/A'
    },
    projectDuration: 'Old',
    projectType: "nftCollection"
  },
  {
    id: '123swap',
    name: '123SWAP',
    ticketAddress: '0x820bF1E40730610C427114F1dFB97864720AbdCE',
    marketAddress: '0x10d5b8bD77BbEFD2c5C05F031d6dB3C0EF1DCA90',
    marketPlaceAddress: '0x0B049a5AeDE3a7EaF2E1eb0AE6DEe9f41927573d',
    returnNFTAddress: '0x093CDEd0488c335258EEbfdFa8C26A5f98331502',
    report: 'https://docsend.com/view/tjzzw3px99bi5e36',
    bgImage: 'https://drive.google.com/uc?export=view&id=1HSSsL5Qy1JSs9g-9R8jdxqNhaXMZNzSH',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x820bF1E40730610C427114F1dFB97864720AbdCE',
    fundsTarget: '75K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQi9snZDicmJKFI07J2rlxkVYTgOMZE1bOU0MguMn_ZmGnE4B_RoQH4jEWo1QehU8zyMj2_nWjxu25O/pub?gid=95556946&single=true&output=csv',
    endDate: '1648213200',
    startDate: '1646053200',
    //preIdo: '1647003600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1646053200
      },
      {
        title: 'Whitelist Close',
        date: 1646830800
      },
      {
        title: 'KYC Open',
        date: 1646917200
      },
      {
        title: 'KYC Close',
        date: 1647003600
      },
      {
        title: 'Pool Open',
        date: 1647003600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/gtbSrG4pnsjPjQMw8',
      gold: 'https://forms.gle/nkbx485qMsTQmwzr5',
      pink: 'https://forms.gle/cy1cvrQkNTnufdmP8',
      silver: 'https://forms.gle/EbXyTGUzSrjr1sgy7',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'kalanetwork',
    name: 'KALA NETWORK',
    ticketAddress: '0x7727C5eA46f473Ea26406F743A27Eb2027cB6BCE',
    marketAddress: '0x50285f00D58D97e3af9Bd233f8Cf6b1fb2c7b5Ea',
    marketPlaceAddress: '0xE7183179d8A626bDeb580E5694b53929063E37EB',
    returnNFTAddress: '0x093CDEd0488c335258EEbfdFa8C26A5f98331502',
    report: 'https://docsend.com/view/pqeekcy59e3vbcy9',
    bgImage: 'https://drive.google.com/uc?export=view&id=1kIcDQvAXe1IQXKqfJO-20jWu2rRe9kgU',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x7727C5eA46f473Ea26406F743A27Eb2027cB6BCE',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmTumSERZ6uqZ_e6iMKqha-Ndy3KyK1TedXadIiMLtvZG5jsxP5YI1k9SG9ILHHMhGjJvdSL_sMgV9/pub?gid=95556946&single=true&output=csv',
    endDate: '1648299600',
    startDate: '1646744400',
    // preIdo: '1648126800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1646744400
      },
      {
        title: 'Whitelist Close',
        date: 1647954000
      },
      {
        title: 'KYC Open',
        date: 1648040400
      },
      {
        title: 'KYC Close',
        date: 1648126800
      },
      {
        title: 'Pool Open',
        date: 1648126800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/LgJdZZtc11rU9Bhs7',
      gold: 'https://forms.gle/Cknv7svEqjtr1g5a6',
      pink: 'https://forms.gle/sSatYPjaeyK7KBug6',
      silver: 'https://forms.gle/MQzKJC84XVjhavTz7',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'polkerino',
    name: 'POLKER INO',
    ticketAddress: '0x17f25CAeD8ee186E87b9311cf9946493de0f96fA',
    marketAddress: '0x086D13C2ab3333809dA698E508871f433E2f07BE',
    report: 'https://docsend.com/view/aagqubngssg3ekf4',
    bgImage: 'https://drive.google.com/uc?export=view&id=1V4mqXjqgb99jWw5y7CjaUgzeFCuI_YhI',
    openSeaURL: '',
    nfTradeURL: '',
    fundsTarget: '-',
    subPrivate: '-',
    subPublic: '-',
    //subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR62MYp7o4zot_xl8RtNIv58HKwMzuTYJ4DdOjFExYME1cubXcNyabhFsDW8DluBjeOrSMK0FbGLlqq/pub?gid=95556946&single=true&output=csv',
    endDate: '1648731600',
    startDate: '1647262800',  // 1646830800 - FOR BUYNFT | 1647262800 == FOR COMING SOON
    // preIdo: '1646830800',  // UNCOMMENT & 1646830800 - FOR BUYNFT | DO COMMENT FOR COMING SOON
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1646917200
      },
      {
        title: 'Whitelist Close',
        date: 1646917200
      },
      {
        title: 'KYC Open',
        date: 1646917200
      },
      {
        title: 'KYC Close',
        date: 1646830800  // 1646830800 - FOR BUYNFT
      },
      {
        title: 'Pool Open',
        date: 1646830800 // 1646830800 - FOR BUYNFT
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Pfot55icy4xQ8jHY7',
      gold: 'https://forms.gle/E2CrMvNujKgVoJjs6',
      pink: 'https://forms.gle/2AUuXgd2GhryLzJh6',
      silver: 'N/A',
      'open community': 'N/A'
    },
    projectDuration: 'New',
    projectType: "nftCollection"
  },
  {
    id: 'supernova',
    name: 'SUPERNOVA',
    ticketAddress: '0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    marketAddress: '0x305684Cd6d02f2Fe2e139A22969C3f7AeE5B6CA5',
    report: 'https://docsend.com/view/xae8jnstd38ar7ip',
    bgImage: 'https://drive.google.com/uc?export=view&id=1cEV2FmgkIgZg4qUSr8quVjV979hgsSU9',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQV-C8xp8EGP7ScF9FR3oTEIUnqV9qaSJx0Iw85Sxyv9cK_Vcco8CUNMYHnkn-DkmGz84ONMdjYlZTe/pub?gid=95556946&single=true&output=csv',
    endDate: '1648182600',
    startDate: '1647435600',
    //preIdo: '1648040400',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1647435600
      },
      {
        title: 'Whitelist Close',
        date: 1647867600
      },
      {
        title: 'KYC Open',
        date: 1647954000
      },
      {
        title: 'KYC Close',
        date: 1648040400
      },
      {
        title: 'Pool Open',
        date: 1648040400
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/vDSniMqw2eqKzSAZ9',
      gold: 'https://forms.gle/MoUa7npj8FRjuq938',
      pink: 'https://forms.gle/dL1GxRJKe3jfjDMr5',
      silver: 'https://forms.gle/W45EFxBNUscg5ENh6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'sugarkingdom',
    name: 'SUGAR KINGDOM',
    ticketAddress: '0x578CF69a6e4A336084AbB58dA7D9d6301046B64A',
    marketAddress: '0x3EC01c400E4403D44f910fC01c9F5C878c711542',
    report: 'https://docsend.com/view/mf3jq976ms796ac5',
    bgImage: 'https://drive.google.com/uc?export=view&id=1dEGjXIlqyeHiMI7O4NbcZfW9IwqtcmzY',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0x578CF69a6e4A336084AbB58dA7D9d6301046B64A',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8MItirIRDgkcLMBcINcXS-jUY9QWYtsvghF6QYXqOsfshO5bNNPAnBtvykXPVyXKiAIe2ZurOghfP/pub?gid=95556946&single=true&output=csv',
    endDate: '1649941200',
    startDate: '1648213200',
   // preIdo: '1649757600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1648213200
      },
      {
        title: 'Whitelist Close',
        date: 1649077200
      },
      {
        title: 'KYC Open',
        date: 1649336400
      },
      {
        title: 'KYC Close',
        date: 1649682000
      },
      {
        title: 'Pool Open',
        date: 1649757600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/wwUrh3GD5nYX3rs79',
      gold: 'https://forms.gle/sBPUUAS1d9fgczybA',
      pink: 'https://forms.gle/AAUzqakShwUdBaky6',
      silver: 'https://forms.gle/MTzVC1QmLneGUH8j8',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'legionnetwork',
    name: 'LEGION NETWORK',
    ticketAddress: '0x1feCa8ADaa5927138755690D92EEEDE7E2044bdd',
    marketAddress: '0x1824Dbb4F4cBCE1B273C51f33284a8bC672AE66c',
    report: 'https://docsend.com/view/6eq5zhduejakdenu',
    bgImage: 'https://drive.google.com/uc?export=view&id=1Uhz-7PR7B1IGHDqgJuAoEMJ-R5uWTX2G',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0x1feCa8ADaa5927138755690D92EEEDE7E2044bdd',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlovRzUnuO7fcact1WNw9if5vhb0FglpunrbrHBeuzXlzy52WUL18e12gMZE14LujbvqhygerdcZUw/pub?gid=95556946&single=true&output=csv',
    endDate: '1650463200',
    startDate: '1650286800',
    //preIdo: '1650448800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1650286800
      },
      {
        title: 'Whitelist Close',
        date: 1650373200
      },
      {
        title: 'KYC Open',
        date: 1650373200
      },
      {
        title: 'KYC Close',
        date: 1650448800
      },
      {
        title: 'Pool Open',
        date: 1650448800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Ak2UVM21t8VvnuL2A',
      gold: 'https://forms.gle/RxmZy1T4u4GMsLVP7',
      pink: 'https://forms.gle/ezfdztwXX7gRceX16',
      silver: 'https://forms.gle/noJQ7VfwHGfw2nCB9',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'crypcade',
    name: 'CRYPCADE',
    ticketAddress: '0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    report: 'https://docsend.com/view/2exr2h5gqwfw5ers',
    bgImage: 'https://drive.google.com/uc?export=view&id=1QDd_0G0LKyPaiGcDo54wv1HpKPfNqCay',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRN6Tgu1L8MQ2pddLnQhbY-MG6bSI02hjvPwYEFxgYV6gKRnwc3YQ5A8cOx8vHiWeFw78abyAHVlt0/pub?gid=95556946&single=true&output=csv',
    endDate: '1652533200',
    startDate: '1650546000',
    preIdo: '1652360400',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1650546000
      },
      {
        title: 'Whitelist Close',
        date: 1652187600
      },
      {
        title: 'KYC Open',
        date: 1652274000
      },
      {
        title: 'KYC Close',
        date: 1652360400
      },
      {
        title: 'Pool Open',
        date: 1652360400
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/ELXXXHqB6bMtsBwa7',
      gold: 'https://forms.gle/RM9XAB1yBdX6kwVx5',
      pink: 'https://forms.gle/8BnqCLLgFYZByzXw8',
      silver: 'https://forms.gle/vEJDVG3kyGegLuBS8',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'ikonic',
    name: 'IKONIC',
    ticketAddress: '0x8e9f838FaAbd6aB0EA82F26ce419d38b0d3545c2',
    marketAddress: '0x9d17A59995f5bDE06E0c602f8ed43B3C47cDa5E1',
    report: 'https://docsend.com/view/t6uqhnek3rbru3d8',
    bgImage: 'https://drive.google.com/uc?export=view&id=1s3Ews9d-oQAFxMYYUEV2ueN32k6yxopr',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0x8e9f838FaAbd6aB0EA82F26ce419d38b0d3545c2',
    fundsTarget: '30K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeBgm-25UzAc3VC412OkWFkoiEHCI_jhIkuZ8KUuAIbr4IJZ8eF3iBGEL4wfReoZYVRG-sW1N1NIoE/pub?gid=95556946&single=true&output=csv',
    endDate: '1653051600',
    startDate: '1651755600',
    //preIdo: '1652878800',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1651755600
      },
      {
        title: 'Whitelist Close',
        date: 1652274000
      },
      {
        title: 'KYC Open',
        date: 1652360400
      },
      {
        title: 'KYC Close',
        date: 1652878800
      },
      {
        title: 'Pool Open',
        date: 1652878800
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/XYZMZY8xACnBjptU9',
      gold: 'https://forms.gle/59jHBDnPfPkADeFMA',
      pink: 'https://forms.gle/DeVy9hYR34GB5hQF8',
      silver: 'https://forms.gle/DsTxXkcNCC1iZ3AC7',
      'open community': 'https://forms.gle/CsWDAMoApXVyBtWZA'
    },
    projectDuration: 'New'
  },
  {
    id: 'metacraft',
    name: 'METACRAFT',
    ticketAddress: '0xBcC7d150f9B36584eb30190205Ccd5538bdBE49d',
    marketAddress: '0x27e1Ed2457e822E556a8d11e2C2483F7b65e380b',
    report: 'https://docsend.com/view/ykn3szrx87qui29m',
    bgImage: 'https://drive.google.com/uc?export=view&id=1Zd9B5G9XVr8EbkSQWDx_Ecjy6oo02J5U',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0xBcC7d150f9B36584eb30190205Ccd5538bdBE49d',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2mSCMucMN_ggyRuFbh4LB_hMBc3E-8t4TkccoV3cHbl0hD16nxg5Q-Ya50Xsm0QoUUAAbAiWmg1IQ/pub?gid=95556946&single=true&output=csv',
    endDate: '1662656400',
    startDate: '1655211600',
    // preIdo: '1662642000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1655211600
      },
      {
        title: 'Whitelist Close',
        date: 1656853200
      },
      {
        title: 'KYC Open',
        date: 1656939600
      },
      {
        title: 'KYC Close',
        date: 1657112400
      },
      {
        title: 'Pool Open',
        date: 1662642000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/PNsc4yKPdbHjxvUV8',
      gold: 'https://forms.gle/pSsbNuoxpWGjNf5PA',
      pink: 'https://forms.gle/Wurqk4MWDBK8qj1m6',
      silver: 'https://forms.gle/2GEHnZT7mEShYyjy6',
      'open community': 'https://forms.gle/Na6Na48dLWfh6qWY8'
    },
    projectDuration: 'New'
  },
  {
    id: 'metawarriors',
    name: 'META WARRIORS',
    ticketAddress: '0xf7f1b454bc62b362a45f8cfc3bce1f07ee2c49b0',
    marketAddress: '0x9657D097985993C3c0eba7542B546a4784268638',  // old marketaddress - new never created
    report: 'https://docsend.com/view/gyq4dgxt8r6dg4vb',
    bgImage: 'https://drive.google.com/uc?export=view&id=1WvDIFVP-2XqUuoNyMtUFivSUpsOpX0tB',
    openSeaURL: '',
    nfTradeURL:'https://nftrade.com/assets/bsc/0xF03983f4F6130d76A433c4EB4C86f7cfD3c0e91A',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT004LnHyV2hA8WOEDqhLZcO_4Nb6Vem94-UXSPeXD_eID-bNqR8NMOMCAWbj_iLOocksyPCoEEyIZR/pub?gid=95556946&single=true&output=csv',
    endDate: '1665990000',
    startDate: '1664888400',
    // preIdo: '1665147600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1664888400
      },
      {
        title: 'Whitelist Close',
        date: 1665061200
      },
      {
        title: 'KYC Open',
        date: 1665061200
      },
      {
        title: 'KYC Close',
        date: 1665147600
      },
      {
        title: 'Pool Open',
        date: 1665147600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/zZNvvarqsqHbFtQd6',
      gold: 'https://forms.gle/yV5cweggeSNyK2hY7',
      pink: 'https://forms.gle/LzxfySgrG7j2TGpj9',
      silver: 'https://forms.gle/qfcUeK9GBkr3D6o9A',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  // {
  //     id: 'bsctest',
  //     name: 'BSC Test - USDT',
  //     ticketAddress: '0xb3006fd4D1934e8050eC1E5beAA1d5BDebF649Ed', //'0xd2604c17a3e0288ed6fbceb6cf2b0fdcae13e629', //'0x6798D2B2bF461745d0bAE23B0C08891E79C4A4E1',
  //     marketAddress: '0x9357bB419149683394bD096e18535b713b496A00', //'0x598Cc6002F9F2D7CEd76ea050cc3CD7bc2A3b3d2', //'0x1d21fc46baca73ad1b8fe409bedb7befd644442f',
  //     report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
  //     bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
  //     fundsTarget: '50K',
  //     openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
  //     nfTradeURL:'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
  //     subPrivate: '0',
  //     subPublic: '0',
  //     subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
  //     endDate: '1646571600',
  //     startDate: '1642741200',
  //     //preIdo: '1645189200',
  //     timeline: [
  //       {
  //         title: 'Whitelist Open',
  //         date: 1642741200
  //       },
  //       {
  //         title: 'Whitelist Close',
  //         date: 1643115600
  //       },
  //       {
  //         title: 'KYC Open',
  //         date: 1643288400
  //       },
  //       {
  //         title: 'KYC Close',
  //         date: 1645189200
  //       },
  //       {
  //         title: 'Pool Open',
  //         date: 1645189200
  //       }
  //     ],
  //     whitelistForm: {
  //       black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
  //       gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
  //       pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
  //       silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
  //       'open community': 'N/A'
  //     },
  //     projectDuration: 'New'
  // }
]

export const PROJECTS_DATA: BaseProject[] = [
  {
    id: 'sator',
    name: 'SATOR',
    ticketAddress: '0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    marketAddress: '0x60c2762eac75486848e22c2710c517c3364162dd',
    report: 'https://docsend.com/view/9ixkzxjjk24rfby2',
    bgImage: 'https://drive.google.com/uc?export=view&id=1zBXyx4fMq9HryVoWQiTqLVgpiNSrmdli',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-eo2gidwwsh',
    nfTradeURL: 'https://app.nftrade.com/assets/eth/0x0c4881a88d8f073dd0a9e9c0d98a793601675792',
    fundsTarget: '75K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJqcKC9NrlUjSN4-vuep-kU0e_Qeu8cA-QNWDApWrHzAnOZ1Bm0jbM0KKjLT74Mr301Prl3zTTrZiW/pub?gid=95556946&single=true&output=csv',
    endDate: '1635771600',
    startDate: '1634558400',
    //preIdo: '1635339600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634558400
      },
      {
        title: 'Whitelist Close',
        date: 1634734800
      },
      {
        title: 'KYC Open',
        date: 1634828400
      },
      {
        title: 'KYC Close',
        date: 1635339600
      },
      {
        title: 'Pool Open',
        date: 1635339600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/i3bCLR5kZWnDcZs39',
      gold: 'https://forms.gle/KnL21uXyr6VgdWKN7',
      pink: 'https://forms.gle/t92LTR5i9M9NLcJV7',
      silver: 'https://forms.gle/K9SHTQXPCftTANDQA',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'acknoledger',
    name: 'ACKNOLEDGER',
    ticketAddress: '0xab45c53c164ac8c2a657bd74d75bf205661cc40e',
    marketAddress: '0x709ed5ead4fa5f2ddd91f4d30d3fb409c4a5c0be',
    report: 'https://docsend.com/view/aagqubngssg3ekf4',
    bgImage: 'https://drive.google.com/uc?export=view&id=1EW8Wg69Jz68k5fNjSUxgfZl2jBvz5Pos',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-6l5w6q0qc9',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=acknoledger&sort=listed_desc',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR62MYp7o4zot_xl8RtNIv58HKwMzuTYJ4DdOjFExYME1cubXcNyabhFsDW8DluBjeOrSMK0FbGLlqq/pub?gid=95556946&single=true&output=csv',
    endDate: '1634729400',
    startDate: '1634043600',
    //preIdo: '1634562000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1634043600
      },
      {
        title: 'Whitelist Close',
        date: 1634216400
      },
      {
        title: 'KYC Open',
        date: 1634310000
      },
      {
        title: 'KYC Close',
        date: 1634562000
      },
      {
        title: 'Pool Open',
        date: 1634562000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Pfot55icy4xQ8jHY7',
      gold: 'https://forms.gle/E2CrMvNujKgVoJjs6',
      pink: 'https://forms.gle/2AUuXgd2GhryLzJh6',
      silver: 'https://forms.gle/e3eRC219aHzXJeYA7',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'amasa',
    name: 'AMASA',
    ticketAddress: '0x3ed83b9ae395ca3de994600fe0f2cd027753b2ee',
    marketAddress: '0xa5a71350f95d0b42a25c25f278c561bf40f0453f',
    report: 'https://docsend.com/view/af4t34mxhdu9xqcm',
    bgImage: 'https://drive.google.com/uc?export=view&id=1SlUcnpSoreshecmIHzXS-bwNDA4GNaV3',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-gatphxno5z',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=amasa&sort=listed_desc',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUbGgA-F52Oh0P2s_VRPG-a6eyAsKM_rrJtRXJ0DRY6ZBCIgN0XA1aKsokUNgJkjUHJM6U_HjMKXzQ/pub?gid=95556946&single=true&output=csv',
    endDate: '1632461400',
    startDate: '1632056400',
    //preIdo: '1632402000',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1632056400
      },
      {
        title: 'Whitelist Close',
        date: 1632285000
      },
      {
        title: 'KYC Open',
        date: 1632315600
      },
      {
        title: 'KYC Close',
        date: 1632402000
      },
      {
        title: 'Pool Open',
        date: 1632402000
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/Yi27Z14reNsXQgGP6',
      gold: 'https://forms.gle/ghSjgYJPPrQ3TiEUA',
      pink: 'https://forms.gle/kJ7rfrpoURFoj2uy5',
      silver: 'https://forms.gle/HLe1AdCro9N7x3PK6',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'enjinstarter',
    name: 'ENJINSTARTER',
    ticketAddress: '0x7eb6115a3c667d05a6fbccc6c598a5a6ad392e4b',
    marketAddress: '0x50be996bf5309bbF35FDF96868dE92433acEA142',
    report: 'https://docsend.com/view/ug98ffx6r2gb3ybc',
    bgImage: 'https://drive.google.com/uc?export=view&id=1_ChcnhCDsTv2o43X3P0JjQpFHs-p8W8N',
    openSeaURL: 'https://opensea.io/collection/unidentified-contract-rckkff0dt1',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=enjinstarter&sort=listed_desc',
    fundsTarget: '50K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDrEVxgT40r3bbUoo6hXqB4hEjgNxHbJiPASRkc8o04OXW6qpQ_ZHytLvnXnVSyvQboK0qGvGF0ASo/pub?gid=95556946&single=true&output=csv',
    endDate: '1632234600',
    startDate: '1631716200',
    //preIdo: '1632148200',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1631716200
      },
      {
        title: 'Whitelist Close',
        date: 1631889000
      },
      {
        title: 'KYC Open',
        date: 1631975400
      },
      {
        title: 'KYC Close',
        date: 1632061800
      },
      {
        title: 'Pool Open',
        date: 1632148200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/VsdXX6qMQHyENg3E9',
      gold: 'https://forms.gle/5PKPPYaY4VZQSgMt7',
      pink: 'https://forms.gle/kEr2L6kgxYFdFHEo8',
      silver: 'https://forms.gle/E2GduRj6Gmy1zVSF6',
      'open community': 'N/A'
    },
    projectDuration: 'Old'
  },
  {
    id: 'coinburp',
    name: 'COINBURP',
    ticketAddress: '0x62EB9234eC26DA725e90A270A452a8d6EB304b0D',
    marketAddress: '0x35CDB713a19f49F0776eaF82063e488E5424Dd5A',
    report: 'https://docsend.com/view/43mp7sa22hunrjzr',
    bgImage: 'https://drive.google.com/uc?export=view&id=1XUvbAlRWW6w6fTSmiIdEvyxfH15J8cmD',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-2ascn2dbzv',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=coinburp&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '-',
    subPublic: '-',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdIMQj466G09hqutDaGFc2GpdGLv60pbXExNMQH5yGbC0HL2O6usNUAaezOWzjDQN5PBl7Q3KeYWeN/pub?gid=95556946&single=true&output=csv',
    endDate: '1626458400',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1625666400
      },
      {
        title: 'Whitelist Close',
        date: 1625889600
      },
      {
        title: 'KYC Open',
        date: 1625976000
      },
      {
        title: 'KYC Close',
        date: 1626148800
      },
      {
        title: 'Pool Open',
        date: 1626289200
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/bu5XXJGKPDirenP69',
      gold: 'https://forms.gle/hxgijqi4bAR8zC4D8',
      pink: 'https://forms.gle/MPGy8V3s3UFQKeVe6',
      silver: 'https://forms.gle/r1BjZY3pAKwVyJqo9',
      'open community': 'https://forms.gle/2e65LTMRbUaBhU7MA',
    },
    projectDuration: 'Old'
  },
  {
    id: 'mozik',
    name: 'MOZIK',
    ticketAddress: '0xffb4ff24e76605d1bfdccb9d8f717e5c71439c2a',
    report: 'https://docsend.com/view/7s9gzzpi473cz8g5',
    bgImage: 'https://drive.google.com/uc?export=view&id=1OF96f4lAHoa9iq5yHNZUjFmpgdwpnELQ',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-i8regefqnx',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=mozik&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '109',
    subPublic: '1501',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1619928000
      },
      {
        title: 'Whitelist Open',
        date: 1619928000
      },
      {
        title: 'Pool Opens',
        date: 1620273600
      },
      {
        title: 'Pool Closes',
        date: 1620360000
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/ugsLaPEfct1pV5Wy6',
      gold: 'https://forms.gle/PRNn9Af6wPakC3m29',
      pink: 'https://forms.gle/X1vAtJMtMCYftr4j6',
      silver: 'https://forms.gle/iKq4Rmp3Vbc6msdU6',
      'open community': 'https://forms.gle/qSK77Fsq3Un7soSv8',
    },
    projectDuration: 'Old',
    // black -> gold -> pink -> silver
    ticketData: [
      {
        numTickets: 52,
        ticketsPurchased: 35,
        price: 650
      },
      {
        numTickets: 47,
        ticketsPurchased: 35,
        price: 400
      },
      {
        numTickets: 90,
        ticketsPurchased: 79,
        price: 250
      },
      {
        numTickets: 249,
        ticketsPurchased: 226,
        price: 100
      },
    ]
  },
  {
    id: 'unreal_finance',
    name: 'UNREAL FINANCE',
    ticketAddress: '0xf849e438893e2b2a591bd8e3e42e401adeb2e352',
    report: 'https://docsend.com/view/n4uha26kc7n4iu78',
    bgImage: 'https://drive.google.com/uc?export=view&id=13Efpth52zakywlAa0xxupv6jPIttbFIG',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-my0o0irfgc',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=unreal+finance&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '125',
    subPublic: '2101',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1620360000
      },
      {
        title: 'Whitelist Open',
        date: 1620360000
      },
      {
        title: 'Pool Opens',
        date: 1620705600
      },
      {
        title: 'Pool Closes',
        date: 1620792000
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/tazuDExArZCL6viD6',
      gold: 'https://forms.gle/yXE9KPFH7k5c3Mkc8',
      pink: 'https://forms.gle/QqJLhWLcyBUbiLvK9',
      silver: 'https://forms.gle/EVFv2iTvtzESMQVt7',
      'open community': 'https://forms.gle/LofBpSfNgXroVwhG9',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 53,
        ticketsPurchased: 41,
        price: 650
      },
      {
        numTickets: 57,
        ticketsPurchased: 40,
        price: 400
      },
      {
        numTickets: 89,
        ticketsPurchased: 70,
        price: 250
      },
      {
        numTickets: 245,
        ticketsPurchased: 205,
        price: 100
      },
    ]
  },
  {
    id: 'moma_protocol',
    name: 'MOMA PROTOCOL',
    ticketAddress: '0xece000cd85d38ca467a8b6f3e6a9d5c1d155ec65',
    report: 'https://docsend.com/view/y9mqu83euvrvqjry',
    bgImage: 'https://drive.google.com/uc?export=view&id=19tfQmGM0yDG5xCQwx9a4CbXFXhh_SFTH',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-lfsws4h4ac',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=moma+protocol&sort=listed_desc',
    fundsTarget: '75K',
    subPrivate: '151',
    subPublic: '6784',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1620878400
      },
      {
        title: 'Whitelist Open',
        date: 1620878400
      },
      {
        title: 'Pool Opens',
        date: 1621137600
      },
      {
        title: 'Pool Closes',
        date: 1621224000
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/AbtczoYtzP8ADScg7',
      gold: 'https://forms.gle/VK4FYuEYRP7PZVKs7',
      pink: 'https://forms.gle/2DdVpMaFaeJzpoA7A',
      silver: 'https://forms.gle/pptChBtEknbiZNG86',
      'open community': 'https://forms.gle/UgS9Pa1aQJnwtDXa6',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 40,
        ticketsPurchased: 33,
        price: 650
      },
      {
        numTickets: 37,
        ticketsPurchased: 33,
        price: 400
      },
      {
        numTickets: 64,
        ticketsPurchased: 54,
        price: 250
      },
      {
        numTickets: 178,
        ticketsPurchased: 153,
        price: 100
      },
    ]
  },
  {
    id: 'parami_protocol',
    name: 'PARAMI PROTOCOL',
    ticketAddress: '0x97f945cdd7827579e458502d7a8c9e3157604f3c',
    report: 'https://docsend.com/view/9sc28w6fx3q6fnpv',
    bgImage: 'https://drive.google.com/uc?export=view&id=18wDDVu8ZYaYghQ1ta1qgT0x2_X4Nkl17',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-2rtqqdf42t',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=parami+protocol&sort=listed_desc',
    fundsTarget: '75K',
    subPrivate: '156',
    subPublic: '5404',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1621137600
      },
      {
        title: 'Whitelist Open',
        date: 1621137600
      },
      {
        title: 'Pool Opens',
        date: 1621396800
      },
      {
        title: 'Pool Closes',
        date: 1621656000
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/nhS4rdfH7Bz9xqiu7',
      gold: 'https://forms.gle/d6hKZQJJr7TkSFEV6',
      pink: 'https://forms.gle/ic1vJMV81ZR7vrB27',
      silver: 'https://forms.gle/NJ8rp2h1tf32M1nk7',
      'open community': 'https://forms.gle/FawgTpdmaCasH4899',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 40,
        ticketsPurchased: 31,
        price: 650
      },
      {
        numTickets: 38,
        ticketsPurchased: 33,
        price: 400
      },
      {
        numTickets: 64,
        ticketsPurchased: 47,
        price: 250
      },
      {
        numTickets: 178,
        ticketsPurchased: 138,
        price: 100
      },
    ]
  },
  {
    id: 'crop_finance',
    name: 'CROP FINANCE',
    ticketAddress: '0x49ce90fd09ca07f8c16e073d193df5c7ed1be655',
    report: 'https://docsend.com/view/ezpkjvq75sz4jkme',
    bgImage: 'https://drive.google.com/uc?export=view&id=1lU9jXidhvVhyNf1NKoOFWPsy5qOzeb8g',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-wtvwfhctwv',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=crop+finance&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '127',
    subPublic: '2253',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1621310400
      },
      {
        title: 'Whitelist Open',
        date: 1621310400
      },
      {
        title: 'Pool Opens',
        date: 1621915200
      },
      {
        title: 'Pool Closes',
        date: 1622001600
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/sjuQUQpgJAhwSbzB9',
      gold: 'https://forms.gle/ANYNi4GDe8d9sEPr8',
      pink: 'https://forms.gle/tKYx8T4tFLrD62Pz9',
      silver: 'https://forms.gle/X1u35nV3P7zTevmd9',
      'open community': 'https://forms.gle/Kzk1KfNmt96sWokX8',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 45,
        ticketsPurchased: 41,
        price: 650
      },
      {
        numTickets: 55,
        ticketsPurchased: 37,
        price: 400
      },
      {
        numTickets: 85,
        ticketsPurchased: 67,
        price: 250
      },
      {
        numTickets: 275,
        ticketsPurchased: 192,
        price: 100
      },
    ]
  },
  {
    id: 'dapp_list',
    name: 'THE DAPP LIST',
    ticketAddress: '0x266820432937e9437f5cdb1b8e2357ae1588096a',
    report: 'https://docsend.com/view/wzm8yjakjwp7xrkp',
    bgImage: 'https://drive.google.com/uc?export=view&id=1gv9H2emy3w_3g0Q35pplkB4fy_ZFz1gP',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-rtvjv6hoqu',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=the+dapp+list&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '194',
    subPublic: '3713',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1621828800
      },
      {
        title: 'Whitelist Open',
        date: 1621828800
      },
      {
        title: 'Pool Opens',
        date: 1622088000
      },
      {
        title: 'Pool Closes',
        date: 1622174400
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/4xNvU2QmjBbvBkyP66',
      gold: 'https://forms.gle/j92Dk2DyTrhfdveJ8',
      pink: 'https://forms.gle/6EbtcY6RTdS4TgnM9',
      silver: 'https://forms.gle/ooZjSRik7NdGbFZq7',
      'open community': 'https://forms.gle/pykYHgaqvUrKNNQ48',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 32,
        ticketsPurchased: 24,
        price: 650
      },
      {
        numTickets: 22,
        ticketsPurchased: 18,
        price: 400
      },
      {
        numTickets: 38,
        ticketsPurchased: 29,
        price: 250
      },
      {
        numTickets: 109,
        ticketsPurchased: 90,
        price: 100
      },
    ]
  },
  {
    id: 'rebaked',
    name: 'REBAKED',
    ticketAddress: '0x0018a411c2b57474218be2ded576d10ed748f3d2',
    report: 'https://docsend.com/view/crfqssrefikmpbtn',
    bgImage: 'https://drive.google.com/uc?export=view&id=11C4F0Gv3z4lls3VzZy3NCDS3v1Egggko',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-q70g3slbqp',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=rebaked&sort=listed_desc',
    fundsTarget: '100K',
    subPrivate: '110',
    subPublic: '1453',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1622952000
      },
      {
        title: 'Whitelist Open',
        date: 1622952000
      },
      {
        title: 'Pool Opens',
        date: 1623384000
      },
      {
        title: 'Pool Closes',
        date: 1623470400
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/czPiAo5gEoCQssbJ7',
      gold: 'https://forms.gle/bDr2QwbsckRnsYzn7',
      pink: 'https://forms.gle/G1cn138vU6NqhB7N8',
      silver: 'https://forms.gle/RkVSmcdUNVd48RBw5',
      'open community': 'https://forms.gle/xSwb4Re6VC1tujRY9',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 55,
        ticketsPurchased: 35,
        price: 650
      },
      {
        numTickets: 65,
        ticketsPurchased: 37,
        price: 400
      },
      {
        numTickets: 75,
        ticketsPurchased: 64,
        price: 250
      },
      {
        numTickets: 195,
        ticketsPurchased: 130,
        price: 100
      },
    ]
  },
  {
    id: 'bacondao',
    name: 'BACONDAO',
    ticketAddress: '0x4937c9b011350058a1d4d3c4f8d51870a7a45f3a',
    report: 'https://docsend.com/view/bc77fuix6t739fa5',
    bgImage: 'https://drive.google.com/uc?export=view&id=1VsqvOaIMojSLD8VWXjKdVNrhkbnmlI6J',
    openSeaURL: 'https://opensea.io/assets/unidentified-contract-wkccnfypy9',
    nfTradeURL: 'https://app.nftrade.com/store/genesis-shards?search=bacondao&sort=listed_desc',
    fundsTarget: '80K',
    subPrivate: '123',
    subPublic: '4029',
    endDate: '1626375565',
    timeline: [
      {
        title: 'Project Launch',
        date: 1623816000
      },
      {
        title: 'Whitelist Open',
        date: 1623816000
      },
      {
        title: 'Pool Opens',
        date: 1624075200
      },
      {
        title: 'Pool Closes',
        date: 1624248000
      },
    ],
    whitelistForm: {
      black: 'https://forms.gle/x5K4vT96BQGzRcRH8',
      gold: 'https://forms.gle/Crgd5vc5GqRYrvNx9',
      pink: 'https://forms.gle/EVfXaLqv9kCYmbXh9',
      silver: 'https://forms.gle/81TTFt7WwD83Rhe4A',
      'open community': 'https://forms.gle/1XdmzUqLpeYL7E3HA',
    },
    projectDuration: 'Old',
    ticketData: [
      {
        numTickets: 50,
        ticketsPurchased: 48,
        price: 650
      },
      {
        numTickets: 45,
        ticketsPurchased: 42,
        price: 400
      },
      {
        numTickets: 70,
        ticketsPurchased: 49,
        price: 250
      },
      {
        numTickets: 120,
        ticketsPurchased: 107,
        price: 100
      },
    ]
  },
]

export const PROJECTS_DATA_GOERLI_FOR_GENPAD: BaseProject[] = [
  {
    id: 'supernova',
    name: 'SUPERNOVA - PAST',
    ticketAddress: '0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    marketAddress: '0x305684Cd6d02f2Fe2e139A22969C3f7AeE5B6CA5',
    //genNFTAddress: '',
    //dexAddress: '0xF71D76292E667914Dd4c04831cDb3406354581F8',//'0xACD87404B7BDDDB36dadCb6691b627d023c3152a',
    report: 'https://docsend.com/view/xae8jnstd38ar7ip',
    bgImage: 'https://drive.google.com/uc?export=view&id=1cEV2FmgkIgZg4qUSr8quVjV979hgsSU9',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQV-C8xp8EGP7ScF9FR3oTEIUnqV9qaSJx0Iw85Sxyv9cK_Vcco8CUNMYHnkn-DkmGz84ONMdjYlZTe/pub?gid=95556946&single=true&output=csv',
    endDate: '1648731600',
    startDate: '1647867600',
    preIdo: '1648472400',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1647867600
      },
      {
        title: 'Whitelist Close',
        date: 1648126800
      },
      {
        title: 'KYC Open',
        date: 1648213200
      },
      {
        title: 'KYC Close',
        date: 1648299600
      },
      {
        title: 'Pool Open',
        date: 1648472400
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/vDSniMqw2eqKzSAZ9',
      gold: 'https://forms.gle/MoUa7npj8FRjuq938',
      pink: 'https://forms.gle/dL1GxRJKe3jfjDMr5',
      silver: 'https://forms.gle/W45EFxBNUscg5ENh6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'ProjectX',
    name: 'Project X',
    ticketAddress: '0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    marketAddress: '0x305684Cd6d02f2Fe2e139A22969C3f7AeE5B6CA5',
    //genNFTAddress: '',
    //dexAddress: '0xF71D76292E667914Dd4c04831cDb3406354581F8',//'0xACD87404B7BDDDB36dadCb6691b627d023c3152a',
    report: 'https://docsend.com/view/xae8jnstd38ar7ip',
    bgImage: 'https://drive.google.com/uc?export=view&id=1cEV2FmgkIgZg4qUSr8quVjV979hgsSU9',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQV-C8xp8EGP7ScF9FR3oTEIUnqV9qaSJx0Iw85Sxyv9cK_Vcco8CUNMYHnkn-DkmGz84ONMdjYlZTe/pub?gid=95556946&single=true&output=csv',
    endDate: '1681304400',
    startDate: '1680786000',
    preIdo: '1681131600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1680786000
      },
      {
        title: 'Whitelist Close',
        date: 1680958800
      },
      {
        title: 'KYC Open',
        date: 1681045200
      },
      {
        title: 'KYC Close',
        date: 1681131600
      },
      {
        title: 'Pool Open',
        date: 1681131600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/vDSniMqw2eqKzSAZ9',
      gold: 'https://forms.gle/MoUa7npj8FRjuq938',
      pink: 'https://forms.gle/dL1GxRJKe3jfjDMr5',
      silver: 'https://forms.gle/W45EFxBNUscg5ENh6',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  },
  {
    id: 'sugarkingdom',
    name: 'SUGAR KINGDOM - LIVE',
    ticketAddress: '0xACD87404B7BDDDB36dadCb6691b627d023c3152a',
    //genNFTAddress: '',
    //dexAddress: '0x33F0DE63E15990a6312e24F620aE8b1088Af35F2',//'0xACD87404B7BDDDB36dadCb6691b627d023c3152a',
    report: 'https://docsend.com/view/mf3jq976ms796ac5',
    bgImage: 'https://drive.google.com/uc?export=view&id=1dEGjXIlqyeHiMI7O4NbcZfW9IwqtcmzY',
    openSeaURL: '',
    nfTradeURL: 'https://nftrade.com/assets/bsc/0x7bDE51CbBb56F1E5d9A5f6A22dD0c11cA8faE3cd',
    fundsTarget: '100K',
    subPrivate: '0',
    subPublic: '0',
    subSheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8MItirIRDgkcLMBcINcXS-jUY9QWYtsvghF6QYXqOsfshO5bNNPAnBtvykXPVyXKiAIe2ZurOghfP/pub?gid=95556946&single=true&output=csv',
    endDate: '1650027600',
    startDate: '1648818000',
    preIdo: '1649757600',
    timeline: [
      {
        title: 'Whitelist Open',
        date: 1648818000
      },
      {
        title: 'Whitelist Close',
        date: 1649422800
      },
      {
        title: 'KYC Open',
        date: 1649509200
      },
      {
        title: 'KYC Close',
        date: 1649595600
      },
      {
        title: 'Pool Open',
        date: 1649757600
      }
    ],
    whitelistForm: {
      black: 'https://forms.gle/wwUrh3GD5nYX3rs79',
      gold: 'https://forms.gle/sBPUUAS1d9fgczybA',
      pink: 'https://forms.gle/AAUzqakShwUdBaky6',
      silver: 'https://forms.gle/MTzVC1QmLneGUH8j8',
      'open community': 'N/A'
    },
    projectDuration: 'New'
  }
]

export const GEN_ACCESS_ADDRESS = process.env.REACT_APP_GEN_ACCESS_ADDRESS!


export const GEN_SHARDS_ADDRESS = process.env.REACT_APP_GEN_SHARDS_ADDRESS!
export const GEN_SHARDS_ADDRESS_BSC = process.env.REACT_APP_GEN_SHARDS_ADDRESS_BSC!
export const GEN_SHARDS_ADDRESS_MATIC = process.env.REACT_APP_GEN_SHARDS_ADDRESS_MATIC!
export const GEN_SHARDS_ADDRESS_IOTEX = process.env.REACT_APP_GEN_SHARDS_ADDRESS_IOTEX!
export const GEN_SHARDS_ADDRESS_HARMONY = process.env.REACT_APP_GEN_SHARDS_ADDRESS_HARMONY!
export const GEN_SHARDS_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_SHARDS_ADDRESS_AVALANCHE!
export const GEN_SHARDS_ADDRESS_GOERLI = process.env.REACT_APP_GEN_SHARDS_ADDRESS_GOERLI!
export const GEN_SHARDS_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_SHARDS_ADDRESS_MUMBAI!
export const GEN_SHARDS_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_SHARDS_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_SHARDS_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_SHARDS_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_SHARDS_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_SHARDS_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_SHARDS_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_SHARDS_ADDRESS_BSC_NETWORK_TESTNET!

export const GEN_FACTORY_ADDRESS = process.env.REACT_APP_GEN_FACTORY_ADDRESS!
export const GEN_FACTORY_ADDRESS_BSC = process.env.REACT_APP_GEN_FACTORY_ADDRESS_BSC!
export const GEN_FACTORY_ADDRESS_MATIC = process.env.REACT_APP_GEN_FACTORY_ADDRESS_MATIC!
export const GEN_FACTORY_ADDRESS_IOTEX = process.env.REACT_APP_GEN_FACTORY_ADDRESS_IOTEX!
export const GEN_FACTORY_ADDRESS_HARMONY = process.env.REACT_APP_GEN_FACTORY_ADDRESS_HARMONY!
export const GEN_FACTORY_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_FACTORY_ADDRESS_AVALANCHE!
export const GEN_FACTORY_ADDRESS_GOERLI = process.env.REACT_APP_GEN_FACTORY_ADDRESS_GOERLI!
export const GEN_FACTORY_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_FACTORY_ADDRESS_MUMBAI!
export const GEN_FACTORY_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_FACTORY_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_FACTORY_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_FACTORY_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_FACTORY_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_FACTORY_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_FACTORY_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_FACTORY_ADDRESS_BSC_NETWORK_TESTNET!

export const GEN_NFT_MARKETPLACE_ADDRESS = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS!
export const GEN_NFT_MARKETPLACE_ADDRESS_BSC = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_BSC!
export const GEN_NFT_MARKETPLACE_ADDRESS_MATIC = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_MATIC!
export const GEN_NFT_MARKETPLACE_ADDRESS_IOTEX = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_IOTEX!
export const GEN_NFT_MARKETPLACE_ADDRESS_HARMONY = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_HARMONY!
export const GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE!
export const GEN_NFT_MARKETPLACE_ADDRESS_GOERLI = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_GOERLI!
export const GEN_NFT_MARKETPLACE_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_MUMBAI!
export const GEN_NFT_MARKETPLACE_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_ADDRESS_BSC_NETWORK_TESTNET!


// weth address
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_MATIC = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_MATIC!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_GOERLI = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_GOERLI!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_MUMBAI!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC_NETWORK_TESTNET!


export const GEN_TELEGRAM_ADDRESS = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS!
export const GEN_TELEGRAM_ADDRESS_BSC = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_BSC!
export const GEN_TELEGRAM_ADDRESS_MATIC = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_MATIC!
export const GEN_TELEGRAM_ADDRESS_IOTEX = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_IOTEX!
export const GEN_TELEGRAM_ADDRESS_HARMONY = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_HARMONY!
export const GEN_TELEGRAM_ADDRESS_AVALANCHE = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_AVALANCHE!
export const GEN_TELEGRAM_ADDRESS_GOERLI = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_GOERLI!
export const GEN_TELEGRAM_ADDRESS_MUMBAI = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_MUMBAI!
export const GEN_TELEGRAM_ADDRESS_IOTEX_NETWORK_TESTNET = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_IOTEX_NETWORK_TESTNET!
export const GEN_TELEGRAM_ADDRESS_HARMONY_NETWORK_TESTNET = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_HARMONY_NETWORK_TESTNET!
export const GEN_TELEGRAM_ADDRESS_AVALANCHE_NETWORK_TESTNET = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_AVALANCHE_NETWORK_TESTNET!
export const GEN_TELEGRAM_ADDRESS_BSC_NETWORK_TESTNET = process.env.REACT_APP_GEN_TELEGRAM_ADDRESS_BSC_NETWORK_TESTNET!

export const GEN_TICKET_ADDRESS = process.env.REACT_APP_GEN_TICKET_ADDRESS!

export const GEN_KARMA_GOERLI = process.env.REACT_APP_GEN_KARMA_GOERLI!

// export const GEN_MARKET_FACTORY_ADDRESS = process.env.REACT_APP_GEN_MARKET_FACTORY_ADDRESS!
// export const GEN_MARKET_FACTORY_BSC = process.env.REACT_APP_GEN_MARKET_FACTORY_BSC!
// export const GEN_MARKET_FACTORY_MATIC = process.env.REACT_APP_GEN_MARKET_FACTORY_MATIC!

//GEN_SHARDS address by chain id
export const GS_ADDRESS = {
  [NetworkSymbol.ETH]: GEN_SHARDS_ADDRESS,
  [NetworkSymbol.BSC]: GEN_SHARDS_ADDRESS_BSC,
  [NetworkSymbol.MATIC]: GEN_SHARDS_ADDRESS_MATIC,
  [NetworkSymbol.IOTEX]: GEN_SHARDS_ADDRESS_IOTEX,
  [NetworkSymbol.HARMONY]: GEN_SHARDS_ADDRESS_HARMONY,
  [NetworkSymbol.AVALANCHE]: GEN_SHARDS_ADDRESS_AVALANCHE,
  [NetworkSymbol.GOERLI]: GEN_SHARDS_ADDRESS_GOERLI,
  [NetworkSymbol.MUMBAI]: GEN_SHARDS_ADDRESS_MUMBAI,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: GEN_SHARDS_ADDRESS_IOTEX_NETWORK_TESTNET,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: GEN_SHARDS_ADDRESS_HARMONY_NETWORK_TESTNET,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: GEN_SHARDS_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: GEN_SHARDS_ADDRESS_BSC_NETWORK_TESTNET
}

//gen factory contracts
export const FACTORY_ADDRESS = {
  [NetworkSymbol.ETH]: GEN_FACTORY_ADDRESS,
  [NetworkSymbol.BSC]: GEN_FACTORY_ADDRESS_BSC,
  [NetworkSymbol.MATIC]: GEN_FACTORY_ADDRESS_MATIC,
  [NetworkSymbol.IOTEX]: GEN_FACTORY_ADDRESS_IOTEX,
  [NetworkSymbol.HARMONY]: GEN_FACTORY_ADDRESS_HARMONY,
  [NetworkSymbol.AVALANCHE]: GEN_FACTORY_ADDRESS_AVALANCHE,
  [NetworkSymbol.GOERLI]: GEN_FACTORY_ADDRESS_GOERLI,
  [NetworkSymbol.MUMBAI]: GEN_FACTORY_ADDRESS_MUMBAI,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: GEN_FACTORY_ADDRESS_IOTEX_NETWORK_TESTNET,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: GEN_FACTORY_ADDRESS_HARMONY_NETWORK_TESTNET,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: GEN_FACTORY_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: GEN_FACTORY_ADDRESS_BSC_NETWORK_TESTNET
}

//genNFTMarketPlace 
export const GEN_NFT_MARKETPLACE_ADDRESS_DATA = {
  [NetworkSymbol.ETH]: GEN_NFT_MARKETPLACE_ADDRESS,
  [NetworkSymbol.BSC]: GEN_NFT_MARKETPLACE_ADDRESS_BSC,
  [NetworkSymbol.MATIC]: GEN_NFT_MARKETPLACE_ADDRESS_MATIC,
  [NetworkSymbol.IOTEX]: GEN_NFT_MARKETPLACE_ADDRESS_IOTEX,
  [NetworkSymbol.HARMONY]: GEN_NFT_MARKETPLACE_ADDRESS_HARMONY,
  [NetworkSymbol.AVALANCHE]: GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE,
  [NetworkSymbol.GOERLI]: GEN_NFT_MARKETPLACE_ADDRESS_GOERLI,
  [NetworkSymbol.MUMBAI]: GEN_NFT_MARKETPLACE_ADDRESS_MUMBAI,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_ADDRESS_IOTEX_NETWORK_TESTNET,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_ADDRESS_HARMONY_NETWORK_TESTNET,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_ADDRESS_BSC_NETWORK_TESTNET
}

//weth Address 
export const GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA = {
  [NetworkSymbol.ETH]: GEN_NFT_MARKETPLACE_WETH_ADDRESS,
  [NetworkSymbol.BSC]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC,
  [NetworkSymbol.MATIC]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_MATIC,
  [NetworkSymbol.IOTEX]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX,
  [NetworkSymbol.HARMONY]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY,
  [NetworkSymbol.AVALANCHE]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE,
  [NetworkSymbol.GOERLI]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_GOERLI,
  [NetworkSymbol.MUMBAI]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_MUMBAI,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_IOTEX_NETWORK_TESTNET,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_HARMONY_NETWORK_TESTNET,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: GEN_NFT_MARKETPLACE_WETH_ADDRESS_BSC_NETWORK_TESTNET
}
// tg contracts
export const TG_ADDRESS = {
  [NetworkSymbol.ETH]: GEN_TELEGRAM_ADDRESS,
  [NetworkSymbol.BSC]: GEN_TELEGRAM_ADDRESS_BSC,
  [NetworkSymbol.MATIC]: GEN_TELEGRAM_ADDRESS_MATIC,
  [NetworkSymbol.IOTEX]: GEN_TELEGRAM_ADDRESS_IOTEX,
  [NetworkSymbol.HARMONY]: GEN_TELEGRAM_ADDRESS_HARMONY,
  [NetworkSymbol.AVALANCHE]: GEN_TELEGRAM_ADDRESS_AVALANCHE,
  [NetworkSymbol.GOERLI]: GEN_TELEGRAM_ADDRESS_GOERLI,
  [NetworkSymbol.MUMBAI]: GEN_TELEGRAM_ADDRESS_MUMBAI,
  [NetworkSymbol.IOTEX_NETWORK_TESTNET]: GEN_TELEGRAM_ADDRESS_IOTEX_NETWORK_TESTNET,
  [NetworkSymbol.HARMONY_NETWORK_TESTNET]: GEN_TELEGRAM_ADDRESS_HARMONY_NETWORK_TESTNET,
  [NetworkSymbol.AVALANCHE_NETWORK_TESTNET]: GEN_TELEGRAM_ADDRESS_AVALANCHE_NETWORK_TESTNET,
  [NetworkSymbol.BSC_NETWORK_TESTNET]: GEN_TELEGRAM_ADDRESS_BSC_NETWORK_TESTNET
}

export const DEFAULT_URI = 'https://cloudfront.genshards.com/default/{id}.json'
export const GEN_TICKET_URL =
  'https://cloudfront.genshards.com/gentickets/{index}.json'

export const FROM_BLOCK = 8172143

export const FROM_BLOCK_BSC = 7808450

export const DAI = new Token(
  ChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(
  ChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDT = new Token(
  ChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const COMP = new Token(
  ChainId.MAINNET,
  '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  18,
  'COMP',
  'Compound'
)
export const MKR = new Token(
  ChainId.MAINNET,
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  18,
  'MKR',
  'Maker'
)
export const AMPL = new Token(
  ChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const WBTC = new Token(
  ChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS =
  AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    UNI_ADDRESS,
    18,
    'UNI',
    'Uniswap'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    UNI_ADDRESS,
    18,
    'UNI',
    'Uniswap'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    UNI_ADDRESS,
    18,
    'UNI',
    'Uniswap'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock',
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [
    ...WETH_ONLY[ChainId.MAINNET],
    DAI,
    USDC,
    USDT,
    COMP,
    MKR,
    WBTC,
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
  },
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
}

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][]
} = {
  [ChainId.MAINNET]: [
    [
      new Token(
        ChainId.MAINNET,
        '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
        8,
        'cDAI',
        'Compound Dai'
      ),
      new Token(
        ChainId.MAINNET,
        '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
        8,
        'cUSDC',
        'Compound USD Coin'
      ),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: injected,
  //   name: 'Injected',
  //   iconName: 'arrow-right.svg',
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true
  // },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}
