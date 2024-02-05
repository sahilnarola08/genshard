import React, { useState } from 'react';
import './partner-grid-list.sass';
import AvalanceLogo from "../../../../../../images/homepage/avalance-logo.svg"
import BinanceLogo from "../../../../../../images/homepage/binance-logo.svg"
import EtheriumLogo from "../../../../../../images/homepage/etherium-logo.svg"
import HarmonyLogo from "../../../../../../images/homepage/harmony-logo.svg"
import RbtrumLogo from "../../../../../../images/homepage/rbtrum-logo.svg"
import PoligonLogo from "../../../../../../images/homepage/poligon-logo.svg"
import partnerSvg from "../../../../../../images/ecosystem/partner-crypto-popp-svg.svg"
import worldCryproIMG from '../../../../../../images/homepage/world-cryptoids-logo.svg'


const chainPartner = [
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },
    {
        firstRow: [
            {
                image: AvalanceLogo,
            },
            {
                image: BinanceLogo,
            },
            {
                image: EtheriumLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
            {
                image: HarmonyLogo,
            },
            {
                image: RbtrumLogo,
            },
            {
                image: PoligonLogo,
            },
        ],
    },


]

export const PartnerGridList = () => {

    const [partnerListModel, setPartnerListModel] = useState(false)
    const eventReminderModalToggal = () => setPartnerListModel(!partnerListModel)
    return (
        <>
            <div className="ecosystem-partner-list-section my-lg-5 my-md-3 my-2" >
                <div className="container">
                    <div className="ecosystem-partner-list">
                        <div className="ecosystem-partner-card">
                            <table className="table mb-0">
                                <tbody>
                                    {chainPartner && chainPartner.map((items: any, index: number) => (
                                        <tr key={index}>
                                            {console.log("items", items)}
                                            {items && items?.firstRow.map((item: any, i: number) => (
                                                <td key={i} onClick={() => eventReminderModalToggal()} role='button'>
                                                    {console.log("items?.firstRow", item)}
                                                    <img src={item.image} className='img-fluid' alt="" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={partnerListModel ? "partner-crypto-popup open" : "partner-crypto-popup"}>
                            <div className="top-section position-relative">
                                <img src={partnerSvg} className='img-fluid bg-img' alt="" />
                                <img src={worldCryproIMG} className='img-fluid crypto-image' alt="" />
                            </div>
                            <div className="bottom-card">
                                <div className="image-part">
                                    <img src={worldCryproIMG} className='img-fluid' alt="" />
                                </div>
                                <div className="content-part">
                                    <h5 className='heading-new-6 fw-bold text-start mb-2'>World of Cryptoids</h5>
                                    <p className='mb-0 card-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
