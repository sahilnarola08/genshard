// import { useState, useEffect } from "react"
import './style.sass'
// import { useHistory } from "react-router-dom"
// import GenPad from "./components/GenPad"
// import GenpadStaking from "./components/Staking"
import WelcomeInfo from "./components/WelcomeInfo"
import { default as HomePageInfo } from "./components/Homepage"
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import GenPad from './components/GenPad'
import GenpadStaking from './components/Staking'
import React from 'react'

interface IHomepage {
    index?: Number
}

function HomePage(props: IHomepage) {
    const { index = 0 } = props
    return (
        <div className="homepage-container">
            {index !== 2 ? <WelcomeInfo /> : null}
            {index === 0 ? <HomePageInfo /> : index === 1 ? <GenPad /> : <GenpadStaking />}
        </div>
    )
}

export default HomePage