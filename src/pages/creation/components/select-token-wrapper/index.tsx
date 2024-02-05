import { Token } from '@uniswap/sdk'
import { ErrorMessage, useFormikContext } from 'formik'
import React, { useCallback } from 'react'
import { ICardFormFields } from '../card-form/types'
import SelectToken from '../SelectToken'
import './style.sass'

export default function SelectTokenWrapper() {
  const { setFieldValue, values } = useFormikContext()

  const onSelectToken = useCallback((token: any) => {
    setFieldValue(ICardFormFields.token, token)
  }, [])

  return (
    <div className="select-token-wrapper">
      <div className="select-token-box">
        <p className="title">Token</p>
        <SelectToken onSelectToken={onSelectToken} />
      </div>

      <div className="select-token-err">
        <div></div>
        <ErrorMessage
          name="token"
          render={(msg: any) => <div className="form-item__err">{msg}</div>}
        />
      </div>
    </div>
  )
}
