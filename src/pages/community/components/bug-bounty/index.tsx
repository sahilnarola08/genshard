import { GS_SUBMIT_A_BUG_FORM_URL } from '../../../../constants'
import './style.sass'

const bountyProgramImpact = [
    "Loss of user funds by permanent freezing or direct theft",
    "Loss of governance funds",
    "Theft of unclaimed yield",
    "Freezing of unclaimed yield",
    "Temporary freezing of funds for any amount of time",
    "Unable to call smart contract Network shutdown"
]

const stepsToReproduce = [
    "Add details for how we can reproduce the issue",
    "Add steps",
]

export default function BugBounty() {
    return (
        <div className='bug-bounty-container' id="community-contests-id">
            <div className="report-bug">
                <div className="report-bug-card">
                    <div className="report-bug-card-item">
                        <h1>
                            Submit a bug and get Get Rewarded!
                        </h1>
                        <div className="card-submit-btn">
                            <a href={GS_SUBMIT_A_BUG_FORM_URL} target="_blank" rel="noreferrer"><button >Submit a Bug</button></a>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bug-bounty-info">
                <h1>Bug Bounty</h1>
                {/* <h1 className="m-b-20">Program Overview</h1> */}
                <p>Find vulnerabilities and win handsome rewards basis threat levels! Submit your findings in this form.</p>
                {/* <p >
                    Polygon provides the core components and tools to join the new , borderless economy and society.With Polygon,
                    any project can easily spin-up a dedicated blockchain network which combines the best features of stand-alone blockchains
                    (sovereignty, scalability and flexibility) and Ethereum (security, interoperability and developer experience).Additionally,
                    these blockchains are compatible with all the existing Ethereum tools (Metamask, MyCrypto, Remix etc), and can exchange messages
                    among themselves and with Ethereum.
                </p>
                <p className="m-b-20">For more information about Polygon, please visit
                    <a href="https://polygon.technology/." target="_blank">&nbsp;https://polygon.technology</a>/.
                </p>

                <p>This bug bounty program is focused on their smart contracts and apps and is focused on preventing the following impacts:</p>

                <ul>
                    {
                        bountyProgramImpact.map((item, index) => {
                            return <li key={index}>
                                <p>{item}</p>
                            </li>
                        })
                    }
                </ul>
                <h1 className="m-b-20">Rewards by Threat Level</h1>
                <p className="m-b-20">
                    Rewards are distributed according to the impact of the vulnerability based on the Immunefi Vulnerability Severity Classification System.
                    This is a simplified 5-level scale, with separate scales for websites/apps and smart contracts/blockchains, encompassing everything from
                    consequence of exploitation to privilege required to likelihood of a successful exploit.
                </p>
                <p className="m-b-20">
                    A PoC and a suggestion for a fix is required for all Critical and High bug reports. Additionally, a PoC is required for Medium Web/App bug reports.
                    A high-quality suggestion for a fix may come with a bonus from the Polygon team.
                </p>
                <p className="m-b-20">All bug reports must include the following information in order to be considered for a reward:</p>

                <p>Summary:</p>

                <ul>
                    <li>Add summary of the vulnerability</li>
                </ul>

                <p>Steps To Reproduce:</p>

                <ul>
                    {
                        stepsToReproduce.map((item, index) => {
                            return <li key={index}>
                                <p>{item}</p>
                            </li>
                        })
                    }
                </ul>

                <p>Supporting Material/References:</p>
                <p>list any additional material (e.g. screenshots, logs, etc.)</p>
                <p>attachment / reference</p> */}

            </div>
        </div>
    )
}

