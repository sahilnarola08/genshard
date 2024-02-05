import axios from "axios";
import { BigNumber } from "ethers";
import { start } from "repl";
import { APPLY_IDO_PROJECT_WHITELIST, APPLY_IDO_PROJECT_BUY_ALLOCATION} from "../../../../constants";

const headers = {
  token: process.env.REACT_APP_BASE_TOKEN
};

const applyForWhiteListURL = APPLY_IDO_PROJECT_WHITELIST
const applyForIDOProjectBuyAnAllocationURL  = APPLY_IDO_PROJECT_BUY_ALLOCATION
const getApplyWhiteListData = async (account: string, projectId: string, isChecked: boolean) => {
  const res: any = await axios.post(applyForWhiteListURL, {
    "walletAddress": account,
    "project": projectId,
    "check": isChecked
  }, { headers: headers })
  console.log('getApplyWhiteListData', res);
  return res;
};

const applyForBuyAnAllocation = async (account: string, projectId: string, boughtAllocation: string, stakingAmount : number, isFCFSTimeDuration: boolean, tokenDecimalVal : number, usdtDecimaVal: number) => {
  console.log("applyForBuyAnAllocation Req Body : ", account, projectId, boughtAllocation, stakingAmount, isFCFSTimeDuration, tokenDecimalVal, usdtDecimaVal);  
  const res: any = await axios.post(applyForIDOProjectBuyAnAllocationURL, {
    "walletAddress": account,
    "project": projectId,
    "stakingAmount": stakingAmount,
    "boughtAllocation": boughtAllocation,
    "isFCFSTimeDuration": isFCFSTimeDuration,
    "tokenDecimalValue": tokenDecimalVal,
    "usdtDecimalValue": usdtDecimaVal
  }, { headers: headers })
  console.log('applyForBuyAnAllocation', res);
  return res;
};
export { getApplyWhiteListData, applyForBuyAnAllocation };