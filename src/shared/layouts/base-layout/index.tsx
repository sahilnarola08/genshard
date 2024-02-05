import { Header } from '../../components/header'
import './style.sass'
import { useLocation } from "react-router-dom"
import HomepageHeader from '../../components/HomepageHeader'
import MarketPlaceHeaderComponent from '../../components/MarketPlaceHeaderComponent'
import { Fragment, useEffect, useState } from 'react'
import NewHeader from '../../components/new-header-comp/new-header'
import HomepageHeader_v1 from '../../components/HomepageHeader_v1'

export default function BaseLayout({ children }: IBaseLayoutProps) {
  const location = useLocation()

  const homepageHeaderRoutes = ["/", "/project", "/genpad", "/genpad/staking", "/profile"]
  const marketpageHeaderRoutes = ["/marketplace", "/explore-nfts", "/collection", "/assets/:nftcontractaddress/:tokenid", "/marketplace/projects", "/top-collections", "/assets/create", "/marketplace/cart", "/profile-detail", "/userProfile"]
  const ishomepage = homepageHeaderRoutes.includes(String(location.pathname))
  let [isMarketPlacePage, setIsMarketPlacePage] = useState(false)
  useEffect(() => {    
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    // setIsMarketPlacePage(marketpageHeaderRoutes.includes(String(location.pathname)))
    console.log("location.pathnamelocation.pathname", location.pathname, isMarketPlacePage);
    let arrayOfPaths = String(location.pathname).split("/")
    // console.log("arrayOfPaths", arrayOfPaths, arrayOfPaths[1], ["assets", "collection", "marketplace", "explore-nfts", "top-collections", "profile-detail", "userProfile"].includes(arrayOfPaths[1] || ""));
    setIsMarketPlacePage(arrayOfPaths && ["assets", "collection", "marketplace", "explore-nfts", "top-collections", "profile-detail", "userProfile"].includes(arrayOfPaths[1] || "") ? true  : false)
  }, [location.pathname])

  // const ishomepage = location.pathname === "/" || "/project"
 
  return (
  <>
    <Fragment>
      {/* you can add the header component to props if we need it */}
      {isMarketPlacePage ?
        <MarketPlaceHeaderComponent />
      :
        // <HomepageHeader />
        // <HomepageHeader_v1 />
        <NewHeader/>
      }
      {/* <Header /> */}
      <div className="baselayout__content">{children}</div>
    </Fragment>
    </>
  )
}

interface IBaseLayoutProps {
  children: React.ReactNode
}
