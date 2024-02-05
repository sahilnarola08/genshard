import { createReducer } from '@reduxjs/toolkit'
import { ExtendedProject } from './types'
import {
    changeCurrentProject
} from './actions'

export const initialState: {currentProject?: ExtendedProject} = {}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(changeCurrentProject, (state, action) => {
      state.currentProject = action.payload
    })
})
