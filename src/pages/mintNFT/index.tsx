import React, { useState, useEffect, useCallback } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Select from 'react-select'
import * as Yup from 'yup'

import { FileUpload } from 'diardo-fileupload';

import PropertyModal from './modals/PropertyModal';
import StatsModal from './modals/StatsModal';
import LevelsModal from './modals/LevelsModal';
import { abi as GEN_NFT_OPEN_STORE_ERC721_ABI } from '../../contracts/GenShardsOpenStoreERC721.json'
import { abi as GEN_NFT_OPEN_STORE_ERC1155_ABI } from '../../contracts/GenShardsOpenStoreERC1155.json'
import { useHistory, useRouteMatch } from 'react-router-dom'
import './style.sass'
import CreateCollectionModal from './modals/CreateCollectionModal/CreateCollectionModal'
import ReactImageUploading from 'react-images-uploading'
import {
    getBlockchainListData,
    getCollectionListData,
    postMintNFTCallBack,
} from './API/ApiCall'
import { useActiveWeb3React } from '../../hooks/web3'
import { apiBaseUrl, REACT_APP_IS_TEST_MODE } from '../../constants'
import { useAddPopup } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import LoaderComp from '../../shared/components/LoaderComponent';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserToken } from '../../state/user/actions';
import { AppState } from '../../state';
import useUserAuth from '../../hooks/useUserAuth';
import RefreshIcon from '../../shared/components/RefreshIcon';
import StatsLevelProgressBar from './StatsLevelProgressBar';
import Fotlogo from '../../images/marketplace/fotlogo.svg'
import ReactPlayer from 'react-player';
import  Footer  from '../marketplace/components/footer/index';

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

const customStyles = {
    option: (provided, state) => {
        return {
            ...provided,
            color: "blue",
            backgroundColor: state.data === state.selectProps.value ? "#117DCC" : "white"
        };
    }
};

