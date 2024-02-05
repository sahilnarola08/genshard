import {
  Currency,
  Token,
  ETHER,
  CurrencyAmount,
  currencyEquals, JSBI, TokenAmount, ChainId,
} from '@uniswap/sdk'
import React, {
  CSSProperties,
  MutableRefObject,
  useMemo,
  useCallback,
  memo
} from 'react'
import styled, { useTheme } from 'styled-components'
import { useActiveWeb3React } from '../../../../../hooks/web3'
import { useCombinedActiveList } from '../../../../../state/lists/hooks'
import { WrappedTokenInfo } from '../../../../../state/lists/types'
import { useCurrencyBalance } from '../../../../../state/wallet/hooks'
import { wrappedCurrency } from '../../../../../utils/wrappedCurrency'
import Column from '../../../../../shared/components/Column'
import CurrencyLogo from '../CurrencyLogo'
import { MenuItem } from '../styleds'
import { Text } from 'rebass'
import { RowBetween, RowFixed } from '../../../../../shared/components/Row'
import Loader from '../../../../../shared/components/Loader'
import { areEqual, FixedSizeList } from 'react-window'
import {
  useAllInactiveTokens,
  useIsUserAddedToken,
} from '../../../../../hooks/tokens'
import TokenListLogo from '../../../../../images/tokenlist.svg'
import ImportRow from '../ImportRow'
import { LightGreyCard } from '../../../../../shared/components/Card'
import { TYPE } from '../../../../../theme'
import QuestionHelper from '../../../../../shared/components/QuestionHelper'
import { isTokenOnList } from '../../../../../utils'
import { Contract } from '@ethersproject/contracts'
import { ERC20_ABI } from '../../../../../constants/abis/erc20'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../../../../../constants/multicall'
import { Web3Provider } from '@ethersproject/providers'

function currencyKey(currency: Currency): string {
  return currency instanceof Token
    ? currency.address
    : currency === ETHER
    ? 'ETHER'
    : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const FixedContentRow = styled.div`
  box-sizing: border-box;
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(10)}
    </StyledBalanceText>
  )
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TokenListLogoWrapper = styled.img`
  height: 20px;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      {/* <MouseoverTooltip text={tag.description}> */}
      <Tag key={tag.id}>{tag.name}</Tag>
      {/* </MouseoverTooltip> */}
      {tags.length > 1 ? (
        // <MouseoverTooltip
        //   text={tags
        //     .slice(1)
        //     .map(({ name, description }) => `${name}: ${description}`)
        //     .join('; \n')}
        // >
        <Tag>...</Tag>
      ) : // </MouseoverTooltip>
      null}
    </TagContainer>
  )
}

interface CRIProps {
  currency: any
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  account?: string | null;
  library: Web3Provider;
  chainId?: ChainId;
}

interface CRIState {
  balance?: TokenAmount;
}

class CurrencyRowInner extends React.Component<CRIProps, CRIState> {
  state: CRIState = {}

  componentDidMount() {
    this.loadBalance();
  }

  loadBalance = async () => {
    const { currency, account, library, chainId } = this.props;
    if (!chainId || !account)
      return;
    let balance;
    if (currency === ETHER || currency.name=="BNB") {
      balance = JSBI.BigInt((await library.getBalance(account!)).toString())
    } else {
      const contract = new Contract(currency.address as string, ERC20_ABI, library);
      balance = JSBI.BigInt((await contract.balanceOf(account)).toString());
    }
    this.setState({
      balance: new TokenAmount(currency, balance),
    });
  }

  render() {
    const { currency, onSelect, isSelected, otherSelected, style, account } = this.props;
    const { balance } = this.state;
    const key = currencyKey(currency)
    return (
      <MenuItem
        style={style}
        className={`token-item-${key}`}
        onClick={() => (isSelected ? null : onSelect())}
        disabled={isSelected}
        selected={otherSelected}
      >
        <CurrencyLogo currency={currency} size={'24px'} />
        <Column>
          <Text title={currency.name} fontWeight={500} color='#AFAFAF'>
            {currency.symbol}
          </Text>

          <TYPE.darkGray ml="0px" fontSize={'12px'} fontWeight={300}>
            {currency.name}{' '}
            {/* {!isOnSelectedList && customAdded && '• Added by user'} */}
          </TYPE.darkGray>
        </Column>
        <TokenTags currency={currency} />

        <RowFixed style={{ justifySelf: 'flex-end' }}>
          {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
        </RowFixed>
      </MenuItem>
    )
  }
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: any
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  // const selectedTokenList = useCombinedActiveList()
  // const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  // const customAdded = useIsUserAddedToken(currency)
  // const balance = useCurrencyBalance(account ?? undefined, currency)
  const { account, library, chainId } = useActiveWeb3React()
  return <CurrencyRowInner
    currency={currency} 
    onSelect={onSelect} 
    isSelected={isSelected} 
    otherSelected={otherSelected}
    style={style}
    account={account}
    library={library!}
    chainId={chainId as ChainId}
  />;
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  // showImportView,
  // setImportToken,
  breakIndex,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  // showImportView: () => void
  // setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  //todo add bsc switch eugen



  // const itemData: (Currency | undefined)[] = useMemo(() => {
  //   let formatted: (Currency | undefined)[] = showETH
  //     ? [Currency.ETHER, ...currencies]
  //     : currencies
  //   if (breakIndex !== undefined) {
  //     formatted = [
  //       ...formatted.slice(0, breakIndex),
  //       undefined,
  //       ...formatted.slice(breakIndex, formatted.length),
  //     ]
  //   }
  //   return formatted
  // }, [breakIndex, currencies, showETH])



  // console.log(itemData, 'item data')

  // const { chainId } = useActiveWeb3React()
  // const theme = useTheme()

  // const inactiveTokens: {
  //   [address: string]: Token
  // } = useAllInactiveTokens()

  const Row = memo(
    ({ data, index, style } : {data: any, index: number, style: any}) => {

      const currency: Currency = data[index]
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      )
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      )
      const handleSelect = () => onCurrencySelect(currency)

      // const token = wrappedCurrency(currency, chainId)
      // const showImport =
      //   inactiveTokens &&
      //   token &&
      //   Object.keys(inactiveTokens).includes(token.address)

      // if (index === breakIndex || !data) {
      //   return (
      //     <FixedContentRow style={style}>
      //       <LightGreyCard padding="8px 12px" borderRadius="8px">
      //         <RowBetween>
      //           <RowFixed>
      //             <TokenListLogoWrapper src={TokenListLogo} />
      //             <TYPE.main ml="6px" fontSize="12px">
      //               Expanded results from inactive Token Lists
      //             </TYPE.main>
      //           </RowFixed>
      //           <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
      //         </RowBetween>
      //       </LightGreyCard>
      //     </FixedContentRow>
      //   )
      // }

   
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          /> 
          
        )
      
    }, areEqual

  )

  // const itemKey = useCallback(
  //   (index: number, data: any) => currencyKey(data[index]),
  //   []
  // )

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={currencies}
      itemCount={currencies.length}
      itemSize={56}
      // itemKey={itemKey} //list doesn't update with this
    >
      {Row}
    </FixedSizeList>
  )
}
