import React from 'react'

export interface BokengiIconProps {
  className?: string
  fill?: string
  [key: string]: unknown
}

export const BokengiIcon: React.FC<BokengiIconProps> = ({ className = '' }) => {
  return (
    <img
      src="/bokengi-mark.svg"
      alt="Bokengi Group"
      className={`graphic-icon bokengi-admin-icon ${className}`.trim()}
      width={28}
      height={28}
      loading="eager"
    />
  )
}

export default BokengiIcon
