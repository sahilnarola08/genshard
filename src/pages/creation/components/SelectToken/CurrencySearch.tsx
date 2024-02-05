import { Currency, ETHER, Token } from '@uniswap/sdk'
import {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../../../hooks/web3'
import {
  useAllTokens,
  useToken,
  useIsUserAddedToken,
  // useFoundOnInactiveList, eugen
} from '../../../../hooks/tokens'
import { CloseIcon, TYPE } from '../../../../theme'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
// import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import styled from 'styled-components'
import ImportRow from './ImportRow'
import { isAddress } from '../../../../utils'
import Row, { RowBetween } from '../../../../shared/components/Row'
import Column from '../../../../shared/components/Column'
import { useOnClickOutside } from '../../../../hooks/useOnClickOutside'
import useToggle from '../../../../hooks/useToggle'
import useTheme from '../../../../hooks/useTheme'
import useDebounce from '../../../../utils/useDebounce'
import AutoSizer from 'react-virtualized-auto-sizer'
import {DEFAULT_ETH_LIST} from '../../../../constants/list/eth_default_list'
import {BSC_LIST} from '../../../../constants/list/bsc_list'
import {MATIC_LIST} from "../../../../constants/list/default-tokenlist-matic";
import {GOERLI_LIST} from "../../../../constants/list/gorli_list";
import {MUMBAI_LIST} from "../../../../constants/list/mumbai_list";
import {HARMONY_LIST} from "../../../../constants/list/harmony_list";
import {AVALANCHE_LIST} from "../../../../constants/list/avalanche_list";
import {IOTEX_LIST} from "../../../../constants/list/iotex_list";
import {IOTEX_TESTNET_LIST} from "../../../../constants/list/iotex_testnet_list";
import {HARMONY_TESTNET_LIST} from "../../../../constants/list/harmony_testnet_list";
import {AVALANCHE_TESTNET_LIST} from "../../../../constants/list/avalanche_testnet_list";
import {BSC_TESTNET_LIST} from "../../../../constants/list/bsc_testnet_list";
import { TokenInfo } from '@uniswap/token-lists'
import {Contract} from "@ethersproject/contracts";
import {ERC20_ABI} from "../../../../constants/abis/erc20";

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${({ theme }) => theme.bg1};
  border-top: 1px solid ${({ theme }) => theme.bg2};
`
interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
                                 selectedCurrency,
                                 onCurrencySelect,
                                 otherSelectedCurrency,
                                 showCommonBases,
                                 onDismiss,
                                 isOpen,
                               }: CurrencySearchProps) {
  const { chainId, account, library } = useActiveWeb3React()
  const theme = useTheme()
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [defaultList, setDefaultList] = useState<TokenInfo[]>(DEFAULT_ETH_LIST)
  const [searchedToken, setSearchedToken] = useState<TokenInfo[]>([])
  const debouncedQuery = useDebounce(searchQuery, 200)
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)


  useEffect(() => {
    if(isAddressSearch)  loadToken(isAddressSearch as string).then((res) => {
      setSearchedToken(res)
    })
  }, [isAddressSearch])



  //switch list
  useEffect(() => {
    
    if (chainId == 4689) {
      setDefaultList(IOTEX_LIST)
    } else if (chainId == 1666600000) {
      setDefaultList(HARMONY_LIST)
    } else if (chainId == 43114) {
      setDefaultList(AVALANCHE_LIST)
    } else if (chainId == 56) {
      setDefaultList(BSC_LIST)
    } else if (chainId == 137) {
      setDefaultList(MATIC_LIST)
    } else if (chainId == 80001) {
      setDefaultList(MUMBAI_LIST)
    } else if (chainId == 5) {
      setDefaultList(GOERLI_LIST)
    } else if (chainId == 4690) {
      setDefaultList(IOTEX_TESTNET_LIST)
    } else if (chainId == 1666700000) {
      setDefaultList(HARMONY_TESTNET_LIST)
    } else if (chainId == 43113) {
      setDefaultList(AVALANCHE_TESTNET_LIST)
    } else if (chainId == 97) {
      setDefaultList(BSC_TESTNET_LIST)
    } else if (chainId == 1) {
      setDefaultList(DEFAULT_ETH_LIST)
    }

  }, [chainId])

  const loadToken = async (isAddressSearch : string) => {
    
    let chainURL = chainId === 56 ? 'bscscan.com' : chainId === 137 ? 'polygonscan.com' : chainId === 4689 ? 'iotexscan.io' : chainId === 1666600000 ? 'explorer.harmony.one' : chainId === 43114 ? 'snowtrace.io' : chainId === 4 ? 'etherscan.io' : chainId === 80001 ? 'mumbai.polygonscan.com' : chainId === 4690 ? 'testnet.iotexscan.io' : chainId === 1666700000 ? 'explorer.pops.one' : chainId === 43113 ? 'testnet.snowtrace.io' : 'etherscan.io'
  
    try {
      const token = [{
        symbol: '',
        name: '',
        chainId: chainId,
        address: isAddressSearch as string,
        decimals: 18,
        logoURI: "https://" + chainURL + "/images/main/empty-token.png"
      }]

      const contract = new Contract(isAddressSearch as string, ERC20_ABI, library);
      let getDecimals = await contract.decimals()
      let symbol = await contract.symbol();
      let name = await contract.name();

      token[0].symbol = symbol;
      token[0].name = name;
      token[0].decimals = getDecimals;

      return token as TokenInfo[];

    } catch (err) {
      return []
    }
  }

  const allTokens = useAllTokens();
  const filteredTokens = useMemo(() => {
   
    console.log('isAddressSearch + chainId', isAddressSearch, chainId);
    
    // if(isAddressSearch) {
    //   return searchToken ? [searchToken] : []
    // }

    if (isAddressSearch && (chainId!==1 && chainId!==4) ) { 
      return searchedToken; 
    } else if(isAddressSearch) {
      return searchToken ? [searchToken] : [] 
    }

    return filterTokens(Object.values(defaultList), debouncedQuery)
  }, [ debouncedQuery, defaultList, searchToken, isAddressSearch, searchedToken])

  // const filteredSortedTokens = useSortedTokensByQuery(
  //   sortedTokens,
  //   debouncedQuery
  // )


  const handleCurrencySelect = useCallback(
      (currency: Currency) => {
        console.log('selected option', currency)
        onCurrencySelect(currency)
        onDismiss()
      },
      [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // const inputRef = useRef<HTMLInputElement>()


  const handleInput = useCallback((event) => {
    const input = event.target.value
    // const checksummedInput = isAddress(input)
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])


  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if(chainId!==1 && chainId!==4) return false //if others network
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const handleEnter = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          const s = debouncedQuery.toLowerCase().trim()
          if (s === 'eth') {
            handleCurrencySelect(ETHER)
          } else if (filteredTokens.length > 0) {
            if (
                filteredTokens[0].symbol?.toLowerCase() ===
                debouncedQuery.trim().toLowerCase() ||
                filteredTokens.length === 1
            ) {
              handleCurrencySelect(filteredTokens[0])
            }
          }
        }
      },
      [handleCurrencySelect, debouncedQuery]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)


  return (
      <ContentWrapper>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} textAlign="center" fontSize={16} color="#AFAFAF">
              SELECT A TOKEN
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>

          <Row>
            <SearchInput
                type="text"
                id="token-search-input"
                placeholder="Search name or paste address"
                autoComplete="off"
                value={searchQuery}
                // ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
            />
          </Row>

          {/* {showCommonBases && (
          <>
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            // selectedCurrency={selectedCurrency}
          />
          </>
        )} */}
        </PaddedColumn>
        <Separator />


        {filteredTokens?.length > 0 || isAddressSearch ? (
            <div style={{ flex: '1' }}>
              <AutoSizer disableWidth>
                {({ height }: any) => (
                    <CurrencyList
                        height={height}
                        showETH={showETH}
                        currencies={filteredTokens}
                        breakIndex={undefined //break index for manage button
                        }
                        onCurrencySelect={handleCurrencySelect}
                        otherCurrency={otherSelectedCurrency}
                        // selectedCurrency={selectedCurrency}
                        fixedListRef={fixedList}

                    />
                )}
              </AutoSizer>
            </div>
        ) : (
            <Column style={{ padding: '20px', height: '100%' }}>
              <TYPE.main color={theme.text3} textAlign="center" mb="20px">
                No results found.
              </TYPE.main>
            </Column>
        )}

      </ContentWrapper>
  )
}
