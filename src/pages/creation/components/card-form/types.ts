import { Currency, Token } from '@uniswap/sdk'
import { CardModalState } from '../card-modal/types'

export enum ICardFormFields {
  modalIndex = 'modalIndex',
  token = 'token',
  numberOfTypes = 'numberOfTypes',
  designable = 'designable',
  designUri = 'designUri',
  cards = 'cards',
  totalNumberOfTranches = 'totalNumberOfTranches'
}



export interface ICardFormState {
  [ICardFormFields.modalIndex]: number
  [ICardFormFields.token]: any
  [ICardFormFields.numberOfTypes]: number
  [ICardFormFields.designable]: boolean
  [ICardFormFields.designUri]: string
  [ICardFormFields.cards]: CardDto[]
  [ICardFormFields.totalNumberOfTranches] : number
}

export class CardDto extends CardModalState {
  index: number
  defineVesting: boolean
  number: string | undefined
  size: string | undefined

  constructor(index: number) {
    super()
    this.index = index
    this.defineVesting = false
    this.number = ''
    this.size = ''
  }
}

export enum CardType {
  CREATION = 'CREATION',
  DASHBOARD_VIEW = 'DASHBOARD_VIEW'
}
