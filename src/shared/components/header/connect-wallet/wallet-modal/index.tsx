import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core'
import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useModalOpen, useWalletModalToggle,} from '../../../../../state/application/hooks'
import Modal from '../../../../components/UniModal'
import {ReactComponent as Close} from '../../../../../images/x.svg'
import {AbstractConnector} from '@web3-react/abstract-connector'
import usePrevious from '../../../../../hooks/usePrevious'
import {ExternalLink} from '../../../../../theme'
import PendingView from './PendingView'
import {SUPPORTED_WALLETS} from '../../../../../constants'
import Option from './Option'
import MetamaskIcon from '../../../../../images/metamask.png'
import WalletConnectIcon from '../../../../../images/walletConnectIcon.svg'
import AccountDetails from '../account-details'
import {ApplicationModal} from '../../../../../state/application/type'
import {isMobile} from 'react-device-detect'
import {useSelector} from 'react-redux'
import {AppState} from '../../../../../state'
import {NetworkSymbol} from "../../../../../connectors";

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) =>
    props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit'};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

const WalletModal = ({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) => {
  const { active, account, connector, activate, error } = useWeb3React()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const network = useSelector((state: AppState) => state.application.network)
  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >()

  const [pendingError, setPendingError] = useState<boolean>()

  const previousAccount = usePrevious(account)

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ])
    const { ethereum } = window as any

  const tryActivation = async (connector: AbstractConnector | undefined) => {


    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    if(connector) {
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          // activate(connector) // a little janky...can't use setError because the connector isn't set
          ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Matic Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: [process.env.REACT_APP_MATIC_URL!],
              blockExplorerUrls: ['https://polygonscan.com/']
            }]
          })



        } else {
          setPendingError(true)
        }
      })
  }
}


  function getOption() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    const optionMetaMask = SUPPORTED_WALLETS.METAMASK
    const optionMobile = SUPPORTED_WALLETS.WALLET_CONNECT
    if (isMobile) {
      if (!window.web3 && !window.ethereum && optionMobile.mobile) {
        return (
          <Option
            onClick={() => {
              optionMobile.connector !== connector &&
                !optionMobile.href &&
                tryActivation(optionMobile.connector)
            }}
            id={`connect`}
            key={0}
            active={
              optionMobile.connector && optionMobile.connector === connector
            }
            color={optionMobile.color}
            link={optionMobile.href}
            header={optionMobile.name}
            subheader={null}
            icon={WalletConnectIcon}
          />
        )
      }
      return null
    }
    if (!isMetamask) {
      return (
        <Option
          id={`connect`}
          key={0}
          color={'#E8831D'}
          header={'Install Metamask'}
          subheader={null}
          link={'https://metamask.io/'}
          icon={MetamaskIcon}
        />
      )
    }
    return (
      <Option
        id={`connect`}
        key={0}
        color={'#E8831D'}
        header={'Metamask'}
        subheader={null}
        link={null}
        icon={MetamaskIcon}
        onClick={() => {
          optionMetaMask.connector === connector
            ? setWalletView(WALLET_VIEWS.ACCOUNT)
            : tryActivation(optionMetaMask.connector)
        }}
      />
    )
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError
              ? 'Wrong Network'
              : 'Error connecting'}
          </HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please connect to the appropriate Ethereum network.</h5>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>

        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>Connect to a wallet</HoverText>
          </HeaderRow>
        )}

        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOption()}</OptionGrid>
          )}

          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <p style={{ color: "white", fontWeight: 400, marginBottom: "0px" }}>New to Ethereum? &nbsp;</p>{' '}
              <ExternalLink href="https://ethereum.org/wallets/">
                Learn more about wallets
              </ExternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}

export default WalletModal
