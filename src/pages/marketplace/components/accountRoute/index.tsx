import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.sass'

function AccountMobileRoute() {
    const accounts = [
        {
          name: 'ACTIVITY',
          to: 'activity',
        },
        {
          name: 'OFFERS RECEIVED',
          to: 'offersReceived',
        },
        {
          name: 'OFFERS MADE',
          to: 'offersMade',
        },
      ]
    return (
        <div className="accountsRoute">
          {accounts?.map((account, index) => (
            <li key={index}>
              <NavLink
                className="accountName"
                activeClassName="active-link"
                exact
                to={`${account.to}`}
                title={account.name}
              >
                {account.name}
              </NavLink>
            </li>
          ))}
        </div>
    )
}

export default AccountMobileRoute
