import React from 'react'
import bannerIMG from '../../../../../../images/homepage/banner-img.svg';
import Slider from 'react-slick';
import SentnlLogo from '../../../../../../images/homepage/duelist-kink-img.svg';
import './banner-slider.sass'

const collections = [
    {
        desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    },
    {
        desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    },
    {
        desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    }
]

export const BannerSlider = () => {

    let settings = {
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
        pauseOnHover: false
    };

    return (
        <>
            <section className='banner-slider overflow-hidden'>
                <Slider {...settings}>
                    {collections?.map((values) => (
                        <div className="">
                            <div className="banner-content" style={{ backgroundImage: `url(${bannerIMG})` }}>
                                <div className='container container-maxwidth'>
                                    <div className='row'>
                                        <div className='col-lg-4 col-md-12'>
                                            <div className="content">
                                                <div className="">
                                                <button className='new-primary-button-small'>A project of Symbiote <span className='fw-bold'>Accelerate</span></button>
                                                </div>
                                                <div className="user-image">
                                                    <img src={SentnlLogo} className='img-fluid' alt="" />
                                                </div>
                                                <div className="labels-btn d-flex gap-2 align-items-center">
                                                    <p className='lables m-0'>Public</p>
                                                    <p className='lables m-0'>Private</p>
                                                </div>
                                                <p className='paragraph-new-medium my-lg-3 my-2'>{values.desc}</p>
                                                <button className='new-color-button-small py-2'>See Project</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>
        </>
    )
}
