import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';

import './style.sass';
import searchIcon from '../../../../images/marketplace/SearchVector.svg'
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../state';
import { useActiveWeb3React } from '../../../../hooks/web3';
import useUserAuth from '../../../../hooks/useUserAuth';
import LoaderComp from '../../../../shared/components/LoaderComponent';
import { apiBaseUrl } from '../../../../constants';
import axios from 'axios';
import { saveUserStats } from '../../../../state/user/actions';

const NavigationTabs = {
    title: 'RESOURCES',
    to: 'resources',
    altTitle: 'See resources',
}
type MarketPlaceHeaderProps = {
    getSearchText?: any
}
const MarketPlaceHeader = ({ getSearchText }: MarketPlaceHeaderProps) => {


    const { path } = useRouteMatch()
    const history = useHistory()
    const dispatch = useDispatch()

    const [searchText, setSearchText] = useState("")
    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const access_token = useSelector((state: AppState) => state.user && state.user.access_token)

    const { library, account, chainId } = useActiveWeb3React()

    const getToken = path === "/profile-detail" || path === "/activity" || path === "/offersReceived" || path === "/offersMade"

    useEffect(() => {
        if (access_token && account === storedAddress && chainId) {
            getUserStats()
        }
    }, [access_token, account, storedAddress, chainId])


    const getUserStats = () => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/user/stats/chain_id/${chainId}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(({ data }) => {
            const { totalNfts = 0, totalLikedNfts = 0, totalAllNfts = 0 } = data || {}
            dispatch(saveUserStats({ totalAllNfts, totalLikedNfts, totalNfts }))
        })
    }


    return (
        <div className="header-marketplace">
            {/* <LoaderComp msg={authLoaderMsg} isOpen={isAuthLoader} onClose={() => { }} /> */}
            <div className="header-stuff">
                <div className="title">marketplace</div>
                <div className='resource-container'>
                    {/* <div className="design-uri"> */}
                    
                    {/* </div> */}

                    {/* <div className="marketplace-navigation">
                        <NavLink
                            key={NavigationTabs.title}
                            className="link-item"
                            to={`${path}/${NavigationTabs.to}`}
                            activeClassName="active-link"
                            title={NavigationTabs.altTitle}
                            isActive={(match) => match?.isExact || false}
                        >
                            {NavigationTabs.title}
                        </NavLink>
                    </div> */}
                    {/* <ShoppingCart onClick={() => history.push(`${path}/cart`)} /> */}
                </div>
            </div>
        </div>
    )
}

export default MarketPlaceHeader
