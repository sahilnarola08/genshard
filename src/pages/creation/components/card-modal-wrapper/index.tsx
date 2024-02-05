import { useFormikContext } from 'formik'
import { pick } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { ICardFormState } from '../card-form/types'
import CardModal from '../card-modal'
import { CardModalState, CardModalStateFields } from '../card-modal/types'

const CARD_MODAL_INDEX_HIDDEN = 0

const CardModalWrapper = ({ setState, formValues, setFormValues, open, setOpen }: any) => {
  const { values, setFieldValue } = useFormikContext<ICardFormState>()

  const [cardModalState, setCardModalState] = useState<CardModalState>(
    new CardModalState()
  )

  const [cardValues, setCardValues] = useState<any>({
    weightageCheck: '',
    arrayOfWeightage: [''],
    sameWeigth: 0
  });

  useEffect(() => {
    setState({
      'days': cardValues.arrayOfIntervals,
      'weight': cardValues.arrayOfWeightage,
      'totalTranches': Number(cardValues.txtPecentage)
    })
  }, [cardValues])

  // handle submit
  const submitModal = useCallback(
    (data: any) => {
      const currentIndex = values.modalIndex - 1
      const newCard = {
        ...values.cards[currentIndex],
        ...data,
        days: cardValues.arrayOfIntervals,
        weight: cardValues.arrayOfWeightage
      }

      setFieldValue(`cards[${currentIndex}]`, newCard)
      onClose()
    },
    [values]
  )

  /**
   * Store new value card modal state according the changing of modalIndex
   */
  useEffect(() => {
    const modalIndex = values.modalIndex

    // update new card modal value to state
    if (modalIndex !== CARD_MODAL_INDEX_HIDDEN) {
      const currentCard = values.cards.find((card) => card.index === modalIndex)

      const cardModalStateValue = pick(
        currentCard,
        [CardModalStateFields.vestingNumber],
        [CardModalStateFields.cliffNumber],
        [CardModalStateFields.length]
      ) as CardModalState

      setCardModalState(cardModalStateValue)

      setOpen(true)
    }
  }, [values.cards, values.modalIndex])

  // close modal and update the modalIndex
  const onClose = useCallback(() => {
    setOpen(false)
    setFieldValue('modalIndex', CARD_MODAL_INDEX_HIDDEN)
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <CardModal
        initValue={cardModalState}
        isOpen={open}
        onClose={onClose}
        cardIndex={values.modalIndex}
        onSubmited={submitModal}
        setCardValues={setCardValues}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </div>
  )
}

export default CardModalWrapper
