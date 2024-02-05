import React, { useState, useEffect, useCallback } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Select from 'react-select'
import * as Yup from 'yup'

import PropertyModal from '../mintNFT/modals/PropertyModal'
import StatsModal from '../mintNFT/modals/StatsModal'
import LevelsModal from '../mintNFT/modals/LevelsModal'
import { abi as GEN_NFT_OPEN_STORE_ERC721_ABI } from '../../contracts/GenShardsOpenStoreERC721.json'
import { abi as GEN_NFT_OPEN_STORE_ERC1155_ABI } from '../../contracts/GenShardsOpenStoreERC1155.json'
import { useHistory, useRouteMatch } from 'react-router-dom'
import './style.scss'
import CreateCollectionModal from '../mintNFT/modals/CreateCollectionModal/CreateCollectionModal'
import ReactImageUploading from 'react-images-uploading'
import {
    getBlockchainListData,
    getCollectionListData,
    postMintNFTCallBack,
} from '../mintNFT/API/ApiCall'
import { useActiveWeb3React } from '../../hooks/web3'
import { apiBaseUrl, REACT_APP_IS_TEST_MODE } from '../../constants'
import { useAddPopup } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import LoaderComp from '../../shared/components/LoaderComponent'
import Twitter from '../../images/profile/twitter-white.svg'
import Instagram from '../../images/profile/instagram.svg'
import Internet from '../../images/profile/internet-white.svg'
import Copy from '../../images/profile/copy.svg'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../state'
import { saveUserToken } from '../../state/user/actions'
import useUserAuth from '../../hooks/useUserAuth'
import {
    LoginSocialInstagram,
    LoginSocialTwitter,
    IResolveParams,
  } from 'reactjs-social-login'

const arrayOfMainNetBlockchains = [
    { value: '56', label: 'Binance Smart Chain', src: '/images/bnb-icon.png' },
    { value: '1', label: 'Ethereum', src: '/images/ETH.svg' },
    { value: '137', label: 'Polygon(Matic)', src: '/images/matic_.png' },
    {
        value: '1666600000',
        label: 'Harmony One',
        src: '/images/harmony-one-logo-final.png',
    },
    {
        value: '43114',
        label: 'Avalanche',
        src: '/images/avalanche-avax-logo-final.png',
    },
    { value: '4689', label: 'Iotex', src: '/images/BSC.svg' },
]

const initialValues = {
    nftAssetFile: [],
    name: '',
    externalLink: '',
    description: '',
    collection: {},
    properties: '',
    levels: '',
    stats: '',
    chain: '',
    unlockableContent: '',
    unlockableContentData: '',
    explicitSensitiveContent: '',
    supply: 1,
    freezeMetadata: ''
}

const supportedFormats = [
    'JPG',
    'PNG',
    'MP4',
    'WEBM',
    'MP3',
    'WAV',
    'OGG',
    'GLB',
    'GLTF',
]

const Userprofile = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { library, chainId, account } = useActiveWeb3React()
    const [propertyData, setPropertyData] = useState([
        { id: 1, type: '', name: '' },
    ])
    const [levelsData, setLevelsData] = useState([
        { id: 1, name: '', of: '', total: '' },
    ])
    const [statsData, setStatsData] = useState([
        { id: 1, name: '', of: '', total: '' },
    ])
    const [propertyModal, setPropertyModal] = useState(false)
    const [levelsModal, setLevelsModal] = useState(false)
    const [statsModal, setStatsModal] = useState(false)
    const [createCollection, setCreateCollection] = useState(false)
    const [collectionObj, setCollectionObj] = useState({})
    const [listOfBlockchains, setListOfBlockchains] = useState<any[]>([])
    const [listOfCollections, setListOfCollections] = useState<any[]>([])
    const [collectionUpdate, setCollectionUpdate] = useState(false)

    const propertyModalToggle = () => setPropertyModal(!propertyModal)
    const levelsModalToggle = () => setLevelsModal(!levelsModal)
    const statsModalToggle = () => setStatsModal(!statsModal)
    const createCollectionToggle = () => setCreateCollection(!createCollection)

    const addErrorPopup = useAddPopup()
    const [msg, setMsg] = useState('Please Wait')
    const addTransaction = useTransactionAdder()
    const [isLoading, setIsLoading] = useState(false)

    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    // const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()
    

    
