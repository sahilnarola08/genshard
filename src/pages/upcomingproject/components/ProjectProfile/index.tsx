import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useActiveWeb3React } from "../../../../hooks/web3";
import { changeKYC } from "../../../../state/application/actions";
import { KYC_STATUS } from "../../../../state/application/reducer";
import ProgressBar from "../ProgressBar";
import "./style.sass"
import { useSelector } from "react-redux"
import { AppState } from '../../../../state'
import { useWeb3Contract } from "../../../../hooks/useContract";
import { abi as GEN_DEX_ABI } from "../../../../contracts/GenIDO.json"
import { abi as GEN_STACKING_CONTRACT_ABI } from "../../../../contracts/StakeTESTToken.json"
import { formatEther, formatUnits } from "ethers/lib/utils";
import snsWebSdk from '@sumsub/websdk';
import Modal from "../../../../shared/components/modal";
import { VerifyCard } from "../../../../../src/shared/components/header";
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useAddPopup } from "../../../../state/application/hooks";
import { calculateGasMargin, getContract, getERC20Contract } from "../../../../utils";
import { abi as USDT_ABI } from '../../../../contracts/USDT.json'
import { Contract } from "@ethersproject/contracts";
import { ERC20_ABI } from "../../../../constants/abis/erc20";
import { APPLY_IDO_PROJECT_WHITELIST } from "../../../../constants";
import { getApplyWhiteListData } from '../API/ApiCall'
import privateLock from "../../../../images/lounchpad/private-lock-icon.svg"

var _ = require("lodash");
export const timeline = [
  {
    title: "Whitelist Open",
    date: 1644325200,
  },
  {
    title: "Whitelist Close",
    date: 1644670800,
  },
  {
    title: "KYC Open",
    date: 1644757200,
  },
  {
    title: "KYC Close",
    date: 1644843600,
  },
  {
    title: "Pool Open",
    date: 1644843600,
  },
];

