import Button from "../../../../../shared/components/buttons"
import "./style.sass"
import arrowRight from "../../../../../images/community/arrow-right-circle.svg"

export default function GskSwapConfirm(props: IGskSwapConfirm) {

    const {
        isConfirmed,
        gskValue,
        convertedGskPricePerGs,
        onClickConfirmSwap,
        onCloseModal
    } = props

    const amountInGs = Number(convertedGskPricePerGs) * Number(gskValue)

    return (
        <div className="gsk-swap-confirm">
            <div className="gsk-swap-confirm-item">
                {
                    !isConfirmed ? <div className="confirm-div">
                        <div className="confirm-heading">
                            <h2>CONFIRM SWAP</h2>
                        </div>

                        <div className="confirm-gs-value">
                            <div className="swap-from">
                                <h2><img alt="" />GSK</h2>
                                <h2>{gskValue}</h2>
                            </div>
                            <div className="swap-divider">
                                <img src={arrowRight} alt="" />
                            </div>
                            <div className="swap-from">
                                <h2><img alt="" />GS</h2>
                                <h2>{amountInGs}</h2>
                            </div>
                        </div>

                        <div className="confirm-text">
                            <p>Are you sure? if yes, click <span>Confirm Swap</span></p>
                        </div>

                        <div className="confirm-button">
                            <Button className="" onClick={onClickConfirmSwap}>
                                CONFIRM SWAP
                            </Button>
                        </div>

                    </div> : <div className="confirmed-div">
                        <div className="confirmation-gsk-item">
                            <div className="confirmation">
                                <div>
                                    <h1>CONFIRMATION</h1>
                                    <span>Successfully Converted!</span>
                                </div>
                            </div>
                            <div className="confirmation">
                                <div>
                                    <p>Your Converted GSK is</p>
                                    <h2>{amountInGs} GS</h2>
                                </div>
                            </div>
                        </div>
                        <div className="return-to-home">
                            <Button className="" onClick={onCloseModal}>
                                RETURN TO HOMEPAGE
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

interface IGskSwapConfirm {
    isConfirmed?: Boolean
    onClickConfirmSwap?: Function
    gskValue?: Number
    convertedGskPricePerGs?: Number
    onCloseModal?: Function
}