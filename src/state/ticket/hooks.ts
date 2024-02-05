import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useRef, useEffect } from 'react'
import {
  useContractTicket,
  useGenFactory,
  useGenTicket,
  useWeb3Contract,
} from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { useTransactionAdder } from '../transactions/hooks'
import { DEFAULT_URI } from '../../constants'
import { abi as GEN_FACTORY_ABI } from '../../contracts/GenFactory.json'
import { abi as ERC1155_ABI } from '../../contracts/IERC1155.json';
import { abi as ERC721_ABI } from '../../contracts/IERC721.json';
import { calculateGasMargin, getContract, getERC20Contract, getGenTicketContract } from '../../utils'
import { GenTicketDto } from './types'
import { addTicket, addGenTicket, approveDeposit, approveIssue, setCurrentProject } from './actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '..'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { abi as GEN_TICKET_ABI } from '../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../contracts/GenTickets_v1.json'
import { abi as GEN_DEX_ABI } from '../../contracts/GenIDO.json'
import { abi as USDT_ABI } from '../../contracts/USDT.json'

import { formatEther, parseUnits } from 'ethers/lib/utils'
import { ITicketVestingData } from '../../pages/dashboard/components/inventory/types'
import { MaxUint256 } from '@ethersproject/constants'
import { useSelector } from 'react-redux'
import { AppState } from '../'
import { Project } from './types'
import { parseEther } from 'ethers/lib/utils'
import { useAddPopup } from '../application/hooks'
import { BigNumber } from 'ethers'
import { abi as GEN_MARKETPLACE_ABI } from '../../contracts/GenMarketPlace.json';

const projectWithNineDecimals = ['sator'];

/**
 * Workflow:
 * When we trigger the create genTicket, we store the hash to redux state
 * the ticket status should be WAIT
 * the Updater will looking for blockNumber and update new status to redux
 *
 * on the home/index.ts we check genTicket status and condition render the lock component
 * @returns
 */
export function useCreateGenTicket(): (
  genTicket: GenTicketDto,
  decimalValue: number
) => undefined | Promise<string> {
  const dispatch = useDispatch<AppDispatch>()

  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const currentProject = useSelector((state: AppState) => state.market.currentProject)
  const genFactory = useGenFactory()
  const getFactoryContract = useWeb3Contract(GEN_FACTORY_ABI)
  const addErrorPopup = useAddPopup();

  return useCallback(
    (genTicket: GenTicketDto, decimalValue: number = 18) => { 
      if (!library || !chainId || !account) return undefined

      if (!genFactory) throw new Error('No UNI Contract!')

      let {
        uri,
        ticketSizes,
        numTickets,
        totalNumberOfTranches,
        trancheWeightages,
        underlyingToken,
        trancheLengths,
        //cliffTranches,
      } = genTicket
      if (!uri) {
        uri = DEFAULT_URI
      }

      // console.log('uri', uri)
      // const isProjectWithNineDecimal = projectWithNineDecimals.reduce((isTrue, project) => {
      //   console.log('currentProject URI ->', uri?.toLowerCase().endsWith(`/${project.toLowerCase()}/{id}.json`));
      //   return isTrue || !!uri?.toLowerCase().endsWith(`/${project.toLowerCase()}/{id}.json`);
      // }, false);

      // console.log(isProjectWithNineDecimal);

      let newTicketSizes = [] as any

      for (let i = 0; i < ticketSizes.length; i++) {
        // if (isProjectWithNineDecimal) {
        //   newTicketSizes.push(parseUnits(ticketSizes[i].toFixed(0), 9))
        // } else {
        //   newTicketSizes.push(parseEther(ticketSizes[i].toFixed(0)))
        // }
        newTicketSizes.push(parseUnits(ticketSizes[i].toFixed(0), decimalValue))
      }
      console.log('_newTicketSizes->', newTicketSizes);

      const args = [
        underlyingToken,
        numTickets,
        newTicketSizes,
        trancheWeightages,
        //cliffTranches,
        trancheLengths,
        uri,
      ]
      console.log('args->', args);
      return genFactory.estimateGas
        .createGenTicket(...args, {})
        .then((estimatedGasLimit) => {
          console.log('first resp', estimatedGasLimit)
          return genFactory
            .createGenTicket(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              console.log('resp', response);
              
              // add the transaction to store and show the popup
              addTransaction(response, {
                summary: `Create Gen Ticket`,
              })
              // store ticket to redux
              dispatch(addTicket({ hash: response.hash }))

              return response.hash
            })
            .catch((err: any) => {
              console.log('err', err);
              addErrorPopup({ 
                txn: { 
                  hash: '', 
                  success: false, 
                  summary: err.message,
                  description: err.data?.message ?? '',
                  withExternalLink: false,
                } 
              }); 
            });
        })
        .catch((err: any) => {
          console.log('error', err);
          addErrorPopup({ 
            txn: { 
              hash: '', 
              success: false, 
              summary: err.message,
              description: err.data?.message ?? '',
              withExternalLink: false,
            } 
          }); 
        })
    },
    [account, addTransaction, chainId, library, genFactory, getFactoryContract]
  )
}

