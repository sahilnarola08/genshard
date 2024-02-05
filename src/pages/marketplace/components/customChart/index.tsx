import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import './style.sass'

const ApexCharts = ({ chartData }) => {

    console.log("chartData => ", chartData);
    
    const saleListingPricesArray = chartData.map((item: any) => Number(item?.itemPrice))
    // const saleListingPricesArray = chartData.map((item: any) => Number(item?.listingPriceDetails))

    let highestPrice =  Math.max.apply(null, saleListingPricesArray);
    // highestPrice = Math.round(highestPrice)
    console.log("highestPrice => ", highestPrice, saleListingPricesArray);
    
    const dateListingArray = chartData.map((item: any) => moment.unix(Number(item?.itemSellTime)).format("DD MMM, YYYY"))
    // const dateListingArray = chartData.map((item: any) => moment.unix(Number(item?.itemTime) + Number(item?.itemDuration)).format("DD MMM, YYYY"))
    // const dateListingArray = chartData.map((item: any) => moment.unix(Number(item?.listingTime) + Number(item?.listingItemDuration)).format("DD MMM, YYYY"))
    // const highListedItem = filterAuctionDataArrayResults.find((item: any) => Number(item?.auctionPriceDetails) == highestPrice)

    let initChartValue: any = {
        options: {
            chart: {
                id: "basic-line",
                width: '100%',
                height: 600,
            },
            xaxis: {
                categories: dateListingArray, //['Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021'],
                labels: {
                    style: {
                        colors: 'black',
                        fill: 'black',
                        fontSize: '16'
                    }
                }
            },
            yaxis: {
                min: 0,
                max: highestPrice, //Math.ceil(highestPrice),
                tickAmount: 3,
                crosshairs: {
                    show: true,
                    position: 'back',
                    stroke: {
                        color: 'black',
                        width: 1,
                        dashArray: 0,
                    },
                },
                labels: {
                    style: {
                        colors: 'black',
                        fill: '#fff',
                        fontSize: '16'
                    }
                },
            },
            stroke: {
                width: 2,
                colors: '#117DCC',
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px',
                    fontFamily: undefined,
                },
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        height: 280
                    }
                },
            }],
        },
        series: [
            {
                name: chartData && chartData[0] && chartData[0]?.itemChainId + " Price",
                // data: []
                data: saleListingPricesArray
            }
        ]
    };

    const [chartState, setchartState] = useState(initChartValue)
    useEffect(() => {
        setchartState(initChartValue);
    }, [chartData])

    return (
        <div>
            <div className="row">
                <div className="mixed-chart" style={{ maxHeight: "600px", height: '100%' }}>
                    {chartData && chartData.length > 1 ? <Chart
                        options={chartState.options}
                        series={chartState.series}
                        type="line"
                        width="100%"
                        height={'400px'}
                    /> : <div className="no-price-data">
                        <img src="/images/no-chart-data.svg" alt="chart" className='chart-img' />
                        <div className="description">No item activity yet</div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ApexCharts
