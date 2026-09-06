'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from '@payloadcms/ui'

export interface BokengiLogoProps {
  className?: string
  priority?: boolean
  [key: string]: unknown
}

export const BokengiLogo: React.FC<BokengiLogoProps> = ({ className = '' }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`graphic-logo bokengi-admin-logo-wrap ${className}`.trim()}
      data-theme-active={mounted ? theme : undefined}
    >
      <img
        src="/bokengi-logo-horizontal.png"
        alt="Bokengi Group"
        className="bokengi-admin-logo bokengi-admin-logo--light"
        width={1035}
        height={240}
        loading="eager"
      />
      <img
        src="/bokengi-logo-horizontal-dark.png"
        alt="Bokengi Group"
        className="bokengi-admin-logo bokengi-admin-logo--dark"
        width={1035}
        height={240}
        loading="eager"
      />
    </div>
  )
}

export default BokengiLogo
