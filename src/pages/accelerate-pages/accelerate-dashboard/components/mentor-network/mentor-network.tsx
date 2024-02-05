import React from 'react'
import "./mentor-network.sass"
import Elone from '../../../../../images/accelerate/pages/elon.svg';


const mentorDAta = [
    {
        name: "Elon Musk",
        title: "Makes funny cars",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    }
]
const NetworkData = [
    {
        name: "Elon Musk",
        title: "Makes funny cars",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
    {
        name: "Carl Pei",
        title: "Not Nothing",
    },
]

const Mentornetwork = () => {
    return (
        <>
            <div className=''>
                <div className='lead-section'>
                    <div className='d-flex'>
                        <h5 className='heading-new-5 me-3'>Current Lead Mentors</h5>
                        <p className='heading-new-6 mb-0' style={{ color: "#6D6D6D" }}>1/2  Assigned</p>
                    </div>
                    <div className='connection-section mt-lg-5 mt-md-3 mt-2'>
                        <div className="row">
                            <div className="row">
                                {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                                    <div className="col-lg-2">
                                        <div className='all-mentor-section text-center'>
                                            <img className='img-fluid' src={Elone} alt="" />
                                            <p className='paragraph-new mt-3'>{item.name}</p>
                                            <p className='paragraph-new-medium'>{item.title}</p>
                                            <button className='new-primary-button'>Talk</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='lead-section mt-lg-5 mt-md-3 mt-2'>
                    <div className='d-flex'>
                        <h5 className='heading-new-5 me-3'>Current Support Mentors</h5>
                        <p className='heading-new-6 mb-0' style={{ color: "#6D6D6D" }}>2/3  Assigned</p>
                    </div>
                    <div className='connection-section mt-lg-5 mt-md-3 mt-2'>
                        <div className="row">
                            <div className="row">
                                {mentorDAta && mentorDAta?.map((item: any, i: any) => (
                                    <div className="col-lg-2">
                                        <div className='Support-mentor-section text-center'>
                                            <img className='img-fluid' src={Elone} alt="" />
                                            <p className='paragraph-new mt-3'>{item.name}</p>
                                            <p className='paragraph-new-medium'>{item.title}</p>
                                            <button className='new-primary-button'>Talk</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='network-section mt-lg-5 mt-md-3 mt-2'>
                    <div className='d-flex justify-content-between'>
                        <h5 className='heading-new-5'>Mentor Network</h5>
                        <p className='paragraph-new mb-0 request' style={{ color: "#6D6D6D" }}>Make a request</p>
                    </div>
                    <div className='network-catogory mt-lg-5 mt-md-3 mt-2'>
                        <div className="row d-flex ">
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios1" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios1'>
                                            Product Dev
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios2" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios2'>
                                            Market Fit
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios3" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios3'>
                                            Technology
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios4" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios4'>
                                            Unit Economics
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios5" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios5'>
                                            Marketing
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios6" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios6'>
                                            Community
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios7" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2" htmlFor='exampleRadios7'>
                                            GTM Strategy
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios8" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2 " htmlFor='exampleRadios8'>
                                            Business Dev
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios9" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2 " htmlFor='exampleRadios9'>
                                            Legal
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 mb-3">
                                <div className='aaa'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="exampleRadios" id="exampleRadios10" value="option1" />
                                        <label className="form-check-label paragraph-new-medium fw-bold ms-2 " htmlFor='exampleRadios10'>
                                            Fundraising
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='network-catogory-data mt-lg-5 mt-md-3 mt-2'>
                        <div className="row">
                            {NetworkData && NetworkData?.map((item: any, i: any) => (
                                <div className="col-lg-2 mt-lg-5 mt-md-3 mt-2">
                                    <div className='all-mentor-section text-center'>
                                        <img className='img-fluid' src={Elone} alt="" />
                                        <p className='paragraph-new mt-3'>{item.name}</p>
                                        <p className='paragraph-new-medium'>{item.title}</p>
                                        <button className='new-primary-button'>Connect</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mentornetwork