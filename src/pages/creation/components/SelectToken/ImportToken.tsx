import React, { useState } from 'react'
import { Token, Currency } from '@uniswap/sdk'
import styled from 'styled-components'
import { ArrowLeft, AlertTriangle } from 'react-feather'
import { transparentize } from 'polished'
import { PaddedColumn, Checkbox } from './styleds'
import useTheme from '../../../../hooks/useTheme'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useCombinedInactiveList } from '../../../../state/lists/hooks'
import {
  AutoRow,
  RowBetween,
  RowFixed,
  SectionBreak,
} from '../../../../shared/components/Row'
import { CloseIcon, ExternalLink, TYPE } from '../../../../theme'
import Card from '../../../../shared/components/Card'
import { AutoColumn } from '../../../../shared/components/Column'
import { getEtherscanLink } from '../../../../utils'
import ListLogo from '../../../../shared/components/ListLogo'
import { ButtonPrimary } from './Button'
import CurrencyLogo from './CurrencyLogo'
import { useAddUserToken } from '../../../../state/user/hooks'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  background-color: ${({ theme, highWarning }) =>
    highWarning
      ? transparentize(0.8, theme.red1)
      : transparentize(0.8, theme.yellow2)};
  width: fit-content;
`

const AddressText = styled(TYPE.blue)`
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`}
`

interface ImportProps {
  tokens: Token[]
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Currency) => void
}

export function ImportToken({
  tokens,
  onBack,
  onDismiss,
  handleCurrencySelect,
}: ImportProps) {
  const theme = useTheme()

  const { chainId } = useActiveWeb3React()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]?.list) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address]?.list)

  return (
    <Wrapper>
      <PaddedColumn
        gap="14px"
        style={{ width: '100%', flex: '1 1', boxSizing: 'border-box' }}
      >
        <RowBetween>
          {onBack ? (
            <ArrowLeft style={{ cursor: 'pointer' }} onClick={onBack} />
          ) : (
            <div></div>
          )}
          <TYPE.mediumHeader>
            Import {tokens.length > 1 ? 'Tokens' : 'Token'}
          </TYPE.mediumHeader>
          {onDismiss ? <CloseIcon onClick={onDismiss} /> : <div></div>}
        </RowBetween>
      </PaddedColumn>

      <SectionBreak />

      <PaddedColumn gap="md" style={{ boxSizing: 'border-box' }}>
        {tokens.map((token) => {
          const list =
            chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
          return (
            <Card
              backgroundColor={theme.bg2}
              key={'import' + token.address}
              className=".token-warning-container"
            >
              <AutoColumn gap="10px">
                <AutoRow align="center">
                  <CurrencyLogo currency={token} size={'24px'} />
                  <TYPE.body ml="8px" mr="8px" fontWeight={500}>
                    {token.symbol}
                  </TYPE.body>
                  <TYPE.darkGray fontWeight={300}>{token.name}</TYPE.darkGray>
                </AutoRow>
                {chainId && (
                  <ExternalLink
                    href={getEtherscanLink(chainId, token.address, 'address')}
                  >
                    <AddressText>{token.address}</AddressText>
                  </ExternalLink>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {list.logoURI && (
                      <ListLogo logoURI={list.logoURI} size="12px" />
                    )}
                    <TYPE.small ml="6px" color={theme.text3}>
                      via {list.name}
                    </TYPE.small>
                  </RowFixed>
                ) : (
                  <WarningWrapper
                    borderRadius="4px"
                    padding="4px"
                    highWarning={true}
                  >
                    <RowFixed>
                      <AlertTriangle stroke={theme.red1} size="10px" />
                      <TYPE.body
                        color={theme.red1}
                        ml="4px"
                        fontSize="10px"
                        fontWeight={500}
                      >
                        Unknown Source
                      </TYPE.body>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoColumn>
            </Card>
          )
        })}

        <Card
          style={{
            backgroundColor: fromLists
              ? transparentize(0.8, theme.yellow2)
              : transparentize(0.8, theme.red1),
          }}
        >
          <AutoColumn
            justify="center"
            style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}
          >
            <AlertTriangle
              stroke={fromLists ? theme.yellow2 : theme.red1}
              size={32}
            />
            <TYPE.body
              fontWeight={600}
              fontSize={20}
              color={fromLists ? theme.yellow2 : theme.red1}
            >
              Trade at your own risk!
            </TYPE.body>
          </AutoColumn>

          <AutoColumn
            style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}
          >
            <TYPE.body
              fontWeight={400}
              color={fromLists ? theme.yellow2 : theme.red1}
            >
              Anyone can create a token, including creating fake versions of
              existing tokens that claim to represent projects.
            </TYPE.body>
            <TYPE.body
              fontWeight={600}
              color={fromLists ? theme.yellow2 : theme.red1}
            >
              If you purchase this token, you may not be able to sell it back.
            </TYPE.body>
          </AutoColumn>
          <AutoRow
            justify="center"
            style={{ cursor: 'pointer' }}
            onClick={() => setConfirmed(!confirmed)}
          >
            <Checkbox
              className=".understand-checkbox"
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <TYPE.body
              ml="10px"
              fontSize="16px"
              color={fromLists ? theme.yellow2 : theme.red1}
              fontWeight={500}
            >
              I understand
            </TYPE.body>
          </AutoRow>
        </Card>
        <ButtonPrimary
          disabled={!confirmed}
          altDisabledStyle={true}
          borderRadius="20px"
          padding="10px 1rem"
          onClick={() => {
            tokens.map((token) => addToken(token))
            handleCurrencySelect && handleCurrencySelect(tokens[0])
          }}
          className=".token-dismiss-button"
        >
          Import
        </ButtonPrimary>
      </PaddedColumn>
    </Wrapper>
  )
}
