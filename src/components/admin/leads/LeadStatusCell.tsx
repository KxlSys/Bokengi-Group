'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

export interface LeadStatusCellProps extends Partial<DefaultCellComponentProps> {
  cellData?: string | null
  className?: string
  [key: string]: unknown
}

interface StatusConfig {
  label: string
  className: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
  new: {
    label: 'Nouveau',
    className: 'bokengi-status-badge--new',
  },
  contacted: {
    label: 'Contacté',
    className: 'bokengi-status-badge--contacted',
  },
  qualified: {
    label: 'Qualifié',
    className: 'bokengi-status-badge--qualified',
  },
  converted: {
    label: 'Converti',
    className: 'bokengi-status-badge--converted',
  },
  archived: {
    label: 'Archivé',
    className: 'bokengi-status-badge--archived',
  },
}

export const LeadStatusCell: React.FC<LeadStatusCellProps> = ({
  cellData,
  className = '',
  rowData,
}) => {
  const rawStatus = (typeof cellData === 'string' ? cellData : (rowData as any)?.status) || ''
  const statusKey = rawStatus.toLowerCase().trim()
  const config = STATUS_MAP[statusKey] || {
    label: rawStatus || '—',
    className: 'bokengi-status-badge--default',
  }

  return (
    <span className={`bokengi-status-badge ${config.className} ${className}`.trim()}>
      <span className="bokengi-status-badge__dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default LeadStatusCell