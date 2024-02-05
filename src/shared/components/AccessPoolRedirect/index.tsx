import Button from "../buttons";
import accessPoolSvg from "../../../images/staking/access-pool.svg"
import "./style.sass"
import { useHistory } from "react-router-dom"

export default function AccessPoolRedirect() {
    const history = useHistory()
    return (
        <div className="access-pool-redirect">
            <div className="access-pool-item">
                <div className="image-div">
                    <img src={accessPoolSvg} alt="" />
                </div>
                <div className="heading">
                    <h2>ACCESS POOL</h2>
                </div>
                <div className="access-text">
                    <span>Participate in preIDO projects by staking your GS</span>
                </div>
                <div className="stake-button">
                    <Button className="" onClick={() => history.push('/access-pool')}>STAKE</Button>
                </div>
            </div>
        </div>
    )
}
