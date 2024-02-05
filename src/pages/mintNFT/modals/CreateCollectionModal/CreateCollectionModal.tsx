import React, { useState, useEffect, useCallback } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Select from 'react-select'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import * as Yup from 'yup'
import ReactImageUploading from 'react-images-uploading'
import { abi as GEN_NFT_STORE_ABI } from '../../../../contracts/GenNFTStore.json'
import {
  getCollectionCategoriesData,
  getBlockchainListData,
  postCreateCollectionCallBack,
  preCheckCreateCollectionData,
} from '../../API/ApiCall'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useAddPopup } from '../../../../state/application/hooks'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import LoaderComp from '../../../../shared/components/LoaderComponent'
import { BigNumber, ethers, providers } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin, getContract } from '../../../../utils'
import { GEN_NFT_STORE_ADDRESS_DATA } from '../../../../connectors'
import './style.sass'
import '../style.sass'
import { AppState } from '../../../../state'
import { useSelector } from 'react-redux'
import useNetwork from '../../../../hooks/useNetwork'
import { NetwokButton } from '../../../../shared/components/header'

// const arrayOfMainNetBlockchains = [
//     { value: "56", label: "Binance Smart Chain", src: '/images/bnb-icon.png' },
//     { value: "1", label: "Ethereum", src: '/images/ETH.svg' },
//     { value: "137", label: "Polygon(Matic)", src: '/images/matic_.png' },
//     { value: "1666600000", label: "Harmony One", src: '/images/harmony-one-logo-final.png' },
//     { value: "43114", label: "Avalanche", src: '/images/avalanche-avax-logo-final.png' },
//     { value: "4689", label: "Iotex", src: '/images/BSC.svg' }
// ];

const paymentTokensArray = [
  // {
  //   name: 'ETH',
  //   category: 'Ethereum',
  //   token: '0x0131024293019039109301240921412390122424234324',
  // },
  {
    name: 'WETH',
    category: 'Ethereum',
    token: '0x0131024293019039109301240921412390122424234324',
  },
]

const initialValues = {
  logoImage: [],
  featuredImage: [],
  bannerImage: [],
  name: '',
  url: `https://${new URL(window.location.href).host}/collection/`,
  // url: 'https://opensea.io/collection/',
  description: '',
  category: '',
  contractType: 'erc721',
  website: '',
  discord: 'https://discord.gg/',
  instagram: '',
  medium: 'https://www.medium.com/@',
  telegram: 'https://t.me/',
  selectedChain: '',
  creatorEarnings: 0.0,
  creatorEarningsAddress: '',
  token: '',
  addToken: '',
  displayTheme: '',
  explicitAndSensitiveContent: '',
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
      color: "black",
      backgroundColor: state.data === state.selectProps.value ? "#117DCC" : "white"
    };
  }
};

