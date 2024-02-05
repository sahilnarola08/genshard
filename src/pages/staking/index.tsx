import { Switch, Route, useRouteMatch } from "react-router-dom";
import StakeHeader from './components/stake-header';
import LiveStake from './components/live-stake';
import PastStake from './components/past-stake';
import './style.sass';

interface IStaking {
    accessPool?: Boolean
}

export function Staking(props: IStaking) {
    const { accessPool = false } = props
    const { path } = useRouteMatch()
    return (
        <div className="staking">
            <StakeHeader accessPool={accessPool} />
            <Switch>
                <Route exact path={path}>
                    <LiveStake accessPool={accessPool} />
                </Route>
                <Route exact path={`${path}/past-stake`}>
                    {accessPool ? null : <PastStake accessPool={accessPool} />}
                </Route>
            </Switch>
        </div>
    )
}
