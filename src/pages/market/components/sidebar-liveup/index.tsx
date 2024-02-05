import './style.sass';
import liveUpImage from '../../../../images/liveup.svg';
import sentnlLogo from '../../../../images/sentnl-logo.png';
import {ExtendedProject} from '../../../../state/market/types'
import _ from 'lodash'

interface SideBarLiveUpProps {
    topName: string
    firstSetProjects: ExtendedProject[]
    secondSetProjects?: ExtendedProject[]
}

const SideBarLiveUp = (props: SideBarLiveUpProps) => {
    return (
        <div className="sidebar-liveup">
            <div className="live-up">
                <div className="title-sidebar">{props.topName}</div>
                <div className="list-container">
                    {_.map(props.firstSetProjects, (item) => {
                        return (
                            <a href={`#${item.id}`} className="list-item">
                                    {item.name}
                            </a>
                        )
                    })}
                </div>
            </div>
            {props.secondSetProjects !== undefined ? <div className="live-up">
                <div className="title-sidebar">upcoming</div>
                <div className="list-container">
                    {_.map(props.secondSetProjects, (item) => {
                        return (
                            <a href={`#${item.id}`} className="list-item">
                                    {item.name}
                            </a>
                        )
                    })}
                </div>
            </div> : null}
            <div className="footer">
                <img src={liveUpImage}/>
                <div className="bottom">
                <a target="_blank" href="https://github.com/GenesisShards/Resources/blob/main/Smart%20contract%20Audit%20%20Results%20-%20Genshards.pdf" className="sentnl-container">
                    <img className={"sentnl-img"} src={sentnlLogo} />
                    <div className="audit-text">
                        <div className='audit-top'>audited by</div>
                        <div className='audit-bottom'>sentnl</div>
                    </div>
                </a>
            </div>
            </div>
            <div className="bottom">
                <a target="_blank" href="https://github.com/GenesisShards/Resources/blob/main/Smart%20contract%20Audit%20%20Results%20-%20Genshards.pdf" className="sentnl-container">
                    <img className={"sentnl-img"} src={sentnlLogo} />
                    <div className="audit-text">
                        <div className='audit-top'>audited by</div>
                        <div className='audit-bottom'>sentnl</div>
                    </div>
                </a>
            </div>
        </div>
    )
}

export default SideBarLiveUp
