// import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './style.sass'
import { isVideoFormat } from '../../../market/helper'

const Logo = ({ src, alt }: { src: string; alt: string }) => {
  const videoFormat = isVideoFormat(src);
  return (
    <div className="inventory-ticket-logo-wrapper">
      <div className="inventory-ticket-logo">
        {
          videoFormat ? <ReactPlayer width={'100%'} height={'100%'} playing={true} muted={true} url={src} loop={true}/>
          : <img src={src} alt={alt} />
        }
        {/* {src !== undefined && src.substr(src.length - 3) === 'mp4' ? 
          <ReactPlayer width={'100%'} height={'100%'} playing={true} muted={true} url={src} loop={true}/>
        : <img src={src} alt={alt} />} */}
      </div>
    </div>
  )
}

export default Logo
