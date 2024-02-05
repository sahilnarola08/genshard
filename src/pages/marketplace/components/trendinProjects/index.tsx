import { useEffect, useState } from "react"
import projectBackgroung from '../../../../images/marketplace/46_1024x631 1.png'
import profileImage from '../../../../images/marketplace/getty_481292845_77896 1.png'
import projectBackgroung2 from '../../../../images/marketplace/you_belong_to_me_by_aquasixio-d799lr2 1.png'
import profileImage2 from '../../../../images/marketplace/20190502194704-ent19-june-editorsnote 1.png'
import projectBackgroung3 from '../../../../images/marketplace/neoncity_by_joeyjazz_dekl5mu-350t 1.png'
import profileImage3 from '../../../../images/marketplace/dwayne-the-rock- 1.png'
import { useHistory, useRouteMatch } from 'react-router-dom';

import './style.sass'
import { INftCollection } from "../.."
import axios from "axios"
import { apiBaseUrl } from "../../../../constants"

const maxDesclength = 130

const TrendingProjects = () => {

    const { path } = useRouteMatch()
    const history = useHistory();
    const TrendingProjectData = [
        {
            projectBackgroung: projectBackgroung,
            profileImage: profileImage,
            heading: "PRJKT",
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            projectBackgroung: projectBackgroung2,
            profileImage: profileImage2,
            heading: "PRJKT",
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            projectBackgroung: projectBackgroung3,
            profileImage: profileImage3,
            heading: "PRJKT",
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    const [collections, setCollection] = useState<INftCollection[]>([])

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/collection/get/all?limit=3&sortBy=top_selling`).then(({ data }) => {
            console.log('TrendingProjectsTrendingProjects', data);
            setCollection(data.values || [])
        })
    }, [])


    return (
        <div className="trending-project-container">
            <div className="custome-container">
            <div className="trending-project-heading">TRENDING COLLECTIONS</div>
            <hr className="styled-underline" />
            <div className="card-wrapper">
                {collections.map((value) =>
                    // <div className="card-container">
                    <div className="card" onClick={() => history.push(`/collection/${value?.chainId}/${value?.collectionAddress}`)}>
                        <div className="upper">
                            <img src={value.logoImage} alt="" />
                        </div>
                        <div className="user">
                            <div className="profile">
                                <img src={value.user.profileImage || "/images/avtar.svg"} alt="" />
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-body-container">
                                <div className="profile-header">{value.name || "User"}</div>
                                <div className="body-content">
                                    {value.description ? (value.description.substring(0, maxDesclength).concat(value.description.length > maxDesclength ? "..." : "")) : "..."}

                                </div>
                                <div>
                                    <button className="explore-button" onClick={() => history.push(`/collection/${value?.chainId}/${value?.collectionAddress}`)}>explore</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    // </div>
                )}
            </div>
            </div>
        </div>
    )
}

export default TrendingProjects