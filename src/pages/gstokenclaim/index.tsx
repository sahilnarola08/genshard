import {
    useRouteMatch,
  } from 'react-router-dom'
  import './style.sass';
import claimed from '../../images/claimed.svg'
import remaining from '../../images/remaining.svg'
import total_vested from '../../images/total_vested.svg'
import withdraw from '../../images/withdraw.svg'
import { ButtonPrimary } from '../../shared/components/UniButton';
import { useActiveWeb3React } from '../../hooks/web3'
import GEN_VESTING_ABI from '../../contracts/GenVesting.json'
import {abi as ERC20_ABI} from '../../contracts/IERC20.json'
import {GEN_VESTING_ADDRESS, GEN_SHARDS_ADDRESS, OLD_CLAIM_DATA_SHEET} from '../../constants'
import { useGenShard, useWeb3Contract } from '../../hooks/useContract'
import {getContract, getERC20Contract} from '../../utils'
import { useState, useEffect } from 'react';
import Skeleton from "react-loading-skeleton";
import moment from 'moment'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../../utils'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Loader from '../../shared/components/Loader'
import { formatEther } from 'ethers/lib/utils'
import Papa from 'papaparse'
import _ from 'lodash'

const IssueContainer = styled.div`
    color: white;
    display: flex; 
    justify-content: center;
    margin-top: 40px;
    width: 100%;
`

interface InnerBoxProps {
    src: any
    title: string
    value: string
}

const InnerBox = (props: InnerBoxProps) => {
    return (
        <div className="box-container">
            <div className="top-status">
                <img className="top-image" src={props.src} />
                <div className="top-title">
                    {props.title}
                </div>
            </div>
            <div className="box-value">
                {props.value}
            </div>
        </div>
    )
}

interface ClaimInfo {
    total_locked: string
    amount_claimed: string
    percent_remaining: string
    available_withdraw: string
    token_balance: string
}

export function GenshardsDashboard() {
    const history = useHistory()
    const { path } = useRouteMatch()
    const { account, chainId, library } = useActiveWeb3React()
    const genVesting = useWeb3Contract(GEN_VESTING_ABI)
    const genToken = useWeb3Contract(ERC20_ABI)
    const [reloadInfo, setReloadInfo] = useState<ClaimInfo>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const refreshData = async () => {
        setIsLoading(true)
        let vested_amounts
        let start_time
        let tokens_available
        let token_balance
        let og_data: unknown
        try {
            [vested_amounts, start_time, tokens_available, token_balance, og_data] = await Promise.all([
                genVesting(GEN_VESTING_ADDRESS).methods.vestingPeriods(account!).call(),
                genVesting(GEN_VESTING_ADDRESS).methods.startTime().call(),
                genVesting(GEN_VESTING_ADDRESS).methods.tokensToClaim(account!).call(),
                genToken(GEN_SHARDS_ADDRESS).methods.balanceOf(account!).call(),
                new Promise(function(complete, error) {
                    Papa.parse(OLD_CLAIM_DATA_SHEET, {
                                  download: true,
                                  header: true,
                                  complete,
                                  error
                            })
                  })
            ])
        } catch (e) {
            setError(true)
            setIsLoading(false)
            return
        }
        const account_data = _.find((og_data as any).data, (i) => i["Ethereum Address"].toLowerCase() === account!.toLowerCase())
        if (account_data === undefined) {
            setError(true)
            setIsLoading(false)
            return
        }

        const remaining_perc_string = account_data['REMAINING %'].substring(0, account_data['REMAINING %'].length - 1)
        
        const amount_og_claimed = parseInt(account_data['TOTAL CLAIMED'].replace(/\D/g,''))
        const percent_og_remaining = 0.01*parseFloat(remaining_perc_string)
        
        start_time = Number(start_time)
        const end_time = moment.unix(start_time).add(parseInt(vested_amounts.vestingDays), 'd').unix()
        const percent = end_time < moment().unix () ? 1 : ((moment().unix() - start_time) / (end_time - start_time))
        const totalVested = parseInt(vested_amounts.vestingDays) * Number(formatEther(vested_amounts.tokensPerDay))
        const amountClaimed = Number(amount_og_claimed+(totalVested*percent) - Number(formatEther(tokens_available)))
        setReloadInfo({
            total_locked: (totalVested+amount_og_claimed).toFixed(2),
            amount_claimed: amountClaimed.toFixed(2),
            percent_remaining: `${(percent_og_remaining*(1-percent)*100).toFixed(2)}%`,
            available_withdraw: parseFloat(formatEther(tokens_available)).toFixed(2),
            token_balance: parseFloat(formatEther(token_balance)).toFixed(2)
        })
        setIsLoading(false)
    }

    useEffect(() => {
        if (account !== null && account !== undefined) {
            refreshData()
        }
    }, [account])

    const handleWithdraw = async () => {
        if (account === null || account === undefined) {
            alert("Please login to your wallet to withdraw")
            return
        }

        let estimate,
        method: (...args: any) => Promise<TransactionResponse>
    
        const gen = getContract(GEN_VESTING_ADDRESS, GEN_VESTING_ABI, library!, account)
        method = gen.claimForSelf
        estimate = gen.estimateGas.claimForSelf
    
        await estimate()
                .then(estimatedGasLimit =>
                method({
                    gasLimit: calculateGasMargin(estimatedGasLimit)
                }).then(response => {
                        //cb(response.hash)
                })
            )
            .catch(error => {
                // we only care if the error is something _other_ than the user rejected the tx
                if (error?.code !== 4001) {
                    console.error(error)
                }
            })
    }

    if (error) {
        return (
            <IssueContainer>
                There was a problem loading your Genshards claim data. Please ensure you are on a wallet address that was used to claim GS tokens.
            </IssueContainer>
        )
    }
    
    if (isLoading || reloadInfo === undefined) {
        return (
            <IssueContainer>
                <Loader size={'40px'} stroke={'white'}/>
            </IssueContainer>
        )
    }

    if (account == null || account == undefined || chainId !== 1) {
        return (
            <IssueContainer>
                Please connect your Mainnet Ethereum wallet to access this page.
            </IssueContainer>
        )
    }

    return (
        <div className="genshards-dashboard">
            <div className="dashboard-title">dashboard</div>
            <div className="triplets-container">
                <InnerBox 
                    src={total_vested}
                    title={'Total Tokens'}
                    value={reloadInfo.total_locked}
                />
                <InnerBox 
                    src={claimed}
                    title={'Amount Claimed'}
                    value={reloadInfo.amount_claimed}
                />
                <InnerBox 
                    src={remaining}
                    title={'% Remaining'}
                    value={reloadInfo.percent_remaining}
                />
            </div>
            <div className="box-container large-box-container">
                <img src={withdraw} className="top-image" />
                <div className="box-info">Amount Available</div>
                <div className="box-withdraw-amount">{reloadInfo.available_withdraw}</div>
                <ButtonPrimary onClick={handleWithdraw} className="withdraw-button">Withdraw</ButtonPrimary>
            </div>
            <div className="footer">
                <div className="footer-section">
                    <div className="footer-title">
                    <div className="wallet-circle" style={{color: account === null || account === undefined ? '#ff0000' : ''}} /> Wallet Address
                    </div>
                    <div className="footer-response">
                        {account !== null && account !== undefined ? account : 'Error'}
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-title">
                        Token balance
                    </div>
                    <div className="footer-response">
                        {reloadInfo.token_balance}
                    </div>
                </div>
            </div>
        </div>
        
    )
}
  