import StakeBg from '../../../../images/staking/staking-bg-img.svg';
import SentnlLogo from '../../../../images/homepage/duelist-kink-img.svg';
import SentnlLogoImg from '../../../../images/staking/sentnl-logo.svg';
import LevelImg from '../../../../images/staking/level-img.svg';
import bannerIMG from '../../../../images/homepage/banner-img.svg';
import ManyMoreImg from "../../../../images/homepage/many-more-img.svg"
import RocketIcon from "../../../../images/homepage/rocket-icon.svg"
import projectIcon from "../../../../images/50-icon.svg"
import "./launchpad.sass"
import Footercmp from '../../../../shared/components/footercmp/footercmp';
import Slider from 'react-slick';
import GenPad from '../GenPad';
import { BannerSlider } from './components/launchpad-banner-slider/banner-slider';
import { useEffect, useState } from 'react';
import { TagSlider } from '../accelerate/components/tag-slider/tag-slider';


function Launchpad() {
    const [selectValue, setSelectValue] = useState("");
    const onChange = (event) => {
        const value = event.target.value;
        setSelectValue(value);
    };
    const [screenSize, setScreenSize] = useState(getCurrentDimension());

    function getCurrentDimension() {
        return {
            width: window.innerWidth,
        }
    }

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    return (
        <>
            <div>
                <section className="new-hero-section">
                    <div className='container container-maxwidth'>
                        <div className="section-heading d-lg-flex d-block align-items-center justify-content-between text-lg-start text-center">
                            <h2 className='heading-new-2 mb-lg-0 mb-4'>Launchpad</h2>
                            {screenSize && screenSize.width < 992 &&
                                <>
                                    <div className='inner-seciton'>
                                        <h5 className='heading-new-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h5>
                                        <p className='paragraph-new-medium color-white-new mt-4'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                        <p className='paragraph-new-medium color-white-new'>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                    </div>
                                    <div className="Performance-sec mt-lg-5 mt-md-3 mt-2 ">
                                        <div >
                                            <div className="d-lg-block d-md-flex d-flex gap-lg-5 gap-2 align-items-center justify-content-center">
                                                <div>
                                                    <img src={RocketIcon} className='img-fluid mb-3 rocket-icon' alt="" />
                                                    <h2 className='heading-new-5'>Over</h2>
                                                </div>
                                                <img className='project-score-img img-fluid' src={projectIcon} alt="" />
                                                <div>
                                                    <h2 className='heading-new-5 text-start'>successful project launches</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="d-flex gap-3 launchpad-btn-group justify-content-center mt-lg-0 mt-4">
                                <button type="button" className=''>Public</button>
                                <button type="button" className='active'>Private</button>
                            </div>
                        </div>
                    </div>
                </section>

                <BannerSlider />

                <section className="new-hero-section launchpad mt-lg-5 pt-4 pb-lg-5 pb-0  left-part-background">
                    <div className='container container-maxwidth position-relative'>
                        <div className='row'>
                            {/* {screenSize && screenSize.width > 992 && */}
                            <div className='col-lg-3 col-md-12'>
                                <div className="">
                                    <div className="filter-content gap-2 justify-content-lg-start justify-content-center">
                                        <select className="form-control form-control-sm" onChange={onChange}>
                                            <option selected disabled hidden>Filter By </option>
                                            <option value="Name">Name</option>
                                            <option value="Tag">Tag</option>
                                        </select>
                                        <div className="filter-input">
                                            <div className='filter-value'>{selectValue || "Gaming"}</div>
                                        </div>
                                    </div>
                                    <div className='check-input d-flex align-items-center gap-2 my-3 mb-lg-3 mb-0 justify-content-lg-start justify-content-center'>
                                        <label className='paragraph-new-medium color-white-new' htmlFor="flexSwitchCheckChecked">Show only <strong className='paragraph-new-medium fw-bold'>Accelerate</strong> Projects</label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                        </div>
                                    </div>
                                </div>
                                {screenSize && screenSize.width > 992 &&
                                    <>
                                        <h5 className='heading-new-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h5>
                                        <p className='paragraph-new-medium color-white-new mt-4'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                        <p className='paragraph-new-medium color-white-new'>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                        <div className="overflow-hidden d-lg-block d-none">
                                            <TagSlider />
                                        </div>
                                        <div className="Performance-sec mt-lg-5 mt-md-3 mt-2">
                                            <div >
                                                <div className="d-lg-block d-md-flex d-flex gap-lg-5 gap-4 align-items-center">
                                                    <div>
                                                        <img src={RocketIcon} className='img-fluid mb-3' alt="" />
                                                        <h2 className='heading-new-5'>Over</h2>
                                                    </div>
                                                    <img className='project-score-img img-fluid' src={projectIcon} alt="" />
                                                    <div>
                                                        <h2 className='heading-new-5'>successful project launches</h2>
                                                        <div>
                                                            <button className='new-primary-button mt-4'>Find out how to launch with us</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="platform-btn mt-4 d-lg-block d-none">
                                                    <p className="py-0 m-0">Platform Audited by <img src={SentnlLogoImg} className='img-fluid ms-1' alt="" /></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className='col-lg-9 col-md-12 mt-lg-0 mt-md-4 mt-0'>
                                <GenPad />
                            </div>
                        </div>
                    </div>
                </section>

                <Footercmp />
            </div>
        </>
    )
}

export default Launchpad
