import { createReducer, nanoid } from '@reduxjs/toolkit'
import { string } from 'yup/lib/locale'
import {
  updateBlockNumber,
  setOpenModal,
  addPopup,
  removePopup,
  changeNetwork,
  changeKYC
} from './actions'
import { ApplicationState } from './type'
import {NetworkSymbol, NetworkSymbolAndId} from "../../connectors";

export enum KYC_STATUS {
  VERIFIED="KYC Verified",
  NOT_VERIFIED="KYC Not Verified",
  NOT_SET="Loading..."
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  network: NetworkSymbol.ETH,
  kyc_status: KYC_STATUS.NOT_SET
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId]
        )
      }
    })
    .addCase(changeKYC, (state, action) => {
      state.kyc_status = action.payload
    })
     .addCase(changeNetwork, (state, action) => {
      const {network, chainId} = action.payload;
      if (network === state.network) {
        return
      }
      if(!chainId){
        state.network = network
      } else {
        state.network = NetworkSymbolAndId[chainId]
      }
      
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
    .addCase(
      addPopup,
      (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
        state.popupList = (key
          ? state.popupList.filter((popup) => popup.key !== key)
          : state.popupList
        ).concat([
          {
            key: key || nanoid(),
            show: true,
            content,
            removeAfterMs,
          },
        ])
      }
    )
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
