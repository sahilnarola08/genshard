import { useCallback, useMemo, useEffect, useState } from 'react'
import moment from 'moment';
import Button from '../../../../shared/components/buttons'
import { AppState } from '../../../../state'
import { useRedeem, useSetApprovalForAll } from '../../../../state/ticket/hooks'
import { InventoryTicketDto } from '../inventory/types'
import Logo from '../logo'
import './style.sass'
import { useSelector } from 'react-redux'
import { KYC_STATUS } from '../../../../state/application/reducer'
import { Project } from '../../../../state/ticket/types'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'

import { PROJECTS_DATA, PROJECTS_DATA_BSC, PROJECTS_DATA_MATIC, PROJECTS_DATA_IOTEX, PROJECTS_DATA_HARMONY, PROJECTS_DATA_AVALANCHE, PROJECTS_DATA_GOERLI, PROJECTS_DATA_MUMBAI, PROJECTS_DATA_IOTEX_NETWORK_TESTNET, PROJECTS_DATA_HARMONY_NETWORK_TESTNET, PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET, PROJECTS_DATA_BSC_NETWORK_TESTNET} from '../../../../constants'
import { formatEther } from 'ethers/lib/utils'

const TokenInventory = ({ ticket, onView, setRefreshData, setRefundLoader }: ITokenInventoryProps) => {
  const redeemCallback = useRedeem()
  const setApprovalForAllCallback = useSetApprovalForAll()
  const kycStatus = useSelector((state: AppState) => state.application.kyc_status)
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const [tge, setTge] = useState(0);

  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);

  const network = useSelector((state: AppState) => state.application.network)
  const [data, setData] = useState<any>({})

  useEffect(() => {
    if (network) {
      let collections = network == 'BSC' ? PROJECTS_DATA_BSC : network == 'MATIC' ? PROJECTS_DATA_MATIC : network == 'IOTEX' ? PROJECTS_DATA_IOTEX : network == 'HARMONY' ? PROJECTS_DATA_HARMONY : network == 'AVALANCHE' ? PROJECTS_DATA_AVALANCHE : network == 'GOERLI' ? PROJECTS_DATA_GOERLI : network == 'MUMBAI' ? PROJECTS_DATA_MUMBAI : network == 'T-IoTeX' ? PROJECTS_DATA_IOTEX_NETWORK_TESTNET : network == 'T-HRMNY' ? PROJECTS_DATA_HARMONY_NETWORK_TESTNET : network == 'T-AVALANCHE' ? PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET : network == 'T-BSC' ? PROJECTS_DATA_BSC_NETWORK_TESTNET : PROJECTS_DATA;
      setData(collections.find(({ ticketAddress }) => ticketAddress === currentProject?.address));
    }
  }, [network])

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

  const handleView = useCallback(() => {
    onView(ticket)
  }, [ticket])

  const isDisableRedeem = useMemo(
    () => !(ticket.redeemableToken && Number(ticket.redeemableToken)),
    [ticket.redeemableToken]
  )

  const handleRedeem = useCallback(() => {
    // if (isDisableRedeem) return
    /*if (kycStatus === KYC_STATUS.NOT_VERIFIED) {
      alert('Please verify KYC status before redeeming your NFT.')
      return
    }*/
    redeemCallback(ticket.index)
  }, [redeemCallback, kycStatus, ticket.index, ticket.redeemableToken])

  const handleReturnNft = useCallback(async () => {
    try {
      setRefundLoader(true)
      await setApprovalForAllCallback(data.marketPlaceAddress, data.returnNFTAddress, ticket, () => {
        setRefreshData((prev) => !prev)
      })
      setRefundLoader(false)
    } catch (ex) {
      setRefundLoader(false)
    }
  }, [setApprovalForAllCallback, ticket, data])

  const getRedeemedTokens = (ticket: InventoryTicketDto): any => {
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
    const tranchesWiseTokens = currentProject?.projectDuration! === 'New' ?  
                               ((ticket.size != undefined) ? (Number(ticket.size)) : 0) / Number(ticket.totalTranches) :
                               ((ticket.size != undefined) ? (Number(ticket.size)) : 0) / (Number(ticket.totalTranches) - Number(ticket.lengthOfCliff!))
    console.log('getAverageTranchesWiseTokensForSingleNFTTicket --> ', ticket, tranchesWiseTokens);
    return tranchesWiseTokens.toFixed(2);
  }

  const getTotalCoinsOfTicket = (ticket: InventoryTicketDto): any => {
    const tokens = ((ticket.size != undefined) ? (Number(ticket.size)) : 0) * Number(ticket.number)
    console.log('final data getTotalCoinsOfTicket : ', tokens);
    return Math.floor(tokens).toFixed(2);
  }

  const getTokensForReedemableAndRedeemed = (type: string, ticket: InventoryTicketDto): any => {
    let redeemablePercentage = 0;
    let redeemedPercentage = 0;
    let redeemableCounter = 0;
    let redeemedCounter = 0;
    let tranche = Math.floor(Number(ticket?.tranchePastCliff!))
    console.log("Format Ticket : ", ticket);

    for (let i = 0; i< Number(ticket?.arrayOfWeightages?.length); i++)
    {    
        if (i < Number(tranche)){
            redeemedPercentage += Number(formatEther(ticket?.arrayOfWeightages![i] ?? 0));
            redeemedCounter += Number(1);
        }
        
        if (Number(tge) + Number(ticket?.arrayOfTranches![i] ?? 0) <= Number(moment().unix())){
            redeemablePercentage += Number(formatEther(ticket?.arrayOfWeightages![i]) ?? 0);
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
      console.log("I am coming", ticket);
      tokens = getTokensForReedemableAndRedeemed('redeemable', ticket);
    }
    else {
      let numberOfEligibleTranches = 0
      if (Number(ticket.lengthOfTranche!) >= 1) {
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

  return (
    <div className="token-inventory-wrapper">
      <div className="token-inventory">
        {/* token logo */}
        <div className="token-inventory__logo">
          <Logo src={ticket.image} alt={ticket.description}></Logo>
        </div>

        {/* token detail */}
        <div className="token-inventory__ticket">
          <div className="name-number-ticket">
            <div className="ticket ticket--name">
              <div className="ticket__title">Ticket Name</div>
              <div className="ticket__value">{ticket.name}</div>
            </div>

            <div className="ticket ticket--number">
              <div className="ticket__title">Number of Tickets</div>
              <div className="ticket__value ticket__value--number">
                {ticket.number}
              </div>
            </div>
          </div>

          {currentProject?.name!.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && currentProject?.name!.toLowerCase() !== "POLKER INO".toLowerCase() && (
            <><div className="ticket-size-tokens">
              <div className="ticket-tokens ticket-size">
                <div className="ticket-tokens__title">Ticket size</div>
                <div className="ticket-tokens__value">
                  {((ticket.size != undefined) ? Number(ticket.size) : 0)} {ticket.symbol}
                </div>
              </div>
              <div className="ticket-tokens ticket-size">
                <div className="ticket-tokens__title">Total Ticket Tokens</div>
                <div className="ticket-tokens__value">
                  {getTotalCoinsOfTicket(ticket)} {ticket.symbol}
                </div>
              </div>
            </div>

              <div className="ticket-size-tokens">
                <div className="ticket-tokens ticket-token">
                  <div className="ticket-tokens__title">Redeemable tokens</div>
                  <div className="ticket-tokens__value">
                    {(getTotalRedeemableTokens(ticket))} {ticket.symbol}
                  </div>
                </div>
                <div className="ticket-tokens ticket-token">
                  <div className="ticket-tokens__title">Redeemed tokens</div>
                  <div className="ticket-tokens__value">
                    {getRedeemedTokens(ticket)} {ticket.symbol}
                  </div>
                </div>
              </div></>
          )}

        </div>

        <div className="button-redeem-wrapper">
          {
            currentProject!.name.toLowerCase() === "testProject".toLowerCase()
              ?
              <div className="redeemReturntoken">
                <Button
                  disabled={(Math.ceil(getRedeemedTokens(ticket)).toFixed(0) === Math.ceil(getTotalCoinsOfTicket(ticket)).toFixed(0)) || (moment().unix() - tge) < 0}
                  className="outline--highlight small button-redeem"
                  onClick={handleRedeem}
                >
                  REDEEM
                </Button>
                <Button
                  className="outline--highlight small button-redeem"
                  onClick={handleReturnNft}
                >
                  RETURN NFT
                </Button>
              </div>
              :
              <Button
                disabled={(Math.ceil(getRedeemedTokens(ticket)).toFixed(0) === Math.ceil(getTotalCoinsOfTicket(ticket)).toFixed(0)) || (moment().unix() - tge) < 0}
                className="outline--highlight small button-returnNFT"
                onClick={() => {currentProject?.name.toLowerCase() === "ACKNOLEDGER NFT COLLECTION".toLowerCase() || currentProject?.name.toLowerCase() === "POLKER INO".toLowerCase() ? window.open("", '_self') : handleRedeem()}}
              >
                REDEEM
              </Button>
          }
        </div>

        {/* token view button */}
        <div className="token-inventory__btn">
          <Button className="outline btn-token-inventory" onClick={handleView}>
            View
          </Button>
        </div>
      </div>

      {ticket.isEmpty && (
        <div className="empty-layer">
          <img src="/images/box.svg" alt="empty" />
          <p>Empty</p>
        </div>
      )}
    </div>
  )
}

interface ITokenInventoryProps {
  ticket: InventoryTicketDto
  onView: (ticket: InventoryTicketDto) => any
  setRefreshData: (refreshData: boolean | ((prev: boolean) => boolean)) => void
  setRefundLoader: (refundLoader: boolean) => void
}

export default TokenInventory
