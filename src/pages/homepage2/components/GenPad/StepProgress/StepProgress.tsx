import React, { memo } from 'react'
import './style.sass'

const progressArray = [
  {
    label: "Stake",
    details: "Stake details",
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

const StepProgress = () => {
  return (
    <div className="step-container">
      <div className='step-background'>
        <div className="five-step-progress">
          <span>5 STEP PROCESS</span>
        </div>
        {
          progressArray.map((item, index) => {
            return <div key={index} className="step-items">
              <label>{item.label} {item.details ? <div className='details-items'><span>i</span></div> : null}</label>
              <span className='item-divider-hoz'/>
            </div>
          })
        }
        <hr />
      </div>
    </div>
  )
}

export default memo(StepProgress)