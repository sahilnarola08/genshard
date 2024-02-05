import React from 'react'
import BugBounty from './components/bug-bounty'
import CommunityNfto from './components/communityNfto'
import GsAcademy from './components/gs-academy'
import GskSwap from './components/gsk-swap'
import ProjectActivity from './components/project-activity'
import Resolution from './components/resolution'
import SocialMedia from './components/social-media'
// import back from "../../images/community/dao-bg.png"
import "./style.sass"

export default function Community() {
    return (
        <div className="community-pg">
            <div className="community-main">
                <SocialMedia />
                {/* <div className="community-container">
                    <CommunityNfto />
                </div> */}
            </div>

            <div className="gs-community-nfto-main" id="community-nftos-id">
                <div className="community-container" >
                    <CommunityNfto />
                </div>
            </div>

            <div className="gs-resolution-main" id="community-dao-id">
                <div className="community-container">
                    <Resolution />
                </div>
            </div>

            <div className="gs-academy-main" id="community-academy-id">
                <div className="community-container">
                    <GsAcademy />
                </div>
            </div>

            {/* <div className="community-main">
                <div className="community-container">
                    <GskSwap />
                </div>
            </div> */}

            {/* <div className="community-bug">
                <div className="community-container">
                    <BugBounty />
                </div>
            </div> */}

            {/* <div className="community-bug">
                <div className="community-container">
                    <ProjectActivity />
                </div>
            </div> */}

        </div>
    )
}