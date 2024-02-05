import './style.sass'
import dashboadrdImage from '../../../../images/dashboard.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import JSBI from 'jsbi'
import { useWeb3React } from '@web3-react/core'
import { BigintIsh, TokenAmount } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { BSC_LIST } from '../../../../constants/list/bsc_list'
import { DEFAULT_ETH_LIST } from '../../../../constants/list/eth_default_list'
import { GOERLI_LIST } from '../../../../constants/list/gorli_list'
import { MUMBAI_LIST } from '../../../../constants/list/mumbai_list'
import { HARMONY_LIST } from '../../../../constants/list/harmony_list'
import { AVALANCHE_LIST } from '../../../../constants/list/avalanche_list'
import { IOTEX_LIST } from '../../../../constants/list/iotex_list'
import { IOTEX_TESTNET_LIST } from "../../../../constants/list/iotex_testnet_list";
import { HARMONY_TESTNET_LIST } from "../../../../constants/list/harmony_testnet_list";
import { AVALANCHE_TESTNET_LIST } from "../../../../constants/list/avalanche_testnet_list";
import { BSC_TESTNET_LIST } from "../../../../constants/list/bsc_testnet_list";
import { MATIC_LIST } from '../../../../constants/list/default-tokenlist-matic'
import Deshboardround from '../../../../images/deshboardround.svg';

import {
  useGetTotalTicketsHeld,
  useGetTotalValueHeld,
  usePolling,
} from '../../../../state/ticket/hooks'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { ERC20_ABI } from '../../../../constants/abis/erc20'
import { Contract } from 'ethers'
import AccessPoolRedirect from '../../../../shared/components/AccessPoolRedirect'

interface IBalance {
  totalTicketHeld: string
  totalValueHeld: string
}

const jazzicon = require('jazzicon')
const AccountDetail = () => {
  const ref = useRef<HTMLDivElement>()
  const getTotalTicketsHeld = useGetTotalTicketsHeld()
  const getTotalValueHeld = useGetTotalValueHeld()
  const { account, chainId, library } = useWeb3React()
  const network = useSelector((state: AppState) => state.application.network)

  const [balances, setBalances] = useState<IBalance>({
    totalTicketHeld: '...',
    totalValueHeld: '...',
  })
  const [balance, setBalance] = useState<any>()
  const [defaultList, setDefaultList] = useState<TokenInfo[]>(DEFAULT_ETH_LIST)

  const handleFetchData = useCallback(async () => {
    const [totalTicketHeld, totalValueHeld] = await Promise.all([
      getTotalTicketsHeld(),
      getTotalValueHeld(),
    ]).then((balances) => {
      return balances.map((balance) => balance ?? '...')
    })

    setBalances({
      totalTicketHeld,
      totalValueHeld,
    })
  }, [getTotalTicketsHeld, getTotalValueHeld])

  // polling callback helper fetch data
  /*usePolling(
    handleFetchData as () => Promise<void>,
    INTERVAL_FETCH_TIME,
    account,
    chainId,
    library
  )*/

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(jazzicon(88, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  const loadBalance = async () => {
    if (!chainId || !account)
      return;

    console.log('dl', defaultList)
    const GSValue = defaultList.find(({ name }) => name === 'Genesis Shards') ?? null;
    console.log('GSValue.address ', GSValue?.address);

    try {
      if (GSValue?.address) {
        if (chainId == 56 || chainId == 1 || chainId == 80001 || chainId == 4 || chainId == 4690 || chainId == 97 || chainId == 43113 || chainId == 1666700000) {
          const contract = new Contract(GSValue.address as string, ERC20_ABI, library);
          console.log('contract', contract);
          const balance = JSBI.BigInt((await contract.balanceOf(account)).toString());
          console.log('balance: ', ((await contract.balanceOf(account)).toString()));
          setBalance(new TokenAmount(GSValue as any, balance));
        } else {
          setBalance(0);
        }
      } else {
        console.log('else block');
        setBalance(0);
      }
    } catch (err) {
      console.log('err --->', err)
      setBalance(0);
    }
  }

  useEffect(() => {
    // console.log('ChainID : ???', chainId);
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

  }, [chainId, network, account])

  useEffect(() => {
    loadBalance();
  }, [defaultList]);

  return (
    <div className="acc-connected">
      <div>
        {/* account logo */}
        <div className="acc-connected__header">
          <div className="acc-connected--logo">
            {account ? <div><img src={Deshboardround} alt="" /></div> : <span></span>}
          </div>
          <div className="acc-connected--title">
            User's account connected
          </div>
        </div>

        {/* account detail */}
        <div className="acc-connected__held">
          <div className="hr-image"></div>
          <div className="total-held">
            {/* <div className="total-value-held total-held-grid">
              <div className="total-value-held__title">Total Value Held :</div>
              <div className="total-held-grid__value">
                {balances.totalValueHeld}
              </div>
            </div>
            <div className="total-tickets-held total-held-grid">
              <div className="total-tickets-held__title">
                Total Tickets Held :
              </div>
              <div className="total-held-grid__value">
                {balances.totalTicketHeld}
              </div>
            </div> */}
            <div className="total-value-held total-held-grid">
              <div className="total-value-held__title">Total GS Held :</div>
              <div className="total-held-grid__value">
                {account && (balance?.toSignificant?.(10) ?? 0)} GS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* dashboad image */}
      <div className="acc-connected__image">
        <img src={dashboadrdImage} />
      </div>
      <div className="access-dashboard-redirect">
        <AccessPoolRedirect />
      </div>
    </div>
  )
}

export default AccountDetail
