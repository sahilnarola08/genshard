import { useState, useEffect } from "react";
import "./style.sass"
import ProjectProfile from "./components/ProjectProfile";
import ProjectDetails from "./components/ProjectDetails";
import SwapClaim from "./components/SwapClaim";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { useAddPopup } from "../../state/application/hooks";
import axios from "axios";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "ethers/lib/utils";
import { ERC20_ABI } from "../../constants/abis/erc20";
import { useWeb3Contract } from "../../hooks/useContract";
import { useActiveWeb3React } from "../../hooks/web3";
import { abi as GEN_DEX_ABI } from "../../contracts/GenIDO.json"
import Papa from 'papaparse'
import behanceLogo from "../../images/homepage/behancesmall-logo.svg"
import bannerImg from "../../images/homepage/banner-img.svg"
import Footercmp from "../../shared/components/footercmp/footercmp";
import SimilarProjectSlider from "./components/similar-project-slider-comp/similar-project-slider";

const LiveProjectPage = () => {
  const params = useParams<{ projectid: string }>()
  const [selectedMenu, setselectedMenu] = useState("Project Details");
  const [projectMenu, setProjectMenu] = useState(["Project Details"]);
  const [msg, setMsg] = useState("Please Wait")
  const [cardTitle, setCardTitle] = useState("")
  const [startValue, setStartValue] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const addErrorPopup = useAddPopup();

  const [selProjectData, setSelProjectData] = useState({})
  console.log("startValue", startValue)


  let { state }: any = useLocation()
  const genDex = useWeb3Contract(GEN_DEX_ABI)
  const { account, chainId, library } = useActiveWeb3React()

  const getProjectData = async (projectId: any) => {
    setMsg("Loading NFTs")
    setIsLoading(true);
    try {
      const headers = {
        Authorization: process.env.REACT_APP_BASE_TOKEN,
      };
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const url = `${baseUrl}/api/v1/projects/${projectId}`
      console.log('getProjectData URL', url);
      const resp = await axios.get(url, { headers: headers }
      );
      setStartValue(resp && resp?.data)

      console.log('getProjectData URLRES', resp);

      let cardTitleVal = "Live"
      const currentTimestamp = Math.round(+new Date() / 1000);
      if ((Number(resp?.data?.startDate) > currentTimestamp)) {
        // Upcoming  
        cardTitleVal = "Upcoming"
      } else if ((Number(resp?.data?.endDate) < currentTimestamp)) {
        // Ended
        cardTitleVal = "Ended"
      } else if ((Number(resp?.data?.startDate) <= currentTimestamp && Number(resp?.data.endDate) >= currentTimestamp)) {
        // Live
        cardTitleVal = "LIVE"
      }
      setCardTitle(cardTitleVal)

      let tokensforUSDProject = 0
      let totalSoldProjectAllocation = 0
      let lowAllocPerUserPerTier = 0
      let totalProjectAllocation = 0
      let subPrivate = 0
      let subPublic = 0
      let percentageValue = 0
      let purchases = {} as any
      let getTokenDecimals = 0
      let tge = 0
      let projectStartTimeValue = 0
      let enableFcfsSaleValue = false
      let arrayOfWeightagesVal = []
      let arrayOfTranchesVal = []

      if (resp?.data?.dexAddress) {
        try {
          console.log('totalProjectAllocation0');
          let getBCProjectInfo = await genDex(resp?.data?.dexAddress!).methods.getProjectInfo().call()
          console.log('totalProjectAllocation00');
          const erc20 = new Contract(resp?.data?.underlyingToken as string, ERC20_ABI, library)
          console.log('totalProjectAllocation000');

          if (!erc20) throw new Error('No Contract!')
          getTokenDecimals = await erc20.decimals()

          const getTokensPerUSD = getBCProjectInfo?._tokenRate  //await genDex(data?.dexAddress).methods.tokenPerUsd().call()
          tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)
          console.log('totalProjectAllocation');

          const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted //await genDex(data?.dexAddress).methods.minTokenAllocationPermitted().call()
          lowAllocPerUserPerTier = Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject)

          const getTokensSoldInProject = await genDex(resp?.data?.dexAddress).methods.getTokensInfo().call()
          totalSoldProjectAllocation = getTokensSoldInProject && formatUnits(getTokensSoldInProject?._tokensSold, getTokenDecimals)

          const totalTokenAllocationForProject = getBCProjectInfo?._totalTokensAllocated // await genDex(data?.dexAddress).methods.totalTokenAllocation().call()
          totalProjectAllocation = totalTokenAllocationForProject && formatUnits(totalTokenAllocationForProject, getTokenDecimals)
          console.log('totalProjectAllocation1');

          if (resp?.data.subSheet !== undefined || resp?.data.subSheet.length > 0) {
            console.log("sssss");
            const results = await new Promise(function (complete, error) {
              Papa.parse(resp?.data?.subSheet!, {
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
            percentageValue = +((subPublic) * 100 / Number(resp?.data?.totalSuppliedTokenSize)).toFixed(2)
          }

          purchases = (await genDex(resp?.data?.dexAddress).methods.purchases(account!).call()) //PSC

          tge = await genDex(resp?.data?.dexAddress).methods.TGE().call()
          projectStartTimeValue = await genDex(resp?.data?.dexAddress).methods.startTime().call()
          console.log('totalProjectAllocation2');

          const enableFCFSProjectTime = getBCProjectInfo?._guranteedSaleDuration //await genDex(data?.dexAddress).methods.guranteedSaleDuration().call()
          enableFcfsSaleValue = (Number(enableFCFSProjectTime) + Number(projectStartTimeValue ?? 0) <= Number(moment().unix())) ? true : false

          let arrayWeigthage = getBCProjectInfo?._trancheWeightage//await genDex(data?.dexAddress).methods.returnTrancheWeightage().call() //PSC
          arrayOfWeightagesVal = arrayWeigthage?.map((item: string) => Number(formatUnits(item, 18)))

          arrayOfTranchesVal = getBCProjectInfo?._trancheLength

        } catch (error) {
        }
      }

      const selectedProjectData_Obj = {
        data: resp?.data, cardTitle: cardTitleVal, tokensPerUSD: tokensforUSDProject, getTokensSold: totalSoldProjectAllocation, totalTokenAllocation: totalProjectAllocation, percentageValue: percentageValue, subPublic: subPublic, arrayOfWeightages: arrayOfWeightagesVal, arrayOfTranches: arrayOfTranchesVal, underlyingToken: resp?.data?.underlyingToken, lowAllocPerUserPerTier: lowAllocPerUserPerTier, enableFcfsSale: enableFcfsSaleValue, projectStartTime: projectStartTimeValue, tokenAllocationBought: purchases?.tokenAllocationBought && formatUnits(purchases?.tokenAllocationBought, getTokenDecimals), tge: tge, usdAllocationBought: Number(purchases?.tokenAllocationBought && formatUnits(purchases?.tokenAllocationBought, getTokenDecimals)) / Number(tokensforUSDProject), position: purchases?.position
      }

      setSelProjectData(selectedProjectData_Obj)
      if (projectMenu.length < 2) {
        // ((cardTitleVal === "LIVE" || cardTitleVal === "Ended") && moment().unix() > Number(resp?.data?.timeline[4].date)) && 
        setProjectMenu([...projectMenu, "Swap and Claim"])
      }

      console.log('getProjectData URL1', resp?.data, selectedProjectData_Obj);
    } catch (error: any) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: error.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
    setMsg("Please wait")
    setIsLoading(false);
    // return resp;
  };

  useEffect(() => {
    console.log('paramsparamsparamsparams', params);
    getProjectData(params.projectid)
  }, [state, params])

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
      <div className="liveProjectPage">
        <div className="container container-maxwidth">
          <div className="row liveProjectBlock">
            <div className="col-lg-3">
              <div className="liveLeftSide">
                <ProjectProfile data={selProjectData} />
              </div>
            </div>
            <div className="col-lg-9 p-0">
              <div className="liveRightSide">
                <div className="banner-image d-block">
                  <div className="text-center">
                    {/* {cardTitle === "LIVE" || cardTitle === "Ended" */}
                    <button className="card-type-button new-primary-button" style={{ border: cardTitle === "Ended" ? "1px solid #2F2F2F" : "2px solid #54C4FC" }}>
                      {cardTitle === "Upcoming" && "UPCOMING"}
                      {cardTitle === "LIVE" &&
                        <p className="paragraph-new-medium mb-0"><span className="paragraph-new-medium fw-bold" style={{ color: "#54C4FC" }}>Live </span> | Time left : {countdown(moment().unix(), startValue && startValue?.startDate)}</p>
                      }
                      {cardTitle === "Ended" && "Ended"}
                    </button>
                  </div>
                  <div className="">
                    <img src={bannerImg} className="w-100" alt="" />
                  </div>
                </div>
                <div className="key-info mt-4 d-lg-flex d-md-flex d-block">
                  <div className="d-flex gap-lg-4 gap-2 key-info-cards">
                    <h2 className="heading-new-2">Key <br /> Info</h2>
                    <div className="raise-box">
                      <h5 className="heading-new-5 fw-light" style={{ color: "#A3A3A3" }}>Total Raise</h5>
                      <h4 className="heading-new-4" style={{ color: "#54C4FC", fontWeight: 500 }}>$145,000</h4>
                    </div>
                    <div className="raise-box">
                      <h5 className="heading-new-5 fw-light" style={{ color: "#A3A3A3" }}>Token Price</h5>
                      <h4 className="paragraph-new token-price" style={{ color: "#54C4FC", fontWeight: 500 }}>{`1 $${startValue && startValue?.projectShortCode} = $${Number(startValue?.totalSuppliedTokenSize) / Number(startValue?.hardCapValue)}`}</h4>
                    </div>
                    <div className="raise-box">
                      <h5 className="heading-new-5 fw-light" style={{ color: "#A3A3A3" }}>Tokens on</h5>
                      <img src={behanceLogo} className="img-fluid w-100" alt="" />
                    </div>
                  </div>
                  <div className="ido-claim-date">
                    <p className="paragraph-new fw-bolder mb-0 mt-0" >IDO Date</p>
                    <p className="paragraph-new fw-bolder mb-0 mt-0" style={{ color: "#54C4FC" }}>{moment.unix(startValue?.preIdo && startValue?.preIdo).fromNow()}</p>
                    <p className="paragraph-new fw-bolder mb-0 mt-0">Claim on</p>
                    <p className="paragraph-new fw-bolder mb-0 mt-0" style={{ color: "#54C4FC" }}>RedKite</p>
                  </div>
                </div>
                {/* {(cardTitle === "LIVE" || cardTitle === "Ended") && */}
                <div className="projectMenu my-lg-5 my-3">
                  {projectMenu.map((menu, id) => (
                    <div
                      key={id}
                      className={
                        selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "
                      }
                      onClick={() => setselectedMenu(menu)}
                    >
                      {menu}
                    </div>
                  ))}
                </div>
                {/* } */}
                {selectedMenu === "Project Details" && <ProjectDetails selectedProjectData={selProjectData} />}
                {selectedMenu === "Swap and Claim" && <SwapClaim data={selProjectData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProjectSlider />

      <Footercmp />

    </>
  )
}

export default LiveProjectPage