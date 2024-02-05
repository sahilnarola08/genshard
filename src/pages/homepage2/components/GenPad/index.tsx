import React, { memo, useMemo, useState } from 'react'
import GenpadCard from './GenpadCard/GenpadCard'
import './style.sass'
import Button from '../../../../shared/components/buttons'
import StepProgress from './StepProgress/StepProgress'
function GenPad() {

    const projects = useMemo(() => {
        return [{
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }, {
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }, {
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }, {
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }, {
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }, {
            name: "Project X",
            tokenId: "$PRJX",
            chain: "BSC",
            image: null,
            socialLinks: [{ type: 'twitter', link: "" }, { type: 'telegram', link: "" }, { type: 'metaverse', link: "" }, { type: 'websiteLink', link: "" }],
            starting_date: "Jan 15, 11:00 UTC",
            progress: {
                completion_time: "3 days, 3 hours",
                completion_percentage: "50%",
                completed_projects: 0,
                total_projects: 1000000
            },
        }]
    }, [])

    const actionButtons = [
        {
            label: 'LIVE',
            value: 'LIVE'
        },
        {
            label: 'Upcoming',
            value: 'Upcoming'
        },
        {
            label: 'Ended',
            value: 'Ended'
        },
    ]

    const [currentView, setCurrentView] = useState("Upcoming")

    console.log(currentView, "currentView")

    return (
        <div>
            <StepProgress />
            <div className='heading-buttons-container'>
                <div><h1>POOLS</h1></div>
                <hr />
                {/* <h6>NOW VIEWING</h6> */}
                <div className='buttons-container'>
                    {
                        actionButtons.map((button, index) => {
                            return <div key={index}>
                                {currentView === button.value ? <h6>NOW VIEWING</h6> : null}
                                <Button className="outline--highlight" onClick={() => { setCurrentView(button.value) }}>{button.label}</Button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="genpad-container">
                {(projects || []).map((data, index) => (
                    <GenpadCard data={data} key={index} cardTitle={currentView} />
                ))}
            </div>
        </div>
    )
}

export default memo(GenPad)