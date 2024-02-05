import { TransactionResponse } from '@ethersproject/abstract-provider'
import { CardDto } from '../../pages/creation/components/card-form/types'
import { daysToSeconds } from '../../utils'

interface ITicketDetail {
  numTickets: number[]
  ticketSizes: number[]
  totalNumberOfTranches: number
  totalTranches: Array<number | null>
  cliffTranches: Array<number | null>
  trancheWeightages: Array<number | null>
  trancheLengths: Array<number | null>
}

const DEFAULT_TOTAL_TRANCHE = 1
const DEFAULT_CLIFF_TRANCHE = 0
const DEFAULT_TRANCHE_LENGTH = 0

export class GenTicketDto implements ITicketDetail {
  // token address
  underlyingToken: string

  uri: string | null

  // they are array
  numTickets: number[]
  ticketSizes: number[]
  totalNumberOfTranches: number
  totalTranches: Array<number | null>
  cliffTranches: Array<number | null>
  trancheWeightages: Array<number | null>
  trancheLengths: Array<number | null>

  constructor(
    underlyingToken: string,
    uri: string | undefined,
    totalNumberOfTranches: number,
    weight: [],
    days: [],
    cards: CardDto[]
  ) {
    this.underlyingToken = underlyingToken
    this.totalNumberOfTranches = totalNumberOfTranches
    this.trancheWeightages = weight
    this.trancheLengths = days //  daysToSeconds(Number(length))
    // handle convert cards to fields array
    const {
      numTickets,
      ticketSizes,
      totalTranches,
      cliffTranches,
      trancheWeightages,
      trancheLengths,
    } = cards.reduce<ITicketDetail>(
      (memo, card) => {

        const { number, size, vestingNumber, defineVesting, cliffNumber, length } = card
        
        // number and size is required fields
        if (!number || !size) {
          throw new Error('[GenTicketDto] get invalid number or size')
        }

        // prepare value if they have not fill yet
        // todo: min value vestingNumber = 1, right?
        const totalTranche = vestingNumber
          ? Number(vestingNumber)
          : DEFAULT_TOTAL_TRANCHE

          
        const cliffTranche = cliffNumber
          ? Number(cliffNumber)
          : DEFAULT_CLIFF_TRANCHE

        // don't forget convert to miliseconds
        const trancheLength = length
          ? daysToSeconds(Number(length))
          : DEFAULT_TRANCHE_LENGTH

        memo['numTickets'].push(Number(number))
        memo['ticketSizes'].push(Number(size))
        memo['totalTranches'].push(totalTranche)
        memo['cliffTranches'].push(cliffTranche)
        if (this.totalNumberOfTranches <= 0){
          memo['trancheLengths'].push(trancheLength)
        }

        return memo
      },
      {
        numTickets: [],
        ticketSizes: [],
        totalNumberOfTranches: 0,
        totalTranches: [],
        cliffTranches: [],
        trancheWeightages: [],
        trancheLengths: [],
      } as ITicketDetail
    )

    this.underlyingToken = underlyingToken
    this.uri = uri || null
    this.numTickets = numTickets
    this.totalNumberOfTranches = totalNumberOfTranches
    this.cliffTranches = cliffTranches
    this.ticketSizes = ticketSizes
    this.totalTranches = totalTranches
    this.trancheWeightages = weight //trancheWeightages
    this.trancheLengths = days //trancheLengths
  }
}

export interface TicketType {
  hash: string, 
  status: TransactionStatus
}

export enum TransactionStatus {
  WAIT,
  SUCCESS,
  FAIL,
  NOTHING
}

export interface GenerationState {
  lockTicket?: TicketType

  genTicket?: TicketType

  approveDeposit?: TicketType

  approveAndIssue?: TicketType

  genTokenDate: number | undefined
}

export interface Project {
  address: string
  name: string
  projectDuration?: string
  projectType?: string
}

export interface DashboardState {
  currentProject?: Project
  whitelist?: Project[]
  selectedProjectType?: String
}
