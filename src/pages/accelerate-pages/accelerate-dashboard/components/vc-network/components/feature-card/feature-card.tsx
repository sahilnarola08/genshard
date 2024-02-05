import React from 'react'
import "./feature-card.sass"
import Slider from "react-slick";
import Profile from '../../../../../../../images/accelerate/pages/profile-img.svg'

const Featurecard = () => {

    let settings = {
        dots: false,
        slidesToShow: 2.2,
        slidesToScroll: 1,
        // initialSlide: 0,
        arrows: false,
        infinite: false,
    };

    const collections = [
        {
            id: 1,

        },
        {
            id: 2
        },
        {
            id: 3
        },
        {
            id: 4
        },
        {
            id: 5
        },
    ]
    return (
        <>
            <div className='featured-slider mt-lg-5 mt-md-3 mt-2'>
                <Slider {...settings}>
                    {collections?.map((values, i) => (
                        <div className="slide-content feature-card">
                            <div className="content d-flex">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className='profile-text'>
                                            <div className='profiles-name d-flex align-items-center'>
                                                <img src={Profile} alt="" />
                                                <h5 className='heading-new-5 ms-3'>DUELIST KING</h5>
                                            </div>
                                            <div className='deshboard-social d-flex mt-lg-5 mt-md-3 mt-2'>
                                                <div><i className="ri-twitter-fill"></i></div>
                                                <div><i className="ri-link ms-3"></i></div>
                                                <div><i className="ri-send-plane-fill ms-3"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className='mt-3 profile-discription'>
                                            <h6 >Ut enim ad minim veniam, quis nostrud </h6>
                                            <p className='mt-3'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4 text-center'><button className='new-primary-button'>Connect to Partner</button></div>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )
}

export default Featurecard