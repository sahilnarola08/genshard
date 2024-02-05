import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import { useHistory, useRouteMatch } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

import sliderImage from '../../../../images/marketplace/foto1-original 1.png'
import sliderImage2 from '../../../../images/marketplace/bf7f0e2df7b5283050229f5677c9a733 1.png'
import './style.sass'
import { apiBaseUrl } from '../../../../constants';
import axios from 'axios';
import { INftCollection } from '../..';
import { shortenAddress } from '../../../../utils';

const FreshComponent = () => {

    const { path } = useRouteMatch()
    const history = useHistory();
    const imgRef = useRef<Slider>(null);
    const [state, setState] = useState(0)
    const [collections, setCollection] = useState<INftCollection[]>([])

    useEffect(() => {
        if (imgRef?.current?.slickGoTo) {
            imgRef.current.slickGoTo(state);
        }
    }, [state, imgRef]);

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/collection/get/all?limit=4&sortBy=new_featured`).then(({ data }) => {
            setCollection(data.values || [])
        })
    }, [])

    let settings = {
        dots: true,
        // infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        // beforeChange: (current: number, next: number) => setState(next)
    };

    return (
        <div className="fresh-container">
            <div className='custome-container'>
            <div className="fresh-wrapper">
                <div className="fresh-side-wrapper">
                    <div className="fresh-heading">FRESH</div>
                    <hr className="custom-hr" />
                    <ul className="slide-menu">
                        {collections?.map((values, index) => (
                            <li key={index}>
                                <a
                                    className={state === index ? 'active-link' : ''}
                                    onClick={() => setState(index)}>
                                    {values?.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="anxious-wrapper">
                <Slider {...settings} ref={imgRef}>
                    {collections?.map((values) => (
                        <div className="anxious-slide-item" onClick={() => history.push(`/collection/${values.chainId}/${values?.collectionAddress}`)}>
                            <div className="slide-img">
                                <img src={values.bannerImage || `/images/explore-nft.png`} alt={""} />
                            </div>
                            <div className="slide-sub-title">
                                <div className="bold-text">{values?.name}</div>
                                <div className='byVeraStudio'>| by {values?.user?._id === values?.user?.username ? `${shortenAddress(values?.user?.walletAddress)}` : values?.user?.username}</div>
                                <div className="slide-body">{values?.description}</div>
                                {/* <div className='btn-container'>
                                    <div className="bold-text">0.01 ETH</div>
                                    <button>buy</button>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </Slider>

            </div>
            </div>
        </div>
    )
}

export default FreshComponent
