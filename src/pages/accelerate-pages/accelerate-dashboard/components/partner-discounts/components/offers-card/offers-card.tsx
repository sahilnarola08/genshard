import React from 'react'
import "./offers-card.sass"
import Profile from '../../../../../../../images/accelerate/pages/profile-img.svg'


const cardData = [
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    {
        name: "ABC Oriental",
        image: Profile,
        subTitle: "Auditing, Documentation",
        discription: "Avail upto 50% off on our core servies",
    },
    

]

const Offerscard = () => {
    return (
        <>
            <div className='offer-table-section mt-lg-5 mt-md-3 mt-2'>
                <div className="row">
                    {cardData && cardData?.map((item: any, i: any) => (
                        <div className="col-lg-4 mb-lg-5 mb-md-3 mb-2">
                            <div className='vc-list-card text-center'>
                                <div className='d-flex justify-content-center align-items-center gap-3'>
                                    <img src={item.image} alt="" />
                                    <h5 className='heading-new-5 text-start'>{item.name}</h5>
                                </div>
                                <ul className='social-link-table mt-3'>
                                    <li>
                                        <a href="#"><i className="ri-twitter-fill"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="ri-links-line"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="ri-send-plane-fill"></i></a>
                                    </li>
                                </ul>
                                <p className='auditing mt-3'>{item.subTitle}</p>
                                <h5 className='avail'>{item.discription}</h5>
                                <div className='text-center'>
                                    <button className='request-to-onnect-btn mt-3'>Connect to Partner</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Offerscard