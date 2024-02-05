import { useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import styled, { css } from 'styled-components'
import { useWalletModalToggle } from '../../../../../state/application/hooks'
import Button from '../../../buttons'
import { ButtonSecondary } from '../../../UniButton'
import WalletModal from '../wallet-modal'
import { Activity } from 'react-feather'
import useENSName from '../../../../../hooks/useENSName'
import { shortenAddress } from '../../../../../utils'
import {
  isTransactionRecent,
  useAllTransactions,
} from '../../../../../state/transactions/hooks'
import { useMemo } from 'react'
import { TransactionDetails } from '../../../../../state/transactions/reducer'
import Identicon from '../Identicon'
import { injected } from '../../../../../connectors'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useHasSocks } from '../../../../../hooks/useSocksBalance'
import { RowBetween } from '../../../Row'
import Loader from '../../../Loader'
import { NetworkContextName } from '../../../../../constants'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) =>
    pending ? theme.primary1 : theme.bg2};
  border: 1px solid
    ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) =>
      pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2)};

    :focus {
      border: 1px solid
        ${({ pending, theme }) =>
          pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3)};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
)
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  }
  return null
}
function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const toggleWalletModal = useWalletModalToggle()
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()

  if (account) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            <Text>{ENSName || `${shortenAddress(account)}`}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} />
        )}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <>
        <p style={{ color: 'red' }}>Error</p>
      </>
    )
  } else {
    return (
      <Button
        onClick={toggleWalletModal}
        style={{ textTransform: 'uppercase', margin: 0, color: "#fff" }}
        className="outline--highlight large"
      >
        Connect Wallet
      </Button>
    )
  }
}

const Web3Status = () => {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <div>
      <Web3StatusInner />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </div>
  )
}

export default Web3Status
