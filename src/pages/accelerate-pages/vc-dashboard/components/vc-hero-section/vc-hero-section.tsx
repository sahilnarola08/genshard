import React from 'react';
import './vc-hero-section.sass';
import Accelerate from '../../../../../images/accelerate/accelerate.svg';
import Profile from '../../../../../images/accelerate/pages/profile-img.svg';
import { useHistory, useLocation } from 'react-router-dom';


export const VCHeroSection = () => {
    const history = useHistory()

    return (
        <div>
            <div className='vc-profile-section py-5'>
                <div className='container container-maxwidth profil-text'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <img className='dashboard-title img-fluid' src={Accelerate} alt="" />
                        <div className='d-flex align-items-center gap-3'>
                            <div className='user-profile-image'>
                                <img src={Profile} alt="" />
                            </div>
                            <div>
                                <h3 className='heading-new-3 color-white-new mb-2 fw-light'>Satya Nadella</h3>
                                <button className='new-white-button' onClick={() => history.push('/vc-dashboard/profile-information')}>Your Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
