import { Fragment, useMemo } from 'react'
import Button from '../../../../shared/components/buttons'
import {
    NavLink,
    useRouteMatch,
} from 'react-router-dom'
import "./style.sass"
import { IStakingProps } from '../../../../state/staking/types'

const stakingView = [
    {
        path: "",
        label: "LIVE",
    },
    {
        path: "past-stake",
        label: "PAST"
    }
]

function StakeHeader(props: IStakingProps) {

    const { accessPool = false } = props
    const { path } = useRouteMatch()

    const filteredView = useMemo(() => {
        if (accessPool) return stakingView.filter(item => item.path === "LIVE")
        return stakingView
    }, [accessPool])

    return (
        <div className="stake-header">
            <h1 className="stake-heading">{accessPool ? "GS Access Pool" : "Stake to Earn"}</h1>
            <h1 className="stake-heading" style={{ margin: "0 auto" }}>{accessPool ? "Access NFTOs | Earn GSK" : "Let your crypto work for you"}</h1>
            <div className="stake-now">
                <Button className="outline--highlight active stake-now-btn" >STAKE NOW</Button>
            </div>

            <div className="switch-stakes">
                {filteredView.map((item, index) => (
                    <Fragment key={index}>
                        <NavLink
                            className="link-item"
                            to={`${path}/${item.path}`}
                            activeClassName="active-link"
                            title={item.label}
                            isActive={(match) => match?.isExact || false}
                        >
                            {item.label}
                        </NavLink>
                        {index === 0 ? <div className="divider" /> : null}
                    </Fragment>
                ))}
            </div>

        </div>
    )
}

export default StakeHeader
