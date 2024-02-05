import React, { useEffect, useState } from 'react'
import "./votedao.sass"
import Footercmp from '../../../../shared/components/footercmp/footercmp'
import SentnlLogo from '../../../../images/staking/sentnl-logo.svg';
import RocketIcon from "../../../../images/homepage/rocket-icon.svg"
import Votehero from "../../../../images/vote-hero-img.svg"
import VoteProfile from "../../../../images/vote-profile-img.svg"
import binanceLogo from "../../../../images/binance-logo.svg"
import voteIcon from "../../../../images/vote-icon.svg"
import projectIcon from "../../../../images/50-icon.svg"
import moment from 'moment';
import Pagination from '../Pagination';

const VoteCard = [
    {
        id: 1,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        voting: true,
        date: 83500000
    },
    {
        id: 2,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 3500000
    },
    {
        id: 3,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 800000
    },
    {
        id: 4,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 83500000
    },
    {
        id: 5,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 83500000
    },
    {
        id: 6,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 835000000
    },
    {
        id: 7,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 835000000
    },
    {
        id: 8,
        name: "cheking",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 86450000
    },
    {
        id: 9,
        name: "Duelist King",
        subname: "DUEK",
        vote: "362 Votes",
        image: Votehero,
        date: 835000000
    },
]

const totalLimit = 3

