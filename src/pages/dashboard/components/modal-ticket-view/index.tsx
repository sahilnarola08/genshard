import { useCallback, useMemo, useEffect, useState } from 'react'
import moment from 'moment';
import React from 'react'
import Modal from '../../../../shared/components/modal'
import { InventoryTicketDto } from '../inventory/types'
import Logo from '../logo'
import './style.sass'
import { useWeb3Contract } from '../../../../hooks/useContract';
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'

import { useSelector } from 'react-redux'
import { KYC_STATUS } from '../../../../state/application/reducer'
import { Project } from '../../../../state/ticket/types'
import { AppState } from '../../../../state'
import { formatEther } from 'ethers/lib/utils'

interface ITicketViewModal {
  ticket: InventoryTicketDto | undefined
  isOpen: boolean
  onClose: () => any
}

const ModalTicketView = ({ ticket, isOpen, onClose }: ITicketViewModal) => {
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  
  const [tge, setTge] = useState(0);
  
  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);
  
  const getTGE = async () => {
    try {
      const tge = await genTicket(currentProject!.address).methods.TGE().call();
      setTge(tge);
    } catch (error) {
  
    }
  }
  
  useEffect(() => {
    getTGE();
  }, [currentProject])
  
  const getRedeemedTokens = (ticket: InventoryTicketDto) : any => {
    var tranchesWiseTokens = 0.0;
    if (currentProject?.projectDuration! === 'New') {
      tranchesWiseTokens = getTokensForReedemableAndRedeemed('redeemed', ticket);
    }
    else {
      const actualTranchePastCliff = Number(ticket.tranchePastCliff!) - Number(ticket.lengthOfCliff)
      if (actualTranchePastCliff < 1) {
        return tranchesWiseTokens.toFixed(2);
      }
      // ((15*3)/(5-0))-0,1,2,3,4
      tranchesWiseTokens = (parseFloat(getAverageTranchesWiseTokensForSingleNFTTicket(ticket)) * parseFloat(ticket.number) * Math.floor(actualTranchePastCliff));
      //const tranchesWiseTokens = ((((ticket.size != undefined) ? (Number(ticket.size)) : 0) * Number(ticket.number)) / (Number(ticket.totalTranches) - Number(ticket.lengthOfCliff))) * Math.floor(ticket.tranchePastCliff!)
      console.log('GetRedeemedTokens --> ', tranchesWiseTokens, ticket.tranchePastCliff!, actualTranchePastCliff);
    }
    return tranchesWiseTokens.toFixed(2);
  }
  
  const getAverageTranchesWiseTokensForSingleNFTTicket = (ticket: InventoryTicketDto) => {
    if (Number(ticket.totalTranches) == 0) {
      console.log('Inner Loop getAverageTranchesWiseTokensForSingleNFTTicket --> ', getTotalCoinsOfTicket(ticket));
      return getTotalCoinsOfTicket(ticket);
    }
    const tranchesWiseTokens = currentProject?.projectDuration === 'New' ?  
                               ((ticket.size != undefined) ? (Number(ticket.size)) : 0) / Number(ticket.totalTranches) :
                               ((ticket.size != undefined) ? (Number(ticket.size)) : 0) / (Number(ticket.totalTranches) - Number(ticket.lengthOfCliff!))
    console.log('getAverageTranchesWiseTokensForSingleNFTTicket --> ', ticket, tranchesWiseTokens);
    return tranchesWiseTokens.toFixed(2);
  }
  
  const getTotalCoinsOfTicket = (ticket: InventoryTicketDto) : any => {
    const tokens = ((ticket.size != undefined) ? (Number(ticket.size)) : 0) * Number(ticket.number)
    return Math.floor(tokens).toFixed(2);
  }
  
  const getTokensForReedemableAndRedeemed = (type: string, ticket: InventoryTicketDto): any => {
    let redeemablePercentage = 0;
    let redeemedPercentage = 0;
    let redeemableCounter = 0;
    let redeemedCounter = 0;
    let tranche = Math.floor(Number(ticket?.tranchePastCliff!));

    for (let i = 0; i< Number(ticket.arrayOfWeightages?.length); i++)
    {    
        if (i < Number(tranche)){
            redeemedPercentage += Number(formatEther(ticket?.arrayOfWeightages![i] ?? 0));
            redeemedCounter += Number(1);
        }
        if (Number(tge) + Number(ticket?.arrayOfTranches![i] ?? 0) <= Number(moment().unix())){
            redeemablePercentage += Number(formatEther(ticket?.arrayOfWeightages![i] ?? 0));
            redeemableCounter += Number(1);
        } else{
            break;
        }
    }

    console.log('redeemablePercentage', tranche, redeemablePercentage, redeemedPercentage);
    let actualRedeemablePercentage = (Number(redeemablePercentage)) - (Number(redeemedPercentage))
    const tokens = (type == 'redeemable') ? (Number(getTotalCoinsOfTicket(ticket)) * (Number(actualRedeemablePercentage) / 100)) : (Number(getTotalCoinsOfTicket(ticket)) * (Number(redeemedPercentage) / 100));
    return tokens;
  }

  const getTotalRedeemableTokens = (ticket: InventoryTicketDto) => {
    let tokens = 0
    if ((moment().unix() - Number(tge)) < 0) {
      return 0.00;
    }

    if (currentProject?.projectDuration! === 'New') {
      tokens = getTokensForReedemableAndRedeemed('redeemable', ticket);
    }
    else {
      let numberOfEligibleTranches = 0
      if (Number(ticket.lengthOfTranche!) >= 1) 
      {
        numberOfEligibleTranches = Math.floor((moment().unix() - ((Number(ticket?.lengthOfTranche!) * Number(ticket.lengthOfCliff!)) + Number(tge))) / Number(ticket.lengthOfTranche!));
        console.log('moment().unix(), ticket.lengthOfTranche!, ticket.lengthOfCliff!, tge', moment().unix(), Number(ticket.lengthOfTranche!), Number(ticket.lengthOfCliff!), Number(tge));
        console.log('numberOfEligibleTranches11111111', numberOfEligibleTranches);
        if (numberOfEligibleTranches <= 0 && Number(ticket.lengthOfCliff!) == 0) {
          numberOfEligibleTranches = 1
        } else if ((numberOfEligibleTranches + Number(ticket.lengthOfCliff!)) >= Number(ticket?.totalTranches!)) {
          numberOfEligibleTranches = Number(ticket?.totalTranches!) - Number(ticket.lengthOfCliff!)
        } else {
          if (numberOfEligibleTranches < 0 && Number(ticket.lengthOfCliff!) > 0) {
            numberOfEligibleTranches = 0
          } else {
            numberOfEligibleTranches = numberOfEligibleTranches + 1
          }
        }
      } else {
        numberOfEligibleTranches = 1
      }
    
      console.log('numberOfEligibleTranches', numberOfEligibleTranches);
      const averageTokensAvailableToClaim = parseFloat(getAverageTranchesWiseTokensForSingleNFTTicket(ticket)) * parseFloat(ticket.number);
      console.log('averageTokensAvailableToClaim', averageTokensAvailableToClaim);
    
      tokens = (numberOfEligibleTranches * averageTokensAvailableToClaim) - getRedeemedTokens(ticket) > 0 ? (numberOfEligibleTranches * averageTokensAvailableToClaim) - getRedeemedTokens(ticket) : 0;
    
      console.log('Final tokens data (tokens, numberOfEligibleTranches, getAverageTranchesWiseTokensForSingleNFTTicket, ticket.number, getRedeemedTokens) ---->  ', tokens, numberOfEligibleTranches, getAverageTranchesWiseTokensForSingleNFTTicket(ticket), Number(ticket.number), getRedeemedTokens(ticket))
    }
    return tokens.toFixed(2);
  };
  console.log("ppppp", currentProject);
  return (
    <div className="modal-ticket-view">
      <Modal isOpen={isOpen} onClose={onClose}>
        {ticket && (
          <div className="modal-content">
            <div className="modal-title">
              <p>TICKET VIEW</p>
            </div>

            <div className="logo">
              <Logo src={ticket.image} alt={ticket.description}></Logo>
            </div>

            <div className="content-wrapper">
              <div className="row">
                <div className="special-item">
                  <p className="label">Ticket Name</p>
                  <p className="value">{ticket.name}</p>
                </div>

                <div className="special-item special-item--02">
                  <p className="label">Number of Tickets</p>
                  <p className="value">{ticket.number}</p>
                </div>
              </div>
            
              { currentProject?.name.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && currentProject?.name.toLowerCase() !== "POLKER INO".toLowerCase() && (
                <>  
              <div className="row">
                <p className="label">Token Generation Date</p>
                <p className="value">{ticket.generationDate}</p>
              </div>

              <div className="row-group--secondary">
                
                {/* redeemable token */}
                <div className="row">
                  <p className="label">Ticket Size</p>
                  <p className="value">
                    {ticket.size} {ticket.symbol}
                  </p>
                </div>

                {/* redeemable token */}
                <div className="row">
                  <p className="label">Redeemable Tokens</p>
                  <p className="value">
                  {(getTotalRedeemableTokens(ticket))} {ticket.symbol}
                  </p>
                </div>

                {/* redeemable token */}
                <div className="row">
                  <p className="label">Redeemed tokens</p>
                  <p className="value">{getRedeemedTokens(ticket)} {ticket.symbol}</p>
                </div>

                {/* redeemable token */}
                <div className="row">
                  <p className="label"># of Total Tranches</p>
                  <p className="value">{ticket.totalTranches}</p>
                </div>

                {/* redeemable token */}
                <div className="row">
                  <p className="label">Length of each tranche</p>
                  <p className="value">{ticket.lengthOfTranche}</p>
                </div>

                {/* redeemable token */}
                <div className="row">
                  <p className="label">Length of each cliff</p>
                  <p className="value">{ticket.lengthOfCliff}</p>
                </div>
                
              </div></>
              )}

            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ModalTicketView
