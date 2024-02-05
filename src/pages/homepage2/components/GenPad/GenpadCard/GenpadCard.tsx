import { memo, useCallback, useMemo } from 'react'
import './style.sass'

import twitter from "../../../../../images/homepage/twitter.svg"
import metaverse from "../../../../../images/homepage/metaverse.svg"
import telegram from "../../../../../images/homepage/telegram.svg"
import websiteLink from "../../../../../images/homepage/websiteLink.svg"
import Button from '../../../../../shared/components/buttons'

const redirectIconsMap: any = {
    twitter,
    telegram,
    metaverse,
    websiteLink,
}

const GenpadCard = (props: any) => {

    const tokenValue = {
        "$PRJX": 0.16
    }

    const { data, cardTitle } = props;

    return (
        <div className='genpad-card-container'>
            <div className='notch' style={{ backgroundColor: cardTitle === "Ended" ? 'transparent' : '#FF0071' }}>{cardTitle}</div>
            <div className="inner-div">
                <div className='overview-container'>
                    <div className='overview-info'>
                        <h1>{data?.name}</h1>
                        <h3>{data?.tokenId}</h3>
                        <h3>Chain : {data?.chain}</h3>
                    </div>
                    <div className="image">
                        {!!data?.image ? <img src={data?.image} alt="" height="100%" width="100%" /> : <div className='image-placeholder' />}
                    </div>
                </div>
                <div className='links'>
                    {
                        (data?.socialLinks || []).map((link: any) => (
                            <img src={redirectIconsMap[link?.type]} alt="" />
                        ))
                    }
                </div>
                <div className='starting-info'>
                    <span>
                        <h3>
                            Starts
                        </h3>
                    </span>
                    <span>
                        <h3 className='starting-date'>
                            {data?.starting_date}
                        </h3>
                    </span>
                </div>
                <div className='progress-container'>
                    <div className="progress-info">
                        <span><h2>Opens in {data?.progress?.completion_time}</h2></span>
                        <span><h2>{data?.progress?.completion_percentage}</h2></span>
                    </div>
                    <div className='progress-bar' style={{ borderColor: cardTitle === "Ended" ? '#00CF6C' : '#FF0071' }}>
                        <div style={{ backgroundColor: (cardTitle === "Ended") ? '#00CF6C' : '#FF0071', height: '100%', width: data?.progress?.completion_percentage }}></div>
                    </div>
                    <div className="progress-info">
                        <span>{data?.progress?.completed_projects} PRJX</span>
                        <span>{data?.progress?.completed_projects}/{data?.progress?.total_projects} PRJX</span>
                    </div>
                </div>
                <div className="total-info">
                    <h3>Total Raise</h3>
                    <h3>1 $PRJX = 0.16 GSK</h3>
                </div>
                <hr />
                <div className='kyc-section'>
                    <h4>
                        This IDO Requires KYC
                    </h4>
                    <Button className="primary">Verify KYC</Button>
                </div>
            </div>
        </div>
    )
}

export default memo(GenpadCard)