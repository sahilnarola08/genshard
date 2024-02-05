import React from 'react'
import Accelerate from '../../../../../images/accelerate/accelerate.svg';
import ZksyncIcon from '../../../../../images/accelerate/zksync-icon.svg';
import ArbitrumIcon from '../../../../../images/accelerate/arbitrum-icon.svg';
import { useHistory, useLocation } from 'react-router-dom';
import './welcoming-section.sass'

export const WelcomingSection = () => {
    const history = useHistory()
    const location = useLocation();
    const { pathname } = location;
    const isform = pathname.includes("/forms/project-view/first-time-login");
    return (
        <>
            <div className='form-header-section'>
                <div className='container container-maxwidth'>
                    <div className='thanks-head-section text-center'>
                        <img className='acce-logo' src={Accelerate} alt="" />
                        <div className='launch-text mt-3 d-lg-flex d-md-flex d-none'>
                            <p >Home for launches on</p>
                            <img src={ArbitrumIcon} alt="" />
                            <p >&</p>
                            <img src={ZksyncIcon} alt="" />
                        </div>
                        <div className='launch-text d-lg-none d-md-none d-block text-center justify-content-center'>
                            <div>
                                <p className='mb-0'>Home for launches on</p>
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <img src={ArbitrumIcon} alt="" />
                                <p >&</p>
                                <img src={ZksyncIcon} alt="" />
                            </div>
                        </div>
                        <div className='mt-lg-5 mt-md-3 mt-2 welcome-text'>
                            <h3 className='heading-new-3 color-white-new'>Welcome onboard!</h3>
                            <p className='heading-new-6 mt-lg-4 mt-md-3 mt-2'>Please enter any missing details in the form <br /> to complete the onboarding process.</p>
                        </div>
                    </div>
                    <div className=' mt-lg-4 mt-md-3 mt-2 data-sections d-flex align-items-center justify-content-center position-relative'>
                        {isform ?
                            <div className='heading-new-6 text-center' style={{ color: "#848484" }}>Fields and sections marked in Orange will guide you to the unfilled data sections</div>
                            : ""}
                        <div className='text-end position-absolute end-0'><button className='new-primary-button' onClick={() => history.push('/project-dashboard')}>Skip</button></div>
                    </div>

                </div>

            </div>
        </>
    )
}
