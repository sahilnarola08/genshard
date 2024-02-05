import React, { useEffect, useState } from 'react'
import "./vc-projects.sass"
import { VCCard } from '../vc-card/vc-card'
import Filterlist from '../filter-list/filter-list'
import { useLocation } from 'react-router-dom'

const cardData = [
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
]
const allcardData = [
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
]

const VcProjects = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const isMentorDashboard = pathname.includes("/mentor-dashboard")
    const [selectedMenu, setselectedMenu] = useState("Projects Overview");
    const [projectMenu, setProjectMenu] = useState(["Projects Overview"]);

    useEffect(() => {
        if (projectMenu.length < 2) {
            setProjectMenu([...projectMenu, "All Projects List"])
        }
    }, [selectedMenu])
    return (
        <>
            {isMentorDashboard ?
                <div className="event-button text-center mb-5">
                    {projectMenu.map((menu: any, id: number) => (
                        <button key={id}
                            className={selectedMenu === menu ? "selectedMenu menuItem " : "menuItem "}
                            onClick={() => setselectedMenu(menu)}
                        >
                            {menu}
                        </button>
                    ))}
                </div> : ""}
            <div className='mb-5 vc-filter'>
                <Filterlist />
            </div>
            {selectedMenu === "Projects Overview" &&
            <div className="row mb-5">
                {cardData && cardData.map((item: any, index: number) => (
                    <VCCard
                        name={item.name}
                        title={item.title}
                        description={item.description} />
                ))}
            </div>}
            {selectedMenu === "All Projects List" &&
            <div className="row mb-5">
                {allcardData && allcardData.map((item: any, index: number) => (
                    <VCCard
                        name={item.name}
                        title={item.title}
                        description={item.description} />
                ))}
            </div>}
        </>
    )
}

export default VcProjects