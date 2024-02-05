import React, { useState } from 'react'
import './reminder-card.sass'
import EventremiderModal from '../event-remider-modal/event-remider-modal';


export interface ReminderCardData {
    reminderTime: string,
    imageURL: string,
}

export const ReminderCard = (props: ReminderCardData) => {
    const { reminderTime, imageURL } = props
    const [reminderModal, setReminderModal] = useState<boolean>(false)
    const eventReminderModalToggal = () => setReminderModal(!reminderModal)

    return (
        <>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="reminder-card">
                    <div className="card-image">
                        <img src={imageURL} className='img-fluid' alt="" />
                    </div>
                    <div className="card-text d-flex align-items-center">
                        <i className="ri-notification-3-fill"></i>
                        <p role='button' className='paragraph-new mb-0 'onClick={() => eventReminderModalToggal()}>{reminderTime}</p>
                    </div>
                </div>
            </div>
            <EventremiderModal isOpen={reminderModal} toggle={eventReminderModalToggal} />
        </>
    )
}
