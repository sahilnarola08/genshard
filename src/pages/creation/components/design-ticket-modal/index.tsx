import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik'
import { useCallback } from 'react'
import Button from '../../../../shared/components/buttons'
import InputText from '../../../../shared/components/input-text'
import Modal from '../../../../shared/components/modal'
import * as Yup from 'yup'
import { ICardFormState } from '../card-form/types'
import './style.sass'

const validationSchema = Yup.object({
  designUri: Yup.string()
    .required('This field is required.')
    .url('The URI invalid'),
})

const initFormState: IDesignTicketState = {
  designUri: '',
}

const DesignTicketModal = () => {
  const {
    setFieldValue,
    values: cardFormValue,
  } = useFormikContext<ICardFormState>()

  const onSubmited = useCallback(
    (values: IDesignTicketState) => {
      setFieldValue('designUri', values.designUri)
      onClose()
    },
    [cardFormValue]
  )

  const onClose = useCallback(() => {
    setFieldValue('designable', false)
  }, [])

  return (
    <div className="design-ticket">
      <Modal isOpen={cardFormValue.designable} onClose={onClose}>
        <div className="modal-content">
          <div className="modal-title">CUSTOM TICKET DESIGN</div>

          <Formik
            initialValues={initFormState}
            onSubmit={onSubmited}
            enableReinitialize
            render={() => (
              <Form>
                <div className="modal-form">
                  <div className="modal-form-item">
                    <Field name="designUri">
                      {({ field }: any) => (
                        <InputText
                          placeholder="Input NFT URI"
                          className="modal-form-item__input"
                          {...field}
                        ></InputText>
                      )}
                    </Field>
                    <ErrorMessage
                      name="designUri"
                      render={(msg) => (
                        <div className="form-item__err">{msg}</div>
                      )}
                    />
                  </div>

                  <div className="modal-form-btn">
                    <Button
                      type="submit"
                      className="outline--highlight btn-done"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          />
        </div>
      </Modal>
    </div>
  )
}

interface IDesignTicketState {
  designUri: string
}

export default DesignTicketModal
