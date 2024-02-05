import "./style.sass"
import Fotlogo from '../../../../images/marketplace/fotlogo.svg'

const Footers = () => {
    return (
        <>
            <div className='mainpageFooter'>
                <div className="foot-wrapper">
                    <div className='footer-title'>STAY UPDATED</div>
                    <hr />
                    <div className="footer-desc">Sign up to our newsletter to stay updated with the latest information</div>
                    <div className='signUpMail'>
                        <input type="email" placeholder='Enter Email ID' />
                        <button>SIGN UP</button>
                    </div>
                </div>
            </div>
            <div className="lastfoter">
                <hr />
                <div className="footeritem">
                    <div className="custome-container">
                        <div className="footerwidth footerlogo">
                            <img src={Fotlogo} alt="" />
                        </div>
                        <div className="footercontent footerwidth2">
                            <div className="middlecont">
                                <a href="">Rethinking NFTS</a>
                            </div>
                            <div className="middlecont">
                                <a href="">The pieces</a>
                            </div>
                            <div className="middlecont">
                                 <a href="">GEN shards ecosystem</a>  {/*GEN shards ecosystem */}
                            </div>
                            <div className="middlecont">
                                <a href="">Services</a>
                            </div>
                            <div className="middlecont">
                                <a href="">Investor partners</a>
                            </div>
                            <div className="middlecont">
                                <a href="">Core team</a>
                            </div>
                        </div>
                        <div className="footercontent footerwidth3">
                            <div className="middlecont">
                                <a href="">About Genesis</a>
                            </div>
                            <div className="middlecont support">
                                <a href="" >Support & Media Inquiries</a>
                                 <div className="boldfont">gs@genshards.com</div>
                            </div>
                            <div className="middlecont">
                                <a href="">Disclaimer</a>
                                <div>
                                    <p className="boldfont">Assertively visualize are granular infomediaries whereas user centric customer service. Dramatically maximize resource-leveling expertise for ethical products. Globally visualize open-source leadership.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footers
