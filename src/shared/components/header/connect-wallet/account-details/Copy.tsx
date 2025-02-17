import React from 'react'
import styled from 'styled-components'

// import {  } from 'react-feather'
import { LinkStyledButton } from '../../../../../theme'
import useCopyClipboard from '../../../../../hooks/useCopyClipboard'
import Copy from '../../../../../images/copy.svg';
import Checkcircle from '../../../../../images/check-circle.svg';

const CopyIcon = styled(LinkStyledButton)`
  color: white;
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          {/* <CheckCircle size={'16'} /> */}
          <img src={Checkcircle} alt="" />
          <TransactionStatusText style={{ color: "white"}}>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <img src={Copy} alt="" />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}
