import { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../../hooks/web3'
import { AutoRow } from '../Row'
import { AutoColumn } from '../Column'
import { TYPE } from '../../../theme'
import { ExternalLink } from '../../../theme/components'
import { getEtherscanLink } from '../../../utils'
import { useSelector } from 'react-redux'
import {AppState} from '../../../state'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
  description,
  withExternalLink = true,
}: {
  hash: string
  success?: boolean
  summary?: string
  description?: string 
  withExternalLink?: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const network = useSelector((state: AppState) => state.application.network)

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <CheckCircle color={theme.green1} size={24} />
        ) : (
          <AlertCircle color={theme.red1} size={24} />
        )}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </TYPE.body>
        {withExternalLink && chainId && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
           View on {network == 'ETH' || network == 'GOERLI' ? 'EtherScan'
                    : network == 'BSC' || network == 'T-BSC' ? 'BscScan' 
                    : network == 'T-IoTeX' || network === 'IOTEX' ? 'IotexScan'
                    : network == 'T-HRMNY' || network === 'HARMONY' ? 'HarmonyOne'  
                    : network == 'T-AVALANCHE' || network === 'AVALANCHE' ? 'AvalancheScan'
                    : network == 'MATIC' || network == 'MUMBAI' ? 'PolygonScan' 
                    : ''
          }
          </ExternalLink>
        )}
        {description && (
          <TYPE.white fontSize={14}>{description}</TYPE.white>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