const ProjectProfile = (selectedProjectData: any) => {

  console.log('ProjectProfileData', selectedProjectData);

  const socialLinks = [
    { src: "twitter" },
    { src: "telegram" },
    { src: "mail" },
    { src: "browser" },
  ];

  const projectData = selectedProjectData && selectedProjectData?.data

  const getTargetUrl = (link: string): string => {
    if (link === "twitter") {
      return projectData && projectData?.data?.socialLinks?.twitterURL
    } else if (link === "telegram") {
      return projectData && projectData?.data?.socialLinks?.telegramURL
    } else if (link === "mail") {
      return projectData && projectData?.data?.socialLinks?.mediumURL
    } else if (link === "browser") {
      return projectData && projectData?.data?.socialLinks?.websiteURL
    } else {
      return '#'
    }
  }

  const genDex = useWeb3Contract(GEN_DEX_ABI)
  const genDexStacking = useWeb3Contract(GEN_STACKING_CONTRACT_ABI, "staking")
  const { account, chainId, library } = useActiveWeb3React()
  const genDexAddress = projectData && projectData?.data?.dexAddress;
  const dispatch = useDispatch();
  const [kycStatus, setKYCStatus] = useState<KYC_STATUS>(KYC_STATUS.NOT_SET)
  const KYC_BASE = process.env.REACT_APP_KYC_ENDPOINT!
  const network = useSelector((state: AppState) => state.application.network)
  const [lowAllocPerUserPerTier, setLowAllocPerUserPerTier] = useState(0);
  const [tge, setTge] = useState(0);
  const [getTokensSold, setGetTokensSold] = useState(0);
  const [projectProgressPercentage, setProjectProgressPercentage] = useState(0);
  let totalSoldProjectAllocation = 0;
  const [raisedProjectUSDT, setRaisedProjectUSDT] = useState(0);
  const [accessToken, setAccessToken] = useState<string>()
  const [isKYCWindowOpen, setKYCWindowOpen] = useState(false)
  const [isAllowedForAllocation, setIsAllowedForAllocation] = useState(false)
  const [upcommingStep, setUpcommingStep] = useState<any>({})

  let getUSDTDecimals = 0
  let getTokenDecimals = 0
  let underlyingToken = ''

  async function getNewAccessToken() {
    const res = await axios.get(KYC_BASE + `get-access-token?userAddress=${account!}`)
    return res.data.token
  }

  async function getKYCStatus() {
    try {
      const res = await axios.get(KYC_BASE + `get-applicant-status?userAddress=${account!}`)
      return res.data
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const handleVerifyKyc = (e: any) => {
    e.stopPropagation();
    launchWebSdk(process.env.REACT_APP_SUMSUB_BASE!, 'basic-kyc', accessToken!)
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

  const getTGE = async () => {
    console.log('Entered', projectData, genDexAddress);

    if (!genDexAddress || account === undefined) return
    try {

      let getBCProjectInfo = await genDex(genDexAddress!).methods.getProjectInfo().call()
      let usdtAccountAddress = getBCProjectInfo?._usdt //await genDex(genDexAddress!).methods.usdt().call()
      console.log(usdtAccountAddress)
      const usdtMarket = getContract(usdtAccountAddress, USDT_ABI, library!, account!)
      if (!usdtMarket) throw new Error('No Contract!')

      getUSDTDecimals = await usdtMarket.decimals()

      const tge = await genDex(genDexAddress!).methods.TGE().call()
      console.log('tge', tge);
      setTge(tge);

      const erc20 = new Contract(getBCProjectInfo?._underlyingToken as string, ERC20_ABI, library)
      if (!erc20) throw new Error('No Contract!')
      getTokenDecimals = await erc20.decimals()

      const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
      const tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)

      const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted //await genDex(data?.dexAddress).methods.minTokenAllocationPermitted().call()
      const getTokensSoldInProject = await genDex(genDexAddress).methods.getTokensInfo().call()

      // const getTokensSoldInProject = await genDex(genDexAddress).methods.getTokensSold().call()
      totalSoldProjectAllocation = getTokensSoldInProject && formatUnits(getTokensSoldInProject?._tokensSold, getTokenDecimals)

      console.log('totalSoldProjectAllocation', getTokensSoldInProject, totalSoldProjectAllocation, projectData?.totalTokenAllocation);
      setGetTokensSold(totalSoldProjectAllocation)
      setProjectProgressPercentage(Number((Number(totalSoldProjectAllocation) * 100) / Number(projectData?.totalTokenAllocation)))
      setLowAllocPerUserPerTier(Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))

      const getAmountRaisedProject = await genDex(genDexAddress).methods.getAmountRaised().call()
      setRaisedProjectUSDT(getAmountRaisedProject && formatUnits(getAmountRaisedProject, getUSDTDecimals))
      //setRaisedProjectUSDT(Number(totalSoldProjectAllocation) * Number(projectData?.tokensPerUSD))

    } catch (error) {
      console.log("dataerror", error);

    }
  }


  const checkApplyForWhitelist = async () => {
    const projectId: any = projectData && projectData?.data?._id;
    if (account === undefined) return
    await getApplyWhiteListData(account!, projectId, true).then((res) => {
      let isCheckedAllowed = (res?.status === 200 && res?.data?.status === true) ? true : false
      console.log('getApplyWhiteListDatares', res, isCheckedAllowed)
      setIsAllowedForAllocation(isCheckedAllowed)
    })
  }

  useEffect(() => {
    console.log("upcommingStep", upcommingStep)
    dispatch(changeKYC(kycStatus))
  }, [kycStatus, upcommingStep])


  console.log("upcommingStepupcommingStep", upcommingStep)
  useEffect(() => {
    getTGE();
    checkApplyForWhitelist();
    console.log("projectData?.data?.timeline", projectData);
    if (projectData && projectData !== undefined) {
      if (projectData?.data?.timeline) {
        console.log("projectData?.data?.timeline", projectData?.data?.timeline)
        for (let item of projectData?.data?.timeline) {
          if (item && item?.date > moment().unix()) {
            console.log("itemitemitemitem", item)
            setUpcommingStep(item)
            break;
          }
        }

      }
    }
  }, [projectData, totalSoldProjectAllocation, account])

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

  const history = useHistory();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();

  const handleApplyForWhitelist = async () => {
    // if (kycStatus == KYC_STATUS.VERIFIED) {
    if (!projectData && projectData?.data?._id || account === undefined) return
    await getApplyWhiteListData(account!, projectData && projectData?.data?._id, false).then(res =>
      addErrorPopup({
        txn: {
          hash: '',
          success: res?.status === 200,
          summary: res?.data?.message ?? '',
          description: '',
          withExternalLink: false,
        }
      })
    )
    // }
    // else {
    //   addErrorPopup({
    //     txn: {
    //       hash: '',
    //       success: false,
    //       summary: 'Please complete your KYC Verification to participate into allocation.',
    //       description: '',
    //       withExternalLink: false,
    //     }
    //   });
    // }
  }

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
    <>
      <div>
        <div className="liveBtnWrapper">
          {/* <div className="backwordBtn" onClick={() => history.goBack()}>
          <img className="icon" src="/images/liveproject/backVector.svg" alt="icon" />
          <img
            className="backIcon"
            src="/images/liveproject/backBackground.svg"
            alt="iconback"
          />
        </div> */}
          {/* <button style={{ backgroundColor: projectData?.cardTitle === "Ended" ? '#00CF6C' : '' }}>{projectData?.cardTitle}</button> */}
          <p className="paragraph-new-medium text-center" >HOME &gt; VoteDAO &gt; {projectData && projectData?.data?.name}</p>
          <div className="mt-4 mb-3">
            <div className="private-public-label">PRIVATE <img src={privateLock} alt="" /></div>
          </div>
        </div>
        <h2 className="heading-new-2 text-center mb-3">{projectData && projectData?.data?.name}</h2>
        <div className="projectProfile">
          <div className="profilePic">
            <img src={projectData && projectData?.data?.projectImage} alt="avtar" />
          </div>
          <div className="projectNameAndChain">
            <div className="heading-new-5 mb-2">${projectData && projectData?.data?.projectShortCode}</div>
            <div className="paragraph-new">Chain : {network === "BSC" ? "BNB" : network}</div>
          </div>
        </div>
        <div className="profile">
          {projectData?.cardTitle === "Upcoming" &&
            <div className='starting-info d-flex align-items-center justify-content-center gap-3 my-4'>
              <p className='paragraph-new-small fw-bold mb-0'>Starts</p>
              <p className='paragraph-new-small mb-0 mt-0 project-start-badge'>{moment.unix(parseInt(projectData?.data?.startDate!)).utc().format('MMM DD, kk:mm')} UTC</p>
            </div>
          }
          {projectData?.cardTitle === "LIVE" &&
            <div className='starting-info d-flex align-items-center justify-content-center gap-3 my-4'>
              <p className='paragraph-new-small mb-0 mt-0 project-start-badge text-center' style={{ width: "40%" }}>LIVE</p>
            </div>
          }
          {projectData?.cardTitle === "Ended" &&
            <div className='starting-info d-flex align-items-center justify-content-center gap-3 my-4'>
              <p className='paragraph-new-small  text-center project-start-badge-ended' style={{ width: "40%" }}>Ended</p>
            </div>
          }
          {/* <div className="profilePic">
          <img src="/images/liveproject/avtar.svg" alt="avtar" />
          <img src={projectData && projectData?.data?.projectImage} alt="avtar" />
        </div> */}
          {/* <div className="requireVerifyKYC">
          <div className="requireKYC">This IDO Require KYC</div>
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
        </div> */}
          {/* {projectData?.cardTitle === "LIVE" && Number(projectData && projectData?.data?.timeline[0].date) <= moment().unix() && moment().unix() <= Number(projectData && projectData?.data?.timeline[1].date) && <button onClick={handleApplyForWhitelist}
          style={{
            color: '#fff', backgroundColor: '#00CF6C', marginTop: '30px', width: '100%',
            borderRadius: '10.25px', border: 'none', fontSize: '21.85px', lineHeight: '47px', padding: '2px 30px'
          }}
          disabled={isAllowedForAllocation}
        >{!isAllowedForAllocation ? "Apply For Whitelist" : "Already Applied for Whitelist"}</button>} */}

          <div className="socialLink mt-4">
            {socialLinks.map((link, id) => (
              // <img src={`/images/liveproject/${link.src}.svg`} alt={link.src} />
              <a target="_blank" href={getTargetUrl(link.src)}>
                <img src={`/images/liveproject/${link.src}.svg`} alt={link.src} />
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* <span>{subPublic} {data?.projectShortCode}</span>
                        <span>{subPublic}/{data?.totalSuppliedTokenSize} {data?.projectShortCode}</span> */}
      {/* <div className="progressBarWrapper">
        <div className="progressPercerntage">
          <div>{(projectData?.cardTitle === "Ended") ? "Finished " + moment.unix(parseInt(projectData && projectData?.data?.endDate!)).fromNow() :
            (moment.unix(parseInt(projectData && projectData?.data?.preIdo!)).fromNow() < moment.unix(parseInt("" + new Date())).fromNow()) ? "Pool Open" : "Pool Opens " + moment.unix(parseInt(projectData && projectData?.data?.preIdo!)).fromNow()}</div>
          <div>{Number(projectProgressPercentage).toFixed(2)}%</div>
        </div>
        <ProgressBar height={13} bgcolor={"#117DCC"} progress={projectProgressPercentage} />
        <div className="prjxWrapper">

          <div className="title">{Number(getTokensSold).toFixed(0)} {projectData && projectData?.data?.projectShortCode}</div>
          <div className="value">{Number(getTokensSold).toFixed(0)}/{Number(projectData?.totalTokenAllocation ? projectData?.totalTokenAllocation : projectData && projectData?.data?.totalSuppliedTokenSize).toFixed(0)} {projectData && projectData?.data?.projectShortCode}</div>
        </div>
        <div className="raiseWrapper">
          <div className="title">Price</div>
          <div className="value">{(projectData?.cardTitle === "Ended") ? `$${Number(raisedProjectUSDT).toFixed(5)}` : `1 $${projectData && projectData?.data?.projectShortCode} = $${Number(Number(projectData && projectData?.data?.totalSuppliedTokenSize) / Number(projectData && projectData?.data?.hardCapValue)).toFixed(5)}`}</div>
        </div>
      </div> */}
      {/* {projectData?.cardTitle === "Ended" && <div className="cardTypeLabel">Base Allocation = ${lowAllocPerUserPerTier}</div>}
      {projectData?.cardTitle === "Upcoming" && <div className="cardTypeLabel">Registration will open soon</div>} */}
      {/* {projectData?.cardTitle === "LIVE" && <>  */}
      <div>
        <div className="timeLime heading-new-5 text-center mt-4 mb-3">Timeline</div>
        {Object.keys(upcommingStep).length > 0 && <div className='notch text-center my-3'><span style={{ color: "#65DB6A", fontWeight: 600, fontFamily: 'Space Grotesk' }}>{countdown(moment().unix(), upcommingStep && upcommingStep?.date)}</span></div>}
        {Object.keys(upcommingStep).length > 0 && <div className='paragraph-new my-3 text-center'>for {upcommingStep && upcommingStep?.title} to begin</div>}
        <ul className="timeline-main-container">
          {/* <div className="timeline-background-container">
            <div className="timeline-background" />
          </div> */}
          {/* <div className="ball-outer">
          <div className="ball-middle">
            <div className="ball-inner" />
          </div>
        </div> */}
          {/* <div className="timeline-date">
          {moment.unix(item.date).format("Do MMM YYYY")}
        </div> */}
          {_.map(projectData && projectData?.data?.timeline, (item: { title: string; date: number }) => {
            return (
              <li className={`timeline-item-container ${item.date < moment().unix() ? "select-timeline-item" : ""}`}>
                <p className="timeline-title paragraph-new-medium" style={{ color: (item.date < moment().unix()) ? '#54C4FC' : '' }}>{item.title} <div className="white-spot" style={{ background: (item.date < moment().unix()) ? '#54C4FC' : '' }}></div></p>
                <div className="bottom-line"></div>
              </li>
            );
          })}
          {/* <div className="timeline-bottom-background-container">
          <div className="timeline-bottom-background" />
        </div> */}
        </ul>
      </div>
      <Modal kycChanges={true} isOpen={isKYCWindowOpen} onClose={() => setKYCWindowOpen(false)}>
        <VerifyCard id="sumsub-websdk-container" />
      </Modal>
      {/* </>
      } */}
    </>
  );
};

export default ProjectProfile;
