import React, { memo, useEffect, useMemo, useState } from 'react'
import GenpadCard from './GenpadCard/GenpadCard'
import './style.sass'
import Button from '../../../../shared/components/buttons'
import StepProgress from './StepProgress/StepProgress'
import { PROJECTS_DATA_GOERLI_FOR_GENPAD } from '../../../../constants'
import { BaseProject } from '../../../../state/market/types'
import _ from 'lodash'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'

function GenPad() {

    const actionButtons = [
        {
            label: 'LIVE',
            value: 'LIVE'
        },
        {
            label: 'Upcoming',
            value: 'Upcoming'
        },
        {
            label: 'Ended',
            value: 'Ended'
        },
    ]

    const [currentView, setCurrentView] = useState("Upcoming")
    const [projectsData, setProjectsData] = useState<any>([])
    const currentTimestamp = Math.round(+new Date() / 1000);
    const network = useSelector((state: AppState) => state.application.network)

    const headers = {
        Authorization: process.env.REACT_APP_BASE_TOKEN,
    };

    const [resData, setResData] = useState<any>()


    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const getProjectData = async () => {
        let chainID = 1
        if (network === 'IOTEX') {
            chainID = 4689
        } else if (network === 'HARMONY') {
            chainID = 1666600000
        } else if (network === 'AVALANCHE') {
            chainID = 43114
        } else if (network === 'BSC') {
            chainID = 56
        } else if (network === 'MATIC') {
            chainID = 137
        } else if (network === 'MUMBAI') {
            chainID = 80001
        } else if (network === 'GOERLI') {
            chainID = 5
        } else if (network === 'T-IoTeX') {
            chainID = 4690
        } else if (network === 'T-HRMNY') {
            chainID = 1666700000
        } else if (network === 'T-AVALANCHE') {
            chainID = 43113
        } else if (network === 'T-BSC') {
            chainID = 97
        } else if (network === 'ETH') {
            chainID = 1
        }
        const url = `${baseUrl}/api/v1/projects?chainId=${chainID}`
        const resp = await axios.get(url);
        projectsData.splice(0, projectsData.length)
        console.log("projectsData11111", projectsData);
        setProjectsData([])
        resp?.data?.values?.forEach((data: any) => {
            if ((Number(data?.startDate) > currentTimestamp) && (currentView === "Upcoming")) {
                // Upcoming  
                setProjectsData((prev: any) => [...prev, data])
            } else if ((Number(data?.endDate) < currentTimestamp) && (currentView === "Ended")) {
                // Ended
                setProjectsData((prev: any) => [...prev, data])
            } else if ((Number(data?.startDate) <= currentTimestamp && Number(data.endDate) >= currentTimestamp) && (currentView === "LIVE")) {
                // Live
                setProjectsData((prev: any) => [...prev, data])
            }
        })
        setResData(resp?.data?.values)
        // return resp;
    };

    useEffect(() => {
        getProjectData();
    }, [network])

    useEffect(() => {
        projectsData.splice(0, projectsData.length)
        console.log("projectsData11111", projectsData);
        setProjectsData([])
        resData?.forEach((data: any) => {
            if ((Number(data?.startDate) > currentTimestamp) && (currentView === "Upcoming")) {
                // Upcoming  
                setProjectsData((prev: any) => [...prev, data])
            } else if ((Number(data?.endDate) < currentTimestamp) && (currentView === "Ended")) {
                // Ended
                setProjectsData((prev: any) => [...prev, data])
            } else if ((Number(data?.startDate) <= currentTimestamp && Number(data.endDate) >= currentTimestamp) && (currentView === "LIVE")) {
                // Live
                setProjectsData((prev: any) => [...prev, data])
            }
        })
    }, [currentView])

    const uniqueData = _.uniqBy(projectsData, 'id');
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    function getCurrentDimension(){
      return {
            width: window.innerWidth,
      }
    }
    useEffect(() => {
          const updateDimension = () => {
                setScreenSize(getCurrentDimension())
          }
          window.addEventListener('resize', updateDimension);
          return(() => {
              window.removeEventListener('resize', updateDimension);
          })
    }, [screenSize])

    return (
        <div className=''>
            {/* <StepProgress /> */}
            <div className='heading-buttons-container'>
                {/* <div><h1>POOLS</h1></div> */}
                {/* <hr /> */}
                {/* <h6>NOW VIEWING</h6> */}
                <h6 className='text-center color-white-new tab-btn-heading'>NOW VIEWING</h6>
                <div className='buttons-container mt-0 '>
                    {
                        actionButtons.map((button, index) => {
                            return <div key={index}>
                                
                                <Button className="outline--highlight pools-btn"
                                    style={{ background: currentView === button.value ? 'linear-gradient(180deg, #54C4FC 0%, #2479DF 100%)' : 'transparent', color: currentView === button.value ? '#fff' : '#fff' }}
                                    onClick={() => { setCurrentView(button.value) }}>{button.label}</Button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="row genpad-card-bg">
                {(uniqueData || []).map((data: any, index: number) => (
                    <div className={screenSize && screenSize.width > 1200 ? "col-lg-4 col-md-6 mb-5" : "col-lg-6 col-md-6 mb-5"} key={index}>
                        <GenpadCard data={data} cardTitle={currentView} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(GenPad)