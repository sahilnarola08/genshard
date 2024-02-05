import { useEffect, useState, useMemo, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import ContentElements from './NftCollections'
import ContentFilters from './CommonFilters'
import "./style.sass"
import Modal from "../../../../shared/components/modal"
import NftSingleView from './NftSingleView'
import Button from '../../../../shared/components/buttons'
import styled from 'styled-components'
import { ReactComponent as QMark } from '../../../../images/qmark.svg'
import { getTicketMetadata } from '../../../../utils/genTicketMetadata'
import { getGenTicketUrl } from '../../../dashboard/dashboard.helpers'
import { INftCollection } from '../../types'
import axios from "axios"
import { apiBaseUrl, DIAMOND_HANDS_CONTRACT_ADDRESS, DIAMOND_HANDS_TOKEN_ADDRESS } from '../../../../constants'
import { useWeb3Contract, useWeb3FromWei, useWeb3ToWei } from '../../../../hooks/useContract'
import { AppState } from '../../../../state'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { abi as GEN_COLLECTION_ABI } from "../../../../contracts/GenCollection.json"
import moment from 'moment'
import { calculateGasMargin, getGenCollectionContract, getGenTokenContract } from '../../../../utils'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import GEN_TOKEN_ABI from "../../../../constants/abis/erc20.json"
import { abi as GEN_TOKEN_BSC_ABI } from "../../../../contracts/GenTokenBsc.json"

const QMarkStyled = styled(QMark)`
    opacity: 1.0;
    transition: 0.4s;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`

const IconWrapper = styled.div`
    width: 40px;
    background: #117DCC;
    border-radius: 0px 9px 9px 0;
    display: flex;
    align-items: center;
    justify-content: center;
`

const initialFilters = [
    {
        filterTitle: 'Character',
        filtersList: []
    },
    {
        filterTitle: 'Rarity',
        filtersList: []
    },
]

const sortByList = [
    {
        label: "Latest",
        value: "latest",
    },
    {
        label: "Most Favorite",
        value: "favorite",
    },
    {
        label: "Stake Amount",
        value: "price",
    },
]

const characterAgility = [
    {
        label: 'Attack',
        value: 'attack'
    },
    {
        label: 'Defence',
        value: 'defence'
    },
    {
        label: 'HP',
        value: 'hp'
    },
    {
        label: 'Magic Attack',
        value: 'magicAttack'
    },
    {
        label: 'Magic Defence',
        value: 'magicDefence'
    },
]

const contractAddress = DIAMOND_HANDS_CONTRACT_ADDRESS
const tokenAddress = DIAMOND_HANDS_TOKEN_ADDRESS
const approveValue = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const agilityRange = 150

const CollectionContent = (props: any) => {

    const { saveCollectionDataToHeader, onSetTokenBalance } = props

    const stakeContract = useWeb3Contract(GEN_COLLECTION_ABI)
    const network = useSelector((state: AppState) => state.application.network)
    const etherToWei = useWeb3ToWei()
    const etherFromWei = useWeb3FromWei()
    const { account: selectedAccount, chainId, library } = useActiveWeb3React()
    const [filters, setFilters] = useState<any>([...initialFilters])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedNftId, setSelectedNftId] = useState<Number>(0)
    const [collections, setCollections] = useState<INftCollection[]>([])
    const [showAquired, setShowAquired] = useState<Boolean>(false)
    const [dbCollections, setDbCollections] = useState<INftCollection[]>([])
    const [loader, setLoader] = useState<boolean>(false)
    const [cardLoader, setCardLoader] = useState<any>(null)
    const [agilityFilter, setAgilityFilter] = useState<any>({
        selectedType: 'attack',
        range: agilityRange
    })
    const [sortBy, setSortBy] = useState('price')
    const [openMobileFilters, setOpenMobileFilters] = useState(false)
    const [page, setPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const selectedSortBy = sortByList.find(item => item.value === sortBy)

    let tokenContract: any = null;
    let getTokenBscAbi = useWeb3Contract(GEN_TOKEN_BSC_ABI)
    let getTokenAbi = useWeb3Contract(GEN_TOKEN_ABI)

    if (Number(chainId) === 4 || Number(chainId) === 56) {
        tokenContract = getTokenBscAbi
    } else {
        tokenContract = getTokenAbi
    }

    useEffect(() => {
        onFetchNftCollections()
    }, [])

    useEffect(() => {

        if (!library || !chainId || !selectedAccount || !network) {
            // alert('Connect metamask')
            return
        }

        if (dbCollections.length && selectedAccount && network) {
            onFetchContractData()
            setShowAquired(false)
        }
        if (selectedAccount) onFetchUserbalance()
    }, [dbCollections, selectedAccount, network, chainId])

    const onPageChange = (e: any) => {
        setPage(e.selected || 0)
    }


    const onFetchNftCollections = async () => {
        try {
            setLoader(true)
            const response = await axios.get(apiBaseUrl + '/api/v1/collections')
            let collectionsData = ((response.data && response.data.values)) || []
            let filterRarity = [] as any
            let filterCharacter = [] as any
            collectionsData = collectionsData.map((collection: any) => {
                const isRarityExists = filterRarity.find((item: any) => item.label === collection.rarity)
                if (!!isRarityExists) {
                    const rarityIndex = filterRarity.findIndex((item: any) => item.label === collection.rarity)
                    filterRarity[rarityIndex] = {
                        ...isRarityExists,
                        total: isRarityExists.total + 1
                    }
                } else {
                    filterRarity.push({
                        label: collection.rarity, isChecked: false, total: 1
                    })
                }
                const isCharacterExists = filterCharacter.find((item: any) => item.label === collection.name)
                if (!!isCharacterExists) {
                    const characterIndex = filterCharacter.findIndex((item: any) => item.label === collection.name)
                    filterCharacter[characterIndex] = {
                        ...isCharacterExists,
                        total: isCharacterExists.total + 1
                    }
                } else {
                    filterCharacter.push({
                        label: collection.name, isChecked: false, total: 1
                    })
                }
                return {
                    ...collection,
                    left: 0,
                    isUserStaking: false,
                    isClaimReward: false
                }
            })

            setFilters([
                {
                    filterTitle: 'Character',
                    filtersList: filterCharacter
                },
                {
                    filterTitle: 'Rarity',
                    filtersList: filterRarity
                },
            ])
            setDbCollections(collectionsData)
            setLoader(false)
        } catch (ex) {
            setLoader(false)
            console.log(ex, 'Error while fetching NFT Collections')
        }
    }

    const onFetchUserCollectionVotes = () => {
        axios.get(`${apiBaseUrl}/api/v1/collections/getVotes`, { params: { nftId: dbCollections.map(collection => String(collection.nftId)), walletAddress: selectedAccount } })
            .then(res => {
                console.log(res.data, "votes data")
            }).catch(err => {
                console.log(err.message || 'Error while fetching user collection votes ')
            })
    }

    const onFetchUserbalance = async () => {
        try {
            const userBalance = await tokenContract(tokenAddress).methods.balanceOf(selectedAccount).call()
            onSetTokenBalance(etherFromWei(userBalance))
            return etherFromWei(userBalance)
        } catch (ex) {
            console.log(ex, 'Error in onFetchUserbalance')
            return 0
        }
    }

    const onFetchContractData = async () => {
        try {
            setLoader(true)
            if (dbCollections.length && selectedAccount) {
                onFetchUserCollectionVotes()
            }

            let updatedDbCollections = [...dbCollections]
            const contractInstance = stakeContract(contractAddress)
            
            const currentTime = moment().unix()
            for (let i = 0; i < updatedDbCollections.length; i++) {
                const collection = updatedDbCollections[i]
                let combinedResponse = [] as any
                try {
                    combinedResponse = await Promise.all([
                        contractInstance.methods.totalStaked(collection.nftId).call({ from: selectedAccount }),
                        tokenContract(tokenAddress).methods.allowance(selectedAccount, contractAddress).call(),
                        contractInstance.methods.cards(collection.nftId).call(),
                        contractInstance.methods.totalAmountStaked().call({ from: selectedAccount }), // top
                        contractInstance.methods.availableCards(collection.nftId).call(),
    
                    ])
                } catch (err) { console.log(err)}

                const [isUserStaking, tokenAllowance, cardsDetails, userTotalStaked, totalCards] = combinedResponse
                let remainingTimeUser = "0"
                let userReward = "0"
                let userStaked = "0"
                let userClaimed = "0"
                if (isUserStaking > 0) {

                    const userStakedResponse = await Promise.all([
                        contractInstance.methods.remainingTimeUser(collection.nftId).call({ from: selectedAccount }),
                        contractInstance.methods.totalReward(collection.nftId).call({ from: selectedAccount }), // accured reward
                        // contractInstance.methods.totalStaked(collection.nftId).call({ from: selectedAccount }),
                        // contractInstance.methods.totalClaimed(collection.nftId).call({ from: selectedAccount }),
                    ])
                    remainingTimeUser = userStakedResponse[0]
                    userReward = userStakedResponse[1]
                    userStaked = isUserStaking
                    // userClaimed = userStakedResponse[2]
                }

                let isApproved = false
                if (Number(tokenAllowance) > 0) isApproved = true

                const { count: cardCount = "0", value: cardValue = "0", duration: cardDuration = "0", reward: cardRewards = "0" } = cardsDetails

                updatedDbCollections[i] = {
                    ...collection,
                    isApproved,
                    total: totalCards,
                    stake: Number(etherFromWei(cardValue)),
                    cardDuration,
                    cardRewards: etherFromWei(cardRewards),
                    userReward: etherFromWei(userReward),
                    userClaimed: userClaimed, // etherFromWei(userClaimed),
                    userStaked: etherFromWei(userStaked),
                    userTotalStaked: etherFromWei(userTotalStaked),
                    left: Number(cardCount),
                    isUserStaking: isUserStaking > 0,
                    remainingTimeUser: String(remainingTimeUser),
                    isClaimReward: Number(remainingTimeUser) > currentTime
                }
            }

            saveCollectionDataToHeader(updatedDbCollections) /// send child data to parent component
            setCollections(updatedDbCollections)
            setLoader(false)
        } catch (ex) {
            setLoader(false)
            saveCollectionDataToHeader([])
            setCollections([])
            console.error(ex, 'onFetchContractData')
        }
    }

    const onChangeFilters = (value: boolean, outerIndex: number, innerIndex: number) => {
        const updatedFilters = [...filters]
        updatedFilters[outerIndex].filtersList[innerIndex].isChecked = value
        setFilters(updatedFilters)
    }

    const onSelectNft = useCallback((id: Number) => {
        setSelectedNftId(id)
        setOpenModal(true)
    }, [])

    const onClickApprove = async (collection: INftCollection) => {
        try {
            const genToken = getGenTokenContract(tokenAddress, chainId!, library!, selectedAccount!)
            setCardLoader(collection.nftId)
            const args = [contractAddress, approveValue]
            const estimatedGasLimit = await genToken.estimateGas.approve(...args, {})
            const transactionResponse: TransactionResponse = await genToken.approve(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            const waitResponse = await transactionResponse.wait()
            console.log(waitResponse, "waitResponse")
            await onFetchContractData()
            setCardLoader(null)
        } catch (ex) {
            console.log(ex, "Error in onClickApprove")
            setCardLoader(null)
        }
    }

    const onClickMint = async (collection: INftCollection) => {
        if (!collection) return
        try {
            setCardLoader(collection.nftId)
            const genCollection = getGenCollectionContract(contractAddress as any, chainId!, library!, selectedAccount!)
            const sendObj = {
                contractAddress,
                amount: 0,
                walletAddress: selectedAccount,
                nftId: collection.nftId
            }

            await axios.post(`${apiBaseUrl}/api/v1/stake/update`, sendObj)
            const args = [collection.nftId]
            const estimatedGasLimit = await genCollection.estimateGas.stakeTokens(...args, {})
            const transactionResponse: TransactionResponse = await genCollection.stakeTokens(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
            const waitResponse = await transactionResponse.wait()
            console.log(waitResponse, "waitResponse")
            await onFetchContractData()
            setCardLoader(null)
        } catch (ex) {
            console.error(ex, 'Something went wrong')
            setCardLoader(null)
        }
    }

    const onClickClaimRewards = async (collection: INftCollection) => {
        if (!collection) return
        try {
            setCardLoader(collection.nftId)
            const genCollection = getGenCollectionContract(contractAddress as any, chainId!, library!, selectedAccount!)
            const args = [collection.nftId]
            const estimatedGasLimit = await genCollection.estimateGas.claimReward(...args, {})
            const transactionResponse: TransactionResponse = await genCollection.claimReward(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit), })
            const waitResponse = await transactionResponse.wait()
            console.log(waitResponse, "waitResponse")
            await axios.post(`${apiBaseUrl}/api/v1/collections/stake`, { walletAddress: selectedAccount, contractAddress, tokenAddress })
            await onFetchContractData()
            setCardLoader(null)
        } catch (ex) {
            console.error(ex, 'Something went wrong')
            setCardLoader(null)
        }
    }

    const onClickClaimAndWithdraw = async (collection: INftCollection) => {
        if (!collection) return
        try {
            setCardLoader(collection.nftId)
            const genCollection = getGenCollectionContract(contractAddress as any, chainId!, library!, selectedAccount!)
            const args = [collection.nftId]
            const estimatedGasLimit = await genCollection.estimateGas.claimAndWithdrawAll(...args, {})
            const transactionResponse: TransactionResponse = await genCollection.claimAndWithdrawAll(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit), })
            const waitResponse = await transactionResponse.wait()
            console.log(waitResponse, "waitResponse")
            await axios.post(`${apiBaseUrl}/api/v1/collections/removeStake`, { walletAddress: selectedAccount, contractAddress, tokenAddress })
            await onFetchContractData()
            setCardLoader(null)
        } catch (ex) {
            console.error(ex, 'Something went wrong')
            setCardLoader(null)
        }
    }

    const onClickAddVote = async (collection: INftCollection) => {
        try {
            setCardLoader(collection.nftId)
            const { nftId } = collection
            await axios.post(`${apiBaseUrl}/api/v1/collections/addVote`, { nftId: String(nftId), walletAddress: selectedAccount })
            const nftIdIndex = dbCollections.findIndex(collection => collection.nftId === nftId)
            if (nftIdIndex > -1) {
                let updatedDbCollections = [...dbCollections]
                updatedDbCollections[nftIdIndex] = {
                    ...collection,
                    likeCount: Number(collection.likeCount) + 1
                }
                setDbCollections(updatedDbCollections)
            }
            setCardLoader(null)
        } catch (ex) {
            setCardLoader(null)
            console.error(ex || 'Error while adding votes')
        }
    }

    const onChangeActiveTab = () => {
        setShowAquired(prev => !prev)
        setPage(0)
        setSearchTerm('')
        setAgilityFilter({
            selectedType: 'attack',
            range: agilityRange
        })
    }

    const selectedNft = useMemo(() => {
        return collections.find((item: INftCollection) => item.nftId === selectedNftId)
    }, [selectedNftId, collections])

    const filteredNfts = useMemo(() => {
        return collections.filter((item: INftCollection) => {
            let characterCheck = true
            let rarityCheck = true

            const checkedCharacters = filters[0] && filters[0].filtersList.filter((filter: any) => filter.isChecked === true)
            if (checkedCharacters.length) {
                characterCheck = !!checkedCharacters.find((filter: any) => filter.label === item.name) || false
            }

            const checkedRarity = filters[1] && filters[1].filtersList.filter((filter: any) => filter.isChecked === true)
            if (checkedRarity.length) {
                rarityCheck = !!checkedRarity.find((filter: any) => filter.label === item.rarity) || false
            }

            const selectedAgility = characterAgility.find((agility: any) => agility.value === agilityFilter.selectedType)
            let selectedCharacterStatus = item.characterStatus.find(item => item.name === selectedAgility?.label)
            let agilityCheck = selectedCharacterStatus && Number(selectedCharacterStatus.progress) < agilityFilter.range

            let isSearchTermMatch = (item.name.toLowerCase().includes(searchTerm.toLowerCase())) || (item.rarity.toLowerCase().includes(searchTerm.toLowerCase()))

            return (showAquired ? item.isUserStaking : !item.isUserStaking) && rarityCheck && characterCheck && agilityCheck && isSearchTermMatch
        })
    }, [collections, showAquired, filters, agilityFilter, searchTerm])

    const sortedCollections = useMemo(() => {
        let updatedCollections = [...filteredNfts].sort((a, b) => {
            if (sortBy === 'price') {
                if (a.stake < b.stake) return -1
                if (a.stake > b.stake) return 1
            } else if (sortBy === 'latest') {
                if (a.createdDate > b.createdDate) return -1
                if (a.createdDate < b.createdDate) return 1
            } else if (sortBy === 'favorite') {
                if (a.likeCount > b.likeCount) return -1
                if (a.likeCount < b.likeCount) return 1
            } else {
                return 0
            }
            return 0
        })

        if (page === 0) {
            updatedCollections.splice(6, 6)
        } else {
            updatedCollections.splice(0, 6)
        }
        return updatedCollections
    }, [sortBy, page, filteredNfts])

    if (loader) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div className="loading-wrapper">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="collection-content-container">
            <div className="search-aquired-nft">
                <div className="search-field">
                    <input type="text" placeholder={`Search items...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <IconWrapper>
                        <QMarkStyled />
                    </IconWrapper>
                </div>

                <div className='paginaton-and-sort-by'>
                    <div className='sort-by-container' >
                        <h4>Sort By</h4>
                        <div className='sort-by-options'>
                            {
                                sortByList.map((item, index) => {
                                    const isSelected = item.value === sortBy
                                    return <div key={index} className={`sort-option-item ${isSelected ? 'active-item' : ''}`} onClick={() => setSortBy(item.value)}>
                                        <span>{item.label}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="aquired-nft">
                    <Button className={showAquired ? "aquired-active" : ""} onClick={onChangeActiveTab}>My Collection</Button>
                </div>
            </div>

            <div className="collection-content-main">
                <div className='dekstop-view-filters'>
                    <ContentFilters
                        filters={filters}
                        agilityRange={agilityRange}
                        agilityFilter={agilityFilter}
                        totalCollections={collections.length}
                        setAgilityFilter={setAgilityFilter}
                        characterAgility={characterAgility}
                        onChangeFilters={onChangeFilters}
                    />
                </div>
                <ContentElements
                    page={page}
                    onPageChange={onPageChange}
                    nftCollections={sortedCollections}
                    totalCollections={filteredNfts.length}
                    onSelectNft={onSelectNft}
                    onClickMint={onClickMint}
                    cardLoader={cardLoader}
                    setOpenMobileFilters={setOpenMobileFilters}
                    showAquired={showAquired}
                    onClickApprove={onClickApprove}
                    onClickClaimRewards={onClickClaimRewards}
                    onClickClaimAndWithdraw={onClickClaimAndWithdraw}
                />
            </div>
            <Modal
                isOpen={openModal}
                kycChanges
                isBlackClose
                onClose={() => setOpenModal(false)}
            >
                <NftSingleView
                    collection={selectedNft}
                    onClose={() => setOpenModal(false)}
                    onClickMint={onClickMint}
                    cardLoader={cardLoader}
                    onClickAddVote={onClickAddVote}
                    onClickApprove={onClickApprove}
                    onClickClaimRewards={onClickClaimRewards}
                    onClickClaimAndWithdraw={onClickClaimAndWithdraw}
                />
            </Modal>

            {openMobileFilters ? <div className='mobile-view-filters'>
                <div className='filters-and-clear'>
                    <div className='close-filters' onClick={() => setOpenMobileFilters(false)}>
                        <p><span>X</span> Filters</p>
                    </div>
                    <div className='clear-all'>
                        <p>Clear All <span>X</span></p>
                    </div>
                </div>
                <div className='sort-by-mobile'>
                    <h3>Sort By</h3>
                    <div>
                        <p>{selectedSortBy?.label}<span>{">"}</span></p>
                    </div>
                </div>
                <ContentFilters
                    filters={filters}
                    agilityRange={agilityRange}
                    totalCollections={collections.length}
                    agilityFilter={agilityFilter}
                    setAgilityFilter={setAgilityFilter}
                    characterAgility={characterAgility}
                    onChangeFilters={onChangeFilters}
                />
            </div> : null}
        </div>
    )
}

export default CollectionContent