export function useSetTokenGenDate(): (
  genTicketAddress: string,
  unix: number
) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (genTicketAddress: string, unix: number) => {
      if (!library || !chainId || !account) return undefined

      const genTicket = getGenTicketContract("New", genTicketAddress, chainId, library, account)

      if (!genTicket) throw new Error('No UNI Contract!')

      const args = [
        unix
      ]

      return genTicket.estimateGas
        .updateTGE(...args, {})
        .then((estimatedGasLimit) => {
          return genTicket
            .updateTGE(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              // add the transaction to store and show the popup
              addTransaction(response, {
                summary: `Update Gen Ticket TGE`,
              })

              // store ticket to redux
              // just for handle logic checking set gen token date status
              // after new gen ticket hash created, it will be updated by Updater useEffect handle ticketCreated event
              dispatch(addGenTicket({ hash: response.hash }))

              // The Updater will check the ticket status and update to redux store
              return response.hash
            })
        })
    },
    [account, library, chainId]
  )
}

export function useApproveDeposit(): (genTicketAddress: string) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const genTicket = useWeb3Contract(GEN_TICKET_ABI)
  const addTransaction = useTransactionAdder()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async (genTicketAddress: string) => {
    if (!library || !chainId || !account) return undefined

    let underlyingToken = await genTicket(genTicketAddress).methods.underlyingToken().call()

    const erc20 = getERC20Contract(underlyingToken, chainId, library, account)

    if (!erc20) throw new Error('No UNI Contract!')

    const args = [
      genTicketAddress,
      MaxUint256
    ]

    return erc20.estimateGas
      .approve(...args, {})
      .then((estimatedGasLimit) => {
        return erc20
          .approve(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            addTransaction(response, {
              summary: `Approve deposit of underlying tokens`,
            })

            // store ticket to redux
            dispatch(approveDeposit({ ticket: response.hash }))

            // The Updater will check the ticket status and update to redux store
            return response.hash
          })
      })
  }, [account, chainId, library])
}

export function useApproveForGenPad(): (genDexAddress: string, balanceOfBUSD : BigNumber) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const genDex = useWeb3Contract(GEN_DEX_ABI)
  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async (genDexAddress: string, balanceOfBUSD : BigNumber) => {
    if (!library || !chainId || !account) return undefined

    let getBCProjectInfo = await genDex(genDexAddress!).methods.getProjectInfo().call()
    let usdtAccountAddress = getBCProjectInfo?._usdt //await genDex(genDexAddress!).methods.usdt().call()
    console.log(usdtAccountAddress)
    const erc20 = getContract(usdtAccountAddress, USDT_ABI, library!, account!)

    //let underlyingToken = await genDex(genDexAddress).methods.usdt().call()

    //const erc20 = getERC20Contract(underlyingToken, chainId, library, account)

    if (!erc20) throw new Error('No UNI Contract!')

    const args = [
      genDexAddress,
      balanceOfBUSD //MaxUint256
    ]

    return erc20.estimateGas
      .approve(...args, {})
      .then((estimatedGasLimit) => {
        return erc20
          .approve(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            console.log("response-->", response);
            
            const waitResponse = await response.wait();
            return waitResponse;

            // // store ticket to redux
            // dispatch(approveDeposit({ ticket: response.hash }))

            // // The Updater will check the ticket status and update to redux store
            // return response.hash
          })
          .catch((err : any) => {
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
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
            console.log("response11-->", err);
            return err;
          })
      })
  }, [account, chainId, library])
}

