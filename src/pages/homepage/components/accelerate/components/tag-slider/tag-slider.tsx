import React from 'react'
import Slider from 'react-slick'
import './tag-slider.sass'
import trumpLogo from "../../../../../../images/homepage/trump-logo.svg"
import { useLocation } from 'react-router-dom'


const sliderCollections = [
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Privacy Partner",
        image: trumpLogo,
    },
    {
        title: "Partner Partner",
        image: trumpLogo,
    },
    {
        title: "Finance Partner",
        image: trumpLogo,
    },
    {
        title: "Delivery Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
   ]

const accelerateFormInputData: any = {
    "Founder Information": [
        {
            questionid: 1,
            questionTitle: "Hello there! Can we get your full name",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Can you please give us your date of birth",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "What is the best email address to contact you on?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Can we also have a phone number, please?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please paste the link to your LinkedIn profile",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "Please upload your latest CV",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
    ],
    "Company information": [
        {
            questionid: 1,
            questionTitle: "Company name - What is the legal name of your venture?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Creation date - When did you begin building this?",
            questiontype: "datepicker",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Location - In what legal jurisdiction is it based? (City, Country)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 4,
            questionTitle: "If your company has a website, please share the link",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Company description - Briefly describe your company. What is your value proposition? What sector do you operate in? Etc.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "What is your role within the company? (Options - CEO, CTO, CMO, COO, Other)",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "Employee count: How many employees do you have?",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "If you have a pitch deck that describes your company, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "If you have your company’s whitepaper, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "What stage is your company currently in",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "MVP", 
                "Early Traction", 
                "Growth Phase", 
                "Other"
            ]
        },
    ],
    "Company Metrics": [
        {
            questionid: 1,
            questionTitle: "How many users do you currently have?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "Less than 10", 
                "10-100", 
                "100-1000", 
                "1000-10",
                "000", 
                "10,000+"
            ]
        },
        {
            questionid: 2,
            questionTitle: "What is your average monthly spending? (Amount in $)",
            questiontype: "datepicker",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
            dropdownOption: [
                "Under 1k", 
                "1k-5k", 
                "5k-10k", 
                "10k-50k", 
                "50k+"
            ]
        },
        {
            questionid: 3,
            questionTitle: "What is your average monthly revenue? (Amount in $)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
            dropdownOption: [
                "Under 1k", 
                "1k-5k", 
                "5k-10k", 
                "10k-50k", 
                "50k+"
            ]
        },
        {
            questionid: 4,
            questionTitle: "If your company has a website, please share the link",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Company description - Briefly describe your company. What is your value proposition? What sector do you operate in? Etc.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "What is your role within the company? (Options - CEO, CTO, CMO, COO, Other)",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "Employee count: How many employees do you have?",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "If you have a pitch deck that describes your company, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "If you have your company’s whitepaper, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "What stage is your company currently in",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdown: [
                "MVP", 
                "Early Traction", 
                "Growth Phase", 
                "Other"
            ]
        },
    ],
}

export const TagSlider = (asd: any) => {
    const location = useLocation();
    const pathname = location.pathname;
    const islaunchpad = pathname.includes("/launchpad");

    let settings = {
        dots: false,
        autoplay: true,
        infinite: true,
        autoplaySpeed: 0,
        slidesToShow: islaunchpad ? 2.2 : 8,
        speed: 7000,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
        // swipeToSlide: true,
        responsive: [
            {
                breakpoint: 2500,
                settings: {
                    slidesToShow: islaunchpad ? 1.8 : 8.4,
                }
            },
            {
                breakpoint: 1980,
                settings: {
                    slidesToShow: islaunchpad ? 1.8 : 8.3,
                }
            },
            {
                breakpoint: 1950,
                settings: {
                    slidesToShow: islaunchpad ? 1.8 : 8.3,
                }
            },
            {
                breakpoint: 1750,
                settings: {
                    slidesToShow: islaunchpad ? 1.6 : 7.2,
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: islaunchpad ? 1.6 : 7.5,
                }
            },
            {
                breakpoint: 1550,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 6.5,
                    // slidesToShow: 2.05,
                }
            },
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 5.5,
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 5.9,
                }
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 6.2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 5.5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 5.2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: islaunchpad ? 0.95 : 4.2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 3.8,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 2.5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 2.1,
                }
            },
            {
                breakpoint: 380,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 2.5,
                }
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: islaunchpad ? 1.2 : 1.9,
                }
            },
        ]
    };

    return (
        <>
            <div className="many-more-section text-center mt-5">
                <div className="tag-slider overflow-hidden">
                    <Slider {...settings} className=''>
                        {sliderCollections?.map((values) => (
                            <div className=''>
                                <div className="tag-slider-item me-3">
                                    <img src={values.image} className='img-fluid' alt={""} />
                                    <p className='paragraph-new-medium mb-0'>{values?.title}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <Slider {...settings} className='my-3'>
                        {sliderCollections?.map((values) => (
                            <div>
                                <div className="tag-slider-item ms-3">
                                    <img src={values.image} className='img-fluid' alt={""} />
                                    <p className='paragraph-new-medium mb-0'>{values?.title}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <Slider {...settings}>
                        {sliderCollections?.map((values) => (
                            <div>
                                <div className="tag-slider-item me-3">
                                    <img src={values.image} className='img-fluid' alt={""} />
                                    <p className='paragraph-new-medium mb-0'>{values?.title}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </>
    )
}
