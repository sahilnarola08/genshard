import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'
import './style.sass'

const StepProgress = () => {

  const history = useHistory()

  const progressArray = [
    {
      label: "Stake",
      details: "Stake details",
      redirectFn: () => redirectToPage("/genpad/staking")
    },
    {
      label: "KYC",
      details: "KYC details",
    },
    {
      label: "Apply Whitelist",
      details: "",
    },
    {
      label: "Swap",
      details: "",
    },
    {
      label: "Claim",
      details: "",
    }
  ]

  const redirectToPage = (path: string) => {
    history.push(path)
  }


  return (
    <>
    <div className="five-step-progress">
          <span>5 STEP PROCESS</span>
        </div>
    <div className="step-container">
        
      <div className='step-background'>
        {
          progressArray.map((item, index) => {
            const isSelectable = !!item.redirectFn
            const redirect = item.redirectFn ? item.redirectFn : () => { }
            return <div key={index} className={`step-items ${isSelectable ? "selected-step" : null}`}>
              <label onClick={redirect}>{item.label} {item.details ? <div className='details-items'><span className='iicon'>i</span></div> : null}</label>
              <span className='item-divider-hoz' />
            </div>
          })
        }
        <hr />
      </div>
    </div>
    </>
  )
}

export default memo(StepProgress)