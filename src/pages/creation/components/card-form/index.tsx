import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Button from '../../../../shared/components/buttons'
import NumberTypes from '../number-of-types'
import { ICardFormState } from './types'
import Cards from '../cards'
import { createCardArray } from './helper'
import CardModalWrapper from '../card-modal-wrapper'
import DesignTicketModal from '../design-ticket-modal'
import SelectTokenWrapper from '../select-token-wrapper'
import { useMemo, useRef } from 'react'
import './style.sass'
import Lock from '../Lock'
import { GenTicketDto } from '../../../../state/ticket/types'
import { useCreateGenTicket } from '../../../../state/ticket/hooks'
import { wrappedCurrency } from '../../../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { Currency, currencyEquals, ETHER } from '@uniswap/sdk'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { useState } from 'react'
import { daysToSeconds } from '../../../../utils'
import { useAddPopup } from '../../../../state/application/hooks'
import { parseUnits } from 'ethers/lib/utils'

const digitsOnly = (value: any) => /^\d+$/.test(value)

// todo: how about the validation for currency?

const validationSchema = Yup.object({
  cards: Yup.array().of(
    Yup.object().shape({
      number: Yup.string()
        .required('This field is required')
        .test('Digits only', 'The field should have digits only', digitsOnly),
      size: Yup.string()
        .required('This field is required')
        .test('Digits only', 'The field should have digits only', digitsOnly),
    })
  ),
  // designUri: Yup.string().when('designable', {
  //   is: true,
  //   then: Yup.string().required('This field is required.'),
  //   otherwise: Yup.string().notRequired(),
  // }),
  designUri: Yup.string().required('This field is required.'),
  token: Yup.object().required('This field is requied!')
})

const FormInitialValue: ICardFormState = {
  modalIndex: 0,
  token: undefined,
  numberOfTypes: 1,
  designable: false,
  designUri: '',
  totalNumberOfTranches: 0,
  cards: createCardArray(1),
}

export default function CardForm({ isLock }: ICardForm) {
  const formRef = useRef<any>()

  const genTicketCallback = useCreateGenTicket()

  const [state, setState] = useState<any>({})
  const addErrorPopup = useAddPopup();

  const [formValues, setFormValues] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);

  console.log(formValues, "state of card form", state);
  const handleSubmit = async (values: ICardFormState) => {
    // dont handle anything if this section has been locked
    if (isLock) return

    if (state?.totalTranches! !== NaN && state?.days! && state?.weight!) {
      console.log("states===>0", state);
      console.log('[CardForm][submit] get values: ', values)

      // const underlyingToken = currencyEquals((values.currency) as Currency, ETHER) ? account : (values.currency as wrappedCurrency).address

      // const tokenAddress = wrappedCurrency(values.currency, chainId)
      if (!values.token) {
        throw new Error('[CardForm][handleSubmit]token not valid')
      }
      const daysValue = state?.days?.map((data: number) => {
        return daysToSeconds(Number(data))
      })
      const weightageValue = state?.weight?.map((data: number) => {
        return parseUnits(getFlooredFixedForSpecificPosition(Number(data),4)) //, values.token.decimals ? values.token.decimals : 18)
      })

      console.log("Before call of creategenticket : ", daysValue, weightageValue);
      // todo: handle smartContract here
      const genTicket = new GenTicketDto(
        values.token.address,
        `https://cloudfront.genshards.com/${values.designUri}/{id}.json`,
        state?.totalTranches!,
        weightageValue,
        daysValue,
        values.cards
      )
      //const {numTickets, ticketSizes, totalNumberOfTranches, trancheLengths, trancheWeightages, underlyingToken, uri} = genTicket
      console.log(genTicket)

      genTicketCallback(genTicket, values.token.decimals)
    } else {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: "Please fill up and complete required vesting details.",
          description: '',
          withExternalLink: false,
        }
      });
    }
  }

  const getFlooredFixedForSpecificPosition = (value: number, fixedPosition: number): any => {
    return (Math.floor(value * Math.pow(10, fixedPosition)) / Math.pow(10, fixedPosition)).toFixed(fixedPosition);
  }

  // Conditional render lock button
  const LockButton = useMemo(() => {
    if (isLock) {
      return (
        <Button className="outline--highlight btn-lock active" disabled>
          LOCKED
        </Button>
      )
    }

    return (
      <Button type="submit" className="outline--highlight btn-lock">
        LOCK
      </Button>
    )
  }, [isLock])

  return (
    <div className="card-form">
      <Formik
        innerRef={formRef}
        initialValues={FormInitialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        render={() => (
          <div>
            <Form>
              <SelectTokenWrapper />

              {/* card form section */}
              <div>
                <div className="card-form-number">
                  <NumberTypes />
                  {/* radio button  */}
                  <Cards formValues={formValues} setFormValues={setFormValues} setState={setState} setOpen={setOpen} open={open} />
                  <div className="card-form__note">
                    Once you lock, you will not be able to change the above
                    settings
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                  {LockButton}
                </div>
              </div>
            </Form>

            <CardModalWrapper setState={setState} formValues={formValues} setFormValues={setFormValues} open={open} setOpen={setOpen} />

            <DesignTicketModal />
          </div>
        )}
      />
    </div>
  )
}

interface ICardForm {
  isLock: boolean
}
