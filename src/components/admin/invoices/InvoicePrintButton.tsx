'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const InvoicePrintButton: React.FC = () => {
  const { id } = useDocumentInfo()

  if (!id) return null

  return (
    <div style={{ margin: '1rem 0' }}>
      <a
        href={`/api/invoices/${id}/print`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.65rem 1rem',
          background: 'rgba(22, 184, 243, 0.1)',
          color: 'var(--bokengi-cyan, #16B8F3)',
          border: '1px solid rgba(22, 184, 243, 0.4)',
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '0.85rem',
          textDecoration: 'none',
          cursor: 'pointer',
          textAlign: 'center',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
        }}
      >
        <span>Imprimer / Exporter PDF 📄</span>
      </a>
    </div>
  )
}

export default InvoicePrintButton
