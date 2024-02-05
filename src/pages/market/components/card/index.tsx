import React, { Component, useEffect, useMemo, useState } from 'react'
import CardDumb from './dumb'
import { Card as CardType } from '../../../../state/market/types'
import BuyNowModal from '../buy-now-modal'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { abi as USDT_ABI } from '../../../../contracts/USDT.json'

import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin, getContract } from '../../../../utils'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useAllTransactions, isTransactionRecent, useTransactionAdder } from '../../../../state/transactions/hooks'
import { TransactionDetails } from '../../../../state/transactions/reducer'
import _ from 'lodash'
import { parseEther, parseUnits, formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { useHistory } from 'react-router-dom'
import { useAddPopup } from '../../../../state/application/hooks'

export default function Card({ card, isPast, index, currentProject, ticketAddress, marketAddress, reload }: ICardProps) {
  const [showModal, setShowModal] = useState(false)
  const [isOnFinalPage, setIsOnFinalPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hash, setHash] = useState('')
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const history = useHistory()
  const addErrorPopup = useAddPopup();
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)

  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter(isTransactionRecent)
      .sort(
        (a: TransactionDetails, b: TransactionDetails) =>
          b.addedTime - a.addedTime
      )
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash)
  const isTransOccurring = _.includes(pending, hash ? hash : '')

  const [msg, setMsg] = useState("Please Wait")
  useEffect(() => {
    const reset = async () => {
      setIsLoading(false)
      setIsOnFinalPage(true)
      setHash('')
    }
    if (!isTransOccurring && hash !== '') {
      reset()
    }
  }, [isTransOccurring])

  const CardProps: CardType = useMemo(
    () => ({
      src: card.src,
      name: card.name,
      total: card.total,
      remain: card.remain,
      balance: card.balance,
      description: card.description,
      index: index,
      price: card.price
    }),
    [card]
  )

  const onBuyNow = async () => {
  
    if (marketAddress === undefined) return

    let isEnableUSDT = await genMarket(marketAddress!).methods.enableUsdt().call()
    if (isEnableUSDT){
     
      setIsLoading(true)
      // Progs : If decided to goes forward with USDT Buy Now instead of Normal buy now then open this code from commenting and comment below code
      
      let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<number | string | BigNumber>,
      value: BigNumber | null
  
      let usdtAccountAddress = await genMarket(marketAddress!).methods.usdt().call()
      console.log(usdtAccountAddress)
      const usdtMarket = getContract(usdtAccountAddress, USDT_ABI, library!, account!)
      console.log('usdtMarket', usdtMarket)
      if (!usdtMarket) throw new Error('No Contract!')

      const getUSDTDecimals = await usdtMarket.decimals()
      const getAllowanceForUSDTToGenMarket = await usdtMarket.allowance(account!, marketAddress!)
      console.log('getUSDTDecimals', getUSDTDecimals)
      value = parseUnits(card.price, Number(getUSDTDecimals))
      console.log('getAllowanceForUSDTToGenMarket', card.price, formatUnits(getAllowanceForUSDTToGenMarket, Number(getUSDTDecimals)))
      
      if (Number(formatUnits(getAllowanceForUSDTToGenMarket, Number(getUSDTDecimals))) >= Number(card.price))
      {
        console.log("Call only buyUsingUSDT");
        setMsg("Buy Now")
        const market = getContract(marketAddress, GEN_MARKET_ABI, library!, account!)
        method = market.buyUsingUSDT
        estimate = market.estimateGas.buyUsingUSDT
        args = [
          index,
          1
        ]
  
        estimate(...args, {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...({}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            addTransaction(response, {
              summary:
                'Purchased Gen Ticket'
            })
            setHash(response.hash)
            setIsLoading(true)
          })
          .catch((err: any) => {
            setIsLoading(false)
            console.log('error buy failed', err);
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e); 
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              }
            });
          })
        )
        .catch((err: any) => {
          setIsLoading(false)
          console.log('inner estimate error', err);
          let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
          if (err.code === -32603) { }
          else if (err.code !== 4001) e = JSON.parse(e); 
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
              description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
              withExternalLink: false,
            }
          });
        })
      }
      else
      {
        console.log("Call with Approve and buyUsingUSDT");
        args = [marketAddress, value]
        setMsg("Approve")
        const estimatedGasLimit = await usdtMarket.estimateGas.approve(...args, {})
        
        await usdtMarket.approve(...args, {
          value: null,
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then(async (transactionResponse : TransactionResponse) => {
          console.log("transactionResponse", transactionResponse);
          
          const waitResponse = await transactionResponse.wait()
          setMsg("Buy Now")
          const market = getContract(marketAddress, GEN_MARKET_ABI, library!, account!)
          method = market.buyUsingUSDT
          estimate = market.estimateGas.buyUsingUSDT
          args = [
            index,
            1
          ]
    
          estimate(...args, {})
          .then(estimatedGasLimit =>
            method(...args, {
              ...({}),
              gasLimit: calculateGasMargin(estimatedGasLimit)
            }).then(response => {
              addTransaction(response, {
                summary:
                  'Purchased Gen Ticket'
              })
              setHash(response.hash)
              setIsLoading(true)
            })
            .catch((err: any) => {
              setIsLoading(false)
              console.log('error buy failed', err);
              let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
              if (err.code === -32603) { }
              else if (err.code !== 4001) e = JSON.parse(e); 
              addErrorPopup({
                txn: {
                  hash: '',
                  success: false,
                  summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                  description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                  withExternalLink: false,
                }
              });
            })
          )
          .catch((err: any) => {
            setIsLoading(false)
            console.log('inner estimate error', err);
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e); 
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              }
            });
          })
        }).catch((err: any) => {
          setIsLoading(false)
          console.log('error else block', err);
          let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
          if (err.code === -32603) { }
          else if (err.code !== 4001) e = JSON.parse(e); 
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
              description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
              withExternalLink: false,
            }
          });
        })
      }
    }
    else{
      // Progs : If decided to goes forward with normal buy instead of USDT then open this code from commenting and comment above code    
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string>,
        value: BigNumber | null

      const market = getContract(marketAddress, GEN_MARKET_ABI, library!, account!)
      method = market.buy
      estimate = market.estimateGas.buy
      args = [
        index,
        1
      ]
      value = parseEther(card.price)

      await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {

            addTransaction(response, {
              summary:
                'Purchased Gen Ticket'
            })

            setHash(response.hash)
            setIsLoading(true)
          })
          .catch((err: any) => {
            console.log('error11', err);
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e); 
            addErrorPopup({
              txn: {
                hash: '',
                success: false,
                summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                withExternalLink: false,
              }
            });
          })
      )
      .catch((err: any) => {
          console.log('errorrrr', err);
          let e = err.code === 4001 ? err : err.code === -32603 ? err.data :err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
          if (err.code === -32603) { }
          else if (err.code !== 4001) e = JSON.parse(e); 
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
              description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
              withExternalLink: false,
            }
          });
      })
    }
  }

  const goToDashBoard = async () => {
    setShowModal(false)
    if (reload !== undefined) {
      await reload()
    }
    history.push('/')
  }

  return (
    <>
      <BuyNowModal
        isLoading={isLoading}
        msg={msg}
        card={CardProps}
        currentProject={currentProject}
        showModal={showModal}
        closeModal={async () => {
          setShowModal(false)
          if (reload !== undefined) {
            await reload()
          }
        }}
        goToDashBoard={goToDashBoard}
        onBuyNow={onBuyNow}
        isOnFinalPage={isOnFinalPage}
      />
      <CardDumb
        {...CardProps}
        ticketAddress={ticketAddress}
        currentProject={currentProject}
        marketAddress={marketAddress}
        onClick={() => setShowModal(true)}
        isPast={isPast}
      />
    </>
  )
}

interface ICardProps {
  card: CardType
  isPast: boolean
  index: number
  currentProject? : any
  ticketAddress: string
  marketAddress?: string
  reload?: () => void
}
