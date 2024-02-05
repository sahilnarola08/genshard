import React from 'react'
import Elone from '../../../../../../images/accelerate/pages/elon.svg';
import './details-card.sass'



export interface ReminderCardData {
    heading: string,
    dayToGo: string,
    title: string,
    partner: string,
    guests: string,
}

export const ReminderDetailsCardData = (props: ReminderCardData) => {
    const { heading, dayToGo, title, partner, guests} = props;
    return (
        <>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="details-card">
                    <div className="card-heading d-flex align-items-center justify-content-between" >
                        <h5 className='heading-new-5'>{heading}</h5>
                        <p className='paragraph-new mb-0'>{dayToGo}</p>
                    </div>
                    <h4 className='heading-new-4 fw-light mb-3'>{title}</h4>
                    <p className='paragraph-new fw-lighter'>{partner}</p>
                    <div className="guests d-flex gap-2">
                        <p className='paragraph-new mb-0 mt-0  fw-lighter'>Guests:</p>
                        <p className='paragraph-new mb-0 mt-0 fw-lighter'>{guests}</p>
                    </div>
                    <div className="bottom-link d-flex align-items-center justify-content-between">
                        <a href="#" className='paragraph-new fw-lighter'>
                            <i className="ri-link me-1"></i> Meeting Link
                        </a>
                        <div className='paragraph-new fw-lighter'>
                            <i className="ri-notification-3-line me-2"></i> Set Reminder
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
