import { createReducer } from '@reduxjs/toolkit'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import {
  DEFAULT_ACTIVE_LIST_URLS,
  DEFAULT_LIST_OF_LISTS,
} from '../../constants/list'
import { acceptListUpdate, fetchTokenList } from './actions'
import { ListsState, ListState } from './types'

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P]
}

const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,

  // init list url and add state object
  byUrl: DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState['byUrl']>>(
    (memo, listUrl) => {
      memo[listUrl] = new ListState()
      return memo
    },
    {}
  ),

  activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      fetchTokenList.pending,
      (state, { payload: { requestId, url } }) => {
        state.byUrl[url] = {
          ...state.byUrl[url],
          current: null,
          pendingUpdate: null,
          loadingRequestId: requestId,
          error: null,
        }
      }
    )
    .addCase(
      fetchTokenList.fulfilled,
      (state, { payload: { requestId, tokenList, url } }) => {
        const current = state.byUrl[url].current
        const loadingRequestId = state.byUrl[url]?.loadingRequestId

        if (current) {
          const upgradeType = getVersionUpgrade(
            current.version,
            tokenList.version
          )

          if (upgradeType === VersionUpgrade.NONE) return
          if (upgradeType === null || loadingRequestId === requestId) {
            state.byUrl[url] = {
              ...state.byUrl[url],
              loadingRequestId: null,
              error: null,
              current: current,
              // question: why tokenList
              pendingUpdate: tokenList,
            }
          }
        } else {
          if (
            DEFAULT_ACTIVE_LIST_URLS.includes(url) &&
            !state.activeListUrls?.includes(url)
          ) {
            state.activeListUrls?.push(url)
          }

          state.byUrl[url] = {
            ...state.byUrl[url],
            loadingRequestId: null,
            error: null,
            current: tokenList,
            pendingUpdate: null,
          }
        }
      }
    )
    .addCase(
      fetchTokenList.rejected,
      (state, { payload: { url, requestId, errorMessage } }) => {
        if (state.byUrl[url]?.loadingRequestId !== requestId) {
          // no-op since it's not the latest request
          return
        }

        state.byUrl[url] = {
          ...state.byUrl[url],
          loadingRequestId: null,
          error: errorMessage,
          current: null,
          pendingUpdate: null,
        }
      }
    )
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update')
      }

      state.byUrl[url] = {
        ...state.byUrl[url],
        pendingUpdate: null,
        current: state.byUrl[url].pendingUpdate,
      }
    })
)
