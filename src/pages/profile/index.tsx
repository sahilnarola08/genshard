import { useEffect, useState } from 'react'
import "./style.sass"
import ReactBubbleChart from "react-bubble-chart";
import axios from 'axios'
import { useSelector } from 'react-redux'
import { AppState } from '../../state'
import LoaderComp from "../../shared/components/LoaderComponent";
import { useActiveWeb3React } from './../../hooks/web3'
import { useAddPopup } from '../../state/application/hooks';
import "./../../../node_modules/react-bubble-chart/src/style.css";

const data = [
    { _id: "kala", value: 5, colorValue: "#87EE4E" },
    { _id: "Supernova", value: 35, colorValue: "#8D5031" },
    { _id: "Karmaverse", value: 25, colorValue: "#EB68CA" },
    { _id: "Kala", value: 25, colorValue: "#1F2999" },
    { _id: "Cryptoids.world", value: 50, colorValue: "#0BE9C3" },
    { _id: "Genshards", value: 5, colorValue: "#8A2E94" },
    { _id: "123swap", value: 25, colorValue: "#3352B7" },
];

function Profile() {

    const volCap = ["Investment Volume", "Market Cap"]
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState("Please Wait")
    const [projectsData, setProjectsData] = useState<any>([])
    const [investmentData, setInvestmentData] = useState<any>()
    const addErrorPopup = useAddPopup();
    console.log("projectsData => ", projectsData);

    const [selectedBtn, setselectedBtn] = useState<string>("Investment Volume")
    const { library, account } = useActiveWeb3React()
    const currentTimestamp = Math.round(+new Date() / 1000);
    const network = useSelector((state: AppState) => state.application.network)
    const headers = {
        Authorization: process.env.REACT_APP_BASE_TOKEN,
    };
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const getProjectData = async () => {
        setMsg("Loading Investments")
        setIsLoading(true);
        try {
            const url = `${baseUrl}/api/v1/projects/investments/${account}`
            const resp = await axios.get(url, { headers: headers }
            );
            console.log('respresp', resp);
            setInvestmentData(resp?.data?.values)
        } catch (error: any) {
            console.log('respresperr', error);
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
        getProjectData();
    }, [network, account])

    useEffect(() => {
        projectsData && projectsData.splice(0, projectsData.length)
        setProjectsData([])
        const investmentDataArray = investmentData?.map((item, index) => {
            return { _id: item?.name, value: item?.investmentInPercentage, colorValue: item?.color };
        }).filter(item => item.value > 0) || []

        setProjectsData(investmentDataArray)
        if (investmentDataArray.length) {
            setTimeout(() => {
                const element = document.getElementsByClassName("bubble-chart-d3") as any
                if (element) {
                    if (element[0] && element[0].children.length > 0) {
                        for (let i = 0; i < element[0].children.length; i++) {
                            const fillColor = investmentDataArray[i]?.colorValue || "#A2A2A8" // default light grey color
                            const circle = element[0].children[i] as any
                            circle.style.setProperty("fill", fillColor)

                        }
                    }
                }
            }, 100)
        }
    }, [investmentData, selectedBtn])

    return (
        <div className="profile-container">
            <div className="paragraph-new color-white-new">Investments</div>
            <hr style={{width: "80px", color: "#54C4FC"}} className='mt-3 mb-4' />
            {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
            <div className="showing-as paragraph-new-medium">Showing as</div>
            <div className="vom-and-cap">
                {
                    volCap.map((btnName, ind) => <button className={btnName === selectedBtn ? "selected-btn vol-cap-btn" : "vol-cap-btn"} key={ind} onClick={() => setselectedBtn(btnName)} >{btnName}</button>)
                }
            </div>
            <div className="profile-investment">
                {/* {projectsData && projectsData.length ?
                    <> */}
                        <div className="bubble-chart-item"  style={{ width: "500px", height: "500px" }}>
                            <ReactBubbleChart
                                id="chart__bubble"
                                className="chart__bubble"
                                data={data}
                                // legend={true}
                                // legendSpacing={10}
                                duration={1000}
                                fontSizeFactor={0.5}
                                // tooltip={true}
                                key="start"
                                smallDiameter
                            />
                        </div>
                        <div className="chart-details-item">
                            <div className="projects-listing">
                                {/* {
                                    [...projectsData].sort((a, b) => {
                                        return b.value - a.value;
                                    }).map((item, index) => { */}
                                        <div className={selectedBtn === volCap[1] ? "with-allocation project-listing-wrapper" : "project-listing-wrapper"}>
                                            <div className="divider-div" style={{ background: "#2479DF" }} />
                                            <div className="listing-allocation">
                                                <div className="project-listing-div">
                                                    <div className="project-listing-div-name paragraph-new color-white-new">Cryptoids.world</div>
                                                    <div className="investment-percentage paragraph-new color-white-new">50%</div>
                                                </div>
                                                {/* {selectedBtn === volCap[1] &&
                                                    <div className="usd-allocation-bought">Investment Value : {investmentData[index].usdAllocationBought} || Market Value : {investmentData[index].marketValue}</div>
                                                } */}
                                            </div>
                                        </div>
                                        <div className={selectedBtn === volCap[1] ? "with-allocation project-listing-wrapper" : "project-listing-wrapper"}>
                                            <div className="divider-div" style={{ background: "#2479DF" }} />
                                            <div className="listing-allocation">
                                                <div className="project-listing-div">
                                                    <div className="project-listing-div-name paragraph-new color-white-new">Cryptoids.world</div>
                                                    <div className="investment-percentage paragraph-new color-white-new">50%</div>
                                                </div>
                                                {/* {selectedBtn === volCap[1] &&
                                                    <div className="usd-allocation-bought">Investment Value : {investmentData[index].usdAllocationBought} || Market Value : {investmentData[index].marketValue}</div>
                                                } */}
                                            </div>
                                        </div>
                                    {/* })
                                } */}
                            </div>
                        </div>
                    {/* </> : <div className="no-investment-found paragraph-new color-white-new">No Investment Found.</div>
                } */}
            </div>
        </div>
    )
}

export default Profile