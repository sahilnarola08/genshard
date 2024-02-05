import { ErrorMessage, Field, useFormikContext } from 'formik'
import InputText from '../../../../shared/components/input-text'
import Checkbox from '../../../../shared/components/checkbox'
import './style.min.css'
import './style.sass'
import { useCallback, useEffect, useState } from 'react'
import { CardModalState, CardModalStateFields } from '../card-modal/types'
import { pick } from 'lodash'
import deleteImage from '../../../../images/delete.svg'
import { CardType, ICardFormState } from '../card-form/types'
import rightArrow from '../../../../images/rightArrow.svg'
import downArrow from '../../../../images/downArrow.svg'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

export default function Card({ index, type }: ICardProps) {
  const { values, setFieldValue } = useFormikContext<ICardFormState>()
  const [isEmptyCardModal, setIsEmptyCardModal] = useState(true)
  const [showVesting, setShowVesting] = useState(true)

  const editDataModal = useCallback(() => {
    setFieldValue('modalIndex', index + 1)
    console.log(values)
  }, [])

  const deleteDataModal = useCallback(() => {
    const cardModal = new CardModalState()
    const newCard = {
      ...values.cards[index],
      ...cardModal,
    }
    setFieldValue(`cards[${index}]`, newCard)
  }, [values])

  const viewVestingPeriod = useCallback(() => {
    setShowVesting(!showVesting)
  }, [showVesting, values])
  useEffect(() => {
    const cardModalStateValue = pick(
      values.cards[index],
      [CardModalStateFields.vestingNumber],
      [CardModalStateFields.cliffNumber],
      [CardModalStateFields.length]
    ) as CardModalState

    const isEmpty = Object.values(cardModalStateValue).every(
      (fieldValue) => !fieldValue
    )

    setIsEmptyCardModal(isEmpty)
  }, [values.cards[index]])

  const VestingCheckbox = (
    // vesting checkbox
    <></>
    // <div className="card__check">
    //   <div className="checkbox-title">define vesting period</div>
    //   {isEmptyCardModal ? (
    //     // checkbox
    //     <Field name={`cards.${index}.defineVesting`}>
    //       {({ field }: any) => {
    //         return (
    //           <Checkbox
    //             className=""
    //             {...field}
    //             checked={field.value}
    //             onChange={editDataModal}
    //           ></Checkbox>
    //         )
    //       }}
    //     </Field>
    //   ) : (
    //     // edit button & clear card modal button
    //     <div className="edit-delete-data">
    //       <div className="btn-edit" onClick={editDataModal}>
    //         Edit
    //       </div>
    //       <div className="btn-delete" onClick={deleteDataModal}>
    //         <img src={deleteImage} />
    //       </div>
    //     </div>
    //   )}
    // </div>
  )

  const VestingView = (
    <>
      {showVesting ? (
        <div className="view-vesting">
          <div className="vesting-header" onClick={viewVestingPeriod}>
            <div className="view-title">View Custom Vesting Period</div>
            <img src={downArrow} className="arrow-image" />
          </div>
          <div className="vesting-detail">
            <div>
              <div className="vesting-title">
                Total number of vesting tranches
              </div>
              <div className="vesting-value">{`{detail}`}</div>
            </div>
            <div>
              <div className="vesting-title">Number of cliff tranches</div>
              <div className="vesting-value">{`{detail}`}</div>
            </div>
            <div>
              <div className="vesting-title">
                Length of each tranche (in days)
              </div>
              <div className="vesting-value">{`{detail}`}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card__view" onClick={viewVestingPeriod}>
          <div className="view-title">View Custom Vesting Period</div>
          <img src={rightArrow} className="arrow-image" />
        </div>
      )}
    </>
  )
  return (
    <div className="card">
      <div 
        style={{backgroundColor:  index === 0 ? '#000'
                                : index === 1 ? '#D4AF37'
                                : index === 2 ? '#ff0071'
                                :               '#C0C0C0'
              }}
        className="card__type"><b>{index+1}</b></div>
      {type === CardType.CREATION ? <>{VestingCheckbox}</> : <></>}

      {type === CardType.DASHBOARD_VIEW ? <>{VestingView}</> : <></>}

      <div className="card__form">
        {/* input number ticket */}
        <div className="card-form-item">
          <label htmlFor="firstName" className="card-form-item__label">
            Number of Tickets
          </label>

          <Field name={`cards.${index}.number`}>
            {({ field }: any) => (
              <InputText
                className="card-form-item__input"
                {...field}
                disabled={type === CardType.DASHBOARD_VIEW}
              ></InputText>
            )}
          </Field>
        </div>

        <ErrorMessage
          name={`cards.${index}.number`}
          render={(msg) => <div className="form-item__err">{msg}</div>}
        />

        {/* input size ticket */}
        <div className="card-form-item">
          <label htmlFor="firstName" className="card-form-item__label">
            Size of Ticket
          </label>

          <Field name={`cards.${index}.size`}>
            {({ field }: any) => (
              <InputText
                className="card-form-item__input"
                {...field}
                disabled={type === CardType.DASHBOARD_VIEW}
              ></InputText>
            )}
          </Field>
        </div>

        <ErrorMessage
          name={`cards.${index}.size`}
          render={(msg) => <div className="form-item__err">{msg}</div>}
        />
      </div>
    </div>
  )
}

interface ICardProps {
  index: number
  type: CardType.CREATION | CardType.DASHBOARD_VIEW
}
