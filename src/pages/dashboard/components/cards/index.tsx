import { FieldArray, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import Card from '../../../creation/components/card'
import {
  createCardArray,
  createEmptySlotArray,
} from '../../../creation/components/card-form/helper'
import {
  CardDto,
  CardType,
  ICardFormState,
} from '../../../creation/components/card-form/types'
import { MAXIMUM_NUMBER_OF_TYPES } from '../../../creation/creation.config'
import './style.sass'

const CardsView = () => {
  const { values, setFieldValue } = useFormikContext<ICardFormState>()
  const [listCard, setListCard] = useState<Array<CardDto | undefined>>(
    createEmptySlotArray(4)
  )
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
    <div className="cards-view">
      <div className="cards__title">Cards</div>
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
                    type={CardType.DASHBOARD_VIEW}
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

export default CardsView
