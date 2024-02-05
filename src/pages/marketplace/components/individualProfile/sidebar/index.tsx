import { useState } from "react"
import { useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom'
import { AppState } from '../../../../../state';
import { searchToObject } from '../../../../../utils';
import './style.sass'
import menuWhiteIcon from "../../../../../images/header-menu-black.png"


const SideBar = () => {

    const nftUserStats = useSelector((state: AppState) => state.user.nftUserStats)
    const {path} = useRouteMatch()
    const history = useHistory()
    const locationSearch = window.location.search as string
    const currentRoute = path + locationSearch

    const myItems = [
        {
            name: 'COLLECTED',
            count: nftUserStats.totalAllNfts,
            to: "/profile-detail"
        },
        {
            name: 'CREATED',
            count: nftUserStats.totalNfts,
            to: "/profile-detail?type=my_nfts"
        },
        {
            name: 'FAVORITED',
            count: nftUserStats.totalLikedNfts,
            to: "/profile-detail?type=liked_nfts"
        },
        // {
        //     name: 'HIDDEN',
        //     count: '56'
        // }
    ];
    const accounts = [
        {
            name: 'ACTIVITY',
            to: 'activity'
        },
        {
            name: 'OFFERS RECEIVED',
            to: 'offersReceived'
        },
        {
            name: 'OFFERS MADE',
            to: 'offersMade'
        }
    ]
    const [openMenu, setOpenMenu] = useState(false)

    return (
        <>
        <div className="items_side_bar">
            <div className="side_bar_wrapper">

                <div className="accounts">
                    <h3>MY ITEMS</h3>
                    <hr />
                    {myItems?.map((item, index) => {
                        return <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div
                                style={{ margin: 0 }}
                                className={`accountName ${item.to === currentRoute ? "active-link" : ""}`}
                                title={item.name}
                                onClick={() => history.push(item.to)}
                            >
                                {item.name}
                            </div>
                            <span>{item.count}</span>
                        </li>
                    }
                    )}
                </div>

                <div className="accounts">
                    <h3>ACCOUNT</h3>
                    <hr />
                    {accounts?.map((account, index) =>
                        <li key={index}>
                            <NavLink
                                className='accountName'
                                activeClassName="active-link"
                                exact
                                to={`${account.to}`}
                                title={account.name}
                            >
                                {account.name}
                            </NavLink>
                        </li>
                    )}
                </div>
            </div>
        </div>  
        <div className="mobile-side-header">
                <div>
                    <img className='humburger'  src={menuWhiteIcon} alt="" onClick={() => setOpenMenu(prev => !prev)} />
                </div>
                {openMenu ? <div className="mobile_side_bar">
            <div className="side_bar_wrapper">
                <div className="myItems">
                    <h3>MY ITEMS</h3>
                    <hr />
                    {myItems?.map(items =>
                        <div className="nameAndCount">
                            <div className='itemsName'>{items?.name}</div>
                            <div className='itemsCount'>{items?.count}</div>
                        </div>
                    )}
                </div>
                <div className="accounts">
                    <h3>ACCOUNT</h3>
                    <hr />
                    {accounts?.map((account, index) =>
                        <li key={index}>
                            <NavLink
                                className='accountName'
                                activeClassName="active-link"
                                exact
                                to={`${account.to}`}
                                title={account.name}
                            >
                                {account.name}
                            </NavLink>
                        </li>
                    )}
                </div>
            </div>
        </div> : null}
            </div>
        </>
    )
}

export default SideBar
