import { useState, useRef, useEffect, useMemo } from "react"
import Checkbox from '../../../../../shared/components/checkbox'
import styled from 'styled-components'
import { ReactComponent as QMark } from '../../../../../images/qmark.svg'
import './style.sass'
import useOutsideAlerter from '../../../../../hooks/useOutsideAlerter'
import tickRedSvg from "../../../../../images/collections/tick-red.svg"

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
background: #f30071;
border-radius: 0px 9px 9px 0;
display: flex;
align-items: center;
justify-content: center;
`
interface ICommonFilters {
    filters: [];
    onChangeFilters: (value: boolean, outerIndex: number, innerIndex: number) => void
    characterAgility: any
    agilityFilter: any
    setAgilityFilter: any
    agilityRange: Number
    totalCollections: Number
}

const percantageBreakdown = [0, 20, 50, 80, 100]

export default function CommonFilters(props: ICommonFilters) {

    const { filters = [], onChangeFilters, characterAgility, agilityFilter, setAgilityFilter, agilityRange, totalCollections } = props
    const dropdownRef = useRef(null);
    const [openMenu, setOpenMenu] = useState(false)
    const clickedOutside = useOutsideAlerter(dropdownRef);

    useEffect(() => {
        if (clickedOutside && openMenu) {
            setOpenMenu(false)
        }
    }, [clickedOutside])

    const onChangeHandler = (outerIndex: number) => (value: boolean, innerIndex: number) => {
        onChangeFilters(value, outerIndex, innerIndex)
    }

    const onChangeAgilityFilter = (name: any, value: String) => {
        setAgilityFilter({
            ...agilityFilter,
            [name]: value
        })
    }

    const getAgilityNumbers = useMemo(() => {
        let arr = [] as any
        for (let i = 0; i < percantageBreakdown.length; i++) {
            const result = (Number(agilityRange) * percantageBreakdown[i]) / 100
            arr.push(result)
        }
        return arr
    }, []) as any

    const selectedAgility = characterAgility.find((agility: any) => agility.value === agilityFilter.selectedType)

    if(!totalCollections) {
        return null
    }

    return (
        <div className="content-filters-container">
            {
                filters.map((filter, index) => {
                    return <FilterCard
                        key={index}
                        filter={filter}
                        onChangeHandler={onChangeHandler(index)}
                    />
                })
            }
            <div className="content-filter-card">
                <div className="filter-card-item">
                    <div className="filter-heading">
                        <h2 onClick={() => setOpenMenu(prev => !prev)}>{selectedAgility.label} <span>{">"}</span></h2>
                        {openMenu ? <ul className="filter-dropdown" ref={dropdownRef}>
                            {
                                characterAgility.map((item: any, index: number) => {
                                    const isSelected = item.value === selectedAgility.value
                                    return <li key={index} className={isSelected ? "selected-item" : ""} onClick={() => onChangeAgilityFilter('selectedType', item.value)}>
                                        <span onClick={() => setOpenMenu(prev => !prev)}>
                                            <div className="red-tick">
                                                {
                                                    isSelected ? <img src={tickRedSvg} alt="" /> : null
                                                }
                                            </div>
                                            {item.label}
                                        </span>
                                    </li>
                                })
                            }
                        </ul> : null}
                    </div>
                    <div className="range-filters">
                        <div className="range-selector">
                            <h3>Range</h3>
                            <input className="range-input" type="range" min="0" max="150" value={agilityFilter.range} onChange={(e) => onChangeAgilityFilter('range', e.target.value)}></input>
                        </div>
                        <div className="range-filters-counter">
                            {
                                getAgilityNumbers.map((range: any, index: number) => {
                                    return <div key={index} className="agility-number-item">
                                        <span>|</span>
                                        <span>{range}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
interface IFilterCard {
    filter: any;
    onChangeHandler: any
}

function FilterCard(props: IFilterCard) {
    const { filter, onChangeHandler } = props
    const { filterTitle = '', filtersList = [] } = filter

    return (
        <div className="content-filter-card" >
            <div className="filter-card-item">
                <div className="filter-heading">
                    <h2>{filterTitle}</h2>
                </div>
                <div className="filter-options">
                    {
                        filtersList.map((item: any, index: number) => {
                            return <div key={index} className={`filter-item-card ${item.isChecked ? "active-item" : ""}`}>
                                <div className="label-checkbox">
                                    {/* <input type="checkbox" checked={item.isChecked} onChange={(e) => onChangeHandler(e.target.checked, index)} /> */}
                                    <Checkbox className="custom-checkbox" checked={item.isChecked} onChange={(e: any) => onChangeHandler(e.target.checked, index)} />
                                    <span>{item.label}</span>
                                </div>
                                <span className="filter-total">{item.total}</span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}