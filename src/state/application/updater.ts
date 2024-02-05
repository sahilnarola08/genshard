import {useCallback, useEffect, useState} from 'react'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import {changeNetwork, updateBlockNumber} from './actions'
import {useDispatch, useSelector} from 'react-redux'
import {useActiveWeb3React} from '../../hooks/web3'
import useDebounce from '../../utils/useDebounce'
import {AppState} from '..'
import {NetworkSymbol, NetworkSymbolAndId} from "../../connectors";

export default function Updater(): null {
  const { library, chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch()
  const network = useSelector((state: AppState) => state.application.network)

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{
    chainId: number | undefined
    blockNumber: number | null
  }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number')
            return { chainId, blockNumber }
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
          }
        }
        return state
      })
    },
    [chainId, setState]
  )

  //change network
  useEffect(() => {
    dispatch(changeNetwork({
      network: chainId ? NetworkSymbolAndId[chainId] : NetworkSymbol.ETH,
      chainId: account ? chainId : null
    }))
  }, [chainId, account])



  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      )

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible
    )
      return
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      })
    )
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockNumber,
    debouncedState.chainId,
  ])

  return null
}
