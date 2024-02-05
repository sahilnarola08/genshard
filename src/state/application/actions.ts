import { createAction } from '@reduxjs/toolkit'
import { KYC_STATUS } from './reducer'
import { ApplicationModal, PopupContent } from './type'
import {NetworkSymbol} from "../../connectors";

export const updateBlockNumber = createAction<{
  chainId: number
  blockNumber: number
}>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>(
  'application/setOpenModal'
)
export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{ key: string }>(
  'application/removePopup'
)

export const changeKYC = createAction<KYC_STATUS>('application/changeKYC')

export const changeNetwork = createAction<{ network: NetworkSymbol, chainId: any }>(
  'application/changeNetwork'
)