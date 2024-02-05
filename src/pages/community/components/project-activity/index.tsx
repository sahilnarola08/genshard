import { useState } from "react"
import Button from "../../../../shared/components/buttons"
import InfoModal from "../../../../shared/components/InfoModal"
import Modal from "../../../../shared/components/modal"
import "./style.sass"

const projectActivity = [
    {
        icon: "",
        name: "Duelighking",
        isClaimable: true,
        claimAmount: 100,
        currency: "USD",
    },
    {
        icon: "",
        name: "Duelighking",
        isClaimable: false,
        claimAmount: "100",
        currency: "USD",
    },
    {
        icon: "",
        name: "Duelighking",
        isClaimable: false,
        claimAmount: 100,
        currency: "USD",
    },
    {
        icon: "",
        name: "Duelighking",
        isClaimable: true,
        claimAmount: 100,
        currency: "USD",
    },
]

function ProjectActivity() {

    const [modal, setModal] = useState(false)

    return (
        <div className="project-activity-container">
            <div className="project-activity-header">
                <h1 className="project-activity-header-title">Project Activity</h1>
            </div>
            <div className="activity-container">
                {
                    projectActivity.length ? projectActivity.map((project, index) => {
                        const { icon, name, isClaimable, claimAmount, currency } = project
                        return <div className="activity-item" key={index}>
                            <div className="activity-item-div">
                                <div className="project-icon-name">
                                    <div className="activity-item-icon">
                                        <img src={"https://peerthroughmedia.com/wp-content/uploads/2021/09/APE.png"} alt="icon" />
                                    </div>
                                    <div className="activity-item-name">
                                        <span>{name}</span>
                                    </div>
                                </div>
                                <div className="activity-actions">
                                    <Button className="participate-btn" onClick={() => setModal(true)}>Participate</Button>
                                    <Button className={!isClaimable ? 'disable-claim' : "active-claim"} onClick={() => setModal(true)}>Claim <span>{claimAmount} {currency}</span></Button>
                                </div>
                            </div>
                        </div>
                    }) : <div className="no-item-found">No item found.</div>
                }
            </div>
            <Modal
                isOpen={modal}
                onClose={() => setModal(false)}
                kycChanges
            >
                <div className="confirmation-modal">
                    <div className="confirmation-modal-body">
                        <h1>Congratulations!</h1>
                        <p>You have received a reward of</p>
                        <h3>{"100"} {"USD"}</h3>
                    </div>
                    <div className="modal-actions">
                        <Button className="action-btn" onClick={() => setModal(false)}>
                            Return to Homepage
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

export default ProjectActivity