import React, { useState } from 'react';
import './vc-dashboard-comp.sass';
import { VCCard } from '../vc-card/vc-card';
import { InfoCard } from '../info-card/info-card';
import Updatessymbioversetable from '../../../accelerate-dashboard/components/dashboard/components/progress-slider/updates-symbioverse-table/updates-symbioverse-table';
import ReactApexChart from 'react-apexcharts';
import { useLocation } from 'react-router-dom';

const cardData = [
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "DUELIST KING",
        title: "Ut enim ad minim veniam, quis nostrud ",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
]
const InfocardData = [
    {
        title: "Projects Invested",
        number: 5
    },
    {
        title: "Projects Invested",
        number: 548
    },
]


export const VCDashboardComp = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const isVCDashboard = pathname.includes("/vc-dashboard")
    const [CharteData, setCharteData] = useState<any>(
        {

            series: [{
                data: [24, 15, 0.4]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                // annotations: {
                //     xaxis: [{
                //         x: 500,
                //         borderColor: '#00E396',
                //         label: {
                //             borderColor: '#00E396',
                //             style: {
                //                 color: '#fff',
                //                 background: '#00E396',
                //             },
                //             text: 'X annotation',
                //         }
                //     }],
                //     // yaxis: [{
                //     //     y: 'July',
                //     //     y2: 'September',
                //     //     label: {
                //     //         text: 'Y annotation'
                //     //     }
                //     // }]
                // },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                // dataLabels: {
                //     enabled: false
                // },
                xaxis: {
                    categories: ['Duelist King', 'Duelist King', 'Duelist King'],
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                yaxis: {
                    reversed: false,
                    axisTicks: {
                        show: false
                    }
                }
            },
        }
    )

    return (
        <div className='vc-dashboard-section'>
            <div className="row mb-5">
                {InfocardData && InfocardData.map((item: any, index: number) => (
                    <InfoCard title={item.title} number={item.number} />
                ))}
            </div>
            {isVCDashboard ?
                <div className="">
                    <h5 className='heading-new-5'>Investment Overview </h5>
                    <div id="chart">
                        <ReactApexChart options={CharteData && CharteData.options} series={CharteData.series} type="bar" height={350} />
                    </div>
                </div>: ""}
            <div className='mb-5'>
                <Updatessymbioversetable />
            </div>

            <div className="row">
                <div className="col-lg-12 mb-5">
                    <h5 className='heading-new-5'>Latest Projects into the platform</h5>
                </div>
                {cardData && cardData.map((item: any, index: number) => (
                    <VCCard
                        name={item.name}
                        title={item.title}
                        description={item.description} />
                ))}
            </div>

        </div>
    )
}
