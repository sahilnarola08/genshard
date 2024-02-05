import './style.sass'
import { useEffect, useState } from 'react';
import justInImage from '../../../../images/marketplace/justInImage.png'
import axios from 'axios';
import { apiBaseUrl } from '../../../../constants';
import { IUserNFT } from '../..';
import { shortenAddress } from '../../../../utils';
import { useHistory, useRouteMatch } from 'react-router-dom';


const JustInOthersWorlds = () => {

    const { path } = useRouteMatch()
    const history = useHistory();
    const [featuredNft, setFeaturedNft] = useState<IUserNFT>()

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/get/all?limit=1&sortBy=new_featured`).then(({ data }) => {
            console.log('JustInOthersWorldsJustInOthersWorlds', data);
            setFeaturedNft((data.values && data.values[0] && data.values[0]) || [])
        })
    }, [])

    console.log(featuredNft, "featuredNfts")

    return (
        <>
            {featuredNft?.user &&
                <div className='justInOthersWorlds' onClick={() => history.push(`/assets/${featuredNft?.tokenAddress}/${featuredNft?.tokenId}`, featuredNft)}>
                    <div className='custome-container'>
                        <div className='inOthersWorldsDetails'>
                            <div className='justIn-Container'>
                                <div id='justIn'>JUST IN</div>
                                <hr />
                                <div id='otherWorlds'>{featuredNft?.nft.name ?? ""}</div>
                                <div id='byVeraStudios'>| by {featuredNft?.user && featuredNft?.user.walletAddress && shortenAddress(featuredNft?.user.walletAddress)}</div>
                                <div id='othersWorldsDescription'>{featuredNft?.nft.description ?? ""}</div>
                                <div id='ethAndBuy'>
                                    {/* <div className='buy-price'>{featuredNft.listingPrice || 0} ETH</div> */}

                                    <button onClick={() => history.push(`/assets/${featuredNft?.tokenAddress}/${featuredNft?.tokenId}`, featuredNft)}>View NFT</button>
                                </div>
                            </div>
                        </div>
                        <div className="inOthersWorldsImageContainer">
                            <div className="inOthersWorldsImage">
                                <img src={featuredNft?.nft.nftAsset && featuredNft?.nft.nftAsset.split('.').pop() !== "svg+xml" ? featuredNft?.nft.nftAsset : `/images/noimageavailable.png`} alt="" />
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default JustInOthersWorlds
