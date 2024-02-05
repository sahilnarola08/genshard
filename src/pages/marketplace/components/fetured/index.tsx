import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Slider from "react-slick";

import './style.sass'
import featureImage from '../../../../images/marketplace/foto1-original 1.png'
import featureImage2 from '../../../../images/marketplace/bf7f0e2df7b5283050229f5677c9a733 1.png'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { apiBaseUrl } from '../../../../constants';
import { IUserNFT } from '../..';
import { shortenAddress } from '../../../../utils';
import ReactPlayer from 'react-player';
import { isVideoFormat } from '../../../market/helper';
import { useIPFS } from '../../../../hooks/useIPFS';


const heroSlider = [
    {
        img: featureImage,
        alt: "head image",
        types: "MONSTERS",
        byStudio: "XYZ",
        title: "FEATURED",
    },
    {
        img: featureImage2,
        alt: "head image",
        types: "MONSTERS",
        byStudio: "XYZ",
        title: "FEATURED",
    },
    {
        img: featureImage,
        alt: "head image",
        types: "MONSTERS",
        byStudio: "XYZ",
        title: "FEATURED",
    },
]

const FeatureComponent = () => {
    const { resolveLink } = useIPFS();
    const { path } = useRouteMatch()
    const history = useHistory();
    const [featuredNfts, setFeaturedNfts] = useState<any[]>([])

    useEffect(() => {
        getAllFeaturedNFTData()
    }, [])

    const getAllFeaturedNFTData = async () => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/get/all?limit=3&sortBy=high_on_sale`).then(async ({ data }) => {
            console.log("featuredcomponents : ", data);
            const featuredNFTDataArray = data?.values || []
            const featuredNFTResultsArray = featuredNFTDataArray && featuredNFTDataArray?.map(async (item, index) => {
                let nftImage = item?.nft?.nftAsset ?? ""
                let nftName = item?.nft?.name ?? ""
                let nftDescription = item?.nft?.description ?? ""
                if (nftName == "" || nftImage == "") {
                    try {
                        await fetch(item?.nft?.token_uri)
                        .then((response) => response.json())
                        .then((dataObject) => {
                            nftImage = resolveLink(dataObject?.image ? dataObject?.image : dataObject?.image_url ? dataObject?.image_url : '')
                            nftName = dataObject?.name
                            nftDescription = dataObject?.description
                        });
                    } catch (error) {
                        console.log('Failed to retried assets information from tokenURI');
                    }
                }
                return { id: index + 1, auctionPrice: item?.auctionPrice, chainId: item?.chainId ?? {}, collection: item?.collection, lastSoldPrice: item?.lastSoldPrice, listingPrice: item?.listingPrice, nftListings: item?.nftListings, offerPrice: item?.offerPrice, tokenAddress: item?.tokenAddress, tokenId: item?.tokenId, user: item?.user, _id: item?._id, nft: item?.nft, nftName: nftName, nftDescription: nftDescription, nftImage: nftImage};
            }) || []
            let dataArrayResults = await Promise.all(featuredNFTResultsArray)
            setFeaturedNfts(dataArrayResults || [])
        })
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    return (
        <>
            <section className="hero-section">
                <div className="custome-container">
                    <div className="container">
                        <div className="content">
                            <div className="hero-title">Explore, collect, and trade, incredible NFTs in the world's most innovative NFT marketplace</div>
                            <button className="cta" onClick={() => history.push(`/explore-nfts`)} >EXPLORE</button>
                        </div>
                        <div className="hero-slider-wrapper">
                            <Slider {...settings} autoplay={true} lazyLoad={'progressive'}>
                                {featuredNfts?.map((values : any) => (
                                    <div className="hero-slide-item" key={values._id} onClick={() => history.push(`/assets/${values?.tokenAddress}/${values?.tokenId}`, values)}>
                                        <div className="slide-title">FEATURED</div>
                                        <div className="slide-img">
                                            {
                                                isVideoFormat(values?.nftImage) ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={values?.nftImage} loop={false} />
                                                    : <img src={values?.nftImage && values?.nftImage.split('.').pop() !== "svg+xml" ? values?.nftImage : `/images/noimageavailable.png`} alt={""} />
                                            }
                                        </div>
                                        <div className="slide-sub-title">
                                            <span className="bold-text"> {values?.nftName} </span> | by Studio{" "}
                                            <span className="name"> {values?.user?._id === values?.user?.username ? values?.user && values?.user?.walletAddress ? `${shortenAddress(values?.user?.walletAddress)}` : 'UnNamed' : values?.user?.username}</span>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FeatureComponent