import './style.sass'
import InputText from '../../../../shared/components/input-text'
import Button from '../../../../shared/components/buttons'
import {Field, Formik, Form} from 'formik'

const Access = (props: {onSubmit: (values: {username: string}) => void}) => {
  return (
      <div className="outer-container">
          <Formik
            initialValues={{username: ''}}
            onSubmit={props.onSubmit}
            enableReinitialize
            render={() => (
                <Form className={'telegram-container'}>
                    <Field name="username">
                        {({ field }: any) => (
                            <InputText
                                placeholder="Input username"
                                className="telegram-input"
                            {...field}
                            ></InputText>
                        )}
                    </Field>
                    <div className="modal-form-btn">
                        <Button
                            type="submit"
                            className="outline--highlight btn-done"
                            >
                            Sync
                        </Button>
                    </div>
                </Form>
                )} />
                <p className="note-text"> 
                    Note: Please do not put "@" before your username. Your username is case-sensitive!
                </p>
      </div>
    
  )
}

export default Access
