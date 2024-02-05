import { useEffect, useState } from 'react'
import { AcademyCard } from '.'
import { useHistory } from "react-router-dom"
import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL || ''

export default function AllAcademy() {

    const history = useHistory()
    const [academy, setAcademy] = useState([])
    const [filters, setFilters] = useState({
        limit: 20,
        skip: 0
    })

    useEffect(() => {
        window.scrollTo(110, 0);
        getInitialAcademy()
    }, [])

    const getInitialAcademy = () => {
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + '/api/v1/academy', { params: { limit: filters.limit, skip: filters.skip } }).then(res => {
                setAcademy(res.data.values || [])
                resolve(res.data)
            }).catch(err => {
                console.log(err)
                resolve({ values: [], total: 0 })
            })
        })
    }

    return (
        <div className="community-pg">
            <div className="gs-academy-main">
                <div className="community-container">
                    <div className="academy-container">
                        <div className="academy-header">
                            <span onClick={() => history.push('/community')}>{'<'}</span>
                            <h1>GS Academy</h1>
                        </div>
                        <div className="academy-cards-container">
                            {
                                academy.length ? academy.map(item => <AcademyCard cardDetails={item} />)
                                    : <div className="no-project-found"><p>No Academy Found.</p></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
