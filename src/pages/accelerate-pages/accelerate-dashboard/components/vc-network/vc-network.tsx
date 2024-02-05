import React, { useState } from 'react'
import "./vc-network.sass"
import Featurecard from './components/feature-card/feature-card'
import Latestbets from './components/latest-bets/latest-bets'
import VcLevelTable from './components/vc-level-table/vc-level-table'
import VcCondensedTable from './components/vc-condensed-table/vc-condensed-table'
import VcListTable from './components/vc-list-table/vc-list-table'

const Vcnetwork = () => {
    const [viewTable, setViewTable] = useState("smallView");


    return (
        <>
            <div className=''>
                <div className='feature-vc-section'>
                    <h5 className='heading-new-5'>Featured VCs</h5>
                    <div>
                        <Featurecard />
                    </div>
                </div>
                <div className='latest-bets-section mt-lg-5 mt-md-3 mt-2'>
                    <h5 className='heading-new-5'>Latest Bets by in VC Network</h5>
                    <div className='mt-4'>
                        <Latestbets />
                    </div>
                </div>
                <div className='explore-section mt-lg-5 mt-md-3 mt-2'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <h5 className='heading-new-5'>Explore Our Network</h5>
                        </div>
                        <div className='d-flex text-center align-items-center'>
                            <p className='paragraph-new-small mb-0 me-4'>View</p>
                            <i className="ri-zoom-out-line color-primary-new me-3"></i>
                            <div className='form-check'>
                                <input className="form-check-input me-5" type="radio" name="exampleRadios" id="flexRadioDefault1" value="option1" defaultChecked onChange={() => setViewTable("smallView")} />
                            </div>
                            <div className='form-check'>
                                <input className="form-check-input me-5" type="radio" name="exampleRadios" id="flexRadioDefault2" value="option1" onChange={() => setViewTable("mediumView")} />
                            </div>
                            <div className='form-check'>
                                <input className="form-check-input me-3" type="radio" name="exampleRadios" id="flexRadioDefault3" value="option1" onChange={() => setViewTable("largeView")} />
                            </div>
                            <i className="ri-zoom-in-line color-primary-new"></i>
                        </div>
                    </div>
                    <div className='mt-4'>
                        {viewTable === "smallView" &&
                            <VcCondensedTable />}
                        {viewTable === "mediumView" &&
                            <VcListTable />}
                        {viewTable === "largeView" &&
                            <VcLevelTable />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Vcnetwork