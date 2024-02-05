import CollectionContent from "./components/collection-content"
import CollectionHeader from "./components/collection-header"
import "./style.sass"
import { useState } from "react"

export default function Collection() {

    const [collections, setCollections] = useState([])
    const [tokenBalance, setTokenBalance] = useState<Number>(0)

    const saveCollectionDataToHeader = (nftCollections: any) => {
        setCollections(nftCollections)
    }

    const onSetTokenBalance = (tokenBalance: Number) => {
        setTokenBalance(tokenBalance)
    }

    return (
        <div className="collection-container">
            <CollectionHeader
                collections={collections}
                tokenBalance={tokenBalance}
            />
            <CollectionContent
                saveCollectionDataToHeader={saveCollectionDataToHeader}
                onSetTokenBalance={onSetTokenBalance}
            />
        </div>
    )
}