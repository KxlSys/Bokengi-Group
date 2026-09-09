'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

export interface LeadPriorityCellProps extends Partial<DefaultCellComponentProps> {
  cellData?: string | null
  className?: string
  [key: string]: unknown
}

interface PriorityConfig {
  label: string
  className: string
}

const PRIORITY_MAP: Record<string, PriorityConfig> = {
  low: {
    label: 'Basse',
    className: 'bokengi-priority-badge--low',
  },
  medium: {
    label: 'Moyenne',
    className: 'bokengi-priority-badge--medium',
  },
  high: {
    label: 'Haute',
    className: 'bokengi-priority-badge--high',
  },
  urgent: {
    label: 'Urgente',
    className: 'bokengi-priority-badge--urgent',
  },
}

export const LeadPriorityCell: React.FC<LeadPriorityCellProps> = ({
  cellData,
  className = '',
  rowData,
}) => {
  const rawPriority = (typeof cellData === 'string' ? cellData : (rowData as any)?.priority) || 'medium'
  const priorityKey = rawPriority.toLowerCase().trim()
  const config = PRIORITY_MAP[priorityKey] || {
    label: rawPriority || 'Moyenne',
    className: 'bokengi-priority-badge--medium',
  }

  return (
    <span className={`bokengi-status-badge bokengi-priority-badge ${config.className} ${className}`.trim()}>
      <span className="bokengi-status-badge__dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default LeadPriorityCell
