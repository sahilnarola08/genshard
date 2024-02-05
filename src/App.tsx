import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom'
import './App.sass'
import Dashboard from './pages/dashboard'
import Create from './pages/creation'
import Popups from './shared/components/Popups'
import Web3ReactManager from './shared/components/Web3ReactManager'
import BaseLayout from './shared/layouts/base-layout'
import { Market } from './pages/market'
import { GenshardsDashboard } from './pages/gstokenclaim'
import ComingSoon from './shared/components/ComingSoon'
import { Staking } from './pages/staking'
import Community from './pages/community'
import AllProjects from './pages/community/components/communityNfto/AllProjects'
import AllAcademy from './pages/community/components/gs-academy/AllAcademy'
import MarketPlace from './pages/marketplace'
import SideBar from './pages/marketplace/components/individualProfile/sidebar'
import ProfileSide from './pages/marketplace/components/individualProfile/profileSide'
import GardenofEden from './pages/marketplace/components/individualProfile/individualProject'
import ActivityTable from './pages/marketplace/components/individualProfile/activityTable'
import MarketPlaceHeader from './pages/marketplace/components/header'
import Collection from './pages/collections'
import HomePage from './pages/homepage'
import CalanderComp from './pages/calendar'
import LiveProjectPage from './pages/upcomingproject'
import Profile from './pages/profile'
import UserProfilePage from './pages/UserProfilePage/UserProfilePage'
import CohortStaking from './pages/cohortStaking'
import CohertStakingDetail from './pages/cohortStaking/stakingDetail'
import IndividualCollection from './pages/marketplace/components/individualCollection'
import Academy from './pages/community/components/gs-academy/Academy'
import MintNFT from './pages/mintNFT'
import OfferReceivedTable from './pages/marketplace/components/individualProfile/offerReceivedTable'
import OffersMadeTable from './pages/marketplace/components/individualProfile/offersMadeTable'
import TopCollections from './pages/topCollections'
import ExploreNFTs from './pages/exploreNfts'
import UserProfile from './pages/userprofile/index';
import 'remixicon/fonts/remixicon.css'
import Ecosystem from './pages/homepage/components/ecosystem/ecosystem'
import Votedao from './pages/homepage/components/Votedao/votedao'
import Launchpad from './pages/homepage/components/launchpad/launchpad'
import Accelerate from './pages/homepage/components/accelerate/accelerate'
import Acceleratethanks from './pages/accelerate-pages/accelerate-thanks/accelerate-thanks'
import Acceleratelists from './pages/accelerate-pages/accelerate-lists/accelerate-lists'
import Accelerateonboard from './pages/accelerate-pages/accelerate-onboard/accelerate-onboard'
import Acceleratedashboard from './pages/accelerate-pages/accelerate-dashboard/accelerate-dashboard'
import AllForms from './pages/homepage/components/all-form/all-form'
import FirstTimeLogin from './pages/accelerate-pages/accelerate-dashboard/components/first-time-login/first-time-login'
import PublicProfileView from './pages/accelerate-pages/accelerate-dashboard/components/public-profile-view/public-profile-view'
import VCDashboard from './pages/accelerate-pages/vc-dashboard/vc-dashboard'
import Vcprofilepage from './pages/accelerate-pages/vc-dashboard/components/vc-profile-page/vc-profile-page'
import Mentorshippublicpage from './pages/accelerate-pages/vc-dashboard/components/mentorship-public-page/mentorship-public-page'

const ProfilePage = () => {
  const { path } = useRouteMatch()

  return (
    <div className="pages-wrapper">
      <SideBar />
      <ProfileSide />
    </div>
  )
}

const ActivityPage = () => {
  return (
    <div className="pages-wrapper">
      <SideBar />
      <ActivityTable />
    </div>
  )
}

const OfferReceivedPage = () => {
  return (
    <div className="pages-wrapper">
      <SideBar />
      <OfferReceivedTable />
    </div>
  )
}

const OffersMadePage = () => {
  return (
    <div className="pages-wrapper">
      <SideBar />
      <OffersMadeTable />
    </div>
  )
}

