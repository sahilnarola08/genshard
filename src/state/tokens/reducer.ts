import { saveTokenLikes } from './actions';
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
    tokenLikes: {}
}

export default createReducer(initialState, (builder) => {
    builder.addCase(saveTokenLikes, (state, { payload }) => {
        state.tokenLikes = {...state.tokenLikes, ...payload}
     })
})