export function useApproveForBuyNowMarketPlace(): (wethAddress: string, nftMarketPlaceAddres: string, nftPrice : BigNumber) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const genDex = useWeb3Contract(GEN_DEX_ABI)
  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async (wethAddress: string, nftMarketPlaceAddres: string, nftPrice : BigNumber) => {
    if (!library || !chainId || !account) return undefined

    const erc20 = getERC20Contract(wethAddress, chainId, library, account)
    if (!erc20) throw new Error('No UNI Contract!')

    const args = [
      nftMarketPlaceAddres,
      nftPrice //MaxUint256
    ]

    console.log('useApproveForBuyNowMarketPlace Args', args);
    
    return erc20.estimateGas
      .approve(...args, {})
      .then((estimatedGasLimit) => {
        return erc20
          .approve(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            console.log("response-->", response);         
            const waitResponse = await response.wait();
            return waitResponse;

          })
          .catch((err : any) => {
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
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
            console.log("response11-->", err);
            return err;
          })
      })
  }, [account, chainId, library])
}

export function useApproveForListPostingERC1155(): (nftContractAddress : string, nftMarketPlaceAddres: string) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async (nftContractAddress : string, nftMarketPlaceAddres: string) => {
    if (!library || !chainId || !account) return undefined

    const erc20 = getContract(nftContractAddress, ERC1155_ABI, library!, account!)
    if (!erc20) throw new Error('No UNI Contract!')

    const args = [
      nftMarketPlaceAddres,
      true
    ]

    return erc20.estimateGas
      .setApprovalForAll(...args, {})
      .then((estimatedGasLimit) => {
        return erc20
          .setApprovalForAll(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            console.log("response-->", response);         
            const waitResponse = await response.wait();
            return waitResponse;
          })
          .catch((err : any) => {
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
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
            console.log("response11-->", err);
            return err;
          })
      })
  }, [account, chainId, library])
}

export function useApproveForListPostingERC721(): (nftContractAddress : string, nftMarketPlaceAddres: string, nftTokenId : string) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const dispatch = useDispatch<AppDispatch>()
  
  return useCallback(async (nftContractAddress : string, nftMarketPlaceAddres: string, nftTokenId : string) => {
    if (!library || !chainId || !account) return undefined

    const erc21 = getContract(nftContractAddress, ERC721_ABI, library!, account!)
    if (!erc21) throw new Error('No UNI Contract!')

    const args = [
      nftMarketPlaceAddres,
      nftTokenId
    ]

    return erc21.estimateGas
      .approve(...args, {})
      .then((estimatedGasLimit) => {
        return erc21
          .approve(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            console.log("response-->", response);         
            const waitResponse = await response.wait();
            return waitResponse;
          })
          .catch((err : any) => {
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
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
            console.log("response11-->", err);
            return err;
          })
      })
  }, [account, chainId, library])
}

export function useIssue(): (genTicketAddress: string) => undefined | Promise<any> {
  const { account, chainId, library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async (genTicketAddress: string) => {
    if (!library || !chainId || !account) return undefined

    const genTicket = getGenTicketContract("New", genTicketAddress, chainId, library, account)

    if (!genTicket) throw new Error('No UNI Contract!')

    const args = [
      account
    ]

    return genTicket.estimateGas
      .issue(...args, {})
      .then((estimatedGasLimit) => {
        return genTicket
          .issue(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            addTransaction(response, {
              summary: `Issue Gen Tickets`,
            })

            // store ticket to redux
            dispatch(approveIssue({ ticket: response.hash }))

            // The Updater will check the ticket status and update to redux store
            return response.hash
          })
      })
  }, [account, chainId, library])
}