const MintNFT = () => {
    const history = useHistory()
    const [files, setFiles] = React.useState([]);

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
    const userId = useSelector((state: AppState) => state.user && state.user.userId)

    // const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()

    useEffect(() => {
        getBlockchainData()
    }, [collectionUpdate])

    useEffect(() => {
        if (userId && chainId) {
            getCollectionData()
        }
    }, [userId, chainId])

    // useEffect(() => {
    //     if (account && account !== storedAddress && library) {
    //         getUserAuthToken()
    //     }
    // }, [account, library, storedAddress])

    const getBlockchainData = async () => {
        if (chainId) {
            console.log('chainIdchainId', chainId)
            let chainType =
                Boolean(REACT_APP_IS_TEST_MODE) === false ? 'mainnet' : 'testnet'
            await getBlockchainListData(chainType)
                .then((res) => {
                    if (res?.status === 200) {
                        console.log('getBlockchainData', res.data.values || [])
                        setListOfBlockchains(res.data.values || [])
                    }
                })
                .catch((err) => {
                    console.log(
                        err.message || 'Error while fetching Collection Categories '
                    )
                })
        }
    }

    const getCollectionData = async () => {
        if (chainId && userId) {
            setIsLoading(true)
            await getCollectionListData(userId, chainId)
                .then(({ data }) => {
                    setIsLoading(false)
                    setListOfCollections(data.values || [])
                })
                .catch((err) => {
                    setIsLoading(false)
                    console.log(
                        err.message || 'Error while fetching Collection Categories '
                    )
                })
        }
    }

    const handleMintNFTBlockchain = async (collectionAddress: string, nftTokenId: string, collectionAssetType: number, supply: number) => {

        console.log('collectionAddressMinting', collectionAddress);

        let estimate,
            method: (...args: any) => Promise<TransactionResponse>,
            args: Array<number | string | BigNumber>,
            value: BigNumber | null

        const market = getContract(collectionAddress, collectionAssetType == 1 ? GEN_NFT_OPEN_STORE_ERC721_ABI : GEN_NFT_OPEN_STORE_ERC1155_ABI, library!, account!)
        method = market.mint
        estimate = market.estimateGas.mint
        if (collectionAssetType == 1) {
            args = [
                account!
            ]
        }
        else {
            args = [
                account!,
                supply,
                "0x00"
            ]
        }

        console.log("mint nft data BC", args);

        await estimate(...args, {})
            .then(estimatedGasLimit =>
                method(...args, {
                    ...({}),
                    gasLimit: calculateGasMargin(estimatedGasLimit)
                })
                    .then(async (response: any) => {
                        const waitResponse = await response.wait();
                        setIsLoading(false);
                        setMsg("Please Wait")
                        if (waitResponse.status) {
                            addTransaction(response, {
                                summary:
                                    'NFT Minted Successfully.'
                            })
                            history.push(`/assets/${collectionAddress}/${nftTokenId}`);
                        }
                        else {
                            addErrorPopup({
                                txn: {
                                    hash: '',
                                    success: false,
                                    summary: 'Unable to processed your request on this time. Please try again later.',
                                    description: '',
                                    withExternalLink: false,
                                }
                            });
                        }
                    })
                    .catch((err: any) => {
                        setIsLoading(false);
                        setMsg("Please Wait")
                        console.log('error create Collection failed11', err);
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
                setIsLoading(false);
                setMsg("Please Wait")
                console.log('inner create Collection error', err);
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
    }

    function getExtension(filename) {
        return filename.split('.').pop()
    }

    const handleDelete = () => {
        // const newFiles = files.filter((item, i) => i !== indexFile);
        setFiles([]);
        console.log("asdsadasdadassdad", files);

    };


    const handleApproveCheckAndMintNFT = async (values: any) => {

        if (!library || !chainId || !account) return
        const isError = {
            msg: '',
            error: false
        }

        console.log('values?.collection', values?.collection);

        if (files.length <= 0) { //files replace of values.nftAssetFile
            isError.msg = `Please select and upload the required NFT Asset File.`;
            isError.error = true;
        }
        else if (values.name.length <= 5) {
            isError.msg = `NFT Name is required and it must be UNIQUE  and more than 5 characters.`;
            isError.error = true;
        }
        else if (Object.keys(values?.collection).length === 0) {
            isError.msg = `Please create your collection from list or Create New One.`;
            isError.error = true;
        }
        else if (Number(values?.supply) < 1) {
            isError.msg = `Please add the supply values(Number of items you wanted to be minted). It should be minimum 1.`;
            isError.error = true;
        }
        else if (Number(values?.collection.assetType) === 1 && (Number(values?.supply) < 1 || Number(values?.supply) > 1)) {
            isError.msg = `You can not select more than 1 supply for ERC721 Contact.`;
            isError.error = true;
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

        if (!isError.error) {
            setIsLoading(true);
            setMsg("Minting NFT")
            try {
                if (account === undefined) return

                var propertyObjArray = [] as any;
                for (var i = 0; i < propertyData.length; i++) {
                    if (propertyData[i].type.trim().length > 0 && propertyData[i].name.trim().length > 0) {
                        propertyObjArray.push({ type: propertyData[i].type, name: propertyData[i].name });
                    }
                }
                console.log('propertyObjArray', propertyObjArray)

                var levelsObjArray = [] as any;
                for (var i = 0; i < levelsData.length; i++) {
                    if (levelsData[i].name.trim().length > 0 && Number(levelsData[i].of) > 0 && Number(levelsData[i].total) > 0) {
                        levelsObjArray.push({ name: levelsData[i].name, min: levelsData[i].of, max: levelsData[i].total });
                    }
                }
                console.log('levelsObjArray', levelsObjArray)

                var statsObjArray = [] as any;
                for (var i = 0; i < statsData.length; i++) {
                    if (statsData[i].name.trim().length > 0 && Number(statsData[i].of) > 0 && Number(statsData[i].total) > 0) {
                        statsObjArray.push({ name: statsData[i].name, min: statsData[i].of, max: statsData[i].total });
                    }
                }
                console.log('statsObjArray', statsObjArray)

                console.log('files[0]', files[0], values?.explicitSensitiveContent) ////files replace of values.nftAssetFile

                let isExplicitAndSensitiveContent = (values?.explicitSensitiveContent === '' || values?.explicitSensitiveContent === false) ? false : true

                console.log('All Data : ', values?.name, userId, values?.collection?._id, URL.createObjectURL(files[0]), Number(values?.collection?.chainId), values?.description, propertyObjArray, levelsObjArray, statsObjArray, values?.externalLink, values?.unlockableContentData, isExplicitAndSensitiveContent, Number(values?.supply || 0)) //URL.createObjectURL(files[0]) replace of values.nftAssetFile

                await postMintNFTCallBack(values?.name, userId, values?.collection?._id, files[0], Number(values?.collection?.chainId), values?.description, propertyObjArray, levelsObjArray, statsObjArray, values?.externalLink, values?.unlockableContentData, isExplicitAndSensitiveContent, Number(values?.supply || 0)).then(async (res: any) => { //URL.createObjectURL(files[0]) replace of values.nftAssetFile
                    console.log("resresresres", res);
                    if (res?.status === 200) {
                        await handleMintNFTBlockchain(values?.collection?.collectionAddress, res?.data?.nft?.tokenId, values?.collection?.assetType, Number(values?.supply || 0));
                    }
                    else {
                        setIsLoading(false);
                        setMsg("Please Wait")
                        addErrorPopup({
                            txn: {
                                hash: '',
                                success: false,
                                summary: 'Unable to processed your request on this time. Please try again later.',
                                description: '',
                                withExternalLink: false,
                            }
                        });
                    }
                })

            } catch (error) {
                setIsLoading(false);
                setMsg("Please Wait")
            }
        }
    }

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

    return (
        <>
            <div className="mint-nft-page">
                <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />
                <div className="mint-nft-wrapper">
                    <div className="create-your-item">Create Your Item</div>
                    <div className="required-items">* Required Items</div>
                    <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            console.log("values :: ", values);
                            console.log("propertyData :: ", propertyData);
                            console.log("levelsData :: ", levelsData);
                            console.log("statsData :: ", statsData);
                            console.log("collectionObj :: ", collectionObj);
                            handleApproveCheckAndMintNFT(values)
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, errors, values, setFieldValue }) => {
                            const onChange = (imageList, addUpdateIndex) => {
                                const files = imageList.target.files;
                                imageList.target.value = ''
                                // console.log("imageList => ", imageList, "addUpdateIndex => ", addUpdateIndex);
                                // setFieldValue("nftAssetFile", imageList)
                            };
                            return (
                                <Form onSubmit={handleSubmit}>
                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper main-wrapper-label">
                                            <div className="main-label">Image, Video, Audio, or 3D Model <span className="required-field">*</span></div>
                                            <div className="sub-label"></div>
                                        </div>
                                        <div className="second-label">File Types Supported: JPG, PNG, MP4, WEBM, MP3, WAV, OGG | Max File Size : 100MB </div>

                                        <div className="upload-area">
                                            {files.length > 0 &&
                                                <div className="upload__image-wrapper" >
                                                    {
                                                        ["png", "jpg", "jpeg", "webp"].includes(getExtension(files[0]["name"]).toLowerCase()) ?
                                                            <img src={URL.createObjectURL(files[0])} alt="upload image" className='mintNFTUpload' /> :
                                                            ["mp4", "webm", "mov", "wmv", "flv", "avi", "mkv"].includes(getExtension(files[0]["name"]).toLowerCase()) ?
                                                                <video className='card-player' autoPlay controls><source src={URL.createObjectURL(files[0])} /></video> :
                                                                ["pcm", "wav", "aiff", "mp3", "aac", "ogg", "wma"].includes(getExtension(files[0]["name"]).toLowerCase()) ?
                                                                    <audio className='card-player' controls><source src={URL.createObjectURL(files[0])} /></audio> : <img src={"/images/uploadImg_small.svg"} alt="upload image" />
                                                    }
                                                    {
                                                        //@ts-ignore
                                                        files.length > 0 ? <button type="button" className='remove-upload--btn' onClick={handleDelete}>
                                                            <img src="/images/icons/close.svg" alt="close"  />
                                                        </button> : null
                                                    }
                                                    {console.log("itemitemitemitem", files)}
                                                </div>
                                            }
                                            <FileUpload
                                                id="file"
                                                onChange={onChange}
                                                label=""
                                                name="file"
                                                maxSize={52428800}
                                                maxFiles={1}
                                                files={files}
                                                setFiles={setFiles}
                                                accept=""
                                                onError={(value) => {
                                                    console.log(value, 'error value')
                                                    addErrorPopup({
                                                        txn: {
                                                            hash: '',
                                                            success: false,
                                                            summary: 'Please select file is having size less than 52428800 bytes.',
                                                            description: '',
                                                            withExternalLink: false,
                                                        }
                                                    });
                                                }}
                                                disablePreview
                                            >
                                                {/* <p>Upload your file / Drop to this box</p> */}
                                                <div className="upload__image-wrapper">
                                                    {
                                                        <img src={"/images/uploadImg_small.svg"} alt="upload image" className='mintNFTUpload' />
                                                    }
                                                    {console.log("itemitemitemitem", files)}
                                                </div>
                                            </FileUpload>
                                        </div>

                                        {errors && <div style={{ color: 'red' }}><ErrorMessage name="file" /></div>}
                                    </div>
                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">Name <span className="required-field">*</span></div>
                                            {/* <div className="sub-label">Item Name</div> */}
                                        </div>
                                        <input
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            placeholder="Item Name"
                                            name="name"
                                        />
                                        {errors && <div style={{ color: 'red' }}><ErrorMessage name="name" /></div>}
                                    </div>
                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">External Link</div>
                                            <div className="sub-label">Optional link to an external page if you wish to redirect the user. GS will otherwise assign a default URL to the item page anyway</div>
                                        </div>
                                        <input
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.externalLink}
                                            name="externalLink"
                                        />
                                    </div>
                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">Description</div>
                                            <div className="sub-label">The description for the item page to be put below the image. "MARKDOWN" format is supported.</div>
                                        </div>
                                        <input
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.description}
                                            name="description"
                                            placeholder='Provide a detailed description for the item'
                                        />
                                    </div>

                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper">
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div className="main-label">Collection</div>
                                                <img src="/images/add.svg" alt="add" onClick={() => setCreateCollection(true)} />
                                            </div>
                                            <div className="sub-label">The collection the item will appear in</div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Select
                                                className='select-fields'
                                                placeholder="Collection"
                                                // value={values.collection}
                                                onChange={opt =>
                                                    //@ts-ignore
                                                    setFieldValue("collection", opt)
                                                }
                                                isSearchable={false}
                                                //@ts-ignore
                                                options={listOfCollections}
                                                //@ts-ignore
                                                getOptionLabel={(e: any) => (
                                                    <div className="option-img-label-wrapper css-2613qy-menu">
                                                        <img src={e?.logoImage} alt="icon" />
                                                        <div>{e?.name + " - " + ((Number(e?.assetType) === 1) ? "ERC721" : "ERC1155") + " - " + ((e?.isConfirmed == false) ? "Pending" : "Confirmed")}</div>
                                                    </div>
                                                )}
                                                name="collection"
                                                isLoading={false}
                                                styles={customStyles}
                                                loadingMessage={() => "Fetching collection"}
                                                noOptionsMessage={() => "No Collection here"}
                                            />
                                            <div className='sync-icon' style={{ marginTop: '18px' }}>
                                                <RefreshIcon isDarkMode={false} onClick={getCollectionData} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-logo-title-wrapper">
                                        <div className="logo-label-wrapper">
                                            <div className="label-logo">
                                                <img src="/images/properties.svg" alt="logo" />
                                            </div>
                                            <div className="main-label">Properties</div>
                                        </div>
                                        <div className="text-add-wrapper">
                                            <div className="sub-label">Textual Traits that show up as rectangles</div>
                                            <div className="add-wrapper">
                                                <div className="add-btn" onClick={() => setPropertyModal(true)}>
                                                    <img src="/images/add.svg" alt="add" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='show-select-property-details'>
                                        <div className="all-properties">
                                            {
                                                propertyData[0] && propertyData[0].name && propertyData?.map((property) => <div className="property">
                                                    <div className='type'>{property?.type}</div>
                                                    <div className="value">{property?.name}</div>
                                                </div>)
                                            }
                                        </div>
                                    </div>

                                    <div className="form-logo-title-wrapper">
                                        <div className="logo-label-wrapper">
                                            <div className="label-logo">
                                                <img src="/images/levels.svg" alt="logo" />
                                            </div>
                                            <div className="main-label">Levels</div>
                                        </div>
                                        <div className="text-add-wrapper">
                                            <div className="sub-label">Numerical traits shows a progress bar</div>
                                            <div className="add-wrapper">
                                                <div className="add-btn" onClick={() => setLevelsModal(true)}>
                                                    <img src="/images/add.svg" alt="add" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='show-input-level-details'>
                                        {
                                            levelsData[0] && levelsData[0].name && levelsData?.map((item) => {
                                                const { name, of, total } = item
                                                return <StatsLevelProgressBar label={name} value={of} total={total} />
                                            })
                                        }
                                    </div>

                                    <div className="form-logo-title-wrapper">
                                        <div className="logo-label-wrapper">
                                            <div className="label-logo">
                                                <img src="/images/stats.svg" alt="logo" />
                                            </div>
                                            <div className="main-label">Stats</div>
                                        </div>
                                        <div className="text-add-wrapper">
                                            <div className="sub-label">Numerical traits shows as numbers</div>
                                            <div className="add-wrapper">
                                                <div className="add-btn" onClick={() => setStatsModal(true)}>
                                                    <img src="/images/add.svg" alt="add" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='show-input-level-details'>
                                        {
                                            statsData[0] && statsData[0].name && statsData?.map((item) => {
                                                const { name, of, total } = item
                                                return <StatsLevelProgressBar label={name} value={of} total={total} />
                                            })
                                        }
                                    </div>

                                    {/* <div className="form-logo-title-wrapper">
                                    <div className="logo-label-wrapper">
                                        <div className="label-logo">
                                            <img src="/images/unlockableContent.svg" alt="logo" />
                                        </div>
                                        <div className="main-label">Unlockable Content</div>
                                    </div>
                                    <div className="text-add-wrapper">
                                        <div className="sub-label">Include unlockable content exclusive for the item owner</div>
                                        <input
                                            type="checkbox"
                                            id="unlockableContent"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.unlockableContent}
                                            name="unlockableContent" />
                                        <label htmlFor="unlockableContent">Toggle</label>
                                    </div>
                                </div>

                                {values?.unlockableContent && <div className="form-control-wrapper">
                                    <input
                                        type="text"
                                        placeholder='Enter content (access key, code to redeem, link to a file, etc.)'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.unlockableContentData}
                                        name="unlockableContentData"
                                    />
                                </div>}

                                <div className="form-logo-title-wrapper">
                                    <div className="logo-label-wrapper">
                                        <div className="label-logo">
                                            <img src="/images/explicitSensitiveContent.svg" alt="logo" />
                                        </div>
                                        <div className="main-label">Explicit and Sensitive Content</div>
                                    </div>
                                    <div className="text-add-wrapper">
                                        <div className="sub-label">Set this item as explcit and sensitive content</div>
                                        <input
                                            type="checkbox"
                                            id='explicitSensitiveContent'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.explicitSensitiveContent}
                                            name="explicitSensitiveContent" />
                                        <label htmlFor="explicitSensitiveContent">Toggle</label>
                                    </div>
                                </div> */}

                                    <div className="form-control-wrapper">
                                        <div className="label-wrapper">
                                            <div className="main-label">Supply</div>
                                            <div className="sub-label">The number of items that can be minted. No gas fees to you.</div>
                                        </div>
                                        <input
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.supply}
                                            name="supply"
                                        />
                                    </div>

                                    {/* <div className="form-control-wrapper">
                                    <div className="label-wrapper">
                                        <div className="main-label">Blockchain</div>
                                    </div>

                                    <Select
                                        className='select-field'
                                        placeholder="Blockchain"
                                        // value={values.collection}
                                        onChange={opt =>
                                            //@ts-ignore
                                            setFieldValue("chain", opt?.chainId)
                                        }
                                        isSearchable={true}
                                        //@ts-ignore
                                        getOptionLabel={e => (
                                            <div className="option-img-label-wrapper">
                                                <img src={e?.tokenImg} alt="icon" />
                                                <div>{e?.name}</div>
                                            </div>
                                        )}
                                        //@ts-ignore
                                        options={listOfBlockchains}
                                        name="chain"
                                        isLoading={false}
                                        loadingMessage={() => "Fetching collection"}
                                        noOptionsMessage={() => "No Collection here"}
                                    />
                                </div> */}
                                    {/* 
                                <div className="form-control-wrapper">
                                    <div className="label-wrapper">
                                        <div className="main-label">Freeze Metadata</div>
                                        <div className="sub-label">Freezing your metadata will allow you to permanently lock and store all of this item’s content in decentralized file stroage.</div>
                                    </div>
                                    <Field
                                        className="input-field"
                                        as="textarea"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.freezeMetadata}
                                        name="freezeMetadata"
                                        placeholder='Create the item first to freeze metadata'
                                    />
                                </div> */}

                                    <div className="create-btn-wrapper">
                                        <button type="submit" className="create-btn">
                                            Create
                                        </button>
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
                <div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default MintNFT;
