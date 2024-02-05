import Button from '../../../../shared/components/buttons'
import { IResolutionItem } from '../../../../state/community/types'
import upvoteIcon from "../../../../images/community/upvote-icon.svg"


// description: "updated resolution for one"
// downvotes: 0
// status: null
// title: "random 31"
// totalVotes: 0
// updatedDate: 1651149721
// upvotes: 0
// _id: "626a8970428398ed1bf3473c"

function ResolutionCard(props: any) {
    const { cardDetails = {}, addResolutionVote = () => { }, selectedId = '' } = props
    const { description = '', status: userVote = '', totalVotes = 0, upvotes = 0, downvotes = 0, _id = '' } = cardDetails

    const onAddResolutionVote = (resolutionId: string, status: string) => {
        if (userVote === status) return
        addResolutionVote(resolutionId, status)
    }

    return (
        <div className="resolution-item-card">
            <div className="item-card">
                {_id === selectedId ? <div className="dao-card-loader">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                </div> : null}
                <h2>{description}</h2>
                <div className="card-vote-btn">
                    <div className="votes">
                        <Button className={userVote === 'up' ? "voted" : ""} onClick={() => onAddResolutionVote(_id, 'up')}><img src={upvoteIcon} alt="" /><span>Upvote</span></Button>
                        <p><span className='total-count'>{upvotes}</span> Total Upvotes</p>
                    </div>
                    <div className="votes">
                        <Button className={userVote === 'down' ? "voted" : ""} onClick={() => onAddResolutionVote(_id, 'down')} ><img src={upvoteIcon} alt="" className="reverse" /><span>Downvote</span></Button>
                        <p><span className='total-count'>{downvotes}</span> Total Downvotes</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResolutionCard
