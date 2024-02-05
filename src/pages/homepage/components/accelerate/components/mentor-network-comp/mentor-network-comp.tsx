import React from 'react';
import './mentor-network-comp.sass';
import MentorImg from '../../../../../../images/accelerate/mentor-network-im.svg'

export const MentorNetworkComp = () => {
    return (
        <>
            <section className='mentor-network-comp-section'>
                <div className="container">
                    <div className="mentor-network-outer-div">
                        <div className="mentor-network-inner-div">
                            <div className="mb-lg-5 mb-md-4 mb-3">
                                <h2 className='heading-new-2 mb-lg-3 mb-md-3 mb-2'>A Mentor Network, spanning the globe</h2>
                                <p className='paragraph-new'><span className='paragraph-new' style={{ color: "#2479DF" }}>110,000</span> Mentors. <span className='paragraph-new' style={{ color: "#2479DF" }}>Across 6 </span> Continents.</p>
                            </div>
                            <div className="mentor-comp-img">
                                <img src={MentorImg} className='img-fluid' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
