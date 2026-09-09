'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

export interface InvoiceStatusCellProps extends Partial<DefaultCellComponentProps> {
  cellData?: string | null
  className?: string
  [key: string]: unknown
}

interface StatusConfig {
  label: string
  className: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
  draft: {
    label: 'Brouillon',
    className: 'bokengi-invoice-badge--draft',
  },
  sent: {
    label: 'Émise / Envoyée',
    className: 'bokengi-invoice-badge--sent',
  },
  paid: {
    label: 'Payée',
    className: 'bokengi-invoice-badge--paid',
  },
  overdue: {
    label: 'En retard',
    className: 'bokengi-invoice-badge--overdue',
  },
  cancelled: {
    label: 'Annulée',
    className: 'bokengi-invoice-badge--cancelled',
  },
}

export const InvoiceStatusCell: React.FC<InvoiceStatusCellProps> = ({
  cellData,
  className = '',
  rowData,
}) => {
  const rawStatus = (typeof cellData === 'string' ? cellData : (rowData as any)?.status) || 'draft'
  const statusKey = rawStatus.toLowerCase().trim()
  const config = STATUS_MAP[statusKey] || {
    label: rawStatus || 'Brouillon',
    className: 'bokengi-invoice-badge--draft',
  }

  return (
    <span className={`bokengi-status-badge ${config.className} ${className}`.trim()}>
      <span className="bokengi-status-badge__dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default InvoiceStatusCell
