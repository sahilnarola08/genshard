import { useEffect, useState } from "react"
import './style.sass'
import browseProject1 from '../../../../images/marketplace/c52396117174479.png'
import browseProject2 from '../../../../images/marketplace/images-31.png'
import browseProject3 from '../../../../images/marketplace/unnamed.png'
import browseProject4 from '../../../../images/marketplace/images.png'
import browseProject5 from '../../../../images/marketplace/images-2.png'
import browseProject6 from '../../../../images/marketplace/digital-art-a-revolutionary-form-of-art.png'
import browseProject7 from '../../../../images/marketplace/UTMR76qhQbgQdqqcFLhgHP.png'
import browseProject8 from '../../../../images/marketplace/ghost-final.png'
import browseProject9 from '../../../../images/marketplace/image4.png'
import { useHistory } from 'react-router'
import axios from "axios"
import { apiBaseUrl } from "../../../../constants"
import { INftCategory } from "../.."

const BrowseByCategory = () => {
    const history = useHistory()
    const [categories, setCategories] = useState<INftCategory[]>([])

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/categories`).then(({ data }) => {
            setCategories(data.values || [])
        })
    }, [])

    return (
        <div className="browse-project">
            <div className="browse-project-heading">BROWSE BY CATEGORY</div>
            <hr className="styled-underline" />
            <div className="custome-container">
                <div className="category-container">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="category-wrapper"
                            onClick={() => history.push(`/explore-nfts?categoryId=${category._id}`)}
                        >
                            <div className="category-list" style={{
                                background: `linear-gradient(to bottom, rgba(22, 22, 28, 0.75), rgba(22, 22, 28, 0.75)), url(${category.image})`,
                            }}>
                                <div className="category-name">
                                    {category.name}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div className="button-container">
                <button className='styled-button' onClick={() => history.push('/explore-nfts')}>SEE ALL NFTs</button>
            </div>
        </div>
    )
}

export default BrowseByCategory
