import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'
import lists from './lists/reducer'
import multicall from './multicall/reducer'
import application from './application/reducer'
import ticket from './ticket/reducer'
import dashboard from './ticket/reducer_dashboard'
import user from './user/reducer'
import transactions from './transactions/reducer'
import market from './market/reducer'
import token from './tokens/reducer'

const PERSISTED_KEYS: string[] = ['lists', 'user', 'ticket', 'transactions', 'market', 'token']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    ticket,
    multicall,
    lists,
    dashboard,
    market,
    token
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  // preloadedState: load({ states: PERSISTED_KEYS }),  // removing preloadedState for now
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
