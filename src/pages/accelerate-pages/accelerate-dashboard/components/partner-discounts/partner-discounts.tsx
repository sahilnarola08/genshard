import React from 'react'
import "./partner-discounts.sass"
import DiscountsCard from './components/discounts-card/discounts-card'
import Offerscard from './components/offers-card/offers-card'

const Partnerdiscounts = () => {
    return (
        <>
            <div>
                <div className='feature-vc-section'>
                    <h5 className='heading-new-5'>Featured Discounts - JUST IN</h5>
                    <div>
                        <DiscountsCard />
                    </div>
                </div>
                <div className='all-offers-section mt-lg-5 mt-md-3 mt-2'>
                    <h5 className='heading-new-5'>All offers</h5>
                    <div>
                        <Offerscard />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Partnerdiscounts