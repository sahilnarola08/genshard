import React from 'react'
import Slider from 'rc-slider'
import './progress-slider.sass'
import roketIcon from '../../../../../../../images/accelerate/roket-icon.svg';

export const ProgressRangeSlider = () => {
  return (
    <div>
      <div className='symbioteScale-section range-slider'>
        <div className='symbioteScale-box-section'>
          <h3 className='symbioteScale-heading text-start mb-5 color-white-new heading-new-4'>Position on the <span className='fw-bold'>SymbioteScale</span></h3>
          <div className="d-flex align-items-center gap-3 symbiotescale-slider">
            <div className="w-100">
              <div className="symbioteScale-slider-main">
                <div className='symbioteScale-slider'>
                  <Slider
                    defaultValue={0}
                    step={null}
                    // vertical= {true}
                    // reverse={false}
                    marks={{ 0: "Idea \t Clarity", 10: "MVP Build", 21: "Product Market Fit", 35: "Company Restructuring", 52: "Team & Management", 68: "Networking with Partners", 82: "VC Networks", 95: "Marketing & KOL Connects" }}
                    trackStyle={{ backgroundColor: '#65DB6A' }}
                    railStyle={{ backgroundColor: '#54C4FC' }}
                    handleStyle={{
                      borderColor: '#FFFFFF',
                      backgroundColor: '#FFFFFF',
                    }}
                    dotStyle={{
                      background: "#000000",
                      border: "1.1761px solid #FFFFFF",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-fit-content launch-heading">
              <div className="text-center">
                <img src={roketIcon} alt="" className='img-fluid' />
              </div>
              <p className='paragraph-new mb-0 mt-3 fw-bold launch-text'>LAUNCH<br />TO MARKET</p>
            </div>
          </div>
          <div className='mt-lg-4 mt-md-3 mt-2'>
            <div className='text-center'>
              <button className='new-black-button'>Update your progress</button>
            </div>
            <div className='text-lg-end text-md-end text-center mt-lg-0 mt-md-0 mt-3'>
              <p className='paragraph-new-small mb-0'>Raise a concern</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
