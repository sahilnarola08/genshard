import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect } from 'react'
import { injected } from '../../../../../connectors'
import { useEagerConnect, useInactiveListener } from '../../../../../hooks/web3'
import Button from '../../../buttons'

export default function ConnectButton() {
  const context = useWeb3React()
  const { library, account, activate } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const onClick = useCallback(() => {
    setActivatingConnector(injected)
    activate(injected)
  }, [])

  // useEffect(() => {
  //   console.log(library)
  // }, [account, library])

  return (
    <>
      {!account ? (
        <Button
          onClick={onClick}
          style={{ textTransform: 'uppercase' }}
          className="outline--highlight large"
        >
          Connect Wallet
        </Button>
      ) : (
        <>
          <p style={{ color: '#fff' }}>Current id: {account}</p>
        </>
      )}
    </>
  )
}
