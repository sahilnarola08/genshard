import { createAction } from "@reduxjs/toolkit"

export const saveTokenLikes = createAction<{
    [tokensAddressWithTokenId: string]: number
}[]>("tokens/saveTokenLikes")