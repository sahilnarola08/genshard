import { ChainId, Token } from '@uniswap/sdk'
import { TokenInfo, TokenList } from '@uniswap/token-lists/dist/types'
import { TagInfo } from './hooks'

export class ListState {
  current: TokenList | null
  pendingUpdate: TokenList | null
  loadingRequestId: string | null
  error: string | null

  constructor() {
    this.error = null
    this.current = null
    this.loadingRequestId = null
    this.pendingUpdate = null
  }
}

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: ListState
  }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[]

  // currently active lists
  readonly activeListUrls: string[] | undefined
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    )
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<
  {
    [chainId in ChainId]: Readonly<{
      [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
    }>
  }
>
