import React from 'react';
import './exchanges-comp.sass';
import ExchangesCompImg from '../../../../../../images/accelerate/exchanges-comp-img.svg'
import exchangesRectangle from '../../../../../../images/accelerate/exchanges-rectangle.svg'
import worldCryptoidLogo from "../../../../../../images/homepage/world-cryptoids-logo.svg";

export const ExchangesComp = () => {
    return (
        <>
            <section className='exchanges-comp-section'>
                <div className="container">
                    <div className="exchanges-comp-outer-div">
                        <div className="exchanges-comp-inner-div">
                            {/* <div className="mb-lg-5 mb-md-4 mb-3">
                                <h2 className='heading-new-2 mb-lg-3 mb-md-3 mb-2'>A Mentor Network, spanning the globe</h2>
                                <p className='paragraph-new'><span className='paragraph-new' style={{ color: "#2479DF" }}>110,000</span> Mentors. <span className='paragraph-new' style={{ color: "#2479DF" }}>Across 6 </span> Continents.</p>
                            </div> */}
                            <img src={exchangesRectangle} className='img-fluid ractangels-img' alt="" />
                            <img src={exchangesRectangle} className='img-fluid ractangels-img2' alt="" />
                            <div className="exchanges-comp-box">
                                <div className="column-poal-1">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-2">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-3">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-4">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-5">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-6">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-7">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                                <div className="column-poal-8">
                                    <div className="top-img-box">
                                        <img src={worldCryptoidLogo} className='img-fluid' alt="" />
                                    </div>
                                    <div className="poal"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
