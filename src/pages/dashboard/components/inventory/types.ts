export interface ITicketVestingData {
  tranchePastCliff: number | undefined
  totalTranches: number | undefined
  lengthOfTranche: number | undefined
  lengthOfCliff: number | undefined
  // New
  arrayOfWeightages?: []
  arrayOfTranches?: []
}

export class InventoryTicketDto implements ITicketVestingData {
  name: string
  description: string
  image: string
  size: string
  number: string
  redeemableToken: string
  symbol: string
  generationDate: string
  tranchePastCliff: number | undefined
  totalTranches: number | undefined
  lengthOfTranche: number | undefined
  lengthOfCliff: number | undefined
  
  arrayOfWeightages?: []
  arrayOfTranches?: []
  // ticket index
  index: number
  price?: string | undefined

  constructor(
    ticketMeta: ITicketMeta,
    number: string,
    vestingData: ITicketVestingData | undefined,
    redeemableToken: string | undefined,
    index: number,
    price?: string | undefined
  ) {
    this.price = price
    // meta data
    this.name = ticketMeta?.name
    this.description = ticketMeta?.description
    this.image = ticketMeta?.image
    this.number = number || '0'
    this.redeemableToken = redeemableToken || ''
    this.index = index

    // vesting data
    const { tranchePastCliff, totalTranches, lengthOfTranche, lengthOfCliff, arrayOfTranches, arrayOfWeightages } =
      vestingData || {}
    this.tranchePastCliff = tranchePastCliff
    this.totalTranches = totalTranches
    this.lengthOfTranche = lengthOfTranche
    this.lengthOfCliff = lengthOfCliff
    // vesting data
    this.arrayOfWeightages = arrayOfWeightages
    this.arrayOfTranches = arrayOfTranches

    // set date time (unix)
    const generationDate = (ticketMeta?.attributes?.find(
      (attr) => attr.trait_type === 'TGE'
    ) as ITicketDetailAttribute)?.value
    this.generationDate = generationDate

    // set token
    const symbol = (ticketMeta?.attributes?.find(
      (attr) => attr.trait_type === 'Token'
    ) as ITicketDetailAttribute)?.value
    this.symbol = symbol

    // set size
    const size = (ticketMeta?.attributes?.find(
      (attr) => attr.trait_type === 'Size'
    ) as ITicketDetailAttribute)?.value
    this.size = size
  }

  get isEmpty() {
    return Number(this.number) === 0
  }
}

export interface ITicketDetailAttribute {
  trait_type: 'TGE' | 'Vesting' | 'Size' | 'Type' | 'Token'
  value: string
}

export interface ITicketMeta {
  name: string
  description: string
  image: string
  attributes: Array<ITicketDetailAttribute>
}
