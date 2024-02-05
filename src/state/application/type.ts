import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import {NetworkSymbol} from "../../connectors";
import { KYC_STATUS } from './reducer'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
        description?: string 
        withExternalLink?: boolean
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  // SETTINGS,
  // SELF_CLAIM,
  // ADDRESS_CLAIM,
  // CLAIM_POPUP,
  // MENU,
  // DELEGATE,
  // VOTE,
}

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly network: NetworkSymbol
  readonly kyc_status: KYC_STATUS
}

type PopupList = Array<{
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}>
