import {useMemo} from 'react'
import DateTimePicker from 'react-datetime-picker'
import '../token-generation-date/style.sass'
import Button from '../../../../shared/components/buttons'
import {TicketType, TransactionStatus} from '../../../../state/ticket/types'

interface TokenGenerationSectionProps {
    handleChange: (dateInput: string) => void
    handleClick: () => void
    date?: Date 
    genTokenAddress?: TicketType
}

const TokenGenerationSection = ({handleChange, handleClick, date, genTokenAddress}: TokenGenerationSectionProps) => {
    return (
        <>
            <div className="token-date">
                <div className="token-date__picker">
                <div className="token-date--title">Token Release Date</div>
                <DateTimePicker
                    onChange={handleChange}
                    value={date}
                    format={'dd/MM/yyyy HH:mm'}
                    className=""
                    dayPlaceholder=""
                    monthPlaceholder=""
                    yearPlaceholder=""
                    hourPlaceholder=""
                    minutePlaceholder=""
                />
                </div>

                <Button
                    type="button"
                    disabled={
                        !date ||
                        (genTokenAddress !== undefined &&
                        genTokenAddress!.status === TransactionStatus.WAIT)
                    }
                    className="outline--highlight token-date__btn"
                    onClick={handleClick}
                >
                {genTokenAddress !== undefined &&
                genTokenAddress!.status === TransactionStatus.WAIT
                    ? 'Loading'
                    : 'Confirm'}
                </Button>
            </div>

            <div className="token-note">
                <div className="token-note__text">
                You can change the Token Generation Date later. Note: The timezone is based on UTC.
                </div>
            </div>
        </>)
}

export default TokenGenerationSection