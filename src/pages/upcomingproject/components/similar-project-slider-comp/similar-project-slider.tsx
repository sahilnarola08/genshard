import "./similar-project-slider.sass"
import Slider from "react-slick";
import ModelCard from "../../../homepage/components/GenPad/model-card/model-card";
import { useLocation } from "react-router-dom";

const SimilarProjectSlider = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isStaking = pathname.includes("/staking")

  let settings = {
    dots: false,
    slidesToShow: 3.8,
    infinite: false,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1750,
        settings: {
          slidesToShow: 3.6,
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3.2,
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3.1,
        }
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 2.6,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 2.8,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1
        }
      },
    ]
  };

  let settingsCongrets = {
    dots: false,
    slidesToShow: 2.5,
    infinite: false,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1750,
        settings: {
          slidesToShow: 2.2,
          // slidesToScroll: 3,
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 2.1,
        }
      },
      {
        breakpoint: 1550,
        settings: {
          slidesToShow: 2.05,
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 1.9,
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1
        }
      },
    ]
  };

  const collections = [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    },
    {
      id: 5
    },
    {
      id: 6
    },
    {
      id: 7
    },
    {
      id: 8
    }
  ]

  return (
    <div className={isStaking ? "slider-content similar-slider ms-0 mt-5" : "slider-content similar-slider my-5"}>
      <div className="container container-maxwidth"></div>
      {!isStaking &&
        <>
          <h2 className="heading-new-2 mb-4">Similar Projects</h2>
          <Slider {...settings}>
            {collections?.map((values) => (
              <ModelCard />
            ))}
          </Slider>
        </>
      }
      {isStaking &&
        <>
          <Slider {...settingsCongrets}>
            {collections?.map((values) => (
              <ModelCard />
            ))}
          </Slider>
        </>
      }
    </div>
  );
};

export default SimilarProjectSlider;