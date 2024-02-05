import { Currency, Token } from '@uniswap/sdk'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../../shared/components/buttons'
import CurrencyLogo from './CurrencyLogo'
import CurrencySearchModal from './CurrencySearchModal'
import { ReactComponent as DropDown } from '../../../../images/dropdown.svg'
import Web3ReactManager from '../../../../shared/components/Web3ReactManager'
import { wrappedCurrency } from '../../../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../../../hooks/web3'

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? '  margin: 0 0.25rem 0 0.75rem;'
      : '  margin: 0 0.25rem 0 0.25rem;'}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
  white-space: nowrap;
  overflow: hidden;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${(theme) => (theme as any).white};
    stroke-width: 1.5px;
  }
`

export default function SelectToken({ onSelectToken}: ISelectTokenProps) {
  const { chainId } = useActiveWeb3React()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [currency, setCurrency] = useState<Currency | null | undefined>()

  // for the select token
  const onCurrencySelect = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    // toggle()
    setIsOpenModal(false)

    const token = wrappedCurrency(newCurrency, chainId)
    onSelectToken(newCurrency as Token)
  }

  const onDismiss = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  const onOpen = useCallback(() => {
    setIsOpenModal(true)
  }, [])
  return (
    <>
      <Web3ReactManager>
        <CurrencySearchModal
          isOpen={isOpenModal}
          onDismiss={onDismiss}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
        />
      </Web3ReactManager>

      <Aligner>
        <Button
          type="button"
          onClick={onOpen}
          className="outline--highlight"
          style={{ minHeight: 42, color: 'black' }}
        >
          <Aligner>
            <CurrencyLogo currency={currency} size={'24px'} />
            <StyledTokenName
              className="token-symbol-container"
              active={Boolean(currency && currency.symbol)}
            >
              {(currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  '...' +
                  currency.symbol.slice(
                    currency.symbol.length - 5,
                    currency.symbol.length
                  )
                : currency?.symbol) || 'Select a token'}
            </StyledTokenName>
          </Aligner>
        </Button>

        <StyledDropDown selected={!!currency} />
      </Aligner>
    </>
  )
}

interface ISelectTokenProps {
  onSelectToken: (token: Token | undefined) => any
}