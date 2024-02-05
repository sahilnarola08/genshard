import React, { useMemo } from 'react'
import './style.sass'

export default function Checkbox({ className, ...props }: ICheckboxProps) {
  return (
    <label className="input-checkbox--primary">
      <input className={`${className || ''}`} {...props} type="checkbox" />
      <span></span>
    </label>
  )
}

interface ICheckboxProps {
  className: any
  [key: string]: any
}
