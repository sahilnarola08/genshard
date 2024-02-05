import {
  Redirect,
  Route,
  BrowserRouter,
  Switch,
  NavLink,
  useRouteMatch,
} from 'react-router-dom'
import HeaderMarket from './components/header'
import LiveUpComing from './components/live-upcoming'
import PastProject from './components/past-project'
import CurrentProject from './components/current-project'
import BuyNFTs from './components/buy-nfts'
import './style.sass';

export function Market() {
  const { path } = useRouteMatch()
  return (
    <div className="market">
      <HeaderMarket />
      <div id="live-upcoming-page">
        <Switch>
          <Route exact path={`${path}`}>
            <LiveUpComing />
          </Route>

          <Route exact path={`${path}/past-project`}>
            <PastProject />
          </Route>

          <Route exact path={`${path}/current-project`}>
            <CurrentProject />
          </Route>

          <Route exact path={`${path}/buy-nfts`}>
            <BuyNFTs />
          </Route>
        </Switch>
      </div>
    </div>

  )
}
