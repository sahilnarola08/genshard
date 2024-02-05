import React from 'react'
import "./style.sass"

interface IStatsLevelProgressBar {
    label: string
    value: string
    total: string
}

function StatsLevelProgressBar({ label, value, total }: IStatsLevelProgressBar) {
    let progress = (Number(value) / Number(total)) * 100
    if (progress > 100) progress = 100

    return (
        <div className='stats-level-progress-container'>
            <div className='container-item'>
                <label>{label}</label>
                <div className='progress-outer'>
                    <div className='progress-inner' style={{ width: `${progress}%` }} />
                </div>
                <span>{value} on {total}</span>
            </div>
        </div>
    )
}

export default StatsLevelProgressBar