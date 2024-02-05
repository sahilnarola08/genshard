import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { apiBaseUrl } from '../../constants'
import { searchToObject } from '../../utils'
import { INftCategory, INftCollection } from '../marketplace'
import "./style.sass"

const ExploreNFTs = () => {
    const history = useHistory()
    let { categoryId = "" } = searchToObject(window.location.search) as { categoryId: string }
    const [categories, setCategories] = useState<INftCategory[]>([])
    const [collections, setCollections] = useState<INftCollection[]>([])
    const [selectedCatId, setSelectedCatId] = useState<string>(categoryId || "all")
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        const catId = selectedCatId || categoryId
        getCollections(catId)

        let searchQuery = `/explore-nfts`
        if (catId && catId !== "all") searchQuery = `/explore-nfts?categoryId=${catId}`
        window.history.replaceState(null, "", searchQuery)
    }, [selectedCatId])

    const getCollections = (categoryId: string) => {
        setCollections([])
        if (!categoryId || categoryId === "all") categoryId = ""
        setLoader(true)
        axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/collection/get/all?categoryId=${categoryId}&withStats=true`)
            .then(({ data }) => {
                console.log("datadata", data);
                setCollections(data.values || [])
                setLoader(false)
            })
            .catch((err) => {
                setLoader(false)
            })
    }

    const getCategories = () => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/categories`).then(({ data }) => {
            setCategories(data.values || [])
        })
    }

    const displayCategories = useMemo(() => {
        return [{ _id: "all", name: "All" }, ...categories]
    }, [categories])

    return (
        <>
        <div className="explore-nfts">
            <div className="explore-nfts-main-text">Explore Collections</div>
            <hr className='explore-nft-hr' /><div className="explore-nft-collection-item-activity">
                {
                    displayCategories.length > 1 ?
                        displayCategories?.map((cat) => <div key={cat._id} onClick={() => setSelectedCatId(cat._id)} className={cat._id === selectedCatId ? "selected-tab content-tab" : "content-tab"}>{cat.name}</div>)
                        : <div style={{ textAlign: "center", color: "white" }}>Loading Categories...</div>
                }
            </div>

            {collections.length > 0 ? <div className="explore-nfts-wrapper">
                {
                    !loader && collections.map((collection) =>
                        <div className="explore-nfts-card" key={collection._id} onClick={() => history.push(`/collection/${collection.chainId}/${collection.collectionAddress}`)}>
                            <div className="explore-nfts-card-image" onClick={() => history.push(`/collection/${collection.collectionAddress}`)}>
                                <img src={collection.bannerImage || `/images/explore-nft.png`} alt="avtar" />
                            </div>
                            <div className="explore-nfts-card-description">
                                <div className="explore-nfts-card-user">
                                    <img src={collection.logoImage} alt="avtar" />
                                </div>
                                <div className="explore-nfts-card-main-title">{collection.name}</div>
                                <div className="explore-nfts-card-sub-label">{collection.description && collection.description.length > 0 ? collection.description : "This collection has no description yet."}</div>
                                <div className='explore-nfts-card-teams'>
                                    <div className='explore-nfts-card-team-wrapper'>
                                        <div className='explore-nfts-card-team-value'>{Number(collection.totalItems)?.toFixed(0)}</div>
                                        <div className='explore-nfts-card-team-label'>Items</div>
                                    </div>
                                    {/* <div className='explore-nfts-card-team-wrapper'>
                                        <div className='explore-nfts-card-team-value'>{collection.totalOwners}</div>
                                        <div className='explore-nfts-card-team-label'>Owners</div>
                                    </div> */}
                                    <div className='explore-nfts-card-team-wrapper'>
                                        <div className='explore-nfts-card-team-value'>{Number(collection.totalVolume)?.toFixed(4)}</div>
                                        <div className='explore-nfts-card-team-label'>Volume</div>
                                    </div>
                                    <div className='explore-nfts-card-team-wrapper'>
                                        <div className='explore-nfts-card-team-value'>{Number(collection.lowestPrice)?.toFixed(4)}</div>
                                        <div className='explore-nfts-card-team-label'>Floor Price</div>
                                    </div>
                                    <div className='explore-nfts-card-team-wrapper'>
                                        <div className='explore-nfts-card-team-value'>{Number(collection.topPrice)?.toFixed(4)}</div>
                                        <div className='explore-nfts-card-team-label'>Best Offer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div> : loader ? <div className='explore-nfts-wrapper'>
                <div className='collection-loader'><span>Loading Collections...</span></div>
            </div> : <div className="no-listing-data">
                <img src="/images/no-listing-data.svg" alt="no listing" />
                <div className="description">No Collections Available</div>
            </div>}
        </div >
        </>
    )
}

export default ExploreNFTs