import { useState, useEffect } from "react"
import './style.sass'
import homePageLogo from "./../../images/homepage/genesis-homepage-logo1.svg"
import homePagedot from "./../../images/homepage/homepage-BG1.svg"
import Button from '../../shared/components/buttons'
import au21CapitalSvg from "../../images/homepage/au21-capital.svg"
import followSeedSvg from "../../images/homepage/follow-seed.svg"
import inclusionCapitalSvg from "../../images/homepage/inclusion-capital.svg"
import lotusCapitalSvg from "../../images/homepage/lotus-capital.svg"
import magnusCapitalSvg from "../../images/homepage/magnus-capital.svg"
import x21LogoSvg from "../../images/homepage/x-21-logo.svg"
import genesisShardLogo from "../../images/homepage/genesis-shard-logo.png"
import { useHistory } from "react-router-dom"
import GenPad from "./components/GenPad"

const welcomeButtons = [
    {
        label: 'Apply'
    },
    {
        label: 'Telegram'
    },
    {
        label: 'Blog'
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

function HomePage() {
    const history = useHistory()
    const [selectedFaq, setSelectedFaq] = useState<any>(faqList[0])
    const [viewportWidth, setViewportWidth] = useState(1366)

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

    return (
        <div className="homepage-container">
            {/* welcome container */}
            <div className='welcome-to-container'>
                <div className='background-logo'>
                    <img src={homePageLogo} alt="" />
                </div>
                <div className='welcome-content'>
                    <h2>A Revolutionary Multi-Chain Launchpad</h2>
                    <div><span /></div>
                    <h2 style={{ color: "#8B8B8B" }}>Welcome to the future of IDOpads</h2>
                </div>
                <div className='actions-buttons'>
                    {welcomeButtons.map((button: any, index: number) => {
                        return <Button className="" key={index}>{button.label}</Button>
                    })}
                </div>
            </div>
            <GenPad />
        </div>
    )

    return (
        <div className="homepage-container">
            {/* welcome container */}
            <div className='welcome-to-container'>
                <div className='background-logo'>
                    <img src={homePageLogo} alt="" />
                </div>
                <div className='welcome-content'>
                    <h2>A Revolutionary Multi-Chain Launchpad</h2>
                    <div><span /></div>
                    <h2 style={{ color: "#8B8B8B" }}>Welcome to the future of IDOpads</h2>
                </div>
                <div className='actions-buttons'>
                    {welcomeButtons.map((button: any, index: number) => {
                        return <Button className="" key={index}>{button.label}</Button>
                    })}
                </div>
            </div>

            {/* about and know more container */}
            <div className='learn-more-container'>
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
            </div>

            {/* faq and details container*/}
            <div className="faq-container">
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
            </div>

            {/* portfolio container */}
            <div className="portfolio-container">
                <h1>
                    PORTFOLIO
                </h1>
                <div className="portfolio-list-container">
                    {
                        portfolioList.map((portfolio, index) => {
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
            </div>


            <div className="stay-updated-container">
                <h2>STAY UPDATED</h2>
                <p>Sign up to our newsletter to stay updated with the latest information</p>
                <input placeholder='Enter Email ID' />
                <Button className="gen-button outline--highlight active">SIGN UP</Button>
            </div>

            <div className="footer-container">
                <div className="footer-container-item">

                    {/* <div className="footer-gen-logo">
                        <div className="gen-logo-item">
                            <img src={genesisShardLogo} alt="" />
                            <span>Copyright (c) | 2022</span>
                        </div>
                    </div> */}
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
            </div>

        </div>
    )
}

export default HomePage