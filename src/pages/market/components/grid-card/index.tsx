import Card from '../card'
import { Card as CardTypes, ExtendedProject } from '../../../../state/market/types'
import './style.sass'
import { ExternalLink } from '../../../../theme'

export default function GridCard({ cards, currentProject, past, reload }: IGridCardProps) {
  return (
    <div>
        <div className="title-container">
          <div className="title">{currentProject.name}</div>
          <div className="title-border"/>
          { currentProject?.name.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && currentProject?.name.toLowerCase() !== "POLKER INO".toLowerCase() && (
          <><ExternalLink className="report-link" href={currentProject.report} target={'_blank'}>
            View Report
          </ExternalLink></>
          )}
        </div>
        <div className="grid-card">
          {cards.map((card, index) => (
            <div key={index}>
              <Card reload={reload}
                    index={index}
                    currentProject={currentProject}
                    ticketAddress={currentProject.ticketAddress}
                    marketAddress={currentProject.marketAddress} 
                    isPast={past !== undefined ? past : false} 
                    card={card}></Card>
            </div>
          ))}
        </div>
    </div>
  )
}

interface IGridCardProps {
  cards: CardTypes[]
  currentProject: ExtendedProject
  past?: boolean
  reload?: () => void
}