const Votedao = () => {

    const [currentPage, setCurrentPage] = useState(0)
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    function getCurrentDimension() {
        return {
            width: window.innerWidth,
        }
    }
    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    const totalPages = Math.ceil(Number(VoteCard?.length) / totalLimit)
    console.log("VoteCard?.length", VoteCard?.length)

    const onPageChange = (e: any) => {
        setCurrentPage(e.selected || 0)
    }

    function countdown(startdate: any, enddate: any) {
        let endDateObj = moment(enddate)
        let diff = endDateObj.diff(startdate)
        let s: any = moment.duration(diff)
        let d: any = Math.floor(s / (3600 * 24));
        s -= d * 3600 * 24;

        const h = Math.floor(s / 3600);

        s -= h * 3600;

        const m = Math.floor(s / 60);

        s -= m * 60;

        let tmp: any = [];

        if (d > 0) {
            tmp.push(d + 'd');
            (d || h) && tmp.push(h + 'h');
        }
        else if (h > 0) {
            tmp.push(h + 'h');
            (d || h || m) && tmp.push(m + 'm');
        }
        else if (m >= 0) {
            tmp.push(m + 'm');
            tmp.push(s + 's');
        }

        return tmp.join(' ');
    }

    function toTitleCase(str: any) {
        if (str != undefined && str != "") {
            return str.replace(
                /\w\S*/g,
                function (txt: any) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
    }

    return (
        <div>
            <div className="votedeo-sec">
                <div className="container container-maxwidth position-relative bg-index">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="text-start">
                                <p className="back-btn d-lg-flex d-md-flex d-none">HOME <i className="ri-arrow-right-s-line"></i> VoteDAO</p>
                                <h2 className="heading-new-2 mt-lg-5 text-lg-start text-md-start text-center mb-lg-0 mb-3">VoteDAO</h2>
                                <p className="heading-new-5 my-lg-4 text-lg-start text-md-start text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                                <p className="paragraph-new fw-lighter text-lg-start text-md-start text-center">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    <br />
                                    <br />
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <div className="Performance-sec mt-lg-5 mt-md-3 mt-2">
                                    <div >
                                        <div className="d-lg-block d-md-flex d-flex gap-md-5 gap-2">
                                            <div className='rocket-icon'>
                                                <img src={RocketIcon} className='img-fluid mb-3' alt="" />
                                                <h2 className='heading-new-5'>Over</h2>
                                            </div>
                                            <img className='project-score-img' src={projectIcon} alt="" />
                                            <div>
                                                <h2 className='heading-new-5'>successful project launches</h2>
                                                <div className='d-lg-block d-md-block d-none'>
                                                    <button className='new-color-button mt-lg-4 mt-2'>Discover live projects on our launchpad</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-lg-none d-md-none d-block text-end'>
                                            <button className='new-color-button mt-lg-4 mt-2'>Discover live projects on our launchpad</button>
                                        </div>
                                        {/* <div className="Performance-logo mt-4">
                                            <p className="platform-btn py-2 m-0">Platform Audited by <img src={SentnlLogo} className='img-fluid ms-1' alt="" /></p>
                                        </div> */}
                                        <div className="platform-btn mt-4 d-lg-block d-none">
                                            <p className="py-0 m-0">Platform Audited by <img src={SentnlLogo} className='img-fluid ms-1' alt="" /></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 mt-lg-0 mt-md-5 mt-5">
                            <div className="row">
                                {VoteCard && VoteCard.map((item, i) => (
                                    <div className={screenSize && screenSize.width > 1200 ? "col-lg-4 col-md-6 col-6 mb-lg-5 mb-4" : "col-lg-6 col-md-6 col-6 mb-lg-5 mb-4"} key={i}>
                                        <div className='vote-card-sec'>
                                            <div className='vote-card'>
                                                {item?.voting && item?.voting === true ?
                                                    <div className='time' style={{ background: "#111111", color: "#4BAE4F", border: "1px solid #2F2F2F" }}>Completed</div> :
                                                    <div className='time' style={{
                                                        background: item.date && item.date < 3600000 ? "linear-gradient(90deg, #DB0909 0%, #318DE7 48.96%, #54C4FC 100%)" :
                                                            item.date && item.date < 86400000 && item.date > 3600000 ? "linear-gradient(90deg, #FEC201 0%, #54C4FC 47.92%, #2981E2 100%)" :
                                                                "linear-gradient(90deg, #54C4FC 0%, #2479DF 100%)"
                                                    }}>{countdown(moment().unix(), item?.date)}</div>
                                                }
                                                <img className='mt-lg-3 mt-md-3 mt-2 vote-hero' src={item.image} alt="" />
                                                <div className='vote-text mt-lg-3 mt-md-3 mt-2 d-flex gap-lg-3 gap-md-3 gap-2 justify-content-center'>
                                                    <div className='vote-profile'><img src={VoteProfile} alt="" /></div>
                                                    <div>
                                                        <div className='name'>{item.name}</div>
                                                        <div className='d-flex mt-lg-2 mt-md-2 mt-1 align-items-center'>
                                                            <div className='subname'>{item.subname}</div>
                                                            <div className='chain-logo d-flex align-items-center justify-content-center'><img src={binanceLogo} alt="" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='d-flex vote-counter mt-lg-3 mt-md-3 mt-2 align-items-center justify-content-center'>
                                                    <img src={voteIcon} alt="" />
                                                    <p className='mb-0'>{item.vote}</p>
                                                </div>
                                                <button className='vote-btn mt-lg-4 mt-md-3 mt-2' style={{ background: item?.voting === true ? "linear-gradient(90deg, #65DB6A 4.29%, #0F6212 100%)" : "linear-gradient(90deg, #54C4FC 0%, #2479DF 100%)" }}>{item?.voting === true ? "Voting Completed" : "VOTE"}</button>
                                                <button className='learn-btn mt-2'><i className="ri-information-line fs-large me-1"></i> Learn more about this project</button>
                                                <div className='d-flex justify-content-center social-icon mt-lg-3 mt-md-3 mt-2'>
                                                    <div className='social-icon'><i className="ri-twitter-fill"></i></div>
                                                    <div className='social-icon'><i className="ri-links-fill"></i></div>
                                                    <div className='social-icon'><i className="ri-send-plane-fill"></i></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-lg-12">
                                    <Pagination
                                        page={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footercmp />
            </div>
        </div>
    )
}

export default Votedao