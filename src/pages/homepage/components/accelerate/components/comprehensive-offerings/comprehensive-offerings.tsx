import React, { useEffect, useRef, useState } from 'react'
import './comprehensive-offerings.sass';
import comprehensiveIcon from '../../../../../../images/accelerate/comprehensive-icon.svg';

export const ComprehensiveOfferings = () => {

    const [height, setHeight] = useState(0)
    const ref = useRef<any>()

    useEffect(() => {
        if(ref?.current?.clientHeight){
            setHeight(ref?.current?.clientHeight + ref?.current?.offsetTop)
            setTimeout(() => {
              setHeight(ref?.current?.clientHeight) 
            }, 1000)
          }
      })
    // const [screenHeight, setScreenHeight] = useState(getCurrentDimension());
    // console.log("screenHeight", screenHeight.windowHeight)
    // function getCurrentDimension() {
    //     return {
    //         windowHeight: window?.innerHeight
    //     }
    // }
    // useEffect(() => {
    //     const updateDimension = () => {
    //         setScreenHeight(getCurrentDimension())
    //     }
    //     window.addEventListener('resize', updateDimension);
    //     return (() => {
    //         window.removeEventListener('resize', updateDimension);
    //     })
    // }, [screenHeight])


    return (
        <>
            <div className='comprehensive-section mt-5 position-relative' ref={ref}>
                <div className="container position-relative">
                    <h2 className='heading-new-2 mb-3 mb-lg-4 mb-lg-5'>Our comprehensive offerings</h2>
                    <div className="scrolling-content">
                        <div className='row'>
                            <div className="col-lg-4 col-md-4">
                                <div>
                                    <h3 className='heading-new-4'>Token <br /> Economy</h3>
                                    <p className='paragraph-new-medium'>It decides the future of the project. We help you with logic and modelling.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Incorporation <br />and Legal</h3>
                                    <p className='paragraph-new-medium'>Your legal structure is an essential component of your strategy. In this unpredictable international law system, you need clarity.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Fundraising</h3>
                                    <p className='paragraph-new-medium'>We cover all the fundraising aspects, from pitch polishing to demo day.</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className='offering-img'>
                                    <img className='img-fluid' src={comprehensiveIcon} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className='text-mar'>
                                    <h3>Smart Contract<br />and Security</h3>
                                    <p className='paragraph-new-medium'>We provide guidance in building a safe product quickly. A single hack can destroy your venture.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Marketing <br /> and Community</h3>
                                    <p className='paragraph-new-medium'>We help you to build and engage your community. No community, no party.</p>
                                </div>
                                <div className='text-mar'>
                                    <h3>Launching <br /> Your Token</h3>
                                    <p className='paragraph-new-medium'>The price market action depends on many factors, from your token launch (on cex or dex) to your market maker. Let our experts guide you.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
