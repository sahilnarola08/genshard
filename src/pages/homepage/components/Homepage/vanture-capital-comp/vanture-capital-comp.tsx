import React, { useState } from 'react';
import './vanture-capital-comp.sass';
import worldCryptoidLogo from "../../../../../images/homepage/world-cryptoids-logo.svg";
import ventureTopBgImg from "../../../../../images/homepage/venture-top-bg-img.svg";
import WorldCryptoidsLogo from "../../../../../images/homepage/world-cryptoids-logo.svg"
import SatorLogo from "../../../../../images/homepage/sator-logo.svg";
import EcnoladgerLogo from "../../../../../images/homepage/ecnoladger-logo.svg";
import DuelistKingLogo from "../../../../../images/homepage/duelist-king-logo.svg"

const chainPartner = [
    {
        firstRow: [
            {
                image: "",

            },
            {
                image: ''
            },
            {
                image: ''
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
        ],
    },
    {
        firstRow: [
            {
                image: SatorLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: EcnoladgerLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: '',
            },
            {
                image: SatorLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: '',
            },
            {
                image: SatorLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: WorldCryptoidsLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: WorldCryptoidsLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: SatorLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
        ],
    },
    {
        firstRow: [
            {
                image: "",
            },
            {
                image: EcnoladgerLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: "",
            },
            {
                image: "",
            },
            {
                image: "",
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: "",
            },
            {
                image: WorldCryptoidsLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
            {
                image: WorldCryptoidsLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
        ],
    },
    {
        firstRow: [
            {
                image: '',
            },
            {
                image: SatorLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: EcnoladgerLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: EcnoladgerLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: "",
            },
            {
                image: WorldCryptoidsLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: DuelistKingLogo,
                title: "show or hide an",
                description: "Let’s take a look at how we can show or hide an element when hovering over another element in React"
            },
            {
                image: '',
            },
        ],
    },
]

export const VantureCapitalComp = () => {
    const [modelData, setModelData] = useState<any>()
    return (
        <>
            <div className="div-bg">
                <div className="div-bg-padding">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-md-10 col-sm-12 position-relative">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-md-6 col-6 position-relative left-images">
                                    <img src={ventureTopBgImg} className='img-fluid' alt="" />
                                    <img src={modelData && modelData.image || worldCryptoidLogo} className={modelData && modelData.image ? 'img-fluid image-2 open' : "img-fluid image-2"} alt="" />
                                </div>
                                <div className="col-lg-6 col-md-6 col-6 align-self-center">
                                    <h2 className={modelData && modelData.title ? 'fs-47 text-start open' : "fs-47 text-start"}>{modelData && modelData.title || "World of Cryptoids"}</h2>
                                    <p className={modelData && modelData.description ? 'paragraph-new-medium mb-0 mt-lg-3 mt-md-3 mt-2 open' : "paragraph-new-medium mb-0 mt-lg-3 mt-md-3 mt-2"} >{modelData && modelData.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="bottom-table-view">
                                <table className="table">
                                    <tbody>
                                        {chainPartner && chainPartner.map((items: any, index: number) => (
                                            <tr key={index}>
                                                {items && items?.firstRow.map((item: any, i: number) => (
                                                    <td key={i} role='button' onMouseEnter={() => item && setModelData(item)} onMouseLeave={() => setModelData([])}>
                                                        <img src={item.image && item.image || ""} className='img-fluid' alt="" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
