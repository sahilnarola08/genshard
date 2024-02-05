import { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import "./style.sass"
import moment from "moment"

const baseUrl = process.env.REACT_APP_API_BASE_URL || ''

export default function GsAcademy() {

    const history = useHistory()
    const [academy, setAcademy] = useState([])

    useEffect(() => {
        getInitialAcademy()
    }, [])

    const getInitialAcademy = () => {
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + '/api/v1/academy', { params: { limit: 3 } }).then(res => {
                setAcademy(res.data.values || [])
                resolve(res.data)
            }).catch(err => {
                console.log(err)
                resolve({ values: [], total: 0 })
            })
        })
    }

    return (
        <div className="academy-container">
            <div className="academy-header">
                <h1>GS Academy</h1>
            </div>
            <div className="academy-cards-container">
                {
                    academy.length ? academy.map((item, index) => <AcademyCard
                        key={index}
                        cardDetails={item}
                    />)
                        : <div className="no-project-found"><p>No Academy Found.</p></div>
                }
            </div>
            <div className="academy-bottom">
                <p onClick={() => history.push('/community/academy')}>{'See All ->'}</p>
            </div>
        </div>
    )
}


export function AcademyCard(props: any) {
    const { cardDetails = {} } = props
    const { _id = '', type = '', image = '', heading = '', publishedDate = '', description = '', link = '' } = cardDetails
    const convertedDate = moment(Number(publishedDate * 1000)).format('MMMM Do, YYYY')
    return (
        <Link to={`/community/academy/${_id}`} className="academy-card-item">
            {/* <a href={link} target="_blank" className="academy-card-item"> */}
            <div className="academy-card">
                <div className="academy-image">
                    <img src={image} alt="" />
                    <div className={`academy-type ${type === 'newsletter' ? 'newsletter' : 'report'}`}><span>{type}</span></div>
                </div>

                <div className="academy-inner">
                    <div className="academy-heading">
                        <h3>{heading}</h3>
                    </div>
                    <div className="academy-paragraph">
                        <p>{description}</p>
                    </div>
                    <div className="academy-published">
                        <span>Published on {convertedDate}</span>
                    </div>
                </div>
            </div>
            {/* </a> */}
        </Link>
    )
}