// social
const [provider, setProvider] = useState('')
const [profile, setProfile] = useState<any>()

const onLogoutSuccess = useCallback(() => {
    setProfile(null)
    setProvider('')
    alert('logout success')
  }, [])

const REDIRECT_URI = 'https://plenty-planets-beam-42-118-51-2.loca.lt/account/login'

const onLoginStart = useCallback(() => {
    alert('login start')
}, [])
    // useEffect(() => {
    //     if (account && account !== storedAddress && library) {
    //         getUserAuthToken()
    //     }
    // }, [account, library, storedAddress])

    const updateUserProfile = () => {

    }

    // const getBlockchainData = async () => {
    //     if (chainId) {
    //         console.log('chainIdchainId', chainId)
    //         let chainType =
    //             Boolean(REACT_APP_IS_TEST_MODE) === false ? 'mainnet' : 'testnet'
    //         await getBlockchainListData(chainType)
    //             .then((res) => {
    //                 if (res?.status === 200) {
    //                     console.log('getBlockchainData', res.data.values || [])
    //                     setListOfBlockchains(res.data.values || [])
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(
    //                     err.message || 'Error while fetching Collection Categories '
    //                 )
    //             })
    //     }
    // }

    // const getCollectionData = async () => {
    //     if (chainId) {
    //         var userId = '632b33b6744231ff68b9bd11'
    //         console.log('userId', userId)
    //         await getCollectionListData(userId)
    //             .then((res) => {
    //                 if (res?.status === 200) {
    //                     console.log('getCollectionData', res.data.values || [])
    //                     setListOfCollections(res.data.values || [])
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(
    //                     err.message || 'Error while fetching Collection Categories '
    //                 )
    //             })
    //     }
    // }

    // const handleMintNFTBlockchain = async (collectionAddress: string, nftTokenId: number, collectionAssetType: number, supply: number) => {

    //     console.log('collectionAddressMinting', collectionAddress)

    //     let estimate,
    //         method: (...args: any) => Promise<TransactionResponse>,
    //         args: Array<number | string | BigNumber>,
    //         value: BigNumber | null

    //     const market = getContract(collectionAddress, collectionAssetType == 1 ? GEN_NFT_OPEN_STORE_ERC721_ABI : GEN_NFT_OPEN_STORE_ERC1155_ABI, library!, account!)
    //     method = market.mint
    //     estimate = market.estimateGas.mint
    //     if (collectionAssetType == 1) {
    //         args = [
    //             account!
    //         ]
    //     }
    //     else {
    //         args = [
    //             account!,
    //             supply,
    //             "0x00"
    //         ]
    //     }

    //     console.log("mint nft data BC", args)

    //     await estimate(...args, {})
    //         .then(estimatedGasLimit =>
    //             method(...args, {
    //                 ...({}),
    //                 gasLimit: calculateGasMargin(estimatedGasLimit)
    //             })
    //                 .then(async (response: any) => {
    //                     const waitResponse = await response.wait()
    //                     setIsLoading(false)
    //                     setMsg("Please Wait")
    //                     if (waitResponse.status) {
    //                         addTransaction(response, {
    //                             summary:
    //                                 'NFT Minted Successfully.'
    //                         })
    //                         history.push(`/assets/${collectionAddress}/${nftTokenId}`)
    //                     }
    //                     else {
    //                         addErrorPopup({
    //                             txn: {
    //                                 hash: '',
    //                                 success: false,
    //                                 summary: 'Unable to processed your request on this time. Please try again later.',
    //                                 description: '',
    //                                 withExternalLink: false,
    //                             }
    //                         })
    //                     }
    //                 })
    //                 .catch((err: any) => {
    //                     setIsLoading(false)
    //                     setMsg("Please Wait")
    //                     console.log('error create Collection failed11', err)
    //                     let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3)
    //                     if (err.code === -32603) { }
    //                     else if (err.code !== 4001) e = JSON.parse(e)
    //                     addErrorPopup({
    //                         txn: {
    //                             hash: '',
    //                             success: false,
    //                             summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
    //                             description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
    //                             withExternalLink: false,
    //                         }
    //                     })
    //                 })
    //         )
    //         .catch((err: any) => {
    //             setIsLoading(false)
    //             setMsg("Please Wait")
    //             console.log('inner create Collection error', err)
    //             let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3)
    //             if (err.code === -32603) { }
    //             else if (err.code !== 4001) e = JSON.parse(e)
    //             addErrorPopup({
    //                 txn: {
    //                     hash: '',
    //                     success: false,
    //                     summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
    //                     description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
    //                     withExternalLink: false,
    //                 }
    //             })
    //         })
    // }

    // const handleApproveCheckAndMintNFT = async (values: any) => {

    //     if (!library || !chainId || !account) return
    //     const isError = {
    //         msg: '',
    //         error: false
    //     }

    //     console.log('values?.collection', values?.collection)

    //     var userId = "632b33b6744231ff68b9bd11"
    //     if (values.nftAssetFile.length <= 0) {
    //         isError.msg = `Please select and upload the required NFT Asset File.`
    //         isError.error = true
    //     }
    //     else if (values.name.length <= 5) {
    //         isError.msg = `NFT Name is required and it must be UNIQUE  and more than 5 characters.`
    //         isError.error = true
    //     }
    //     else if (Object.keys(values?.collection).length === 0) {
    //         isError.msg = `Please your collection from list or Create New One.`
    //         isError.error = true
    //     }
    //     else if (Number(values?.supply) < 1) {
    //         isError.msg = `Please add the supply values(Number of items you wanted to be minted). It should be minimum 1.`
    //         isError.error = true
    //     }
    //     else if (Number(values?.collection.assetType) === 1 && (Number(values?.supply) < 1 || Number(values?.supply) > 1)) {
    //         isError.msg = `You can not select more than 1 supply for ERC721 Contact.`
    //         isError.error = true
    //     }

    //     isError.error && addErrorPopup({
    //         txn: {
    //             hash: '',
    //             success: false,
    //             summary: isError.msg,
    //             description: '',
    //             withExternalLink: false,
    //         }
    //     })

    //     if (!isError.error) {
    //         setIsLoading(true)
    //         setMsg("Minting NFT")
    //         try {
    //             if (account === undefined) return

    //             var propertyObjArray = [] as any
    //             for (var i = 0 i < propertyData.length i++) {
    //                 if (propertyData[i].type.trim().length > 0 && propertyData[i].name.trim().length > 0) {
    //                     propertyObjArray.push({ type: propertyData[i].type, name: propertyData[i].name })
    //                 }
    //             }
    //             console.log('propertyObjArray', propertyObjArray)

    //             var levelsObjArray = [] as any
    //             for (var i = 0 i < levelsData.length i++) {
    //                 if (levelsData[i].name.trim().length > 0 && Number(levelsData[i].of) > 0 && Number(levelsData[i].total) > 0) {
    //                     levelsObjArray.push({ name: levelsData[i].name, min: levelsData[i].of, max: levelsData[i].total })
    //                 }
    //             }
    //             console.log('levelsObjArray', levelsObjArray)

    //             var statsObjArray = [] as any
    //             for (var i = 0 i < statsData.length i++) {
    //                 if (statsData[i].name.trim().length > 0 && Number(statsData[i].of) > 0 && Number(statsData[i].total) > 0) {
    //                     statsObjArray.push({ name: statsData[i].name, min: statsData[i].of, max: statsData[i].total })
    //                 }
    //             }
    //             console.log('statsObjArray', statsObjArray)

    //             console.log('nftAssetFile[0]', values?.nftAssetFile[0], values?.explicitSensitiveContent)

    //             let isExplicitAndSensitiveContent = (values?.explicitSensitiveContent === '' || values?.explicitSensitiveContent === false) ? false : true

    //             console.log('All Data : ', values?.name, userId, values?.collection?._id, values?.nftAssetFile[0], Number(values?.collection?.chainId), values?.description, propertyObjArray, levelsObjArray, statsObjArray, values?.externalLink, values?.unlockableContentData, isExplicitAndSensitiveContent, Number(values?.supply || 0))

    //             await postMintNFTCallBack(values?.name, userId, values?.collection?._id, values?.nftAssetFile[0], Number(values?.collection?.chainId), values?.description, propertyObjArray, levelsObjArray, statsObjArray, values?.externalLink, values?.unlockableContentData, isExplicitAndSensitiveContent, Number(values?.supply || 0)).then(async (res: any) => {
    //                 if (res?.status === 200) {
    //                     await handleMintNFTBlockchain(values?.collection?.collectionAddress, res?.values?.nftTokenId, values?.collection?.assetType, Number(values?.supply || 0))
    //                 }
    //                 else {
    //                     setIsLoading(false)
    //                     setMsg("Please Wait")
    //                     addErrorPopup({
    //                         txn: {
    //                             hash: '',
    //                             success: false,
    //                             summary: 'Unable to processed your request on this time. Please try again later.',
    //                             description: '',
    //                             withExternalLink: false,
    //                         }
    //                     })
    //                 }
    //             })

    //         } catch (error) {
    //             setIsLoading(false)
    //             setMsg("Please Wait")
    //         }
    //     }
    // }

    // useEffect(() => {
    //     getBlockchainData()
    //     getCollectionData()
    // }, [REACT_APP_IS_TEST_MODE, collectionUpdate])

    const validationSchema = Yup.object({
        // file: Yup.mixed()
        //     .nullable()
        //     .required()
        //     .test("FILE_SIZE", "Uploaded file is too big.",
        //         value => !value || (value && value.size <= 100000))
        //     .test("FILE_FORMAT", "Uploaded file has unsupported format.",
        //         value => !value || (value && supportedFormats.includes(value.type))),
        name: Yup.string().required("name is required"),
    })

    // const loadingMessage = isAuthLoader ? authLoaderMsg : msg
    
    
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')
    const [walletaddress, setWalletaddress] = useState('')
    
    return (
        <div className="user-profile-page mint-nft-page">
            {/* {isLoading && ( */}
            <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />
            {/* )} */}
            <div className="user-profile-page-wrapper">
                <div className="user-profile-text">Profile</div>
                <div className="create-btn-wrapper">
                    <button type="submit" className="create-btn">
                        Create
                    </button>
                </div>
                <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        console.log("values :: ", values)
                        console.log("propertyData :: ", propertyData)
                        console.log("levelsData :: ", levelsData)
                        console.log("statsData :: ", statsData)
                        console.log("collectionObj :: ", collectionObj)
                        // handleApproveCheckAndMintNFT(values)
                    }}
                >
                    {({ handleBlur, errors, values, setFieldValue }) => {
                        // const onChange = (imageList, addUpdateIndex) => {
                        //     // data for submit
                        //     console.log("imageList => ", imageList, "addUpdateIndex => ", addUpdateIndex)
                        //     // setImages(imageList)
                        //     setFieldValue("nftAssetFile", imageList)
                        // }
                        const handleSubmit = event => {
                            console.log('handleSubmit')
                            event.preventDefault() 
                            
                            console.log('name :', name)
                            console.log('bio :', bio)
                            console.log('email :', email)
                            console.log('link :', link)
                            console.log('walletadress :', walletaddress)
                        
                            // 👇️ clear all input values in the form
                            setName('')
                            setBio('')
                            setEmail('')
                            setLink('')
                            setWalletaddress('')
                          }
                        return (
                            <Form onSubmit={handleSubmit}>
                                <div className='form-controldata'>

                                    <div className="form-control-wrapper wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">Name</div>
                                        </div>
                                        <input
                                            type="text"
                                            onChange={event => setName(event.target.value)}
                                            onBlur={handleBlur}
                                            value={name}
                                            name="name"
                                            placeholder='name'
                                        />
                                        <div className="label-wrapper">
                                            <div className="main-label">Bio</div>
                                        </div>
                                        <textarea

                                            onChange={event => setBio(event.target.value)}
                                            onBlur={handleBlur}
                                            value={bio}
                                            name="bio"
                                            placeholder='Tell the world your story!'
                                        />
                                        <div className="label-wrapper">
                                            <div className="main-label">Email Address</div>
                                        </div>
                                        <input
                                            type="email"
                                            onChange={event => setEmail(event.target.value)}
                                            onBlur={handleBlur}
                                            value={email}
                                            name="email"
                                            placeholder='Enter email'
                                        />
                                        <div className="label-wrapper">
                                            <div className="main-label">Links</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                onChange={event => setLink(event.target.value)}
                                                onBlur={handleBlur}
                                                value={link}
                                                name="link"
                                                placeholder='Yoursite.com'
                                            />
                                        </div>
                                        <div className="label-wrapper">
                                            <div className="main-label">Wallet address</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                onChange={event => setWalletaddress(event.target.value)}
                                                onBlur={handleBlur}
                                                value={walletaddress}
                                                name="walletaddress"
                                                placeholder='00000x000000000000'
                                                
                                            />
                                            {/* <img src={Copy} alt="" /> */}
                                        </div>

                                        {errors && <div style={{ color: 'red' }}><ErrorMessage name="name" /></div>}
                                    </div>

                                    <div className='wrapper'>
                                        <div className="form-control-wrapper ">
                                            <div className="label-wrapper">
                                                <div className="main-label">Profile Image</div>
                                                <div className="sub-label"></div>
                                            </div>


                                            <div className="upload-area">
                                                <ReactImageUploading
                                                    value={values.nftAssetFile}
                                                    //@ts-ignore
                                                    name="file"
                                                    // onChange={onChange}
                                                    onBlur={handleBlur}
                                                    dataURLKey="data_url"
                                                    acceptType={["jpg", "jpeg", "svg", "png", "mp4", "webm", "mp3", "wav", "ogg", "glb", "gltf"]}
                                                >
                                                    {({
                                                        imageList,
                                                        onImageUpload,
                                                        onImageRemoveAll,
                                                        onImageUpdate,
                                                        onImageRemove,
                                                        isDragging,
                                                        dragProps,
                                                    }) => (
                                                        // write your building UI
                                                        <div className="upload__image-wrapper">
                                                            <button onClick={onImageUpload}
                                                                type="button"
                                                                className="profileimage-upload-btn"
                                                                //@ts-ignore
                                                                style={isDragging ? { color: "red" } : null}
                                                                {...dragProps}>

                                                                <img
                                                                    src={values.nftAssetFile?.length
                                                                        ?
                                                                        //@ts-ignore 
                                                                        values.nftAssetFile[0]?.data_url
                                                                        :
                                                                        "/images/uploadImg_small.svg"} alt="upload image" />
                                                            </button>
                                                            {
                                                                //@ts-ignore
                                                                values.nftAssetFile[0]?.data_url ? <img src="/images/icons/close.svg" alt="close" className='remove-upload--btn' onClick={onImageRemoveAll} /> : null}

                                                        </div>
                                                    )}
                                                </ReactImageUploading>
                                            </div>


                                            {errors && <div style={{ color: 'red' }}><ErrorMessage name="file" /></div>}
                                        </div>

                                        <div className="form-control-wrapper ">
                                            <div className="label-wrapper">
                                                <div className="main-label">Profile Image</div>
                                                <div className="sub-label"></div>
                                            </div>


                                            <div className="upload-area">
                                                <ReactImageUploading
                                                    value={values.nftAssetFile}
                                                    //@ts-ignore
                                                    name="file"
                                                    // onChange={onChange}
                                                    onBlur={handleBlur}
                                                    dataURLKey="data_url"
                                                    acceptType={["jpg", "jpeg", "svg", "png", "mp4", "webm", "mp3", "wav", "ogg", "glb", "gltf"]}
                                                >
                                                    {({
                                                        imageList,
                                                        onImageUpload,
                                                        onImageRemoveAll,
                                                        onImageUpdate,
                                                        onImageRemove,
                                                        isDragging,
                                                        dragProps,
                                                    }) => (
                                                        // write your building UI
                                                        <div className="upload__image-wrapper">
                                                            <button onClick={onImageUpload}
                                                                type="button"
                                                                className="bannerimage-upload-btn"
                                                                //@ts-ignore
                                                                style={isDragging ? { color: "red" } : null}
                                                                {...dragProps}>

                                                                <img
                                                                    src={values.nftAssetFile?.length
                                                                        ?
                                                                        //@ts-ignore 
                                                                        values.nftAssetFile[0]?.data_url
                                                                        :
                                                                        "/images/uploadImg.svg"} alt="upload image" />
                                                            </button>
                                                            {
                                                                //@ts-ignore
                                                                values.nftAssetFile[0]?.data_url ? <img src="/images/icons/close.svg" alt="close" className='remove-upload--btn' onClick={onImageRemoveAll} /> : null}

                                                        </div>
                                                    )}
                                                </ReactImageUploading>
                                            </div>


                                            {errors && <div style={{ color: 'red' }}><ErrorMessage name="file" /></div>}
                                        </div>


                                        <div className='socialbtn'>
                                            <div className='socialconect'>
                                                Social connections
                                            </div>
                                            <div className='socialico'>
                                                <div className='socialtwit'>
                                                    <img className='socialtwitter' src={Twitter} alt="twitter" />
                                                    <button>
                                                    <LoginSocialTwitter
                                                        client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ''}
                                                        // client_secret={process.env.REACT_APP_TWITTER_V2_APP_SECRET || ''}
                                                        redirect_uri={REDIRECT_URI}
                                                        onLoginStart={onLoginStart}
                                                        onLogoutSuccess={onLogoutSuccess}
                                                        onResolve={({ provider, data }: IResolveParams) => {
                                                            setProvider(provider)
                                                            setProfile(data)
                                                        }}
                                                        onReject={(err: any) => {
                                                            console.log(err)
                                                        }}
                                                    >Connect</LoginSocialTwitter>
                                                    </button>
                                                </div>
                                                <div className='socialtwit'>
                                                    <img className='socialig' src={Instagram} alt="twitter" />
                                                    <button>
                                                    <LoginSocialInstagram
                                                        client_id={process.env.REACT_APP_INSTAGRAM_APP_ID || ''}
                                                        client_secret={process.env.REACT_APP_INSTAGRAM_APP_SECRET || ''}
                                                        redirect_uri={REDIRECT_URI}
                                                        onLoginStart={onLoginStart}
                                                        onLogoutSuccess={onLogoutSuccess}
                                                        onResolve={({ provider, data }: IResolveParams) => {
                                                            setProvider(provider)
                                                            setProfile(data)
                                                        }}
                                                        onReject={(err: any) => {
                                                            console.log(err)
                                                        }}
                                                    >Connect</LoginSocialInstagram>
                                                    </button>
                                                    
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    {/* <div className="form-control-wrapper wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">Profile Image</div>
                                            <div className="sub-label"></div>
                                        </div>


                                        <div className="upload-area">
                                            <ReactImageUploading
                                                value={values.nftAssetFile}
                                                //@ts-ignore
                                                name="file"
                                                onChange={onChange}
                                                onBlur={handleBlur}
                                                dataURLKey="data_url"
                                                acceptType={["jpg", "jpeg", "svg", "png", "mp4", "webm", "mp3", "wav", "ogg", "glb", "gltf"]}
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps,
                                                }) => (
                                                    // write your building UI
                                                    <div className="upload__image-wrapper">
                                                        <button onClick={onImageUpload}
                                                            type="button"
                                                            className="upload-btn"
                                                            //@ts-ignore
                                                            style={isDragging ? { color: "red" } : null}
                                                            {...dragProps}>

                                                            <img
                                                                src={values.nftAssetFile?.length
                                                                    ?
                                                                    //@ts-ignore 
                                                                    values.nftAssetFile[0]?.data_url
                                                                    :
                                                                    "/images/uploadImg.svg"} alt="upload image" />
                                                        </button>
                                                        {
                                                            //@ts-ignore
                                                            values.nftAssetFile[0]?.data_url ? <img src="/images/icons/close.svg" alt="close" className='remove-upload--btn' onClick={onImageRemoveAll} /> : null}

                                                    </div>
                                                )}
                                            </ReactImageUploading>
                                        </div>


                                        {errors && <div style={{ color: 'red' }}><ErrorMessage name="file" /></div>}
                                    </div> */}
                                </div>


                                <div className="create-btn-wrapper">
                                    <button type="submit" className="create-btn"> Create </button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
                <PropertyModal
                    toggle={propertyModalToggle}
                    open={propertyModal}
                    propertyData={propertyData}
                    setPropertyData={setPropertyData}
                />
                <LevelsModal
                    toggle={levelsModalToggle}
                    open={levelsModal}
                    levelsData={levelsData}
                    setLevelsData={setLevelsData}
                />
                <StatsModal
                    toggle={statsModalToggle}
                    open={statsModal}
                    statsData={statsData}
                    setStatsData={setStatsData}
                />
                <CreateCollectionModal
                    toggle={createCollectionToggle}
                    open={createCollection}
                    setCollectionObj={setCollectionObj}
                    listOfBlockchains={listOfBlockchains}
                    setCollectionUpdate={setCollectionUpdate}
                />
            </div>
        </div>
    )
}

export default Userprofile
