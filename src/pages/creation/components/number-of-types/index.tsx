import { ErrorMessage, Field, useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'
import Button from '../../../../shared/components/buttons'
import { MAXIMUM_NUMBER_OF_TYPES } from '../../creation.config'
import { ICardFormState } from '../card-form/types'
import './style.sass'
import InputText from '../../../../shared/components/input-text'
import Checkbox from '../../../../shared/components/checkbox'

// create the button items array according MAXIMUM_NUMBER_OF_TYPES constant
const ButtonItems = new Array(MAXIMUM_NUMBER_OF_TYPES)
  .fill(undefined)
  .map((item, index) => index + 1)

export default function NumberTypes() {
  const { values, setFieldValue } = useFormikContext<ICardFormState>()

  // update number of types value to form state
  const onChangeType = useCallback(
    (value: number) => () => {
      setFieldValue('numberOfTypes', value)
    },
    []
  )

  return useMemo(
    () => (
      <div className="number-types">
        <div className="types-select">
          <p className="types-select__label">Number of types</p>
          <div className="types-select__btns">
            {ButtonItems.map((value) => (
              <Button
                key={value}
                type="button"
                className={`outline ${
                  value === values.numberOfTypes && 'active'
                }`}
                onClick={onChangeType(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        {/* design URI */}
        {
          <div className="design-uri">
            <div className="">
              <span className="design__label">Design URI</span>
              <Field name="designUri">
                {({ field }: any) => (
                  <div className="DesignUriTextBox">
                    <div>https://cloudfront.genshards.com/</div>
                    <input placeholder="Enter project name here" {...field} />
                  </div>
                )}
              </Field>
            </div>

            <div className="DesignUriError">
              <div></div>
              <ErrorMessage
                name="designUri"
                render={(msg) => <div className="form-item__err">{msg}</div>}
              />
            </div>
          </div>
        }

        {/* checkbox toggle design URI */}
        {/* <div className="design-checkbox">
          <div></div>
          <div className="design-checkbox__content">
            <Field name="designable" type="checkbox">
              {({ field }: any) => (
                <Checkbox
                  className="card-form-item__input"
                  {...field}
                ></Checkbox>
              )}
            </Field>
            <div className="types-custom__text">Use custom ticket design</div>
          </div>
        </div> */}
      </div>
    ),
    [values.numberOfTypes, values.designable]
  )
}