export function useGetTicketBalance(currentProjectForMarketPlace? : any) {
  const { library, chainId, account } = useActiveWeb3React()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const getProjectDuration = currentProjectForMarketPlace ? currentProjectForMarketPlace!.projectDuration : currentProject!.projectDuration
  const genTicket = useWeb3Contract(getProjectDuration === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
  const getGenTicketAddress = currentProjectForMarketPlace ? currentProjectForMarketPlace!.ticketAddress : currentProject!.address

  return useCallback(
    async (index: number) => {
      if (!library || !chainId || !account || (!currentProjectForMarketPlace && !currentProject)) return undefined
      console.log('chainId---------->', chainId);
      
      const balance = await genTicket(getGenTicketAddress)
        .methods.balanceOf(account, index)
        .call()
      // debugger;

      return balance
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

export function useGetNumberOfTicketTypes(currentProjectForMarketPlace?: any) {
  const { library, chainId, account } = useActiveWeb3React()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  
  const getProjectDuration = currentProjectForMarketPlace ? currentProjectForMarketPlace!.projectDuration : currentProject!.projectDuration
  const genTicket = useWeb3Contract(getProjectDuration === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
  const getGenTicketAddress = currentProjectForMarketPlace ? currentProjectForMarketPlace!.ticketAddress : currentProject!.address

  return useCallback(
    async (address = getGenTicketAddress): Promise<number> => {
      if (!library || !chainId || !account || (!currentProjectForMarketPlace && !currentProject)) return 0
      const numTicketTypes = await genTicket(address).methods.numTicketTypes().call()
      console.log(numTicketTypes);
      
      return Number(numTicketTypes)
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

export function useGetTicketInfo(currentProjectForMarketPlace? : any) {
  const { library, chainId, account } = useActiveWeb3React()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const getProjectDuration = currentProjectForMarketPlace ? currentProjectForMarketPlace!.projectDuration : currentProject!.projectDuration
  const genTicket = useWeb3Contract(getProjectDuration === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
  const getGenTicketAddress = currentProjectForMarketPlace ? currentProjectForMarketPlace!.ticketAddress : currentProject!.address

  return useCallback(
    async (index: number) => {
      if (!library || !chainId || !account || (!currentProjectForMarketPlace && !currentProject)) return undefined

      const genTicketInfo = await genTicket(getGenTicketAddress)
        .methods.genTickets(index)
        .call()
      
      return genTicketInfo
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

// get redeemable tokens
export function useGetRedeemableToken(currentProjectForMarketPlace? : any) {
  // NO use of this method anywhere - meaningless
  const { library, chainId, account } = useActiveWeb3React()

  const getTicketBalance = useGetTicketBalance(currentProjectForMarketPlace)
  const getTicketInfo = useGetTicketInfo(currentProjectForMarketPlace)

  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const getProjectDuration = currentProjectForMarketPlace ? currentProjectForMarketPlace!.projectDuration : currentProject!.projectDuration
  const genTicket = useWeb3Contract(getProjectDuration === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
  const getGenTicketAddress = currentProjectForMarketPlace ? currentProjectForMarketPlace!.ticketAddress : currentProject!.address

  return useCallback(
    async (index: number, projectDuration: string) => {
      if (!library || !chainId || !account || (!currentProjectForMarketPlace && !currentProject)) return undefined

      let TGE = await genTicket(getGenTicketAddress).methods.TGE().call()
      const numTicketTypes = await genTicket(getGenTicketAddress).methods.numTicketTypes().call()
      const genTicketInfo = await getTicketInfo(index % numTicketTypes)

      let lengthOfTranche = genTicketInfo.trancheLength
      if (projectDuration === 'New') {
        let lengthOfTranche = await genTicket(getGenTicketAddress).methods.returnTrancheLength().call()
      }
      
      if (index > numTicketTypes - 1) {
        const addFactor = Math.trunc(index / numTicketTypes) * lengthOfTranche //genTicketInfo.trancheLength
        TGE = parseInt(TGE) + addFactor
      }

      if (TGE > Date.now()) {
        return '0'
      }

      const balance = await getTicketBalance(index)

      return (
        Number(formatEther(genTicketInfo.ticketSize)) * Number(balance)
      ).toFixed(4)
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

// get total value held
export function useGetTotalValueHeld() {
  const { library, chainId, account } = useActiveWeb3React()

  const getTicketBalance = useGetTicketBalance()
  const getTicketInfo = useGetTicketInfo()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)

  return useCallback(async () => {
    if (!library || !chainId || !account || !currentProject) return undefined
    const numTicketTypes = await genTicket(currentProject.address).methods.numTicketTypes().call()

    let totalValueHeld = 0
    for (let i = 0; i < numTicketTypes; i++) {
      const balance = await getTicketBalance(i)
      const genTicketInfo = await getTicketInfo(i)
      totalValueHeld +=
        Number(formatEther(genTicketInfo.ticketSize)) * Number(balance)
    }
    let str = `${totalValueHeld.toFixed(4)} GS`

    return str
  }, [genTicket, account, library, chainId, currentProject])
}

// get total tickets held
export function useGetTotalTicketsHeld() {
  const { library, chainId, account } = useActiveWeb3React()

  const getTicketBalance = useGetTicketBalance()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)

  return useCallback(async () => {
    if (!library || !chainId || !account || !currentProject) return undefined
    const numTicketTypes = await genTicket(currentProject.address).methods.numTicketTypes().call()

    let totalValueHeld = 0
    for (let i = 0; i < numTicketTypes; i++) {
      const balance = await getTicketBalance(i)
      totalValueHeld += Number(balance)
    }
    let str = `${totalValueHeld.toFixed(4)} Gen Tickets`

    return str
  }, [genTicket, account, library, chainId, getTicketBalance, currentProject])
}

// get vesting data
export function useGetVestingData(currentProjectForMarketPlace? : any) {
  const { library, chainId, account } = useActiveWeb3React()
  const getTicketInfo = useGetTicketInfo(currentProjectForMarketPlace)
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const getProjectDuration = currentProjectForMarketPlace ? currentProjectForMarketPlace!.projectDuration : currentProject!.projectDuration
  const genTicket = useWeb3Contract(getProjectDuration === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1)
  const getGenTicketAddress = currentProjectForMarketPlace ? currentProjectForMarketPlace!.ticketAddress : currentProject!.address

  return useCallback(
    async (index: number, projectDuration: string | undefined): Promise<ITicketVestingData | undefined> => {
      if (!library || !chainId || !account || (!currentProjectForMarketPlace && !currentProject)) return undefined
   
      const numTicketTypes = await genTicket(getGenTicketAddress).methods.numTicketTypes().call()
      const genTicketInfo = await getTicketInfo(index % numTicketTypes)

      let tranchePastCliff = (index) / numTicketTypes
      let totalTranches = genTicketInfo.totalTranches
      let lengthOfTranche = genTicketInfo.trancheLength
      let lengthOfCliff = genTicketInfo.cliffTranches
      let arrayOfWeightages = [] as any
      let arrayOfTranches = [] as any
      if (projectDuration === 'New') {
        arrayOfTranches = await genTicket(getGenTicketAddress).methods.returnTrancheLength().call()
        totalTranches = arrayOfTranches.length
        arrayOfWeightages = await genTicket(getGenTicketAddress).methods.returnTrancheWeightage().call()
      }

      return { tranchePastCliff, totalTranches, lengthOfTranche, lengthOfCliff, arrayOfTranches, arrayOfWeightages }
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

export function useRedeem() {
  const { library, chainId, account } = useActiveWeb3React()

  const dispatch = useDispatch<AppDispatch>()
  const addTransaction = useTransactionAdder()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const genTicket = useContractTicket(currentProject?.address!, currentProject)
  const getTicketBalance = useGetTicketBalance()
  const addErrorPopup = useAddPopup();

  return useCallback(
    async (index: number) => {
      if (!library || !chainId || !account) return undefined
      const genTicket = getGenTicketContract(currentProject?.projectDuration!, currentProject?.address!, chainId, library, account)
      if (!genTicket) throw new Error('No Contract!')
      const amount = await getTicketBalance(index)
      const args = [account, index, amount]

      return genTicket.estimateGas
        .redeemTicket(...args, {})
        .then((estimatedGasLimit) => {
          return genTicket
            .redeemTicket(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            .then(async (response: TransactionResponse) => {
              // add the transaction to store and show the popup
              addTransaction(response, {
                summary: `Redeem GS with GenTicket`,
              })

              // store ticket to redux
              dispatch(addTicket({ hash: response.hash }))

              // The Updater will check the ticket status and update to redux store
              return response.hash
            })
            .catch((err: any) => {
              console.log('err', err);
              addErrorPopup({ 
                txn: { 
                  hash: '', 
                  success: false, 
                  summary: err.message,
                  description: err.data?.message ?? '',
                  withExternalLink: false,
                } 
              }); 
            });
        })
        .catch((err: any) => {
          console.log('error', err);
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
        });
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

export function useDepositBoughtTickets() {
  const { library, chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();

  return useCallback(
    async (marketPlaceAddress: string, returnNFTAddress: any, ticket: any, callback: any) => {
      if (!library || !chainId || !account) return undefined
      const market = getContract(marketPlaceAddress, GEN_MARKETPLACE_ABI, library!, account!)

      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<number | string>,
        value: BigNumber | null

      method = market.depositBoughtTickets
      estimate = market.estimateGas.depositBoughtTickets
      args = [
        returnNFTAddress, //'0x093CDEd0488c335258EEbfdFa8C26A5f98331502',
        ticket?.index,
        ticket?.number
      ]
      console.log(args);
      
      return estimate(...args, {})
        .then((estimatedGasLimit) => {
          console.log('estimatedGasLimit', estimatedGasLimit)
          return method(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            new Promise((resolve) => {
              addTransaction(response, {
                summary:
                  'NFT returned successfully!'
              });
              resolve('');
            }).then(() => {
              callback();
            })
          }).catch((err: any) => {
              console.log('error', err);
              let e = err.code === 4001 ? err : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
              if (err.code !== 4001) e = JSON.parse(e);
              addErrorPopup({
                txn: {
                  hash: '',
                  success: false,
                  summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                  description: e.data?.originalError?.message ?? '',
                  withExternalLink: false,
                }
              });
          })  
        })
        .catch((err: any) => {
          console.log("eee1", err);
          
          let e = err.code === 4001 ? err : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
          if (err.code !== 4001) e = JSON.parse(e);
          addErrorPopup({
            txn: {
              hash: '',
              success: false,
              summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
              description: e.data?.originalError?.message ?? '',
              withExternalLink: false,
            }
          });
        })
    },
    [account, library, chainId]
  )
}

export function useSetApprovalForAll() {
  const { library, chainId, account } = useActiveWeb3React()

  const dispatch = useDispatch<AppDispatch>()
  const addTransaction = useTransactionAdder()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const genTicket = useContractTicket(currentProject?.address!, currentProject)
  const addErrorPopup = useAddPopup();
  const deposit = useDepositBoughtTickets();

  return useCallback(
    async (marketPlaceAddress: string, returnNFTAddress : any, ticket: any, callback: any) => {
      try {
      if (!library || !chainId || !account) return undefined
      const genTicket = getGenTicketContract(currentProject?.projectDuration!, currentProject?.address!, chainId, library, account)

      if (!genTicket) throw new Error('No Contract!')
      const args = [marketPlaceAddress, true]

      // return 
      const estimatedGasLimit = await genTicket.estimateGas.setApprovalForAll(...args, {})
        // .then((estimatedGasLimit) => {
          // return 
      const transactionResponse: TransactionResponse = await  genTicket.setApprovalForAll(...args, {
              value: null,
              gasLimit: calculateGasMargin(estimatedGasLimit),
            })
            // .then(async (response: TransactionResponse) => {
              // console.log('resp ---->', response);
              const waitResponse = await transactionResponse.wait()
              return await deposit(marketPlaceAddress, returnNFTAddress, ticket, callback);

              // // store ticket to redux
              // dispatch(addTicket({ hash: response.hash }))

              // // The Updater will check the ticket status and update to redux store
              // return response.hash
            // })
            // .catch((err: any) => {
            //   console.log('err', err);
            //   addErrorPopup({ 
            //     txn: { 
            //       hash: '', 
            //       success: false, 
            //       summary: err.message,
            //       description: err.data?.message ?? '',
            //       withExternalLink: false,
            //     } 
            //   }); 
            // });
        // })
        // .catch((err: any) => {

        // });
          } catch (err: any)  {
                      console.log('error', err);
          addErrorPopup({ 
            txn: { 
              hash: '', 
              success: false, 
              summary: err.message,
              description: err.data?.message ?? '',
              withExternalLink: false,
            } 
          }); 
          }
    },
    [genTicket, account, library, chainId, currentProject]
  )
}

/**
 * Setup a polling interval only call when windowVisible and clear when component destroy
 * @param fn the function that need to interval
 * @param delay delay time
 */
export function usePolling(
  fn: () => Promise<any>,
  delay: number,
  ...dependency: any
) {
  const windowVisible = useIsWindowVisible()
  const intervalRef = useRef<any>()

  // setup interval
  const handleInterval = useCallback(() => {
    fn()?.then(() => {
      intervalRef.current = setTimeout(handleInterval, delay, fn, delay)
    })
  }, [fn, delay])

  useEffect(() => {
    // clear timeout to make sure just 1 function interval
    clearTimeout(intervalRef.current)

    if (windowVisible && fn && delay) {
      handleInterval()
    }

    return () => clearTimeout(intervalRef.current)
  }, [windowVisible, ...dependency])
}