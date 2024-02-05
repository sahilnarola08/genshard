import { useMemo, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import Button from "../../shared/components/buttons"
import { getGenCohortStakingContract } from "../../utils"
import "./style.sass"
import { abi as GET_COHORT_STAKING_ABI } from '../../contracts/GenCohertStaking.json'
import { useWeb3Contract } from "../../hooks/useContract"
import { useSelector } from "react-redux"
import { AppState } from "../../state"
import { useActiveWeb3React } from "../../hooks/web3"
import axios from "axios"
import { apiBaseUrl, COHORT_STAKE_CONTRACT_ADDRESS } from "../../constants"
import moment from "moment"

const tabs: {
  label: string;
  value: number;
}[] = [
    {
      label: "Live Pools",
      value: 1,
    },
    {
      label: "Past Pools",
      value: 2,
    }
  ]

const cohortContractAddress = COHORT_STAKE_CONTRACT_ADDRESS

export default function CohortStaking() {

  const history = useHistory()
  const [activeTab, setActiveTab] = useState(1)
  const [cohortStaking, setCohortStaking] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const network = useSelector((state: AppState) => state.application.network)
  const { account, chainId, library } = useActiveWeb3React()
  const cohortStakeContract = useWeb3Contract(GET_COHORT_STAKING_ABI)

  useEffect(() => {
    getAllCohortStakes()
  }, [])

  useEffect(() => {
    if (network && account && chainId && cohortStaking.length) {
      getInitialData()
    }
  }, [network, account, chainId, cohortStaking])

  const getAllCohortStakes = async () => {
    try {
      setIsLoading(true)
      const { data: { values = [] } } = await axios.get(`${apiBaseUrl}/api/v1/cohort`)
      setCohortStaking(values)
      setIsLoading(false)
    } catch (ex) {
      console.log('error on getAllCohortStakes')
      setIsLoading(false)
    }
  }

  const getInitialData = async () => {
    try {
      setIsLoading(true)
      const noOfCohorts = await getNoOfCohorts()
      console.log(noOfCohorts, "noOfCohorts")

      const cohortPromises = [] as any
      if (!isNaN(noOfCohorts) && noOfCohorts > 0) {
        const contractInstance = cohortStakeContract(cohortContractAddress) as any
        for (let i = 0; i < noOfCohorts; i++) {
          cohortPromises.push(contractInstance.methods.coherts(i).call())
        }
        const combinedResponse = await Promise.all(cohortPromises)
        console.log(combinedResponse, "combinedResponse")

      }
      setIsLoading(false)
    } catch (ex) {
      setIsLoading(false)
    }
  }

  const getNoOfCohorts = async () => {
    try {
      const result = await cohortStakeContract(cohortContractAddress).methods.noOfCoherts().call()
      console.log(result, "getNoOfCohorts")
      return Number(result)
    } catch (ex) { console.log(ex, 'Error in getNoOfCohorts'); return 0 }
  }

  // getGenCohortStakingContract
  const showStakingItems = useMemo(() => cohortStaking.filter((cohort: any) => {
    if (activeTab === 1) return Number(cohort.stakeEndTime) > moment().unix()
    else return Number(cohort.stakeEndTime) < moment().unix()
  }), [activeTab, cohortStaking])

  const onChangeTab = (selectedTab: number) => {
    setActiveTab(selectedTab)
  }

  const onClickStake = (stakeId: number) => {
    history.push(`/cohort-staking/${stakeId}`)
  }

  return (
    <div className="cohort-staking-container">
      {isLoading ? <div className="single-card-loader">
        <img
          className="loading-icon"
          src="/images/icons/loading.svg"
          alt="loading"
        />
      </div> : null}
      <div className="cohort-staking-heading">
        <h1>STAKING</h1>
      </div>

      <div className="cohort-tabs-container">
        {
          tabs.map(tab => {
            return <div key={tab.value} onClick={() => onChangeTab(tab.value)} className={activeTab === tab.value ? "selected-tab" : ""}>
              <span>{tab.label}</span>
            </div>
          })
        }
      </div>

      <div className="staking-list">
        {
          showStakingItems.length ? showStakingItems.map((stake: any) => {
            const { tokens = [] } = stake
            return <div key={stake._id} className="staking-list-item">
              <div className="staking-list-div">

                <div className="stake-header">
                  <h3>{stake.name}</h3>
                  <div className="stake-duration">
                    <span>Timer</span>
                    <span className="duration">{moment((Number(stake.stakeEndTime) || moment().unix()) * 1000).format('Do MMM yyyy')}</span>
                  </div>
                </div>

                <div className="tokens-listing">
                  {
                    tokens.map((token: any, index: number) => {
                      return <div key={index} className="token-image-div" style={{ width: tokens.length > 4 ? "33.33%" : "50%" }}>
                        <div className="image-div">
                          <img src={token.icon} alt="" />
                        </div>
                      </div>
                    })
                  }
                </div>

                <div className="apy-range-item">
                  <p>APY RANGE <span>{stake.apyRange || "-"}</span></p>
                </div>

                <div className="stake-now-actions">
                  <Button className="outline--highlight active" onClick={() => onClickStake(stake._id)}>{activeTab === 2 ? "View" : "STAKE NOW"}</Button>
                </div>

              </div>
            </div>
          }) : isLoading ? null : <div className="no-data-found">No cohort found.</div>
        }
      </div>
    </div>
  )
}