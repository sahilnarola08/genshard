import React from 'react'
import { RadioDropdown } from '../radio-dropdown/radio-dropdown'

const dropdownData = [
    {
        btnName: "Accelerate ONLY",
        dropdown: [
            "Accelerate ONLY",
            "Accelerate ONLY",
            "Accelerate ONLY",
            "Accelerate ONLY",
        ]
    },
    {
        btnName: "Area",
        dropdown: [
            "Area",
            "Area",
            "Area",
            "Area",
        ]
    },
]

const Filterlist = () => {
    return (
        <>
            <div className="table-filter-content">
                <div className="heading-table">
                    <p className='paragraph-new fw-bold mb-0'>Filter List by</p>
                    {dropdownData && dropdownData.map((item: any, index: number) => (
                        <RadioDropdown
                            key={index}
                            BtnName={item.btnName}
                            dropdownValues={item.dropdown}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Filterlist