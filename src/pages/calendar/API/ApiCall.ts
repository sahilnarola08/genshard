import axios from "axios";
import { start } from "repl";

const headers = {
  token: process.env.REACT_APP_BASE_TOKEN,
};
const baseUrl = process.env.REACT_APP_API_BASE_URL;
const getEventData = async (account: string, startDate: string,endDate: string) => {
  
  console.log("------------ account ------ ",account);

  const url = `${baseUrl}/api/v1/events/projects/${account}?startDate=${startDate}&endDate=${endDate}`
  console.log('calendar Data URL : ', url);

  const resp = await axios.get(url, { headers: headers }
  );
  
  function nth(n : number){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"}
  
  let resultsArray = [] as any
  const responseDataArray = resp?.data && resp?.data?.values?.forEach((item, index) => {
    if(dateCheck(startDate, endDate, item?.timeline[0].date)){
      resultsArray.push({_id:item?._id, start: new Date(item?.timeline[0].date * 1000), end: new Date(Number(item?.timeline[1].date) * 1000), title: item?.name + " - Whitelist Duration", resources: item, colorCode:"#ff0071"})
    }
    else if(dateCheck(startDate, endDate, item?.timeline[1].date)){
      resultsArray.push({_id:item?._id, start: new Date(Number(item?.timeline[0].date) * 1000), end: new Date(Number(item?.timeline[1].date) * 1000), title: item?.name + " - Whitelist Duration", resources: item, colorCode:"#ff0071"})
    }
    else if(dateCheck(item?.timeline[0].date, item?.timeline[1].date, startDate) || dateCheck(item?.timeline[0].date, item?.timeline[1].date, endDate)){
      resultsArray.push({_id:item?._id, start: new Date(item?.timeline[0].date * 1000), end: new Date(Number(item?.timeline[1].date) * 1000), title: item?.name + " - Whitelist Duration", resources: item, colorCode:"#ff0071" })
    }
    // else if(item?.timeline[0].date >= Number(startDate) && item?.timeline[0].date <= Number(endDate)){
    //   resultsArray.push({_id:item?._id, start: new Date(item?.timeline[0].date * 1000), end: new Date(item?.timeline[1].date * 1000), title: item?.name + " - Whitelist Duration", resources: item})
    // }
    // else if(item?.timeline[0].date <= Number(startDate) && item?.timeline[1].date >= Number(startDate)){
    //   resultsArray.push({_id:item?._id, start: new Date(Number(startDate) * 1000), end: new Date(Number(endDate) * 1000), title: item?.name + " - Whitelist Duration", resources: item})
    // }
    if(item?.timeline[4].date >= Number(startDate) && item?.timeline[4].date <= Number(endDate)){
      resultsArray.push({_id:item?._id, start: new Date(item?.timeline[4].date * 1000), end: new Date(item?.timeline[4].date * 1000), title: item?.name + " - " + item?.timeline[4].title, resources: item, colorCode:"#F1C40F" })
    }
    if(Number(item?.tge) >= Number(startDate) && Number(item?.tge) <= Number(endDate)){
      resultsArray.push({_id:item?._id, start: new Date(Number(item?.tge) * 1000), end: new Date(Number(item?.tge) * 1000), title: item?.name + " - TGE Started", resources: item, colorCode:"#3498DB"})
    }
    item?.returnTrancheLength && item?.returnTrancheLength?.map((listitem, index) => {
      if(listitem !== "0" && Number(item?.tge) + Number(listitem) >= Number(startDate) && Number(item?.tge) + Number(listitem) <= Number(endDate)){
        resultsArray.push({_id:item?._id, start: new Date((Number(item?.tge) + Number(listitem)) * 1000), end: new Date((Number(item?.tge) + Number(listitem)) * 1000), title: item?.name + " - " + index+nth(index) + " Tranche Unlocked", resources: item, colorCode:"#3498DB"})
      }
    })
  }) || []
  
  console.log('resultsArray: ', resultsArray);

  return resultsArray;
};

function dateCheck(from,to,check) {

  var fDate,lDate,cDate;
  fDate = Number(from) //Date.parse(from);
  lDate = Number(to) //Date.parse(to);
  cDate = Number(check) //Date.parse(check);
  console.log('fDate', fDate, lDate, cDate)
  if((cDate <= lDate && cDate >= fDate)) {
      return true;
  }
  return false;
}

const getEventDetailsById = async (detailId: any) => {
  const resp = await axios.get(
    `${baseUrl}/api/v1/events/${
      detailId ? detailId : null
    }`,
    { headers: headers }
  );
  return resp;
};
export { getEventData, getEventDetailsById };
