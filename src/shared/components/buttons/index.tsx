import React, { useMemo } from 'react'
import './style.sass'

export default function Button({
  className,
  children,
  ...props
}: IButtonProps) {
  return (
    <button className={`gen-button ${className || ''}`} {...props}>
      {children}
    </button>
  )
}

interface IButtonProps {
  className?: 'primary' | 'outline' | 'outline--highlight' | any
  children: React.ReactNode
  [key: string]: any
}
