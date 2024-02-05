import React from 'react'
import Slider from 'rc-slider'
import './range-slider.sass'
import roketIcon from '../../../../../../../images/accelerate/roket-icon.svg';

export const RangeSlider = () => {
    return (
        <div>
            <div className='symbioteScale-section range-slider'>
                <div className='symbioteScale-box-section'>
                    <h3 className='symbioteScale-heading text-start mb-5 color-white-new'>Position on the <span className='symbioteScale'>SymbioteScale</span></h3>
                    <div className="d-flex align-items-center gap-3">
                        <div className="w-100">
                            <div className='symbioteScale-slider active-tabs'>
                                <Slider
                                    defaultValue={0}
                                    step={null}
                                    marks={{ 0: "Idea \t Clarity", 10: "MVP Build", 21: "Product Market Fit", 35: "Company Restructuring", 52: "Team & Management", 68: "Networking with Partners", 82: "VC Networks", 95: "Marketing & KOL Connects" }}
                                    trackStyle={{ backgroundColor: '#54C4FC' }}
                                    railStyle={{ backgroundColor: '#54C4FC' }}
                                    handleStyle={{
                                        borderColor: '#65DB6A',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    dotStyle={{
                                        background: "#000000",
                                        border: "1.1761px solid #FFFFFF",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-fit-content">
                            <div className="text-center">
                                <img src={roketIcon} alt="" className='img-fluid' />
                            </div>
                            <p className='paragraph-new mb-0 mt-3 fw-bold launch-text'>LAUNCH<br />TO MARKET</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
