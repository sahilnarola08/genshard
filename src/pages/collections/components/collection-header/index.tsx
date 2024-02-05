import './style.sass'
import { useState, useEffect, useMemo } from "react"
import { useWeb3Contract, useWeb3FromWei } from '../../../../hooks/useContract'
import { abi as GEN_COLLECTION_ABI } from "../../../../contracts/GenCollection.json"
import { DIAMOND_HANDS_CONTRACT_ADDRESS } from '../../../../constants'
import { useActiveWeb3React } from '../../../../hooks/web3'

export default function CollectionHeader(props: any) {

    const { collections = [], tokenBalance = 0 } = props
    const etherFromWei = useWeb3FromWei()
    const stakeContract = useWeb3Contract(GEN_COLLECTION_ABI)
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()

    const [totalEarned, setTotalEarned] = useState('0')

    useEffect(() => {
        if (selectedAccount && chainId) {
            (async () => {
                const earnedAmount = await stakeContract(DIAMOND_HANDS_CONTRACT_ADDRESS).methods.userRewards(selectedAccount).call()
                setTotalEarned(etherFromWei(earnedAmount))
            })()
        }
    }, [selectedAccount, chainId])

    const contractResult = useMemo(() => {
        let totalStakedAmount = 0
        let yourBalance = 0
        let yourStackedAmount = 0
        // let youEarned = 

        const colLength = (Array.isArray(collections) && collections.length) || 0
        for (let i = 0; i < colLength; i++) {
            const collection = collections[i]
            if (i === 0) {
                totalStakedAmount = collection.userTotalStaked
            }
            yourBalance = yourBalance + collection
            yourStackedAmount = yourStackedAmount + Number(collection.userStaked)
            // youEarned = youEarned + Number(collection.userClaimed)
        }

        return {
            totalStakedAmount,
            yourBalance,
            yourStackedAmount
        }

    }, [collections])

    const totalStaked = [
        {
            label: 'Total staked',
            value: `${contractResult.totalStakedAmount}`,
            token: 'GS'
        },
        {
            label: 'Your balance',
            value: `${Number(tokenBalance).toFixed(2)}`,
            token: 'GS'
        },
        {
            label: 'Your staked amount',
            value: `${contractResult.yourStackedAmount}`,
            token: 'GS'
        },
        {
            label: 'You earned',
            value: `${Number(totalEarned).toFixed(2)}`,
            token: 'GSK'
        },
    ]

    return (
        <div className="collection-header-container">
            <div className="header-container-item">
                <div className="header-types">
                    <h2>GenVerse</h2>
                    <h1>Diamond Hands NFT Collection</h1>
                    <h3>First Gen-characters of the GenVerse with some unique benefits.</h3>
                </div>
                <div className="total-staked-container">
                    <div className="total-stake-item">
                        {
                            totalStaked.map((item, index) => {
                                return <div key={index} className="total-stake">
                                    <span>{item.label} {item.value} {item.token}</span>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}