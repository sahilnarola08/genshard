export interface ICardModal {
  isOpen: boolean
  cardIndex: number
  initValue: CardModalState
  onClose: () => any
  onSubmited: (values: CardModalState) => any
  setCardValues?: (val?: any) => void
  formValues?: any;
  setFormValues?: (val?: any) => void
}

export enum CardModalStateFields {
  vestingNumber = 'vestingNumber',
  cliffNumber = 'cliffNumber',
  length = 'length',
  customRange = 'customRange',
}

export class CardModalState {
  [CardModalStateFields.vestingNumber]: string;
  [CardModalStateFields.cliffNumber]: string;
  [CardModalStateFields.length]: string;
  [CardModalStateFields.customRange]: any[];

  constructor() {
    this.vestingNumber = ''
    this.cliffNumber = ''
    this.length = ''
    this.customRange = []
  }
}
