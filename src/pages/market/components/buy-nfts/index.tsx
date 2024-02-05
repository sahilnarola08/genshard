import { useEffect, useState } from 'react'
import GridCard from '../grid-card'
import './style.sass'
import '../live-upcoming/style.sass'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { getGenTicketUrl } from '../../../dashboard/dashboard.helpers'
import { getTicketMetadata } from '../../../../utils/genTicketMetadata'
import { asyncSleep, getContract } from '../../../../utils'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { useHistory } from 'react-router'
import { Card } from '../../../../state/market/types'
import { useGetNumberOfTicketTypes } from '../../../../state/ticket/hooks'
import axios from 'axios'
import { abi as USDT_ABI } from '../../../../contracts/USDT.json'


export default function BuyNFTs() {
  const { account, library } = useActiveWeb3React()
  const history = useHistory()
  const currentProject = useSelector((state: AppState) => state.market.currentProject)
  const [listCard, setListCard] = useState<Array<Card>>()

  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)
  const getNumberOfTicketTypes = useGetNumberOfTicketTypes()

  useEffect(() => {
    if (currentProject === undefined) {
      history.push('/market')
      return
    }
  }, [])

  const getCardData = async () => {
    if (account === undefined || account === null) return
    const numTicketTypes = await getNumberOfTicketTypes(currentProject?.ticketAddress!);

    const ticketPromises = new Array(numTicketTypes)
      .fill(undefined)
      .map(async (item, index) => {
        // get the meta data
        const uri = await genTicket(currentProject?.ticketAddress!).methods.uri(index).call()
        const ticketUrl = getGenTicketUrl(uri, index)
        const ticketMetaPromise = await getTicketMetadata(ticketUrl).catch(
          (err) => {
            console.error('[Inventory][handleFetchTicket]', err)
            return {}
          }
        )

        const [
          ticketMeta,
          balance,
          ticketNums,
        ] = await Promise.all([
          ticketMetaPromise,
          genTicket(currentProject?.ticketAddress!).methods.balanceOf(account, index).call(),
          genTicket(currentProject?.ticketAddress!).methods.genTickets(index).call(),
        ])

        let numTickets
        let ticketsPurchased
        let price
        let isEnableUSDT = false
        let getUSDTDecimals = 18
        let usdtAccountAddress
        try {
          if (currentProject?.marketAddress !== undefined) {
            [
              numTickets,
              ticketsPurchased,
              price
            ] = await Promise.all([
              genMarket(currentProject?.marketAddress!).methods.numTickets(index).call(),
              genMarket(currentProject?.marketAddress!).methods.ticketsPurchased(index).call(),
              genMarket(currentProject?.marketAddress!).methods.prices(index).call(),
            ])

            try {
              isEnableUSDT = await Promise.resolve(
                genMarket(currentProject?.marketAddress!).methods.enableUsdt().call()
              )
            } catch (err) {
              console.log("error occured to get isEnableUSDT", err);
            }

            if (isEnableUSDT)
            {
              try {
                usdtAccountAddress = await Promise.resolve(
                  genMarket(currentProject?.marketAddress!).methods.usdt().call()
                )
                const usdtMarket = await getContract(usdtAccountAddress, USDT_ABI, library!, account!)
                getUSDTDecimals = await usdtMarket.decimals()
                console.log("usdtAccountAddress + getUSDTDecimals", usdtAccountAddress, getUSDTDecimals);
              } catch (err) {
                console.log("error occured to get usdtAccountAddress and getUSDTDecimals", err);
              }
            }

            // Progs : If decided to goes forward with USDT Buy Now instead of Normal buy now then open this code from commenting and comment below code
            
            price = isEnableUSDT ? formatUnits(price, Number(getUSDTDecimals)) : formatEther(price)
            console.log("prices---->", price);
            // Progs : If decided to goes forward with normal buy instead of USDT then open this code from commenting and comment above code
            // price = formatEther(price)

          } else if (currentProject?.ticketData !== undefined) {
            numTickets = currentProject?.ticketData[index].numTickets
            ticketsPurchased = currentProject?.ticketData[index].ticketsPurchased
            price = currentProject?.ticketData[index].price
          } else {
            numTickets = 0
            ticketsPurchased = 0
            price = 0
          }

          return {
            index: index,
            src: ticketMeta.image,
            name: ticketMeta.name,
            balance: balance,
            description: ticketMeta.description,
            total: ticketNums.numTickets,
            remain: '' + (parseInt(numTickets) - parseInt(ticketsPurchased)),
            price: price
          } as Card
        } catch (err) {
          return {} as Card;
        }
      })
    const tickets = await Promise.all(ticketPromises)
    await asyncSleep(500)
    setListCard(tickets.filter((ticket) => Object.keys(ticket).length > 0))
  }

  useEffect(() => {
    getCardData()
  }, [currentProject])
  return (
    <div className="buy-nfts">
      {!listCard ?
        <div className="loading-wrapper">
          <img
            className="loading-icon"
            src="/images/icons/loading.svg"
            alt="loading"
          />
        </div>
        :
        <div>
          <GridCard
            reload={getCardData}
            cards={listCard}
            currentProject={currentProject!}
            past={currentProject!.isPast === undefined ? false : true} />
          <div className="audit-container">
            <a target={"_blank"} href={"https://github.com/GenesisShards/Resources/blob/main/Smart%20contract%20Audit%20%20Results%20-%20Genshards.pdf"} className="audit-message">Audited by Sentnl</a>
          </div>
        </div>
      }
    </div>
  )
}