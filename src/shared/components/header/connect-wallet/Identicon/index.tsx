import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

import { useActiveWeb3React } from '../../../../../hooks/web3'
const jazzicon = require('jazzicon')

const StyledIdenticonContainer = styled.div`
  height: 0rem;
  margin-bottom: 1.5rem !important;
  border-radius: 1.125rem;
  margin-bottom: 5px;
  background-color: ${({ theme }) => theme.bg4};
`

export default function Identicon() {
  const ref = useRef<HTMLDivElement>()

  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer ref={ref as any} />
}
