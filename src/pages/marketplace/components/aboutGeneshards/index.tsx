import './style.sass'

import shieldImage from '../../../../images/marketplace/safe_secure1.svg'
import updateFTPImage from '../../../../images/marketplace/updated_latest_NFTs1.svg'
import collectionImage from '../../../../images/marketplace/Wide_Collection_Of_NFTs.svg'


const WhyGenshards = () => {
    const whyGenshardData = [
        {
            icon: shieldImage,
            alt: 'verified',
            description: 'Safe and secure transactions'
        },
        {
            icon: updateFTPImage,
            alt: 'updated',
            description: 'Updated with the latest NFTs'
        },
        {
            icon: collectionImage,
            alt: 'wide collection',
            description: 'Wide Collection of curated Tokens'
        }
    ]
    return (
        <div className='whyGenshardsSection'>
            <div className='custome-container'>
             <div id='whyGenshard'>WHY GENSHARDS</div>{/* GENSHARDS */}
            <hr />
            <div className='genshardsForWhat'>
                {whyGenshardData?.map((genshardsData, id) =>
                    <div key={id} className='genshardsFor'>
                        <div className="genshardsForImage">
                            <img src={genshardsData?.icon} alt={genshardsData?.alt} />
                        </div>
                        <div className='genshardsForText'>{genshardsData?.description}</div>
                    </div>
                )}
            </div>
            </div>
        </div>
    )
}

export default WhyGenshards
