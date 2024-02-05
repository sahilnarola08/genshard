import { createAction } from '@reduxjs/toolkit'
import {Project} from './types'

export const addTicket = createAction<{
  hash: string
}>('generation/addTicket')

export const addGenTicket = createAction<{
  hash: string
}>('generation/addGenTicket')

export const genTicketSuccess = createAction<{
  genTicket: string
}>('generation/genTicketSuccess')

export const setGenDate = createAction<{
  genDate: number
}>('generation/setGenDate')

export const genTicketDateConfirmed = createAction(
  'generation/genTicketDateConfirmed'
)

export const clearGenTicketData = createAction<void>(
  'generation/clearGenTicketData'
)

export const approveDeposit = createAction<{
  ticket: string
}>('generation/approveDeposit')

export const approveIssue = createAction<{
  ticket: string
}>('generation/approveIssue')

export const approveIssueConfirmed = createAction(
  'generation/approveIssueConfirmed'
)
export const approveDepositConfirmed = createAction(
  'generation/approveDepositConfirmed'
)

export const setCurrentProject = createAction<Project>(
  'dashboard/setCurrentProject'
)

export const setCurrentProjectType = createAction<String>(
  'dashboard/setCurrentProjectType'
)

export const updateCurrentProject = createAction<string>(
  'dashboard/updateCurrentProject'
)