function App() {
  

  
  return (
    <>
      
      <Router>

        <Web3ReactManager>
          <BaseLayout>

            <Switch>

              <Route path="/genpad/staking">
                <HomePage index={2} />
              </Route>

              <Route path="/genpad">
                <HomePage index={1} />
              </Route>

              <Route exact path='/gstokenclaim'>
                <GenshardsDashboard />
              </Route>

              <Route exact path="/create">
                {<Create></Create>}
              </Route>

              <Route exact path="/">
                <HomePage />
              </Route>
              
              <Route exact path="/vc-dashboard">
                <VCDashboard />
              </Route>

              <Route exact path="/vc-dashboard/:type">
                <VCDashboard />
              </Route>

              <Route exact path="/mentor-dashboard">
                <VCDashboard />
              </Route>
              
              <Route exact path="/mentor-dashboard/:type">
                <VCDashboard />
              </Route>

              <Route exact path="/Mentor-public-profile">
                <Mentorshippublicpage />
              </Route>

              <Route exact path="/forms/:type/:type">
                <FirstTimeLogin />
              </Route>

              <Route exact path="/profile/:id">
                <PublicProfileView />
              </Route>

              {/* <Route exact path="/vc-profile-page">
                <Vcprofilepage />
              </Route> */}

              <Route exact path="/dashboard">
                <Dashboard />
              </Route>

              <Route path="/staking">
                <Staking />
              </Route>

              <Route path="/ecosystem">
                <Ecosystem />
              </Route>

              <Route path="/accelerate">
                <Accelerate />
              </Route>
              <Route path="/project-thanks">
                <Acceleratethanks />
              </Route>

              <Route path="/project-lists">
                <Acceleratelists />
              </Route>
              
              <Route path="/project-courses">
                <Accelerateonboard />
              </Route>
              
              <Route path="/project-dashboard">
                <Acceleratedashboard />
              </Route>

              <Route path="/project-dashboard/:id">
                <Acceleratedashboard />
              </Route>

              <Route path="/contact-form/:id">
                <AllForms />
              </Route>

              <Route path="/launchpad">
                <Launchpad />
              </Route>

              <Route exact path="/community/projects">
                <AllProjects />
              </Route>

              <Route exact path="/community/academy">
                <AllAcademy />
              </Route>

              <Route exact path="/community/academy/:id">
                <Academy />
              </Route>

              <Route exact path="/community">
                <Community />
              </Route>
              <Route path="/genverse">
                <Collection />
              </Route>

              <Route path="/access-pool">
                <Staking accessPool />
              </Route>

              <Route path="/market">
                <Market />
              </Route>

              <Route path="/project/:projectid">
                <LiveProjectPage />
              </Route>
              <Route path="/profile">

                <UserProfilePage />
              </Route>

              <Route path="/calendar">
                <CalanderComp />
              </Route>

              <Route path="/marketplace">
                <MarketPlace />
              </Route>

              <Route path="/cohort-staking/:id">
                <CohertStakingDetail />
              </Route>

              <Route path="/cohort-staking">
                <CohortStaking />
              </Route>

              <Route exact path="/profile-detail">
                <div style={{ width: '100%' }}>
                  <MarketPlaceHeader />
                  <ProfilePage />
                </div>
              </Route>

              <Route exact path="/activity">
                <div style={{ width: '100%' }}>
                  <MarketPlaceHeader />
                  <ActivityPage />
                </div>
              </Route>

              <Route exact path="/offersReceived">
                <div style={{ width: '100%' }}>
                  <MarketPlaceHeader />
                  <OfferReceivedPage />
                </div>
              </Route>

              <Route exact path="/offersMade">
                <div style={{ width: '100%' }}>
                  <MarketPlaceHeader />
                  <OffersMadePage />
                </div>
              </Route>

              <Route exact path="/profile-detaail/project-detail">
                <div style={{ width: '100%' }}>
                  <MarketPlaceHeader />
                  <GardenofEden />
                </div>
              </Route>

              {/* <Route exact path={`/collection/:nftcontractaddress`}>
                <IndividualCollection />
              </Route> */}

              <Route exact path={`/collection/:platformChain/:nftcontractaddress`}>
                <IndividualCollection />
              </Route>


              <Route exact path={`/assets/:nftcontractaddress/:tokenid`}>
                <GardenofEden />
              </Route>

              <Route exact path={`/assets/create`}>
                <MintNFT />
              </Route>

              <Route path="/top-collections">
                <TopCollections />
              </Route>

              <Route path="/explore-nfts">
                <ExploreNFTs />
              </Route>
              <Route path="/votedao">
                <Votedao />
              </Route>
              <Route path="/UserProfile">

                <div style={{ width: '100%' }}>
                  {/* <MarketPlaceHeader /> */}
                  <UserProfile />
                </div>
              </Route>

              {/* redirect to home page if route not match */}
              <Route path="*">
                <Redirect exact to="/"></Redirect>
              </Route>
            </Switch>
          </BaseLayout>
        </Web3ReactManager>
      </Router>

      {/* uniswap modal */}
      <Popups />
    </>
  )
}

export default App
