import React from 'react'
import "./latest-bets.sass"
import Profile from '../../../../../../../images/accelerate/pages/profile-img.svg'

const betsData = [
    {
        name: "DUELIST KING",
        amount: "$150 million",
        entryStage: "Seed",
        ProjectInvested: "NVidia",
    },
    {
        name: "DUELIST KING",
        amount: "$150 million",
        entryStage: "Seed",
        ProjectInvested: "Microsoft Activision",
    },
    {
        name: "DUELIST KING",
        amount: "$150 million",
        entryStage: "Seed",
        ProjectInvested: "Bain Capital",
    },

]


const Latestbets = () => {
    return (
        <>
            <div className="">
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">VC</div>
                        <div className="col col-2">Amount</div>
                        <div className="col col-3">Stage of Entry</div>
                        <div className="col col-4">Project Invested Into</div>
                    </li>
                    {betsData && betsData?.map((item: any, i: any) => (
                        <li className="table-row">
                            <div className="col col-1 paragraph-new fw-bold" data-label="Job Id"><img className='profile-img me-4' src={Profile} alt="" />{item.name}</div>
                            <div className="col col-2 paragraph-new fw-bold" data-label="Customer Name">{item.amount}</div>
                            <div className="col col-3 paragraph-new fw-bold" data-label="Amount">{item.entryStage}</div>
                            <div className="col col-4 paragraph-new fw-bold" data-label="Payment Status">{item.ProjectInvested}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Latestbets