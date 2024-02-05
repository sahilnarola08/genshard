import React from 'react'
import './style.sass'

export default function InputText({ className, type = "text", ...props }: IInputTextProps) {
  return (
    <input
      autoComplete="off"
      className={`input-text--primary ${className || ''}`}
      {...props}
      type={type}
    />
  )
}

interface IInputTextProps {
  className: any
  type?: string
  [key: string]: any
}
