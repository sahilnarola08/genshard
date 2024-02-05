import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import './style.sass'
import { abi as USDT_ABI } from '../../../../../contracts/USDT.json'
import twitter from "../../../../../images/homepage/twitter.svg"
import metaverse from "../../../../../images/homepage/metaverse.svg"
import telegram from "../../../../../images/homepage/telegram.svg"
import websiteLink from "../../../../../images/homepage/websiteLink.svg"
import bannerIMG from "../../../../../images/homepage/banner-img.svg"
import behanceLogo from "../../../../../images/homepage/behancesmall-logo.svg"
import Button from '../../../../../shared/components/buttons'
import Progressbar from '../../ProgressBar'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Papa from 'papaparse'
import { BigNumber } from 'ethers'
import { useWeb3Contract } from '../../../../../hooks/useContract'
import { useActiveWeb3React } from '../../../../../hooks/web3'
import { abi as GEN_DEX_ABI } from "../../../../../contracts/GenIDO.json"
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useSelector } from "react-redux"
import { AppState } from '../../../../../state'
import LoaderComp from "../../../../../shared/components/LoaderComponent";
import { KYC_STATUS } from '../../../../../state/application/reducer'
import axios from 'axios'
import Modal from '../../../../../shared/components/modal'
import { VerifyCard } from '../../../../../../src/shared/components/header'
import snsWebSdk from '@sumsub/websdk';
import { calculateGasMargin, getContract, getERC20Contract } from "../../../../../utils";
import { Contract } from "@ethersproject/contracts";
import { ERC20_ABI } from "../../../../../constants/abis/erc20";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const redirectIconsMap: any = {
    twitter,
    telegram,
    metaverse,
    websiteLink,
}

