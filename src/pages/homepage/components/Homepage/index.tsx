import { useEffect, useState } from 'react'
import au21CapitalSvg from "../../../../images/homepage/au21-capital.svg"
import followSeedSvg from "../../../../images/homepage/follow-seed.svg"
import inclusionCapitalSvg from "../../../../images/homepage/inclusion-capital.svg"
import lotusCapitalSvg from "../../../../images/homepage/lotus-capital.svg"
import magnusCapitalSvg from "../../../../images/homepage/magnus-capital.svg"
import x21LogoSvg from "../../../../images/homepage/x-21-logo.svg"
import x22LogoSvg from "../../../../images/homepage/x-22-logo.svg"
import SentnlImg from "../../../../images/homepage/sentnl-btn-img.svg"
import PowerdBy from "../../../../images/homepage/PowerdBy-img.svg"
import RocketIcon from "../../../../images/homepage/rocket-icon.svg"
import projectIcon from "../../../../images/50-icon.svg"
import ChainImg from "../../../../images/homepage/chain-img.svg"
import AvalanceLogo from "../../../../images/homepage/avalance-logo.svg"
import BinanceLogo from "../../../../images/homepage/binance-logo.svg"
import EtheriumLogo from "../../../../images/homepage/etherium-logo.svg"
import HarmonyLogo from "../../../../images/homepage/harmony-logo.svg"
import RbtrumLogo from "../../../../images/homepage/rbtrum-logo.svg"
import PoligonLogo from "../../../../images/homepage/poligon-logo.svg"
import SatorLogo from "../../../../images/homepage/sator-logo.svg"
import EcnoladgerLogo from "../../../../images/homepage/ecnoladger-logo.svg"
import EnginestarterLogo from "../../../../images/homepage/enginestarter-logo.svg"
import HarmoneyLancherLogo from "../../../../images/homepage/harmoney-lancher-logo.svg"
import WorldCryptoidsLogo from "../../../../images/homepage/world-cryptoids-logo.svg"
import DuelistKingLogo from "../../../../images/homepage/duelist-king-logo.svg"
import trumpLogo from "../../../../images/homepage/trump-logo.svg"
import swiggyLogo from "../../../../images/homepage/swiggy-logo.svg"
import lohmanLogo from "../../../../images/homepage/lohman-logo.svg"
import tinderLogo from "../../../../images/homepage/tinder-logo.svg"
import metaLogo from "../../../../images/homepage/meta-logo.svg"
import WorldImg from "../../../../images/homepage/world-img.svg"
import { useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import Footercmp from '../../../../shared/components/footercmp/footercmp'
import { TagSlider } from '../accelerate/components/tag-slider/tag-slider'
import { Box, Tab, Tabs } from '@mui/material'
import Typography from '@mui/material/Typography';
import { VantureCapitalComp } from './vanture-capital-comp/vanture-capital-comp'

const portfolio = [
    {
        icon: x22LogoSvg,
        return: 21
    },
    {
        icon: x22LogoSvg,
        return: 21
    },
    {
        icon: x22LogoSvg,
        return: 21
    },
    {
        icon: x22LogoSvg,
        return: 21
    },
    {
        icon: x22LogoSvg,
        return: 21
    },
    {
        icon: x22LogoSvg,
        return: 21
    }
]

const portfolioList = [
    {
        icon: magnusCapitalSvg,
        return: 21
    },
    {
        icon: inclusionCapitalSvg,
        return: 21
    },
    {
        icon: x21LogoSvg,
        return: 21
    },
    {
        icon: followSeedSvg,
        return: 21
    },
    {
        icon: lotusCapitalSvg,
        return: 21
    },
    {
        icon: au21CapitalSvg,
        return: 21
    },
]

const mainRoutes = [
    {
        title: 'GenPad',
        path: '/dashboard',
    },
    {
        title: 'GenVerse',
        path: '/dashboard',
    },
    {
        title: 'GenDAO',
        path: '/dashboard',
    },
    {
        title: 'GenNFTX',
        path: '/dashboard',
    },
]

const otherRoutes = [
    {
        title: 'Dashboard',
        path: '/dashboard'
    },
    {
        title: 'Marketplace',
        path: '/dashboard'
    },
    {
        title: 'Stake',
        path: '/dashboard'
    },
    {
        title: 'Create',
        path: '/dashboard'
    },
    {
        title: 'Rewards',
        path: '/dashboard'
    },
    {
        title: 'Access Pool',
        path: '/dashboard'
    },
    {
        title: 'Liquidity Mining',
        path: '/dashboard'
    },
    {
        title: '',
        path: ''
    },
]

const termsAndContact = [
    {
        title: 'Contact',
        path: '/dashboard'
    },
    {
        title: 'Terms and Conditions',
        path: '/dashboard'
    },
    {
        title: 'Privacy Policy',
        path: '/dashboard'
    },
]

const faqList = [
    {
        title: "Ut enim ad minim veniam, quis nostrud exercitation ullamco?",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nOnsectetur adipiscing elit, sed do eius. Lorem ipsum dolor sit amet, cmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        title: "Ad minim veniam, quis nostrud exercitation ullamco?",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nOnsectetur adipiscing elit, sed do eius. Lorem ipsum dolor sit amet, cmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        title: "Minim veniam, quis nostrud exercitation ullamco?",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nOnsectetur adipiscing elit, sed do eius. Lorem ipsum dolor sit amet, cmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        title: "Quis nostrud exercitation ullamco?",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nOnsectetur adipiscing elit, sed do eius. Lorem ipsum dolor sit amet, cmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
]

const howWeWorkContent = [
    {
        link: "/genpad/staking",
        title: "STAKE",
        subTitle: "Stake GS to unleash the ecosystem's full potential",
        subHeading1: "Exclusive IDOs",
        subHeading1Details: "Stake a minimum of 2500 GS tokens to get access to exclusive IDOs - the higher you stake, the higher your allocation",
        subHeading2: "Earn High Rewards",
        subHeading2Details: "Get disproportionate gains by increasing your staked amount and lock-in duration",
    },
    {
        link: "/votedao",
        title: "VOTE DAO",
        subTitle: "Vote for your favourite projects to get them launched on Symbiote",
        subHeading1: "Vote",
        subHeading1Details: "Vote for a single project among a cohort of projects",
        subHeading2: "Win",
        subHeading2Details: "If your chosen project wins, you win a guaranteed allocation in its IDO",
    },
    {
        link: "/launchpad",
        title: "LAUNCHPAD",
        subTitle: "Participate in the latest IDOs and earn exponential returns",
        subHeading1: "Vote",
        subHeading1Details: "Vote in the Vote DAO section for your favourite projects",
        subHeading2: "Participate",
        subHeading2Details: "Win guaranteed allocations for the projects you voted",
    },
]

const pastPerformanceData = [
    {
        value: "$50,000",
        maltiply: "73x",
        image: SatorLogo,
    },
    {
        value: "$50,000",
        maltiply: "48x",
        image: EcnoladgerLogo,
    },
    {
        value: "$50,000",
        maltiply: "29x",
        image: EnginestarterLogo,
    },
    {
        value: "$50,000",
        maltiply: "73x",
        image: HarmoneyLancherLogo,
    },
    {
        value: "$50,000",
        maltiply: "48x",
        image: WorldCryptoidsLogo,
    },
    {
        value: "$50,000",
        maltiply: "29x",
        image: DuelistKingLogo,
    },

]

const collections = [
    {
        title: "Privacy Partner",
        image: metaLogo,
    },
    {
        title: "Partner Partner",
        image: tinderLogo,
    },
    {
        title: "Finance Partner",
        image: lohmanLogo,
    },
    {
        title: "Delivery Partner",
        image: swiggyLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
    {
        title: "Hospitality Partner",
        image: trumpLogo,
    },
]

export default function HomePage() {
    const history = useHistory()
    const [selectedFaq, setSelectedFaq] = useState<any>(faqList[0])
    const [viewportWidth, setViewportWidth] = useState(1366)
    const [value, setValue] = useState(0);

    const [screenSize, setScreenSize] = useState(getCurrentDimension());

    useEffect(() => {

        setViewportWidth(window.innerWidth)
        window.addEventListener("resize", (e) => {
            setViewportWidth(window.innerWidth)
        })

        return () => {
            window.removeEventListener("resize", () => { })
        }

    }, [])

    const goToHomePage = (path: string) => {
        history.push(path)
    }

    let settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        centerMode: true,
        focusOnSelect: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                }
            },
            {
                breakpoint: 370,
                settings: {
                    slidesToShow: 1.2,
                    centerMode: true,
                }
            }
        ]
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    var _ = require("lodash");

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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            {/* how we work */}
            {screenSize && screenSize.width > 767 ?
                <section className="how-we-work-section">
                    <div className="how-we-work">
                        <div className="container">
                            <div className="row">
                                <h2 className='text-center mb-5 heading-new-2'>How we work</h2>
                                {howWeWorkContent.map((item: any, i: number) => {
                                    return <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="how-we-work-card h-100">
                                            <div className="">
                                                <p className='bin-scal-number'>{i + 1}</p>
                                                <h2 className='heading-new-2'>{item.title}</h2>
                                                <h6>{item.subTitle}</h6>
                                                <p className='paragraph-new'><strong>{item.subHeading1}</strong> <br /> {item.subHeading1Details}</p>
                                                <p className='paragraph-new'><strong>{item.subHeading2}</strong> <br /> {item.subHeading2Details}</p>
                                            </div>
                                            <div className="">
                                                <button className='new-primary-button' onClick={() => history.push(item.link)}>Explore</button>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </section>
                :
                <div className='accelerate-program-section home-understande-program mt-lg-5 mt-md-3 mt-2 mb-lg-5 mb-4 position-relative'>
                    <div className="container">
                        <h5 className='heading-new-5 fw-light mb-lg-0 mb-md-0 mb-3 text-center'>Understand the  <br /><span className='fw-700'>Accelerate</span> program</h5>
                        <div className="projectDetails-top background-primary mt-lg-5 mt-md-3 mt-2">
                            <div className="projectDetails">
                                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="1 Stake" {...a11yProps(0)} />
                                        <Tab label="2 VoteDAO" {...a11yProps(1)} />
                                        <Tab label="3 Launch" {...a11yProps(2)} />
                                    </Tabs>
                                    <TabPanel value={value} index={0}>
                                        <div>
                                            <p className='paragraph-new mb-2 fw-bold'>Stake GS to unleash the ecosystem's full potential</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold' >Exclusive IDOs</p>
                                            <p className='paragraph-new mt-0 mb-2 fw-lighter'>Stake a minimum of 2500 GS tokens to get access to exclusive IDOs - the higher you stake, the higher your allocation</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold'>Earn High Rewards</p>
                                            <p className='paragraph-new mt-0 mb-0 fw-lighter' >Get disproportionate gains by increasing your staked amount and lock-in duration</p>
                                            <button className='new-primary-button mt-2' onClick={() => history.push("/genpad/staking")}>Explore</button>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <div>
                                            <p className='paragraph-new mb-2 fw-bold'>Vote for your favourite projects to get them launched on Symbiote</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold' >Vote</p>
                                            <p className='paragraph-new mt-0 mb-2 fw-lighter'>Vote for a single project among a cohort of projects</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold'>Win</p>
                                            <p className='paragraph-new mt-0 mb-0 fw-lighter' >If your chosen project wins, you win a guaranteed allocation in its IDO</p>
                                            <button className='new-primary-button mt-2' onClick={() => history.push("/votedao")}>Explore</button>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <div>
                                            <p className='paragraph-new mb-2 fw-bold'>Participate in the latest IDOs and earn exponential returns</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold'>Vote</p>
                                            <p className='paragraph-new mt-0 mb-2 fw-lighter'>Vote in the Vote DAO section for your favourite projects</p>
                                            <p className='paragraph-new mt-0 mb-1 fw-bold'>Participate</p>
                                            <p className='paragraph-new mt-0 mb-0 fw-lighter'>Win guaranteed allocations for the projects you voted</p>
                                            <button className='new-primary-button mt-2' onClick={() => history.push("/genpad/staking")}>Explore</button>
                                        </div>
                                    </TabPanel>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* how we work */}
            <section className="powerd-by-section">
                <div className="how-we-work">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="pe-5">
                                    <img src={PowerdBy} className='img-fluid' alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="powerd-by-text mt-lg-0 mt-md-0 mt-4">
                                    <i className="ri-lock-fill" style={{ color: "#4BAE4F" }}></i>
                                    <h2 className='heading-new-2 text-sm-center'>Powered by a <br /> robust app ecosystem </h2>
                                    <button>Platform Audited by <img src={SentnlImg} className='img-fluid' alt="" /></button>
                                    <p className='paragraph-new mb-0'>Access Symbiote incubation projects, top tier sales and NFT projects before they hit the market. Stake to unlock maximum benefits in the Symbiote ecosystem. Participate in token staking and liquidity farms. Monitor liquidity locks, distributions, and vesting schedules. Discover projects and vote for future launches, while earning token allocations and free token bribes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chains we work with */}
            <section className="chains-with-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <img src={RocketIcon} className='img-fluid rocket-icon' alt="" />
                            <h2 className='heading-new-2'>Over
                                {/* <br /> */}
                                {/* <div>50+</div> */}
                                <img src={projectIcon} className='img-fluid 50-icon-set' alt="" />
                                {/* <br /> */}
                                successful project launches</h2>
                            <button className='new-primary-button mb-lg-0 mb-md-0 mb-5'>Find out how to launch with us</button>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <img src={ChainImg} className='img-fluid rocket-icon mb-0' alt="" />
                            <h2 className='chain-icon-h2 heading-new-2'>Chains we <br /> work with</h2>
                            <div className="chain-partner">
                                <div className="partner-img">
                                    <img src={AvalanceLogo} className='img-fluid' alt="" />
                                </div>
                                <div className="partner-img">
                                    <img src={BinanceLogo} className='img-fluid' alt="" />
                                </div>
                                <div className="partner-img">
                                    <img src={EtheriumLogo} className='img-fluid' alt="" />
                                </div>
                                <div className="partner-img">
                                    <img src={HarmonyLogo} className='img-fluid' alt="" />
                                </div>
                                <div className="partner-img">
                                    <img src={RbtrumLogo} className='img-fluid' alt="" />
                                </div>
                                <div className="partner-img">
                                    <img src={PoligonLogo} className='img-fluid' alt="" />
                                </div>
                            </div>
                            <p className='last-text paragraph-new-medium'>...and we’re always working on adding more!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* past-performance */}
            <section className="past-performance-section">
                <div className="past-performance">
                    <div className="container">
                        <div className="row">
                            {pastPerformanceData.map((item: any, i: number) => {
                                return <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="past-performance-card">
                                        <img src={item.image} className='img-fluid' alt="" />
                                        <div className="d-flex align-items-center justify-content-center mb-lg-3 mb-md-3 mb-2">
                                            <p className='me-lg-3 me-2 mb-0 paragraph-new-medium'>ATH ROI</p>
                                            <h2 className='heading-new-2'>{item.maltiply}</h2>
                                        </div>
                                        <h2 className='mb-lg-3 mb-md-3 mb-2 heading-new-2'>{item.value}</h2>
                                        <p className='mb-0 paragraph-new-medium'>Total Raise</p>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>

                    {/* <div className="many-more text-center mt-5">
                        <div className="tag-slider overflow-hidden">
                            <div className="tag-slide-flex">
                                {sliderCollections?.map((values) => (
                                    <div className="tag-slider-item">
                                        <img src={values.image} className='img-fluid' alt={""} />
                                        <p className='paragraph-new-medium mb-0'>{values?.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className='mt-5 paragraph-new-medium'>And so many more! We’re just getting started!</p>
                    </div> */}
                    <div className="overflow-hidden">
                        <TagSlider />
                    </div>
                </div>
            </section>

            {/* your project belong-world */}
            <section className="project-belong-world-section">
                <div className="container">
                    <div className="heading text-center mb-5">
                        <h2 className='mb-3 heading-new-2'>Your project belongs to the world.</h2>
                        <p className='paragraph-new'>Let us help you get there.</p>
                    </div>
                    <div className="d-lg-flex d-md-flex d-block justify-content-center text-lg-start text-center">
                        <h2 className='heading-new-2 mb-lg-0 mb-4 d-lg-block d-md-block d-none'><span className='heading-new-2' style={{ color: "#2479DF" }}>110,000</span><br />Members</h2>
                        <img src={WorldImg} className='img-fluid' alt="" />
                        {/* <div className="outer-lines">
                            <div className="inner-map"></div>
                        </div> */}
                        <div className="d-lg-none d-md-none d-flex justify-content-between">
                            <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4'><span className='heading-new-2' style={{ color: "#2479DF" }}>110,000</span><br />Members</h2>
                            <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4'>Across<span className='heading-new-2' style={{ color: "#2479DF" }}> 6 </span><br />Continents</h2>
                        </div>
                        <h2 className='align-self-end heading-new-2 mt-lg-0 mt-4 d-lg-block d-md-block d-none'>Across<span className='heading-new-2' style={{ color: "#2479DF" }}> 6 </span><br />Continents</h2>
                    </div>
                </div>
            </section>

            {/* belong-world counter */}
            <section className="belong-world-counter">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-6">
                            <div className="counter-card">
                                <h2 className='mb-2 heading-new-2'>75M</h2>
                                <p className='paragraph-new-medium'>Total GS Staked</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-6">
                            <div className="counter-card">
                                <h2 className='mb-2 heading-new-2'>75M</h2>
                                <p className='paragraph-new-medium'>Total GS Staked</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 mt-lg-0 mt-md-0 mt-3">
                            <div className="counter-card">
                                <h2 className='mb-2 heading-new-2'>75M</h2>
                                <p className='paragraph-new-medium'>Total GS Staked</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                            <button className='mt-lg-5 mt-md-4 mt-3 new-primary-button'>Stake your GS now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* carousel slider */}
            <section className="partner-ecosystem-section">
                <div className="partner-ecosystem">
                    <div className="heading text-center mb-5">
                        <h2 className='mb-4 heading-new-2'>A thriving partner ecosystem</h2>
                        <p className='paragraph-new-medium'>Look no further than hundreds of our curated Ecosystem partners</p>
                    </div>
                    <Slider {...settings}>
                        {collections?.map((values) => (
                            <div className="anxious-slide-item">
                                <img src={values.image} className='img-fluid' alt={""} />
                                <p className='paragraph-new-medium text-center'>{values?.title}</p>
                            </div>
                        ))}
                    </Slider>
                    <div className="d-flex align-items-center justify-content-center">
                        <p className='me-3 paragraph-new-medium'>Look no further than hundreds of our curated Ecosystem partners</p>
                        <button className='talk-btn new-primary-button'>Let’s talk</button>
                    </div>

                </div>
            </section>

            {/* Venture Capital Partners */}
            <section className="vanture-capital-partner mt-5">
                <div className="container">
                    <div className="heading text-center mb-5">
                        <h2 className='mb-4 heading-new-2'>Venture Capital Partners</h2>
                    </div>
                    <VantureCapitalComp />
                </div>
            </section>

            {/* belong-world counter */}
            <section className="contact-us-section" >
                <div className="container">
                    <div className="row justify-content-lg-center">
                        <div className="col-lg-4 col-md-5 col-sm-12 align-self-center">
                            <h2 className='heading-new-2'>We’re better. <br /> Together.</h2>
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-1">
                            <div className='center-line'></div>
                        </div>
                        <div className="col-lg-4 col-md-5 col-sm-11 col-11 align-self-center">
                            <p className='mb-3 paragraph-new-medium'>Contact Us</p>
                            <p className='paragraph-new-medium'>Our expert Crypto team is always available except on full moons where we moonlight as Werewolves hunting down vampires from Twilight. Want to launch with us? Just want to say Hi? Grab a chai?</p>
                            <button className='mt-4 new-primary-button'>To the Moon!</button>
                        </div>
                    </div>
                </div>
            </section >

            {/* carousel slider */}
            {/* <section className="investor-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <p className='heading'>Investor Partners</p>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-7 col-md-8 col-sm-12 text-center">
                            <img src={investorSectionImg} className='img-fluid' alt="" />
                        </div>
                    </div>
                </div>
            </section> */}





            {/* about and know more container */}
            {/* <div className='learn-more-container'>
                <div className="learn-more-video-item">
                    <div className="learn-more">
                        <h3>Learn about GenPad</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div className="video-container">
                        <div className="video-item">
                            <video src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" controls />
                        </div>
                    </div>
                </div>
            </div> */}

            {/* faq and details container*/}
            {/* <div className="faq-container">
                <div className="faq-titles">
                    <div className='faq-titles-heading'>
                        <h1>FAQ</h1>
                    </div>
                    <div className='faq-title-list'>
                        <ul>
                            {
                                faqList.map((item, index) => {
                                    const isSelected = selectedFaq && selectedFaq.title === item.title
                                    return <li key={index} onClick={() => setSelectedFaq(item)} className={`${isSelected ? "active-item" : ""}`}>
                                        <span>{item.title}</span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="faq-details">
                    <div className='faq-details-title'>
                        <h1>{selectedFaq.title}</h1>
                    </div>
                    <div className="faq-selected-details">
                        <p>{selectedFaq.details}</p>
                    </div>
                </div>
            </div>

            <div className="faq-container-mobile-view">
                <div className='faq-details-title'>
                    <h1>{selectedFaq.title}</h1>
                </div>
                {
                    faqList.map((item, index) => {
                        return <div className="faq-">

                        </div>
                    })
                }
            </div> */}

            {/* portfolio container */}
            {/* <div className="portfolio-container">
                <h1>
                    PORTFOLIO
                </h1>
                <div className="portfolio-list-container">
                    {
                        portfolio.map((portfolio, index) => {
                            return <div className="portfolio-list-item" key={index}>
                                <div className="image-div">
                                    <img src={portfolio.icon} alt="" />
                                </div>
                                <div className="return-container">
                                    <h2>{portfolio.return}x</h2>
                                    <span>return</span>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>

            <div className="partners-container">
                <h2>
                    Partners
                </h2>
                <div className="partners-list-container">
                    {
                        portfolioList.map((portfolio, index) => {
                            return <div className="partner-list-item" key={index}>
                                <div className='image-div'>
                                    <img src={portfolio.icon} alt="" />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div> */}


            {/* <div className="stay-updated-container">
                <h2>STAY UPDATED</h2>
                <p>Sign up to our newsletter to stay updated with the latest information</p>
                <input placeholder='Enter Email ID' />
                <Button className="gen-button outline--highlight active">SIGN UP</Button>
            </div> */}

            {/* <div className="footer-container">
                <div className="footer-container-item">

                    <div className="footer-gen-logo">
                        <div className="gen-logo-item">
                            <img src={genesisShardLogo} alt="" />
                            <span>Copyright (c) | 2022</span>
                        </div>
                    </div>
                    <div className="footer-routes-item">
                        <ul>
                            {
                                mainRoutes.map((routes, index) => {
                                    return <li key={index} onClick={() => goToHomePage(routes.path)}>
                                        <span>{routes.title}</span>
                                    </li>
                                })
                            }
                            {
                                viewportWidth > 1024 ? otherRoutes.map((routes, index) => {
                                    return <li key={index} onClick={() => goToHomePage(routes.path)}>
                                        <span>{routes.title}</span>
                                    </li>
                                }) : <li>Others {"> "}</li>
                            }
                            {
                                termsAndContact.map((routes, index) => {
                                    return <li key={index} onClick={() => goToHomePage(routes.path)}>
                                        <span>{routes.title}</span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div> */}
            <Footercmp />
        </div >
    )
}