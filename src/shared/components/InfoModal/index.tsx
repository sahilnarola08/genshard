import Button from "../buttons"
import "./style.sass"

export default function InfoModal(props: IinfoModal) {
    const { open, message, goBack } = props
    return (
        <>
            {open ? <div className="info-modal-container">
                <div className="info-modal">
                    <div className="image-div">
                        <img src="/images/icons/close.svg" alt="" onClick={goBack} />
                    </div>
                    <p>{message}</p>
                    <Button className="gen-button outline--highlight active" onClick={goBack}>Back</Button>
                </div>
            </div> : null}
        </>
    )
}

interface IinfoModal {
    message: String
    open: Boolean
    goBack: () => void
}