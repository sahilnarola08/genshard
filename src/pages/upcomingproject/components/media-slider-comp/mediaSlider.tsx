import "./mediaSlider.sass"
import { useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import image from '../../../../images/homepage/banner-img.svg'

const MediaSlider = () => {
  let settings = {
    dots: false,
    arrows: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const collections = [
    {
      id: 1,

    },
    {
      id: 2
    },
    {
      id: 3
    }
  ]

  const [playing, setPlaying] = useState(false)

  return (
    <div className="media-slider mt-5">
      <div className="slider-content mt-5">
        <h2 className="heading-new-2 mb-4">Media</h2>
        <Slider {...settings}>
          {collections?.map((values, i) => (
            <div className="slide-content">
              <div className="content">
                
                <ReactPlayer className="card-player" width={'100%'} height={'100%'} controls={true} playing={playing} loop={false} muted={true} url={"https://media.istockphoto.com/id/1425072693/video/portrait-of-lgbtqia-fashion-designer.mp4?s=mp4-640x640-is&k=20&c=zqhqs66duEibazqUiXk-TR6b5bm-894X4KgcsFcNS0Y="} />
                {/* <img src={src.toString()} alt="" /> */}
                {/* <img src={bannerIMG} className="img-fluid" alt="" /> */}
                {/* <div className="video-link">
                  {playing ?
                    <i className="ri-pause-circle-line" onClick={() => setPlaying(false)} ></i> :
                    <i className="ri-play-circle-line" onClick={() => setPlaying(true)}></i> 
                  }
                </div> */}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MediaSlider;

