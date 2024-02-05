import React from 'react'
import "./accelerate-thanks.sass"
import Accelerate from '../../../images/accelerate/accelerate.svg';
import ZksyncIcon from '../../../images/accelerate/zksync-icon.svg';
import arbitrumIcon from '../../../images/accelerate/arbitrum-icon.svg';
import celebrateIcon from '../../../images/accelerate/pages/celebrate-icon.svg';
import celebrateBGIcon from '../../../images/accelerate/pages/celebrate-bg-icon.svg';
import Footercmp from '../../../shared/components/footercmp/footercmp';
import { useHistory } from 'react-router-dom';
import { WelcomingSection } from '../accelerate-dashboard/components/welcoming-section/welcoming-section';


const Acceleratethanks = () => {
    const history = useHistory()

    return (
        <>
            <img className='cele-bg' src={celebrateBGIcon} alt="" />
            <div className='thank-section'>
                <div className="container container-maxwidth">
                    <WelcomingSection />
                    <div className='thank-text-section mt-lg-5 mt-md-3 mt-2 mb-lg-0 mb-md-5'>
                        <div>
                            <img src={celebrateIcon} alt="" />
                            <h3 className='fs-47 fw-light mt-lg-4 mt-3'>Thank you for completing the form</h3>
                            <p className='heading-new-6 fw-light mt-lg-4 mt-md-3 mt-2'>Now, let’s get you set up!</p>
                            <button className='paragraph-new-medium new-primary-button-small mt-lg-4 mt-md-3 mt-2' onClick={() => history.push('/project-lists')}>Next Step</button>
                        </div>
                    </div>
                </div>
                <Footercmp />
            </div>
        </>
    )
}

export default Acceleratethanks