import React from 'react'
import './info-card.sass';

export interface InfoCardData {
    title: string,
    number: number,
}

export const InfoCard = (props: InfoCardData) => {
    const { title, number } = props
    return (
        <>
            <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="info-card">
                    <h5 className='heading-new-5 mb-3'>{title}</h5>
                    <h2 className='heading-new-2 mb-0'>{number}</h2>
                </div>
            </div>
        </>
    )
}