const GenpadCard = (props: any) => {

    const socialLinks = [
        { src: "twitter" },
        { src: "telegram" },
        { src: "mail" },
        { src: "browser" },
    ];

    const { data, cardTitle } = props;

    const colorHandle = useCallback(() => {

    }, [cardTitle])

    const history = useHistory()
    const network = useSelector((state: AppState) => state.application.network)

    const getTargetUrl = (link: string): string => {
        if (link === "twitter") {
            return data?.socialLinks?.twitterURL
        } else if (link === "telegram") {
            return data?.socialLinks?.telegramURL
        } else if (link === "mail") {
            return data?.socialLinks?.mediumURL
        } else if (link === "browser") {
            return data?.socialLinks?.websiteURL
        } else {
            return '#'
        }
    }

    console.log("data====>", data);

    let subPrivate = data.subPrivate;
    let subPublic = data.subPublic ?? 0;
    let percentageValue = 0;
    let totalProjectAllocation = 0;
    let totalSoldProjectAllocation = 0;
    const [projectProgressPercentage, setProjectProgressPercentage] = useState(0);
    const [raisedProjectUSDT, setRaisedProjectUSDT] = useState(0);
    const [lowAllocPerUserPerTier, setLowAllocPerUserPerTier] = useState(0);

    const [purchase, setPurchase] = useState<any>({});
    const [arrayOfWeightages, setArrayOfWeightages] = useState([]);
    const [arrayOfTranches, setArrayOfTranches] = useState([]);
    const [tokensPerUSD, setTokensPerUSD] = useState(0);
    const [underlyingToken, setUnderlyingToken] = useState('');
    const [projectStartTime, setProjectStartTime] = useState('');

    let tokensforUSDProject = 0
    const [msg, setMsg] = useState("Please Wait")
    const [isLoading, setIsLoading] = useState(false)
    const [kycStatus, setKYCStatus] = useState<KYC_STATUS>(KYC_STATUS.NOT_SET)
    const KYC_BASE = process.env.REACT_APP_KYC_ENDPOINT!

    const genDex = useWeb3Contract(GEN_DEX_ABI)
    const { account, chainId, library } = useActiveWeb3React()

    const [tge, setTge] = useState(0);
    const [totalTokenAllocation, setTotalTokenAllocation] = useState(0);
    const [getTokensSold, setGetTokensSold] = useState(0);
    const [accessToken, setAccessToken] = useState<string>()
    const [isKYCWindowOpen, setKYCWindowOpen] = useState(false)
    const [enableFcfsSale, setEnableFcfsSale] = useState(false)

    let getUSDTDecimals = 0
    let getTokenDecimals = 0

    async function getKYCStatus() {
        try {
            const res = await axios.get(KYC_BASE + `get-applicant-status?userAddress=${account!}`)
            return res.data
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async function getNewAccessToken() {
        const res = await axios.get(KYC_BASE + `get-access-token?userAddress=${account!}`)
        return res.data.token
    }

    function launchWebSdk(apiUrl: string, flowName: string, accessToken: string, applicantEmail?: string, applicantPhone?: string) {
        let snsWebSdkInstance = snsWebSdk.init(
            accessToken,
            // token update callback, must return Promise
            // Access token expired
            // get a new one and pass it to the callback to re-initiate the WebSDK
            () => getNewAccessToken()
            // async (newAccessTokenCallback: any) => {
            //   let newAccessToken = await getNewAccessToken()
            //   newAccessTokenCallback(newAccessToken)
            // }
        )
            .withConf({
                lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
                email: applicantEmail,
                phone: applicantPhone,
                uiConf: {
                    customCssStr: ":root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}"
                    // URL to css file in case you need change it dynamically from the code
                    // the similar setting at Customizations tab will rewrite customCss
                    // you may also use to pass string with plain styles `customCssStr:`
                },
                // onMessage: (type: any, payload: any) => {
                //   console.log('WebSDK onMessage', type, payload)
                // },
                // onError: (error: any) => {
                //   console.error('WebSDK onError', error)
                // },
            })
            .withOptions({ addViewportTag: false, adaptIframeHeight: true })
            // see below what kind of messages WebSDK generates
            .on('idCheck.stepCompleted', (payload: any) => {
                console.log('WebSDK stepCompleted', payload)
            })
            .on('idCheck.onError', (error: any) => {
                console.error('WebSDK onError', error)
            })
            .build();
        snsWebSdkInstance.launch('#sumsub-websdk-container')
        setKYCWindowOpen(true)
    }

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getNewAccessToken()
                setAccessToken(token)
                const result = await getKYCStatus()
                if (result.code === 404) {
                    await axios.post(KYC_BASE + `create-applicant`, {
                        userAddress: account!
                    })
                }
                //setKYCStatus(KYC_STATUS.VERIFIED);
                setKYCStatus(
                    result.code === 404
                        ? KYC_STATUS.NOT_VERIFIED
                        : result.review.reviewStatus === 'init'
                            ? KYC_STATUS.NOT_VERIFIED
                            : result.review.reviewResult.reviewAnswer === 'GREEN'
                                ? KYC_STATUS.VERIFIED
                                : KYC_STATUS.NOT_VERIFIED)
            } catch (err) {
                //setKYCStatus(KYC_STATUS.VERIFIED);
                setKYCStatus(KYC_STATUS.NOT_VERIFIED);
            }
        }
        if (account) {
            getAccessToken()
        }
    }, [account])

    const getTGE = async () => {
        if (data?.dexAddress) {
            try {
                let getBCProjectInfo = await genDex(data?.dexAddress!).methods.getProjectInfo().call()

                const erc20 = new Contract(getBCProjectInfo?._underlyingToken as string, ERC20_ABI, library)
                if (!erc20) throw new Error('No Contract!')
                getTokenDecimals = await erc20.decimals()

                const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
                tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)
                setTokensPerUSD(tokensforUSDProject)

                const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted //await genDex(data?.dexAddress).methods.minTokenAllocationPermitted().call()
                setLowAllocPerUserPerTier(Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))
                console.log("lowTierAllocPerUser1111", lowTierAllocPerUser, Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject));
            } catch (error) {
            }
        }
    }

    const getCompletedProject = async () => {
        console.log("==========================,", data);
        // setIsLoading(true)
        if (data.subSheet !== undefined || data.subSheet.length > 0) {
            console.log("sssss");
            const results = await new Promise(function (complete, error) {
                Papa.parse(data.subSheet!, {
                    download: true,
                    header: true,
                    complete,
                    error
                })
            });
            console.log(results)
            // @ts-ignore
            subPrivate = (parseFloat((results.data[0] && results.data[0].sub) || 0) * 100).toFixed(2)
            // @ts-ignore
            subPublic = (parseFloat((results.data[2] && results.data[2].sub) || 0) * 100).toFixed(2)
            percentageValue = +((subPublic) * 100 / Number(data?.totalSuppliedTokenSize)).toFixed(2)
        }

        if (data?.dexAddress) {
            try {
                let getBCProjectInfo = await genDex(data?.dexAddress!).methods.getProjectInfo().call()

                // let usdtAccountAddress = await genDex(data?.dexAddress!).methods.usdt().call()
                console.log(getBCProjectInfo?._usdt)
                const usdtMarket = getContract(getBCProjectInfo?._usdt, USDT_ABI, library!, account!)
                if (!usdtMarket) throw new Error('No Contract!')
                getUSDTDecimals = await usdtMarket.decimals()

                // const underlyingTokenValue = await genDex(data?.dexAddress!).methods.underlyingToken().call()
                setUnderlyingToken(getBCProjectInfo?._underlyingToken)
                const erc20 = new Contract(getBCProjectInfo?._underlyingToken as string, ERC20_ABI, library)
                if (!erc20) throw new Error('No Contract!')
                getTokenDecimals = await erc20.decimals()

                let arrayWeigthage = getBCProjectInfo?._trancheWeightage//await genDex(data?.dexAddress).methods.returnTrancheWeightage().call() //PSC
                console.log("arrayWeigthage", arrayWeigthage);

                let formatedWeight = arrayWeigthage?.map((item: string) => Number(formatUnits(item, 18)))
                console.log("arrayWeigthage1", formatedWeight);

                setPurchase(await genDex(data?.dexAddress).methods.purchases(account!).call()) //PSC
                setArrayOfWeightages(formatedWeight)

                setArrayOfTranches(getBCProjectInfo?._trancheLength) //PSC
                // setArrayOfTranches(await genDex(data?.dexAddress).methods.returnTrancheLength().call()) //PSC

                const totalTokenAllocationForProject = getBCProjectInfo?._totalTokensAllocated // await genDex(data?.dexAddress).methods.totalTokenAllocation().call()
                totalProjectAllocation = totalTokenAllocationForProject && formatUnits(totalTokenAllocationForProject, getTokenDecimals)
                setTotalTokenAllocation(totalProjectAllocation)

                const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
                tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)
                setTokensPerUSD(tokensforUSDProject)

                const getTokensSoldInProject = await genDex(data?.dexAddress).methods.getTokensInfo().call()

                // const getTokensSoldInProject = await genDex(data?.dexAddress).methods.getTokensSold().call()
                totalSoldProjectAllocation = getTokensSoldInProject && formatUnits(getTokensSoldInProject?._tokensSold, getTokenDecimals)
                setGetTokensSold(totalSoldProjectAllocation)
                setProjectProgressPercentage(Number((Number(totalSoldProjectAllocation) * 100) / Number(totalProjectAllocation)))

                //setRaisedProjectUSDT(Number(totalSoldProjectAllocation) * Number(tokensforUSDProject))
                console.log("projectProgressPercentage", projectProgressPercentage);

                // Get lowTierAllocPerUser
                const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted //await genDex(data?.dexAddress).methods.minTokenAllocationPermitted().call()
                setLowAllocPerUserPerTier(Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))
                console.log("lowTierAllocPerUser", lowTierAllocPerUser, Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject));

                const projectStartTimeValue = await genDex(data?.dexAddress).methods.startTime().call()
                setProjectStartTime(projectStartTimeValue)

                const enableFCFSProjectTime = getBCProjectInfo?._guranteedSaleDuration //await genDex(data?.dexAddress).methods.guranteedSaleDuration().call()
                console.log("enableFCFSProjectTime", enableFCFSProjectTime, Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0), Number(moment().unix()), Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0) <= Number(moment().unix()));
                setEnableFcfsSale((Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0) <= Number(moment().unix())) ? true : false)

                const getAmountRaisedProject = await genDex(data?.dexAddress).methods.getAmountRaised().call()
                console.log("getAmountRaisedProject", getAmountRaisedProject);
                setRaisedProjectUSDT(getAmountRaisedProject && formatUnits(getAmountRaisedProject, getUSDTDecimals))

                const tge = await genDex(data?.dexAddress).methods.TGE().call()
                console.log("TGGGG", tge);
                setTge(tge);
            } catch (error) {

            }
            getTGE()
        }
        else {
            setProjectProgressPercentage(0)
            setGetTokensSold(0)
            setTokensPerUSD(0)
            setTotalTokenAllocation(0)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (data) {
            console.log("ProjectData : ", data);
            getCompletedProject()
        }
    }, [data])

    let projectData = {
        data, cardTitle, tokensPerUSD, getTokensSold, totalTokenAllocation, percentageValue, subPublic, arrayOfWeightages, arrayOfTranches, underlyingToken, lowAllocPerUserPerTier, enableFcfsSale, projectStartTime, tokenAllocationBought: purchase?.tokenAllocationBought && formatUnits(purchase?.tokenAllocationBought, getTokenDecimals), tge, usdAllocationBought: Number(purchase?.tokenAllocationBought && formatUnits(purchase?.tokenAllocationBought, getTokenDecimals)) / Number(tokensPerUSD), position: purchase?.position
    }

    const handleVerifyKyc = (e: any) => {
        e.stopPropagation();
        launchWebSdk(process.env.REACT_APP_SUMSUB_BASE!, 'basic-kyc', accessToken!)
    }

    console.log("card loader::::", isLoading);

    // let poolOpen;
    const [poolOpen, setPoolOpen] = useState("")

    useEffect(() => {
        console.log("loader");

        const poolDate = moment.unix(parseInt(data?.preIdo!)).fromNow()
        if (cardTitle === "Ended") {
            setPoolOpen(`Finished ${moment.unix(parseInt(data?.endDate!)).fromNow()}`)
        } else if (cardTitle === "Upcoming") {
            setPoolOpen(`Pool Opens ${poolDate}`)
        } else {
            if (poolDate < moment.unix(parseInt("" + new Date())).fromNow()) {
                setPoolOpen("Pool Open")
            } else {
                setPoolOpen(`Pool Opens ${poolDate}`)
            }
        }
        // ? "Finished " + moment.unix(parseInt(data?.preIdo!)).fromNow() : "Pool Opens " + moment.unix(parseInt(data?.preIdo!)).fromNow()
    }, [data, cardTitle])

    function countdown(startdate: any, enddate: any) {
        let endDateObj = moment(enddate)
        let diff = endDateObj.diff(startdate)
        let s: any = moment.duration(diff)
        let d: any = Math.floor(s / (3600 * 24));
        s -= d * 3600 * 24;

        const h = Math.floor(s / 3600);

        s -= h * 3600;

        const m = Math.floor(s / 60);

        s -= m * 60;

        let tmp: any = [];

        if (d > 0) {
            tmp.push(d + 'd');
            (d || h) && tmp.push(h + 'h');
        }
        else if (h > 0) {
            tmp.push(h + 'h');
            (d || h || m) && tmp.push(m + 'm');
        }
        else if (m >= 0) {
            tmp.push(m + 'm');
            tmp.push(s + 's');
        }

        return tmp.join(' ');
    }

    function toTitleCase(str: any) {
        if (str != undefined && str != "") {
            return str.replace(
                /\w\S*/g,
                function (txt: any) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
    }

    return (
        <div className='genpad-card-container' onClick={() => {
            // if (cardTitle !== 'Upcoming' && !isLoading) {
            history.push(`/project/${projectData?.data?._id}`, projectData)
            // }
        }}>
            <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />
            {/* {cardTitle === "Ended" || cardTitle === "Upcoming" &&
             } */}
            {cardTitle === "LIVE" ?
                <div className='notch' style={{ border: '2px solid #2479DF', color: "#54C4FC" }}>{toTitleCase(cardTitle)} <span style={{ color: "#FFFFFF", fontWeight: 300, fontFamily: 'Space Grotesk' }}>{" | Time Left : " + countdown(moment().unix(), data?.preIdo!)}</span> </div> :
                <div className='notch' style={{ border: cardTitle === "Ended" ? '1px solid #2F2F2F' : '2px solid #2479DF' }}>{toTitleCase(cardTitle)}</div>
            }
            <div className="inner-div">
                <div className="banner-image">
                    <img src={bannerIMG} className='img-fluid' alt="" />
                </div>
                <div className='overview-container'>
                    <div className="image">
                        {!!data?.projectImage && <img src={data?.projectImage} alt="image" height="100%" width="100%" />}
                    </div>
                    <div className='overview-info'>
                        <div className="name-div">
                            <h1 className=''>{data?.name}</h1>
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-2">
                            <h3 className='me-2'>${data?.projectShortCode}</h3>
                            <img src={behanceLogo} className='img-fluid chain-img' alt="" />
                            {/* <h3>Chain : {network === "BSC" ? "BNB" : network}</h3> */}
                        </div>
                    </div>
                </div>
                <div className="privat-public gap-3">
                    <button className='white-border-button'>Private</button>
                    <button className='white-border-button'>Gaming</button>
                </div>
                <div className='links'>
                    {/* {
                        (data?.socialLinks || []).map((link:any) => (
                            <img src={link?.image} alt="image" width="28px" height="28px" />
                        ))
                    } */}
                    {socialLinks.map((link, id) => (
                        <a target="_blank" href={getTargetUrl(link.src)} onClick={(e) => e.stopPropagation()}><img src={`/images/liveproject/${link.src}.svg`} className='img-fluid' alt={link.src} /></a>
                    ))}
                </div>
                <p className='paragraph-new-medium color-white-new'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea</p>
                {cardTitle === "Upcoming" &&
                    <div className='starting-info'>
                        <p className='paragraph-new-small fw-bold mb-0'>Starts</p>
                        <p className='paragraph-new-small mb-0 mt-0 project-start-badge'>{moment.unix(parseInt(data?.startDate!)).utc().format('MMM DD, kk:mm')} UTC</p>
                    </div>
                }
                {cardTitle === "Ended" &&
                    <p className='paragraph-new-small my-4 text-center fw-bold' style={{ color: "#65DB6A" }}>Completed</p>
                }
                {cardTitle === "LIVE" &&
                    <>
                        {/* // <div className='progress-container'>
                    //     <div className="progress-info">
                    //         <span><h2>{poolOpen}</h2></span>
                    //         <span><h2>{Number(projectProgressPercentage).toFixed(2)}%</h2></span>
                    //     </div> */}
                        {/* <div className='progress-bar' style={{ borderColor: cardTitle === "Ended" ? '#00CF6C' : '#FF0071' }}>
                        <div
                            style={{ backgroundColor: (cardTitle === "Ended") ? '#00CF6C' : '#FF0071', height: '100%', width: `${projectProgressPercentage >= 100 ? 100 : projectProgressPercentage}%` }}
                        ></div>
                    </div> */}
                        {/* //     <Progressbar */}
                        {/* //         color={cardTitle === "Ended" ? '#117DCC' : '#117DCC'}
                    //         progress={data?.progress?.completion_percentage || 0}
                    //     />
                    //     <div className="progress-info">
                    //         <span>{Number(getTokensSold).toFixed(0)} {data?.projectShortCode}</span>
                    //         <span>{Number(getTokensSold).toFixed(0)}/{Number(totalTokenAllocation ? totalTokenAllocation : data?.totalSuppliedTokenSize).toFixed(0)} {data?.projectShortCode}</span>
                    //     </div>
                    // </div> */}
                        <div className="d-flex align-items-center justify-content-center gap-4 mt-4">
                            <div className="">
                                <div className='percentage-slider text-center m-auto'>
                                    <CircularProgressbar value={50} text={`${Number(projectProgressPercentage).toFixed(0)}%`} background
                                        backgroundPadding={0}
                                        styles={buildStyles({
                                            backgroundColor: "transparent",
                                            textColor: "#fff",
                                            pathColor: "#65DB6A",
                                            trailColor: "white",
                                            // border: "0.743811px solid #FCFCFC"
                                        })} />
                                </div>
                            </div>
                            <p className='paragraph-new-small my-4 text-center fw-bold'>Completed</p>
                        </div>
                    </>
                }
                <div className="total-info mb-3">
                    <p className='paragraph-new-small mb-0'>0 PRJX</p>
                    <p className='paragraph-new-small my-0'>{Number(getTokensSold).toFixed(0)}/{Number(totalTokenAllocation ? totalTokenAllocation : data?.totalSuppliedTokenSize).toFixed(0)} {data?.projectShortCode}</p>
                </div>
                <div className="total-info my-0">
                    <p className='paragraph-new-small mb-0' >Total Raise</p>
                    <p className='paragraph-new-small my-0'>{`1 $${data?.projectShortCode} = $${Number(data?.totalSuppliedTokenSize) / Number(data?.hardCapValue)}`} </p>
                </div>
                {/* <hr /> */}

                {/* <div className='kyc-section'>
                    {cardTitle === "Ended" ?
                        <h4>Base Allocation = ${lowAllocPerUserPerTier}</h4>
                        : <>
                            <h4>
                                This IDO Requires KYC
                            </h4>
                            <button style={{ display: 'flex', alignItems: 'center' }} onClick={handleVerifyKyc} disabled={kycStatus === KYC_STATUS.VERIFIED}>
                                <div style={{
                                    height: 12,
                                    width: 12,
                                    borderRadius: '50%',
                                    marginRight: 4,
                                    marginTop: 2,
                                    backgroundColor: kycStatus === KYC_STATUS.VERIFIED ? '#00CF6C'
                                        : kycStatus === KYC_STATUS.NOT_VERIFIED ? '#FF0000'
                                            : 'transparent'
                                }} />
                                {kycStatus === KYC_STATUS.VERIFIED ? 'KYC Verified'
                                    : kycStatus === KYC_STATUS.NOT_VERIFIED ? 'Verify KYC'
                                        : 'Verify KYC'}
                            </button>
                        </>
                    }
                </div> */}
            </div>
            <Modal kycChanges={true} isOpen={isKYCWindowOpen} onClose={() => setKYCWindowOpen(false)}>
                <VerifyCard id="sumsub-websdk-container" />
            </Modal>
        </div>
    )
}

export default memo(GenpadCard)