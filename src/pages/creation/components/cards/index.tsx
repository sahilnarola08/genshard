import { FieldArray, useFormikContext, ErrorMessage, Field, } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { MAXIMUM_NUMBER_OF_TYPES } from '../../creation.config'
import Card from '../card'
import { createCardArray, createEmptySlotArray } from '../card-form/helper'
import { CardDto, CardType, ICardFormState } from '../card-form/types'
import './style.sass'
import Checkbox from '../../../../shared/components/checkbox'
import deleteImage from '../../../../images/delete.svg'

export default function Cards({ formValues, setState, setFormValues, setOpen, open }: any) {
  const { values, setFieldValue } = useFormikContext<ICardFormState>()
  const [listCard, setListCard] = useState<Array<CardDto | undefined>>(
    createEmptySlotArray(4)
  )

  const editDataModal = useCallback(() => {
    setFieldValue('modalIndex', 1)
  }, [])

  // Handle change number of type card
  useEffect(() => {
    const { numberOfTypes, cards } = values

    // slice the array card when number of type greater than card length
    // otherwise fill the default card to new index of array
    const emptyCards = createCardArray(numberOfTypes)
    const cardArray = emptyCards.map((item, index) => {
      return cards[index] ?? item
    })

    // fill the undefined value to remaining index of MAXIMUM_NUMBER_OF_TYPES card
    const emptySlots = new Array(MAXIMUM_NUMBER_OF_TYPES).fill(undefined)
    const newListCard = emptySlots.map((emptyItem, index) => {
      return cardArray[index] ?? emptyItem
    })

    setListCard(newListCard)

    setFieldValue('cards', cardArray)
    // eslint-disable-next-line
  }, [values.numberOfTypes])

  return (
    <div className="cards-wrapper">
      <div className="cardsAndCheckBox">
        <p className="title">Cards</p>
        <div className="card__check">
          <span>DEFINE VESTING PERIOD</span>
          {/* <div className="checkbox-title">DEFINE VESTING PERIOD</div> */}
          {Object.keys(formValues ?? {}).length > 0 ?

            <div className="edit-delete-data">
              <div className="btn-edit"
                // onClick={editDataModal}
                onClick={() => setOpen(true)}
              >
                Edit
              </div>
              <div className="btn-delete" onClick={() => {
                setState({}) 
                setFormValues({})}
              }>
                <img src={deleteImage} />
              </div>
            </div>
            :

            <Field name={`cards.defineVesting`}>
              {({ field }: any) => {
                return (
                  <Checkbox
                    className="modalCheckBox"
                    {...field}
                    // checked={field.value}
                    checked={open}
                    onChange={editDataModal}
                  ></Checkbox>
                )
              }}
            </Field>
          }
        </div>

      </div>
      <FieldArray
        name="cards"
        render={() => {
          return (
            <div className="cards">
              {listCard.map((card, index) =>
                !!card ? (
                  <Card
                    key={index}
                    index={index}
                    type={CardType.CREATION}
                  ></Card>
                ) : (
                  <div key={index} className="empty-card">
                    Empty
                  </div>
                )
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
