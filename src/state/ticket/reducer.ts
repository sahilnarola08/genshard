import { createReducer } from '@reduxjs/toolkit'
import { GenerationState, TransactionStatus } from './types'
import {
  genTicketSuccess,
  addTicket,
  setGenDate,
  clearGenTicketData,
  genTicketDateConfirmed,
  addGenTicket,
  approveDeposit,
  approveIssue,
  approveIssueConfirmed,
  approveDepositConfirmed,
  updateCurrentProject,
} from './actions'

export const initialState: GenerationState = {
  lockTicket: undefined,
  genTicket: undefined,
  genTokenDate: undefined,
  approveDeposit: undefined,
  approveAndIssue: undefined,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(addTicket, (state, { payload: { hash } }) => {
      state.lockTicket = {
        hash,
        status: TransactionStatus.WAIT,
      }
    })
    .addCase(addGenTicket, (state, { payload: { hash } }) => {
      state.genTicket = {
        hash,
        status: TransactionStatus.WAIT,
      }
    })
    .addCase(genTicketSuccess, (state, { payload: { genTicket } }) => {
      if (!state.lockTicket) {
        throw Error('Lock Ticket has not existing on redux state')
      }

      state.genTicket = {
        hash: genTicket,
        status: TransactionStatus.NOTHING,
      }
      state.lockTicket.status = TransactionStatus.SUCCESS
    })
    .addCase(setGenDate, (state, { payload: { genDate } }) => {
      if (!genDate) {
        throw Error('genDate can not empty')
      }

      state.genTokenDate = genDate
    })
    .addCase(genTicketDateConfirmed, (state) => {
      if (state.genTicket !== undefined) {
        state.genTicket!.status = TransactionStatus.SUCCESS
      }
    })
    .addCase(approveDeposit, (state, { payload: { ticket } }) => {
      state.approveDeposit = {
        hash: ticket,
        status: TransactionStatus.WAIT,
      }
    })
    .addCase(approveIssue, (state, { payload: { ticket } }) => {
      state.approveAndIssue = {
        hash: ticket,
        status: TransactionStatus.WAIT,
      }
    })
    .addCase(approveIssueConfirmed, (state) => {
      state.approveAndIssue!.status = TransactionStatus.SUCCESS
    })
    .addCase(approveDepositConfirmed, (state) => {
      state.approveDeposit!.status = TransactionStatus.SUCCESS
    })
    .addCase(clearGenTicketData, (state) => {
      state.lockTicket = undefined
      state.genTicket = undefined
      state.approveAndIssue = undefined
      state.approveDeposit = undefined
      state.genTokenDate = undefined
    })
})
