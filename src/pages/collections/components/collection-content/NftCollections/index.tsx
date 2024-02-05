import Button from '../../../../../shared/components/buttons'
import './style.sass'
import likeCountIcon from "../../../../../images/collections/like-count-white.svg"
import ReactPlayer from 'react-player'
import { INftCollection } from '../../../types'
import Pagination from '../../../../../shared/components/Pagination'
import filterIconSvg from "../../../../../images/collections/filter-icon-white.svg"
import { isVideoFormat } from '../../../../market/helper'

export default function NftCollections(props: INftCollections) {
    const {
        nftCollections = [],
        onSelectNft,
        onClickMint,
        onClickClaimRewards,
        onClickClaimAndWithdraw,
        onClickApprove,
        cardLoader,
        showAquired,
        setOpenMobileFilters,
        page,
        onPageChange,
        totalCollections
    } = props

    const totalPages = Math.ceil(totalCollections / 6)
    return (
        <div className="content-elements-container">
            <div className='pagination-container'>
                <div className='mobile-view-filter' onClick={() => setOpenMobileFilters((prev: any) => !prev)}>
                    <img src={filterIconSvg} alt='' />
                </div>
                {nftCollections.length ? <div className='pagination-item'>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div> : null}
            </div>
            <div className="content-elements-item">
                {
                    nftCollections.length ? nftCollections.map((nft: INftCollection, index: number) => <CollectionCard
                        key={index}
                        collection={nft}
                        cardLoader={cardLoader}
                        onClickApprove={onClickApprove}
                        onSelectNft={onSelectNft}
                        onClickMint={onClickMint}
                        onClickClaimRewards={onClickClaimRewards}
                        onClickClaimAndWithdraw={onClickClaimAndWithdraw}
                    />) : <div className='no-nft-available'><p>No {showAquired ? "Acquired" : ""} NFT available.</p></div>
                }
            </div>
            <div className='pagination-container'>
                <div />
                {nftCollections.length ? <div className='pagination-item'>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div> : null}
            </div>
        </div>
    )
}

interface INftCollections {
    cardLoader: any
    showAquired: Boolean
    onSelectNft: (value: Number) => void,
    nftCollections: INftCollection[],
    onClickApprove: (collection: INftCollection) => void
    onClickMint: (collection: INftCollection) => void
    onClickClaimRewards: (collection: INftCollection) => void
    onClickClaimAndWithdraw: (collection: INftCollection) => void
    setOpenMobileFilters: any
    page: number
    onPageChange: any
    totalCollections: number
}

const CollectionCard = (props: ICollectionCard) => {
    const { collection, onSelectNft, onClickMint, onClickClaimRewards, onClickClaimAndWithdraw, onClickApprove, cardLoader } = props
    const { name, left, total, stake, likeCount, img: src, nftId, isClaimReward, isUserStaking, isApproved, rarity } = collection
    // const isButtonDisabled = (left === 0 && (!isUserStaking || isApproved))
    const isButtonDisabled = !isUserStaking ? left === 0 : false
    const combinedName = name + '-' + rarity
    const videoFormat = isVideoFormat(src.toString());
    return (
        <div className="collection-card-container">
            <div className="collection-card-item" onClick={() => onSelectNft(nftId)} >
                {(cardLoader === nftId) ? <div className="single-card-loader">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                </div> : cardLoader ? <div className="remaining-card-disable"></div> : null}
                <div className="collection-image">
                    <div className="like-count"><img src={likeCountIcon} alt="" />{likeCount ? <span>{likeCount}</span> : null}</div>
                    {
                      videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} loop={true} muted={true} url={src.toString()} onClick={() => onSelectNft(nftId)} />
                      : <img src={src.toString()} alt="" />
                    }
                    {/* {
                        src !== undefined && src.substr(src.length - 3) === 'mp4' ?
                            <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} loop={true} muted={true} url={src.toString()} onClick={() => onSelectNft(nftId)} />
                            : <img src={src.toString()} alt="" />
                    } */}
                </div>
                <div className="collection-stake-button">
                    <div className="stake-info">
                        <span>Stake</span>
                        <p>{stake} GS</p>
                    </div>
                    <Button
                        className={isButtonDisabled ? "disable-button" : ""}
                        disabled={isButtonDisabled}
                    // onClick={() => {
                    //     return !isApproved ? onClickApprove(collection) :
                    //         (isUserStaking && isClaimReward) ? onClickClaimRewards(collection) :
                    //             isUserStaking ? onClickClaimAndWithdraw(collection) : onClickMint(collection)

                    // }}
                    >
                        {!isApproved ? "APPROVE" : (isUserStaking && isClaimReward) ? "CLAIM" : isUserStaking ? "CLAIM" : "OWN"}
                    </Button>
                </div>
            </div>
            <div className="total-nft-left">
                <span>Left <span>{left}</span> from {total}</span>
            </div>
        </div >
    )
}

interface ICollectionCard {
    collection: INftCollection
    cardLoader: any
    onClickApprove: (collection: INftCollection) => void
    onSelectNft: (value: Number) => void
    onClickMint: (collection: INftCollection) => void
    onClickClaimRewards: (collection: INftCollection) => void
    onClickClaimAndWithdraw: (collection: INftCollection) => void
}