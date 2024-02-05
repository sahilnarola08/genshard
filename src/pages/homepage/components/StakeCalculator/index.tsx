import { useMemo } from 'react'
import Button from '../../../../shared/components/buttons'
import './style.sass'
import moment from "moment"
import { valueToTokenDecimal } from '../../../../utils'
import Slider from 'rc-slider';



const durationArray = [
    {
        duration: "1M",
        return: "1x",
        tier: 0,
    },
    {
        duration: "3M",
        return: "1.1x",
        tier: 1,
    },
    {
        duration: "6M",
        return: "1.3x",
        tier: 2,
    },
    {
        duration: "1y",
        return: "2x",
        tier: 3,
    },
]

function StakeCalculator(props: any) {
    const {
        onClose = () => { },
        onClickStake = () => { },
        inputBalance = '',
        balance = 0,
        currentValue = 1,
        stakeInfo = {},
        selectedDurationTier = null,
        setSelectedDurationTier = () => { },
        setInputBalance = () => { },
        onClickMax = () => { },
        setCongratulationsPart
    } = props

    const { tier = 0, stakedAmount = 0, tokenDecimal = 0, rewardAndAgsValue = [] } = stakeInfo

    const selectedRewardAgs = rewardAndAgsValue[selectedDurationTier]

    const { agsPercent = "", duration = "", er = "" } = selectedRewardAgs || {}

    const currentEst = Math.ceil(Number(valueToTokenDecimal(er, tokenDecimal)) * 120000) // 311040 (360 * 24 * 60 * 60)  adding 120000 for testing purpose original value is 31104000 * 100 (for percentage)

    const totalLocked = useMemo(() => {
        return Number(stakedAmount) + Number(inputBalance)
    }, [stakedAmount, inputBalance])

    const totalRewards = useMemo(() => {
        return Number(Number(totalLocked) * Number(duration) * valueToTokenDecimal(er, tokenDecimal)).toFixed(2)
    }, [totalLocked, duration, er, tokenDecimal])

    const totalAgs = useMemo(() => {
        return totalLocked * (Number(agsPercent) / 100)
    }, [totalLocked, agsPercent])

    const durationTillLocked = useMemo(() => {
        return moment((moment().unix() + Number(duration)) * 1000).format('DD/MM/yyyy')
    }, [duration])

    const calculatedDollarByInput = useMemo(() => {
        return (currentValue * inputBalance).toFixed(2)
    }, [currentValue, inputBalance])

    // const createSliderWithTooltip = Slider.createSliderWithTooltip;
    // const Range = createSliderWithTooltip(Slider.Range);
    // const Handle = Slider.Handle;
    return (
        <div className="stake-calculator-container mt-5 py-lg-5 py-md-3 py-2">
            <p className='paragraph-new mb-4 fw-lighter' style={{ letterSpacing: "0.2em" }}>CALCULATOR</p>
            <div className='calculator-card'>
                <div className="enter-gs-stake">
                    <div><p className='paragraph-new mb-0 fw-lighter me-2'>GS</p> <Button className="" onClick={onClickMax}><p className='paragraph-new fw-bolder color-white-new mb-0'>MAX</p></Button></div>
                    <input type="number" placeholder='Enter staking amount' onChange={e => setInputBalance(e.target.value)} value={inputBalance} />
                </div>
                <div className="balance-total">
                    <p className='paragraph-new mt-0 mb-0'>Balance : {balance}</p>
                    <p className='paragraph-new mt-0 mb-0'> ${calculatedDollarByInput}</p>
                </div>
                <div className='layer-slider mb-4'>
                    {/* <Slider min={20} defaultValue={20} marks={{ 20: 20, 40: 40, 100: 100 }} step={null} /> */}
                    <Slider
                        // min={20}
                        step={null}
                        defaultValue={20}
                        marks={{ 8: 8, 16: 16, 50: 50, 100: 100 }}
                        dots
                        trackStyle={{ backgroundColor: '#65DB6A' }}
                        railStyle={{ backgroundColor: '#54C4FC' }}
                        handleStyle={{
                            borderColor: '#FFFFFF',
                            backgroundColor: '#FFFFFF',
                        }}
                        dotStyle={{
                            background: "#000000",
                            border: "1.1761px solid #FFFFFF",
                        }}
                    />
                </div>
                <div className="staking-month-duration">
                    <ul>
                        <li>
                            <p className='top-small-text mb-1'>Mon 1</p>
                            <div className="bg-line" style={{ background: "#EDFFEE" }}></div>
                            <p className="paragraph-new-medium days mb-1 lh-1 mt-2 text-end">30 <br /> Days</p>
                            <p className='paragraph-new-medium mb-0 mt-0 fw-bold text-end'>1x</p>
                        </li>
                        <li>
                            <p className='top-small-text mb-1'>Mon 2</p>
                            <div className="bg-line" style={{ background: "#A4FFA7" }}></div>
                            <p className="paragraph-new-medium days mb-1 lh-1 mt-2 text-end">60<br />Days</p>
                            <p className='paragraph-new-medium mb-0 mt-0 fw-bold text-end'>2x</p>
                        </li>
                        <li>
                            <div className="d-flex gap-2">
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 3</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 4</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 5</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 6</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                            </div>
                            <p className="paragraph-new-medium days mb-1 lh-1 mt-2 text-end">180<br />Days</p>
                            <p className='paragraph-new-medium mb-0 mt-0 fw-bold text-end'>1.6x</p>
                        </li>
                        <li>
                            <div className="d-flex gap-2">
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 7</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 8</p>
                                    <div className="bg-line" style={{ background: "#65DB6A" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 9</p>
                                    <div className="bg-line" style={{ background: "#1EBE25" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 10</p>
                                    <div className="bg-line" style={{ background: "#1EBE25" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 11</p>
                                    <div className="bg-line" style={{ background: "#1EBE25" }}></div>
                                </div>
                                <div className="">
                                    <p className='top-small-text mb-1'>Mon 12</p>
                                    <div className="bg-line" style={{ background: "#1EBE25", boxShadow: "0px -1.1761px 8.23272px 1.1761px #3AAC3F" }}></div>
                                </div>
                            </div>
                            <p className="paragraph-new-medium days mb-1 lh-1 mt-2 text-end">360<br />Days</p>
                            <p className='paragraph-new-medium mb-0 mt-0 fw-bold text-end'>2x</p>
                        </li>
                    </ul>
                </div>
                <p className='paragraph-new-small' style={{ color: "#54C4FC" }}>1.6x Multiplier on Staking APY</p>
                {/* <div className="duration-listing">
                    {
                        durationArray.map((value, index) => {
                            const isSelectionDisable = (Number(tier) !== 0 && index < Number(tier)) || false
                            let selected = false
                            selected = Number(value.tier) === Number(selectedDurationTier)
                            return <div key={index} className={`duration-return-item ${isSelectionDisable ? "disable-return" : "selection-return"}`}>
                                <div className={`duration-div ${selected ? 'selected-tier' : ''}`} onClick={() => {
                                    if (!isSelectionDisable) setSelectedDurationTier(value.tier)
                                }}>
                                    <span >{value.duration}</span>
                                </div>
                                <div className="return-div">
                                    <span >{value.return}</span>
                                </div>
                            </div>
                        })
                    }
                </div> */}


                <div className='calculator-yield-container'>
                    <p className='paragraph-new-medium heading-p'>CALCULATE YIELD</p>
                    <div className='calculator-details'>
                        <p className='paragraph-new-medium mb-0 mt-0' style={{ color: "#848484" }}>Total lock</p>
                        <p className='paragraph-new-medium mb-0 mt-0'>{totalLocked}</p>
                    </div>
                    <div className='calculator-details my-3'>
                        <p className='paragraph-new-medium mb-0 mt-0' style={{ color: "#848484" }}>APY (%)</p>
                        <p className='paragraph-new-medium mb-0 mt-0'>{currentEst}%</p>
                    </div>
                    {/* <div className='gs-to-gsk-converted'>
                        <span>{totalRewards} GS</span>
                        <span>{totalRewards} GSK</span>
                    </div> */}
                    <div className='calculator-details'>
                        <p className='paragraph-new-medium mb-0 mt-0 fw-bold' style={{ color: "#848484" }}>Estimated reward</p>
                        <p className='paragraph-new-medium mb-0 mt-0 fw-bold'>{totalRewards}</p>
                    </div>
                    {/* <div className='calculator-details'>
                        <p className='paragraph-new-medium mb-0 mt-0'>Total aGS</p>
                        <p className='paragraph-new-medium mb-0 mt-0'>{totalAgs}</p>
                    </div> */}
                </div>
                <div className="staking-locked-info my-4">
                    <p className='paragraph-new-medium mb-0'>Your total staked tokens will be locked in until {durationTillLocked}</p>
                </div>
                <div className="actions-buttons">
                    <button className='' onClick={onClose}>Cancel</button>
                    <button className='active' onClick={()=>{setCongratulationsPart(true)}} >Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default StakeCalculator

