import React from 'react'
import './radio-dropdown.sass'

export interface DropdownData {
    BtnName: string,
    dropdownValues: any,
}

export const RadioDropdown = (props: DropdownData) => {
    const { BtnName, dropdownValues } = props
    return (
        <>
            <div className="dropdown-list-type">
                <div className="dropdown malti-dropdown">
                    <button className="btn btn-secondary dropdown-toggle w-auto m-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">{BtnName}</button>
                    <ul className="dropdown-menu">
                        {dropdownValues && dropdownValues.map((value: any, i: number) => (
                            <li key={i}>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={BtnName} id={BtnName+i} defaultChecked />
                                    <label className="form-check-label paragraph-new-small" htmlFor={BtnName+i}>{value}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
