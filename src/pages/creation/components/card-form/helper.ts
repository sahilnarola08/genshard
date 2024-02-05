import { CardDto } from './types'

export const createCardArray = (length: number) =>
  new Array(length).fill(undefined).map((item, index) => new CardDto(index + 1))

export const createEmptySlotArray = (length: number) =>
  new Array(length).fill(undefined)
