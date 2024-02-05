import React from 'react'
import "./style.sass"

function Progressbar(props: any) {
    let { color = "#117DCC", height = '9px', progress = 0 } = props
    if (Number(progress) > 100) {
        progress = 100
    }
    const styles = {
        border: `1px solid ${color}`,
        height,
        width: '100%',
        minWidth: '50px'
    }

    const progressStyle = {
        backgroundColor: color,
        height: '100%',
        width: `${progress}%`
    }

    // console.log(progress, "progress")

    return (
        <div style={styles} className="progress-bar-container">
            <div style={progressStyle}></div>
        </div>
    )
}

export default Progressbar