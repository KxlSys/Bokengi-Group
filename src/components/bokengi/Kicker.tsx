import React from 'react'

export interface KickerProps {
  label?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Kicker: React.FC<KickerProps> = ({ label, children, className = '', style }) => {
  return (
    <span className={`kicker-v4 ${className}`} style={style}>
      {children || label}
    </span>
  )
}

export default Kicker
