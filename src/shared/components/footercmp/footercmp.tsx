import React from 'react'
import "./footercmp.sass"
import { Link } from 'react-router-dom'


const Footercmp = () => {
    return (
        <>
            <div className='mt-lg-5 mt-4 m-lg-0 m-md-0 m-3 mb-0'>
                <div className="container">
                    <div className='row footer-sec justify-content-between'>
                        <div className='col-lg-4 Symbiote '>
                            <div className="d-lg-none d-md-none d-block text-center">
                                <button className='new-primary-button mb-3'>Accelerate with Symbiote, Apply to Launch!</button>
                            </div>
                            <h4 className='mb-3 heading-new-2'>Symbiote</h4>
                            <p className='mb-3 paragraph-new-medium'>* Past performances do not indicate future success.</p>
                            <p className='paragraph-new-medium'>This web page and any other contents published on this website shall not constitute investment advice, financial advice, trading advice, or any other kind of advice, and you should not treat any of the website’s content as such. You alone assume the sole responsibility of evaluating the merits and risks associated with using any information or other content on this website before making any decisions based on such information. You understand that the crypto market is characterised by high volatility, and you should be aware of the concrete possibility of losing the entirety of the funds you allocated in the crypto market. You should refrain from using funds you can’t afford to lose when purchasing cryptocurrencies and other digital tokens.</p>
                        </div>
                        <div className="col-lg-7">
                            <div className="d-lg-block d-md-block d-none">
                                <button className='new-primary-button mb-5'>Accelerate with Symbiote, Apply to Launch!</button>
                            </div>
                            <div className="footer-links">
                                <div className='Product'>
                                    <p>Product</p>
                                    <ul>
                                        <li><Link to="">Launchpad</Link></li>
                                        <li><Link to="">Staking</Link></li>
                                        <li><Link to="">VoteDAO</Link></li>
                                        {/* <li>Spaceport</li>
                                        <li>Your Portfolio</li> */}
                                    </ul>
                                </div>
                                <div className='Product'>
                                    <p>Resources</p>
                                    <ul>
                                        <li><Link to="">Documentation</Link></li>
                                        <li><Link to="">About Us</Link></li>
                                        <li><Link to="">CoinGecko link</Link></li>
                                        <li><Link to="">CMC Link</Link></li>
                                        <li><Link to="">Buy GS</Link></li>
                                    </ul>
                                </div>
                                <div className='Product'>
                                    <p className='mb-lg-4 mb-md-3 mb-0'>Ecosystem</p>
                                    <p>Say Hi!</p>
                                    <ul>
                                        <li><Link to="">Telegram</Link></li>
                                        <li><Link to="">LinkedIn</Link> </li>
                                        <li><Link to="">Email</Link></li>
                                    </ul>
                                </div>
                                <div className='d-lg-none d-md-none d-block' style={{ width: "100px" }}>
                                    <p className=" paragraph-new-medium color-white-new mb-0">2023 (C) | All Rights and Lefts Reserved</p>
                                </div>

                            </div>
                            <p className="d-lg-block d-md-block d-none mt-5 paragraph-new-medium color-white-new">2023 (C) | All Rights and Lefts Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footercmp