const CreateCollectionModal = ({
  toggle,
  open,
  setCollectionObj,
  listOfBlockchains,
  setCollectionUpdate,
}) => {
  // const validationSchema = Yup.object({
  //     logoImage: Yup.mixed()
  //         .nullable()
  //         .required()
  //         .test("FILE_SIZE", "Uploaded file is too big.",
  //         value => !value || (value && value.size <= 100))
  //         .test("FILE_FORMAT", "Uploaded file has unsupported format.",
  //             value => !value || (value && supportedFormats.includes(value.type))),
  //     name: Yup.string().required("name is required"),
  // })
  const { library, chainId, account } = useActiveWeb3React()
  const [listOfCategories, setListOfCategories] = useState<any[]>([])
  const [formikInitialValues, setFormikInitialValues] = useState<any>(initialValues)
  // const [listOfBlockchains, setListOfBlockchains] = useState<any[]>([])
  const addErrorPopup = useAddPopup()
  const [msg, setMsg] = useState('Please Wait')
  const addTransaction = useTransactionAdder()
  const [isLoading, setIsLoading] = useState(false)
  const network = useSelector((state: AppState) => state.application.network)
  const userId = useSelector((state: AppState) => state.user && state.user.userId)


  const { NetworkSwitch } = useNetwork()

  useEffect(() => {
    getCategoryData()
    // getBlockchainData()
  }, [])

  useEffect(() => {
    setFormikInitialValues(prev => ({ ...prev, selectedChain: chainId }))
  }, [chainId])

  const getCategoryData = async () => {
    await getCollectionCategoriesData()
      .then((res) => {
        if (res?.status === 200) {
          console.log('getCollectionCategoriesData', res.data.values || [])
          setListOfCategories(res.data.values || [])
        }
      })
      .catch((err) => {
        console.log(
          err.message || 'Error while fetching Collection Categories '
        )
      })
  }

  function slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  const handleCreateCollection = async (
    chainId: number,
    assetType: number,
    collectionName: string,
    symbol: string,
    baseURI: string,
    contractURI: string,
    royaltyReceiver: string,
    royaltyFeeNumerator: any
  ) => {
    console.log(
      'GEN_NFT_STORE_ADDRESS_DATA[chainId]',
      GEN_NFT_STORE_ADDRESS_DATA[chainId]
    )

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<number | string | BigNumber>,
      value: BigNumber | null

    const market = getContract(
      GEN_NFT_STORE_ADDRESS_DATA[chainId],
      GEN_NFT_STORE_ABI,
      library!,
      account!
    )
    method = market.createCollection
    estimate = market.estimateGas.createCollection
    args = [
      assetType,
      collectionName,
      symbol,
      baseURI,
      contractURI,
      royaltyReceiver,
      royaltyFeeNumerator,
    ]

    console.log('data', args)

    await estimate(...args, {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...{},
          gasLimit: calculateGasMargin(estimatedGasLimit),
        })
          .then(async (response: any) => {
            const waitResponse = await response.wait()
            setIsLoading(false)
            setMsg('Please Wait')
            if (waitResponse.status) {
              addTransaction(response, {
                summary: 'Collection Created Successfully.',
              })
              setCollectionUpdate((e) => !e)
              toggle()
            } else {
              addErrorPopup({
                txn: {
                  hash: '',
                  success: false,
                  summary:
                    'Unable to processed your request on this time. Please try again later.',
                  description: '',
                  withExternalLink: false,
                },
              })
            }
          })
          .catch((err: any) => {
            setIsLoading(false)
            setMsg('Please Wait')
            console.log('error create Collection failed11', err)
            let e =
              err.code === 4001
                ? err
                : err.code === -32603
                  ? err.data
                  : err.message.slice(
                    err.message.indexOf('{'),
                    err.message.indexOf('}') + 3
                  )
            if (err.code === -32603) {
            } else if (err.code !== 4001) e = JSON.parse(e)
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : 'MetaMask - RPC Error',
                description:
                  err.code === -32603
                    ? e.message
                    : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              },
            })
          })
      )
      .catch((err: any) => {
        setIsLoading(false)
        setMsg('Please Wait')
        console.log('inner create Collection error', err)
        let e =
          err.code === 4001
            ? err
            : err.code === -32603
              ? err.data
              : err.message.slice(
                err.message.indexOf('{'),
                err.message.indexOf('}') + 3
              )
        if (err.code === -32603) {
        } else if (err.code !== 4001) e = JSON.parse(e)
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: err.code === 4001 ? e.message : 'MetaMask - RPC Error',
            description:
              err.code === -32603
                ? e.message
                : e.data?.originalError?.message ?? '',
            withExternalLink: false,
          },
        })
      })
  }

  const onChangeSelectedChain = (chainId: number, setFieldValue) => {
    const selectedChainName = NetwokButton.find(item => item.chainId === chainId)
    if(selectedChainName?.network) {
      NetworkSwitch(selectedChainName?.network)
      setFieldValue('selectedChain', chainId)
    } else { console.error("Chain not supported please add in supported chains.")  }
  }

  const handleApproveAndCreateCollection = async (values: any) => {
    if (!library || !chainId || !account) return

    //Precheck and validates collection data
    var isNameExists = false
    var isCollectionUrlExists = false
    var customizedCollectionURLArray = values.url.split('/');
    var customizedCollectionURL = customizedCollectionURLArray.pop()
    console.log("BOSS Entered", values?.name, customizedCollectionURL);

    if (values?.name && slugify(customizedCollectionURL)) {
      try {
        await preCheckCreateCollectionData(
          values?.name,
          slugify(customizedCollectionURL)
        ).then(async (res: any) => {
          if (res?.status === 200) {
            // {
            //   "isNameExists": true,
            //   "isCollectionUrlExists": false
            // }
            isNameExists = res?.data?.isNameExists;
            isCollectionUrlExists = res?.data?.isCollectionUrlExists;
          }
        }).catch(err => {
          console.log(err.message || 'Error while validate check of create user collection data ')
        })
      } catch (error: any) {
        console.log(error || 'Error while validate check of create user collection data ')
      }
    }

    const isError = {
      msg: '',
      error: false,
    }

    var parts = values.name.split(' ')
    // console.log("symbolCode parts", values.name, parts.length);
    var symbolCode = "";
    if (parts.length == 1) {
      // console.log("symbolCode Concat", symbolCode.concat(parts[0].slice(0, 3)));
      symbolCode += (parts[0].slice(0, 3));
    }
    else {
      for (var i = 0; i < parts.length; i++) {
        symbolCode += (parts[i].slice(0, 1));
      }
    }

    console.log("symbolCode", symbolCode, (values?.creatorEarningsAddress && values?.creatorEarningsAddress.length > 26) ? values?.creatorEarningsAddress : account!);

    // var parts = values.url.split('/')
    // var customizedCollectionURL =
    //   values.url.length > 30 ? parts.pop() || parts.pop() : ''
    console.log(
      'initialValuesinitialValues',
      values.url.length,
      parts,
      customizedCollectionURL
    )
    if (values.logoImage.length <= 0) {
      isError.msg = `Please select and upload the Collection LOGO. 350 * 350 Recommended.`
      isError.error = true
    } else if (values.name.length <= 5) {
      isError.msg = `Collection Name is required and it must be UNIQUE and more than 5 characters.`
      isError.error = true
    } else if (isNameExists) {
      isError.msg = `Your provided collection name is used by someone. Please try another one.`
      isError.error = true
    } else if (customizedCollectionURL.length <= 0) {
      isError.msg = `Please complete the customized Collection URL for better improvement.`
      isError.error = true
    } else if (isCollectionUrlExists) {
      isError.msg = `Your provided customized URL is already used by someone. Please try another one.`
      isError.error = true
    } else if (values.category.length <= 0) {
      isError.msg = `Please select the category that belongs to your collection for better suggestions.`
      isError.error = true
    } else if (values.selectedChain.length <= 0) {
      isError.msg = `Please select the blockchain for collection creation.`
      isError.error = true
    }

    isError.error &&
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: isError.msg,
          description: '',
          withExternalLink: false,
        },
      })

    if (!isError.error) {
      console.log('All are good to go')
      setIsLoading(true)
      setMsg('Processing Request')
      try {
        if (account === undefined) return

        var linksObjArray = [] as any
        linksObjArray = [
          ...linksObjArray,
          { name: 'Website', link: values?.website ?? '' },
        ]
        linksObjArray = [
          ...linksObjArray,
          { name: 'Discord', link: values?.discord ?? '' },
        ]
        linksObjArray = [
          ...linksObjArray,
          { name: 'Instagram', link: values?.instagram ?? '' },
        ]
        linksObjArray = [
          ...linksObjArray,
          { name: 'Medium', link: values?.medium ?? '' },
        ]
        linksObjArray = [
          ...linksObjArray,
          { name: 'Telegram', link: values?.telegram ?? '' },
        ]

        console.log('linksObjArray', linksObjArray)

        var creatorEarningsObjArray = [] as any
        creatorEarningsObjArray = [
          ...creatorEarningsObjArray,
          {
            address: (values?.creatorEarningsAddress && values?.creatorEarningsAddress.length > 26) ? values?.creatorEarningsAddress : account!,
            value:
              Number(values?.creatorEarnings) > 0 ? values?.creatorEarnings : 0,
          },
        ]
        console.log('creatorEarningsObjArray', creatorEarningsObjArray)

        var paymentTokensObjArray = [] as any
        for (var i = 0; i < paymentTokensArray.length; i++) {
          paymentTokensObjArray.push({
            name: paymentTokensArray[i].name,
            token: paymentTokensArray[i].token,
          })
        }

        console.log('paymentTokensObjArray', paymentTokensObjArray)

        console.log(
          'All Data : ',
          values?.name,
          userId,
          slugify(customizedCollectionURL),
          values?.selectedChain,
          values?.website,
          values?.contractType === "erc721" ? "1" : "2",
          account!,
          symbolCode,
          values?.description,
          values?.category,
          linksObjArray,
          creatorEarningsObjArray,
          paymentTokensObjArray,
          values?.logoImage,
          values?.featuredImage,
          values?.bannerImage
        )

        console.log(
          'logoImage[0]',
          values?.logoImage[0],
          values?.explicitAndSensitiveContent
        )
        let isExplicitAndSensitiveContent =
          values?.explicitAndSensitiveContent === '' ||
            values?.explicitAndSensitiveContent === false
            ? false
            : true
        await postCreateCollectionCallBack(
          values?.name,
          userId,
          slugify(customizedCollectionURL),
          values?.selectedChain,
          values?.website,
          values?.contractType === "erc721" ? 1 : 2,
          account!,
          symbolCode,
          values?.description,
          values?.category,
          linksObjArray,
          creatorEarningsObjArray,
          paymentTokensObjArray,
          values?.logoImage[0],
          values?.featuredImage[0],
          values?.bannerImage[0],
          isExplicitAndSensitiveContent
        ).then(async (res: any) => {
          console.log('resresres', res);
          if (res?.status === 200) {
            await handleCreateCollection(
              values?.selectedChain,
              values?.contractType === "erc721" ? 1 : 2,
              values?.name,
              symbolCode,
              res?.data?.baseUri,
              res?.data?.contractUri,
              (values?.creatorEarningsAddress && values?.creatorEarningsAddress.length > 26) ? values?.creatorEarningsAddress : account!,
              Number(values?.creatorEarnings) * 100 ?? 0
            )
          } else {
            setIsLoading(false)
            setMsg('Please Wait')
            if (res.response) {
              // The client was given an error response (5xx, 4xx)
              console.log(res.response.data);
              console.log(res.response.status);
              console.log(res.response.headers);
            } else if (res.request) {
              // The client never received a response, and the request was never left
            } else {
              // Anything else
            }
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary:
                  'Unable to processed your request on this time. Please try again later.',
                description: '',
                withExternalLink: false,
              },
            })
          }
        }).catch(err => {
          setIsLoading(false)
          setMsg('Please Wait')
          if (err.response) {
            // The client was given an error response (5xx, 4xx)
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else if (err.request) {
            // The client never received a response, and the request was never left
          } else {
            // Anything else
          }
          console.log(err.message || 'Error while create user collection votes ')
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.message,
              description: '',
              withExternalLink: false,
            },
          })
        })

      } catch (error: any) {
        setIsLoading(false)
        setMsg('Please Wait')
        if (error.response) {
          // The client was given an error response (5xx, 4xx)
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The client never received a response, and the request was never left
        } else {
          // Anything else
        }
        addErrorPopup({
          txn: {
            hash: '',
            success: false,
            summary: error.message,
            description: '',
            withExternalLink: false,
          },
        })
      }
    }
  }

  return (
    <div className="create-collection">
      {isLoading && (
        <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />
      )}
      <div className="top-modal-creat-nft d-block">
        <Modal
          centered
          toggle={toggle}
          isOpen={open}
          className="modal_wrapper top-modal-creat-nft"
          id="modal_wrapper"
        >
            <div className="close_btn" onClick={toggle}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 3C9.705 3 3 9.705 3 18C3 26.295 9.705 33 18 33C26.295 33 33 26.295 33 18C33 9.705 26.295 3 18 3ZM18 30C11.385 30 6 24.615 6 18C6 11.385 11.385 6 18 6C24.615 6 30 11.385 30 18C30 24.615 24.615 30 18 30ZM23.385 10.5L18 15.885L12.615 10.5L10.5 12.615L15.885 18L10.5 23.385L12.615 25.5L18 20.115L23.385 25.5L25.5 23.385L20.115 18L25.5 12.615L23.385 10.5Z"
                  fill="black"
                />
              </svg>
          </div>
          <ModalBody>
            <section className="create-collection">
              <div className="create-collection-wrapper">
                <div className="create-your-item">Create a collection</div>
                <div className="required-items">* Required Items</div>
                <Formik
                  initialValues={formikInitialValues}
                  enableReinitialize={true}
                  // validationSchema={validationSchema}
                  onSubmit={(values, actions) => {
                    if (values) {
                      console.log('values ', values, actions)
                      setCollectionObj(values)
                      handleApproveAndCreateCollection(values)
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    errors,
                    values,
                    setFieldValue,
                  }) => {
                    return (
                      <Form onSubmit={handleSubmit}>
                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              Logo Image <span className="required-field">*</span>
                            </div>
                            <div className="sub-label"></div>
                          </div>
                          <div className="second-label">
                            This image will also be used for navigation, 350x350
                            recommended
                          </div>

                          <div className="upload-area logo">
                            <ReactImageUploading
                              value={values.logoImage}
                              //@ts-ignore
                              name="logoImage"
                              onChange={(imageList, addUpdateIndex) =>
                                setFieldValue('logoImage', imageList)
                              }
                              onBlur={handleBlur}
                              dataURLKey="data_url"
                              acceptType={[
                                'jpg',
                                'jpeg',
                                'svg',
                                'png',
                                'mp4',
                                'webm',
                                'mp3',
                                'wav',
                                'ogg',
                                'glb',
                                'gltf',
                              ]}
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
                                  <button
                                    onClick={onImageUpload}
                                    type="button"
                                    className="upload-btn"
                                    //@ts-ignore
                                    style={isDragging ? { color: 'red' } : null}
                                    {...dragProps}
                                  >
                                    <img
                                      src={
                                        //@ts-ignore
                                        values.logoImage[0]?.data_url
                                          ? //@ts-ignore
                                          values.logoImage[0]?.data_url
                                          : '/images/uploadImg_small.svg'
                                      }
                                      alt="upload image"
                                    />
                                  </button>
                                  {
                                    //@ts-ignore
                                    values.logoImage[0]?.data_url ? (
                                      <img
                                        src="/images/icons/close.svg"
                                        alt="close"
                                        className="remove-upload--btn"
                                        onClick={onImageRemoveAll}
                                      />
                                    ) : null
                                  }
                                </div>
                              )}
                            </ReactImageUploading>
                          </div>
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="logoImage" />
                            </div>
                          )}
                        </div>
                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">Featured Image</div>
                            <div className="sub-label"></div>
                          </div>
                          <div className="second-label">
                            This image will be used for featuring your collection
                            on the homepage, category pages, or other promotional
                            areas of OpenSea 600x400 recommended
                          </div>

                          <div className="upload-area">
                            <ReactImageUploading
                              value={values.featuredImage}
                              //@ts-ignore
                              name="featuredImage"
                              onChange={(imageList, addUpdateIndex) => {
                                // data for submit
                                console.log(
                                  'imageList => ',
                                  imageList[0]?.data_url,
                                  'addUpdateIndex => ',
                                  addUpdateIndex
                                )
                                // setImages(imageList);
                                setFieldValue('featuredImage', imageList)
                              }}
                              onBlur={handleBlur}
                              dataURLKey="data_url"
                              acceptType={[
                                'jpg',
                                'jpeg',
                                'svg',
                                'png',
                                'mp4',
                                'webm',
                                'mp3',
                                'wav',
                                'ogg',
                                'glb',
                                'gltf',
                              ]}
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
                                <div className="upload__image-wrapper banner-image">
                                  <button
                                    onClick={onImageUpload}
                                    type="button"
                                    className="upload-btn"
                                    //@ts-ignore
                                    style={isDragging ? { color: 'red' } : null}
                                    {...dragProps}
                                  >
                                    <img
                                      src={
                                        //@ts-ignore
                                        values.featuredImage[0]?.data_url
                                          ? //@ts-ignore
                                          values.featuredImage[0]?.data_url
                                          : '/images/uploadImg.svg'
                                      }
                                      alt="upload image"
                                    />
                                  </button>
                                  {
                                    //@ts-ignore
                                    values.featuredImage[0]?.data_url ? (
                                      <img
                                        src="/images/icons/close.svg"
                                        alt="close"
                                        className="remove-upload--btn"
                                        onClick={onImageRemoveAll}
                                      />
                                    ) : null
                                  }
                                </div>
                              )}
                            </ReactImageUploading>
                          </div>
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="featuredImage" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">Banner Image</div>
                            <div className="sub-label"></div>
                          </div>
                          <div className="second-label">
                            This image will appear at the top of your collection
                            page. Avoid including too much text in this banner
                            image, as the dimensions change on different devices.
                            1400 x 350 recommended
                          </div>

                          <div className="upload-area">
                            <ReactImageUploading
                              value={values.bannerImage}
                              //@ts-ignore
                              name="bannerImage"
                              onChange={(imageList, addUpdateIndex) => {
                                // data for submit
                                console.log(
                                  'imageList => ',
                                  imageList[0]?.data_url,
                                  'addUpdateIndex => ',
                                  addUpdateIndex
                                )
                                // setImages(imageList);
                                setFieldValue('bannerImage', imageList)
                              }}
                              onBlur={handleBlur}
                              dataURLKey="data_url"
                              acceptType={[
                                'jpg',
                                'jpeg',
                                'svg',
                                'png',
                                'mp4',
                                'webm',
                                'mp3',
                                'wav',
                                'ogg',
                                'glb',
                                'gltf',
                              ]}
                            >
                              {({
                                onImageUpload,
                                onImageRemoveAll,
                                isDragging,
                                dragProps,
                              }) => (
                                // write your building UI
                                <div className="upload__image-wrapper banner-image">
                                  <button
                                    onClick={onImageUpload}
                                    type="button"
                                    className="upload-btn"
                                    //@ts-ignore
                                    style={isDragging ? { color: 'red' } : null}
                                    {...dragProps}
                                  >
                                    <img
                                      src={
                                        //@ts-ignore
                                        values.bannerImage[0]?.data_url
                                          ? //@ts-ignore
                                          values.bannerImage[0]?.data_url
                                          : '/images/uploadImg.svg'
                                      }
                                      alt="upload image"
                                    />
                                  </button>
                                  {
                                    //@ts-ignore
                                    values.bannerImage[0]?.data_url ? (
                                      <img
                                        src="/images/icons/close.svg"
                                        alt="close"
                                        className="remove-upload--btn"
                                        onClick={onImageRemoveAll}
                                      />
                                    ) : null
                                  }
                                </div>
                              )}
                            </ReactImageUploading>
                          </div>
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="bannerImage" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              Name <span className="required-field">*</span>
                            </div>
                            <div className="sub-label">Item Name</div>
                          </div>
                          <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            name="name"
                            placeholder="Enter Your Name"
                          />
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="name" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              URL <span className="required-field">*</span>
                            </div>
                            <div className="sub-label">
                              Customize your URL on OpenSea. Must only contain
                              lowercase letters, numbers and hyphens
                            </div>
                          </div>
                          <input
                            type="text"
                            // onChange={handleChange}
                            onChange={(e) => {
                              const prefix = `https://${new URL(window.location.href).host}/collection/`;
                              // 'https://opensea.io/collection/'
                              setFieldValue(
                                'url',
                                prefix + e.target.value.substr(prefix.length)
                              )
                            }}
                            onBlur={handleBlur}
                            value={values.url}
                            name="url"
                            placeholder="https://opensea.io/collection/genshards"
                          />
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="url" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">Description</div>
                            <div className="sub-label">
                              The description for the item page to be put below
                              the image. "MARKDOWN" format is supported.
                            </div>
                          </div>
                          <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                            name="description"
                            placeholder="Provide a detailed description for the item"
                          />
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              Category <span className="required-field">*</span>
                            </div>
                            <div className="sub-label">
                              Adding a category will help make your item more
                              discoverable
                            </div>
                          </div>
                          <Select
                            className="select-fields"
                            onChange={(opt) =>
                              //@ts-ignore
                              setFieldValue('category', opt?._id)
                            }
                            isSearchable={false}
                            //@ts-ignore
                            getOptionLabel={(e) => (
                              <div className="option-img-label-wrapper">
                                <img src="/images/ETH.svg" alt="icon" />
                                {/* {e.src} */}
                                <div>{e?.name}</div>
                              </div>
                            )}
                            //@ts-ignore
                            options={listOfCategories}
                            name="category"
                            styles={customStyles}
                            isLoading={false}
                            loadingMessage={() => 'Fetching collection'}
                            noOptionsMessage={() => 'No Collection here'}
                          />
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="category" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              Contract Type{' '}
                              <span className="required-field">*</span>
                            </div>
                            <div className="sub-label">
                              Adding a Contract Type will help make your item more
                              discoverable
                            </div>
                          </div>
                          <div className="contract-type-wrapper">
                            <div
                              className={
                                values.contractType === 'erc721'
                                  ? 'type-wrapper selected '
                                  : 'type-wrapper'
                              }
                            >
                              <input
                                type="radio"
                                className="type-radio"
                                name="contractType"
                                value="erc721"
                                checked={values.contractType === 'erc721'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="type-label-wrapper">
                                <div className="type-main-label">ERC 721</div>
                              </div>
                            </div>
                            <div
                              className={
                                values.contractType === 'erc1155'
                                  ? 'type-wrapper selected'
                                  : 'type-wrapper'
                              }
                            >
                              <input
                                type="radio"
                                className="type-radio"
                                name="contractType"
                                checked={values.contractType === 'erc1155'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value="erc1155"
                              />
                              <div className="type-label-wrapper">
                                <div className="type-main-label">ERC 1155</div>
                              </div>
                            </div>
                          </div>

                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="category" />
                            </div>
                          )}
                        </div>

                        <div className="link-label">Links</div>
                        <div className="links-form-controll-wrapper">
                          <div className="link-wrapper">
                            <div className="link-logo">
                              <img
                                src="/images/icons/website.svg"
                                alt="website"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Website"
                              onChange={(e) => {
                                const prefix = ''
                                setFieldValue(
                                  'website',
                                  prefix + e.target.value.substr(prefix.length)
                                )
                              }}
                              onBlur={handleBlur}
                              value={values.website}
                              name="website"
                            />
                          </div>
                          <div className="link-wrapper">
                            <div className="link-logo">
                              <img
                                src="/images/icons/discord.svg"
                                alt="discord"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="https://discord.gg/"
                              onChange={(e) => {
                                const prefix = 'https://discord.gg/'
                                setFieldValue(
                                  'discord',
                                  prefix + e.target.value.substr(prefix.length)
                                )
                              }}
                              onBlur={handleBlur}
                              value={values.discord}
                              name="discord"
                            />
                          </div>
                          <div className="link-wrapper">
                            <div className="link-logo">
                              <img
                                src="/images/icons/instagram.svg"
                                alt="instagram"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Instagram"
                              onChange={(e) => {
                                const prefix = ''
                                setFieldValue(
                                  'instagram',
                                  prefix + e.target.value.substr(prefix.length)
                                )
                              }}
                              onBlur={handleBlur}
                              value={values.instagram}
                              name="instagram"
                            />
                          </div>
                          <div className="link-wrapper">
                            <div className="link-logo">
                              <img src="/images/icons/medium.svg" alt="medium" />
                            </div>
                            <input
                              type="text"
                              placeholder="https://www.medium.com/@"
                              onChange={(e) => {
                                const prefix = 'https://www.medium.com/@'
                                setFieldValue(
                                  'medium',
                                  prefix + e.target.value.substr(prefix.length)
                                )
                              }}
                              onBlur={handleBlur}
                              value={values.medium}
                              name="medium"
                            />
                          </div>
                          <div className="link-wrapper">
                            <div className="link-logo">
                              <img
                                src="/images/icons/telegram.svg"
                                alt="telegram"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="https://t.me/"
                              onChange={(e) => {
                                const prefix = 'https://t.me/'
                                setFieldValue(
                                  'telegram',
                                  prefix + e.target.value.substr(prefix.length)
                                )
                              }}
                              onBlur={handleBlur}
                              value={values.telegram}
                              name="telegram"
                            />
                          </div>
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">Creator Earnings</div>
                            <div className="sub-label">
                              Earn a percentage of the sale price every time one
                              of your items is sold. Adding multiple addresses may
                              increase gas fees for buyers.
                            </div>
                          </div>
                          <div className="creator-input-wrapper">
                            <input
                              type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.creatorEarningsAddress}
                              name="creatorEarningsAddress"
                              placeholder="Please enter an address, e.g. 0x1ed3... or destination.eth"
                            />
                            <div className="creator-percentage">
                              <input
                                type="number"
                                step="0.11"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.creatorEarnings}
                                name="creatorEarnings"
                                placeholder="0.00"
                                min={0.00}
                                max={100.00}
                              />
                              <div className="percentage">%</div>
                            </div>
                          </div>
                          {errors && (
                            <div style={{ color: 'red' }}>
                              <ErrorMessage name="creatorEarnings" />
                            </div>
                          )}
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">
                              Blockchain <span className="required-field">*</span>
                            </div>
                            <div className="sub-label">
                              Select the Blockchain your’d like new items from
                              this collection to be added by default.
                            </div>
                          </div>
                          
                          <Select
                            className="select-field-Blockchain"
                            onChange={(opt) =>
                              //@ts-ignore
                              onChangeSelectedChain(opt?.chainId, setFieldValue)
                            }
                            isSearchable={false}
                            //@ts-ignore
                            getOptionLabel={(e: any) => (
                              <div className="option-img-label-wrapper">
                                <img src={e?.tokenImg} alt="icon" />
                                <div>{e?.name}</div>
                              </div>
                            )}
                            value={listOfBlockchains.find(item => item.chainId === chainId) || null}
                            //@ts-ignore
                            options={listOfBlockchains}
                            name="collection"
                            isLoading={false}
                            styles={customStyles}
                            loadingMessage={() => 'Fetching collection'}
                            noOptionsMessage={() => 'No Collection here'}
                          />
                        </div>

                        <div className="form-control-wrapper">
                          <div className="label-wrapper">
                            <div className="main-label">Payment Tokens</div>
                            <div className="sub-label">
                              These tokens can be used to buy and sell your items
                            </div>
                          </div>
                          <div className="eth-token-wrapper">
                            {/* <div className="token-wrapper">
                              <input
                                type="radio"
                                className="token-radio"
                                name="token"
                                value="eth"
                                checked={values.token === 'eth'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="token-icon">
                                <img
                                  src="/images/icons/eth-black-icon.svg"
                                  alt="black icon"
                                />
                              </div>
                              <div className="token-label-wrapper">
                                <div className="token-main-label">ETH</div>
                                <div className="token-sub-label">Ethereum</div>
                              </div>
                            </div> */}
                            <div className="token-wrapper">
                              <input
                                type="radio"
                                className="token-radio"
                                name="token"
                                checked={values.token === 'wth'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value="wth"
                              />
                              <div className="token-icon">
                                <img
                                  src="/images/icons/eth-pink-icon.svg"
                                  alt="pink icon"
                                />
                              </div>
                              <div className="token-label-wrapper">
                                <div className="token-main-label">{(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</div>
                                {/* <div className="token-sub-label">Ethereum</div> */}
                              </div>
                            </div>
                          </div>
                          {/* <Select
                                                      className='select-field'
                                                      placeholder="Add Token"
                                                      onChange={opt =>
                                                          //@ts-ignore
                                                          setFieldValue("addToken", opt?.value)
                                                      }
                                                      isSearchable={true}
                                                      //@ts-ignore
                                                      options={arrayOfTestNetBlockchains}
                                                      //@ts-ignore
                                                      getOptionLabel={e => (
                                                          <div className="option-img-label-wrapper">
                                                              <img src={e.src} alt="icon" />
                                                              <div>{e.label}</div>
                                                          </div>
                                                      )}
                                                      name="addToken"
                                                      isLoading={false}
                                                      loadingMessage={() => "Fetching collection"}
                                                      noOptionsMessage={() => "No Collection here"}
                                                  /> */}
                        </div>

                        {/* <div className="form-control-wrapper">
                                                  <div className="label-wrapper">
                                                      <div className="main-label">Display Theme</div>
                                                      <div className="sub-label">Change how items are shown</div>
                                                  </div>
                                                  <div className='display-theme-wrapper'>
                                                      <div className="theme-wrapper">
                                                          <input
                                                              type="radio"
                                                              className="display-theme-radio"
                                                              name='displayTheme'
                                                              checked={values.token === "padded"}
                                                              onChange={handleChange}
                                                              onBlur={handleBlur}
                                                              value="padded" />
                                                          <div className="theme-img">
                                                              <img src="/images/padded.svg" alt="padded" />
                                                          </div>
                                                          <div className="theme-main-label">Padded</div>
                                                          <div className="theme-sub-label">Recommended for assets with transparent backgrounds</div>
                                                      </div>
                                                      <div className="theme-wrapper">
                                                          <input
                                                              type="radio"
                                                              className="display-theme-radio"
                                                              name='displayTheme'
                                                              checked={values.token === "contained"}
                                                              onChange={handleChange}
                                                              onBlur={handleBlur}
                                                              value="contained" />
                                                          <div className="theme-img">
                                                              <img src="/images/contained.svg" alt="contained" />
                                                          </div>
                                                          <div className="theme-main-label">Contained</div>
                                                          <div className="theme-sub-label">Recommended for assets that are not in 1:1 Ratio</div>
                                                      </div>
                                                      <div className="theme-wrapper">
                                                          <input
                                                              type="radio"
                                                              className="display-theme-radio"
                                                              name='displayTheme'
                                                              checked={values.token === "covered"}
                                                              onChange={handleChange}
                                                              onBlur={handleBlur}
                                                              value="covered" />
                                                          <div className="theme-img">
                                                              <img src="/images/covered.svg" alt="covered" />
                                                          </div>
                                                          <div className="theme-main-label">Covered</div>
                                                          <div className="theme-sub-label">Recommended for assets that go edge-to-edge</div>
                                                      </div>
                                                  </div>
                                              </div> */}

                        {/* <div className="form-logo-title-wrapper">
                          <div className="logo-label-wrapper">
                            <div className="label-logo">
                              <img
                                src="/images/unlockableContent.svg"
                                alt="logo"
                              />
                            </div>
                            <div className="main-label">
                              Explicit and Sensitive Content
                            </div>
                          </div>
                          <div className="label-input-wrapper">
                            <div className="sub-label">
                              Set this item as explcit and sensitive content
                            </div>
                            <input
                              type="checkbox"
                              id="explicitAndSensitiveContent"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.explicitAndSensitiveContent}
                              name="explicitAndSensitiveContent"
                            />
                            <label htmlFor="explicitAndSensitiveContent">
                              Toggle
                            </label>
                          </div>
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
              </div>
            </section>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}

export default CreateCollectionModal
