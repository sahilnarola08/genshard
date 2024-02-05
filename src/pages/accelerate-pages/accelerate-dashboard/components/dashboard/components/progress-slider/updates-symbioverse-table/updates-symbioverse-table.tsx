import React from 'react'
import "./updates-symbioverse-table.sass"
import Profile from '../../../../../../../../images/accelerate/pages/profile-img.svg'
import salman from '../../../../../../../../images/accelerate/pages/salman.svg'

const symbioverseData = [
    {
        image: Profile,
        title: "New project ‘Kisi Ki Bhai Kisi Ki Jaan’ has been added. Explore connecting with them!",
    },
    {
        image: salman,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        image: Profile,
        title: "New project ‘Kisi Ki Bhai Kisi Ki Jaan’ has been added. Explore connecting with them!",
    },
    {
        image: salman,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        image: Profile,
        title: "New project ‘Kisi Ki Bhai Kisi Ki Jaan’ has been added. Explore connecting with them!",
    },
    {
        image: salman,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        image: Profile,
        title: "New project ‘Kisi Ki Bhai Kisi Ki Jaan’ has been added. Explore connecting with them!",
    },
    {
        image: salman,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        image: Profile,
        title: "New project ‘Kisi Ki Bhai Kisi Ki Jaan’ has been added. Explore connecting with them!",
    },
    {
        image: salman,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
]

const Updatessymbioversetable = () => {
    return (
        <>
            <div className='update-section mt-lg-5 mt-4'>
                <h3 className='update-heading'>Updates from Symbioverse</h3>
                <div className='update-table mt-4'>
                    {symbioverseData && symbioverseData?.map((item: any, i: any) => (
                        <div className='d-flex align-items-center update-table-field'>
                            <div>
                                <img className='img-fluid' src={item.image} alt="" />
                            </div>
                            <p className='paragraph-new mb-0 ms-3'>{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Updatessymbioversetable