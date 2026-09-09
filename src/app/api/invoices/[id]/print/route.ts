import { NextRequest, NextResponse } from 'next/server'

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatCurrency(val: unknown): string {
  const num = typeof val === 'number' ? val : parseFloat(String(val || 0))
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(isNaN(num) ? 0 : num)
}

function formatDate(val: unknown): string {
  if (!val) return '—'
  try {
    const d = new Date(String(val))
    return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return String(val)
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const { user } = await payload.auth({ headers: req.headers })
    const { isEditor } = await import('@/access/roles')
    if (!user || !isEditor(user)) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>Accès restreint</h2><p>Vous devez être connecté avec un compte habilité pour visualiser ou imprimer cette pièce comptable.</p><p><a href="/admin/login" style="display:inline-block;margin-top:1rem;padding:0.5rem 1rem;background:#0B1528;color:#fff;text-decoration:none;border-radius:4px;">Se connecter à l'administration</a></p></body></html>`,
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    const invoice = await payload.findByID({
      collection: 'invoices',
      id,
      depth: 1,
    })

    if (!invoice) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>Pièce comptable introuvable</h2><p>Le document ID ${escapeHtml(id)} n'existe pas ou a été supprimé.</p></body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    let siteSettings: any = null
    try {
      siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    } catch {}

    const companyName = siteSettings?.companyName || 'Bokengi Group'
    const legalForm = siteSettings?.legalForm || 'SAS'
    const capital = siteSettings?.capital || '7 500 €'
    const contactEmail = siteSettings?.contactEmail || 'contact@bokengi-group.com'
    const phone = siteSettings?.phone || '07 58 88 84 34'
    const street = siteSettings?.address?.street ? String(siteSettings.address.street).trim() : ''
    const city = siteSettings?.address?.city || 'Paris'
    const country = siteSettings?.address?.country || 'France'
    const issuerAddress = [street, city, country].filter(Boolean).join(', ')

    const rcs = siteSettings?.rcs ? String(siteSettings.rcs).trim() : ''
    const siren = siteSettings?.siren ? String(siteSettings.siren).trim() : ''
    const siret = siteSettings?.siret ? String(siteSettings.siret).trim() : ''
    const vatNumber = siteSettings?.vatNumber ? String(siteSettings.vatNumber).trim() : ''
    const bankName = siteSettings?.bankDetails?.bankName ? String(siteSettings.bankDetails.bankName).trim() : ''
    const iban = siteSettings?.bankDetails?.iban ? String(siteSettings.bankDetails.iban).trim() : ''
    const bic = siteSettings?.bankDetails?.bic ? String(siteSettings.bankDetails.bic).trim() : ''

    const legalLineItems = [
      rcs ? escapeHtml(rcs) : '',
      siren ? `SIREN : ${escapeHtml(siren)}` : '',
      siret ? `SIRET : ${escapeHtml(siret)}` : '',
      vatNumber ? `TVA : ${escapeHtml(vatNumber)}` : '',
    ].filter(Boolean).join(' · ')

    const docTypeLabel =
      invoice.type === 'quote'
        ? 'DEVIS'
        : invoice.type === 'credit_note'
        ? 'AVOIR'
        : 'FACTURE'

    const items = Array.isArray(invoice.items) ? invoice.items : []

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(docTypeLabel)} ${escapeHtml(invoice.invoiceNumber)} — ${escapeHtml(companyName)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #f8fafc;
      font-size: 9.5pt;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0B1528;
      color: #fff;
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .toolbar__title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #16B8F3;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .toolbar__actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.9rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #16B8F3;
      color: #0B1528;
    }
    .btn-primary:hover {
      background: #38bdf8;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border-color: rgba(255,255,255,0.2);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.2);
    }
    .page-container {
      max-width: 210mm;
      margin: 20px auto;
      background: #ffffff;
      padding: 20mm 18mm;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    @media print {
      body {
        background: #ffffff;
      }
      .toolbar {
        display: none !important;
      }
      .page-container {
        margin: 0;
        padding: 0;
        max-width: 100%;
        box-shadow: none;
        border-radius: 0;
      }
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #0B1528;
    }
    .brand__logo-text {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0B1528;
      text-transform: uppercase;
    }
    .brand__logo-text span {
      color: #16B8F3;
    }
    .brand__legal {
      font-size: 8pt;
      color: #64748b;
      margin-top: 0.35rem;
      line-height: 1.45;
    }
    .doc-meta {
      text-align: right;
    }
    .doc-meta__type {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #0B1528;
    }
    .doc-meta__num {
      font-size: 1.1rem;
      font-weight: 700;
      color: #16B8F3;
      margin-top: 0.2rem;
    }
    .doc-meta__table {
      margin-top: 0.6rem;
      font-size: 8.5pt;
      margin-left: auto;
      border-collapse: collapse;
    }
    .doc-meta__table td {
      padding: 0.15rem 0.4rem;
      text-align: right;
    }
    .doc-meta__table td:first-child {
      color: #64748b;
      font-weight: 500;
    }
    .doc-meta__table td:last-child {
      font-weight: 600;
      color: #0f172a;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .party-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem 1.25rem;
    }
    .party-card__kicker {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      margin-bottom: 0.5rem;
    }
    .party-card__name {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }
    .party-card__details {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.5;
      white-space: pre-line;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    .items-table th {
      background: #0B1528;
      color: #ffffff;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
    .items-table th.num, .items-table td.num {
      text-align: right;
    }
    .items-table td {
      padding: 0.7rem 0.75rem;
      border-bottom: 1px solid #e2e8f0;
      font-size: 8.5pt;
      color: #334155;
    }
    .items-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .items-table .item-desc {
      font-weight: 600;
      color: #0f172a;
    }
    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }
    .totals-table {
      width: 45%;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 0.4rem 0.6rem;
      font-size: 8.5pt;
    }
    .totals-table td:first-child {
      color: #64748b;
      text-align: left;
    }
    .totals-table td:last-child {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
    }
    .totals-table tr.total-ttc td {
      border-top: 2px solid #0B1528;
      padding-top: 0.6rem;
      font-size: 1.1rem;
      font-weight: 800;
      color: #0B1528;
    }
    .totals-table tr.total-ttc td:last-child {
      color: #0055D4;
    }
    .payment-box {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 6px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .payment-box__title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0B1528;
      margin-bottom: 0.4rem;
    }
    .payment-box__item {
      font-size: 8pt;
      color: #475569;
      line-height: 1.45;
    }
    .legal-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      font-size: 7.5pt;
      color: #64748b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar__title">
      <span>📄 ${escapeHtml(docTypeLabel)} ${escapeHtml(invoice.invoiceNumber)}</span>
      <span style="font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:3px;background:rgba(255,255,255,0.15);color:#fff;">${escapeHtml(invoice.status)}</span>
    </div>
    <div class="toolbar__actions">
      <button onclick="window.print()" class="btn btn-primary">🖨️ Imprimer / Sauvegarder en PDF</button>
      <a href="/admin/collections/invoices/${escapeHtml(invoice.id)}" class="btn btn-secondary">← Retour à l'admin</a>
    </div>
  </div>

  <div class="page-container">
    <header class="doc-header">
      <div class="brand">
        <div class="brand__logo-text">BOKENGI <span>GROUP</span></div>
        <div class="brand__legal">
          <strong>${escapeHtml(companyName)}</strong> — ${escapeHtml(legalForm)} au capital de ${escapeHtml(capital)}<br>
          Siège social : ${escapeHtml(issuerAddress)}<br>
          ${legalLineItems ? `${legalLineItems}<br>` : ''}
          Email : ${escapeHtml(contactEmail)} · Tél : ${escapeHtml(phone)}
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-meta__type">${escapeHtml(docTypeLabel)}</div>
        <div class="doc-meta__num">${escapeHtml(invoice.invoiceNumber)}</div>
        <table class="doc-meta__table">
          <tr>
            <td>Date d'émission :</td>
            <td>${formatDate(invoice.issueDate)}</td>
          </tr>
          <tr>
            <td>Date d'échéance :</td>
            <td>${formatDate(invoice.dueDate)}</td>
          </tr>
          <tr>
            <td>Mode de règlement :</td>
            <td>${escapeHtml(invoice.paymentMethod || 'Virement bancaire')}</td>
          </tr>
        </table>
      </div>
    </header>

    <section class="parties-grid">
      <div class="party-card">
        <div class="party-card__kicker">Émetteur</div>
        <div class="party-card__name">${escapeHtml(companyName)}</div>
        <div class="party-card__details">
          Siège social : ${escapeHtml(issuerAddress)}
          Email : ${escapeHtml(contactEmail)}
          Téléphone : ${escapeHtml(phone)}
        </div>
      </div>

      <div class="party-card">
        <div class="party-card__kicker">Destinataire / Client</div>
        <div class="party-card__name">${escapeHtml(invoice.clientName)}</div>
        <div class="party-card__details">
          ${invoice.clientCompany ? escapeHtml(invoice.clientCompany) + '<br>' : ''}
          ${invoice.clientAddress ? escapeHtml(invoice.clientAddress) + '<br>' : ''}
          ${invoice.clientEmail ? 'Email : ' + escapeHtml(invoice.clientEmail) + '<br>' : ''}
          ${invoice.clientPhone ? 'Tél : ' + escapeHtml(invoice.clientPhone) + '<br>' : ''}
          ${invoice.clientVatNumber ? 'TVA : ' + escapeHtml(invoice.clientVatNumber) : ''}
        </div>
      </div>
    </section>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 48%;">Désignation des prestations</th>
          <th class="num" style="width: 10%;">Qté</th>
          <th class="num" style="width: 14%;">Prix unit. HT</th>
          <th class="num" style="width: 10%;">TVA</th>
          <th class="num" style="width: 18%;">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it: any) => `
          <tr>
            <td>
              <div class="item-desc">${escapeHtml(it.description || 'Prestation de service')}</div>
            </td>
            <td class="num">${escapeHtml(it.quantity || 1)}</td>
            <td class="num">${formatCurrency(it.unitPriceHT || 0)}</td>
            <td class="num">${escapeHtml(it.vatRate ?? 20)} %</td>
            <td class="num"><strong>${formatCurrency(it.totalHT || (Number(it.quantity || 1) * Number(it.unitPriceHT || 0)))}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-wrap">
      <table class="totals-table">
        <tr>
          <td>Total Hors Taxes (HT) :</td>
          <td>${formatCurrency(invoice.subtotalHT || 0)}</td>
        </tr>
        <tr>
          <td>TVA :</td>
          <td>${formatCurrency(invoice.totalVAT || 0)}</td>
        </tr>
        <tr class="total-ttc">
          <td>Total TTC à payer :</td>
          <td>${formatCurrency(invoice.totalTTC || 0)}</td>
        </tr>
      </table>
    </div>

    <div class="payment-box">
      <div>
        <div class="payment-box__title">Coordonnées Bancaires (Virement)</div>
        <div class="payment-box__item">
          ${iban || bankName || bic ? `
            ${bankName ? `<strong>Banque :</strong> ${escapeHtml(bankName)}<br>` : ''}
            <strong>Titulaire :</strong> ${escapeHtml(companyName)}<br>
            ${iban ? `<strong>IBAN :</strong> ${escapeHtml(iban)}<br>` : ''}
            ${bic ? `<strong>BIC / SWIFT :</strong> ${escapeHtml(bic)}` : ''}
          ` : `
            <strong>Titulaire :</strong> ${escapeHtml(companyName)}<br>
            Règlement par virement bancaire — coordonnées complètes transmises sur demande.
          `}
        </div>
      </div>
      <div>
        <div class="payment-box__title">Modalités de règlement</div>
        <div class="payment-box__item">
          Paiement à réception ou selon l'échéance convenue.<br>
          Libellé du virement à rappeler : <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
        </div>
      </div>
    </div>

    <footer class="legal-footer">
      <p style="margin-bottom: 0.35rem;">
        ${invoice.notes ? escapeHtml(invoice.notes) : 'En cas de retard de paiement, une indemnité forfaitaire de 40 € pour frais de recouvrement sera due de plein droit (art. D. 441-5 C. com.), majorée des pénalités de retard calculées au taux directeur de la BCE majoré de 10 points. Pas d\'escompte pour règlement anticipé.'}
      </p>
      <p style="text-align: center; font-size: 7pt; color: #94a3b8; margin-top: 0.5rem;">
        ${escapeHtml(companyName)} — ${escapeHtml(legalForm)} au capital de ${escapeHtml(capital)} — Siège social : ${escapeHtml(issuerAddress)}${siren ? ` — SIREN : ${escapeHtml(siren)}` : ''} — Document officiel généré par le back-office Bokengi Group
      </p>
    </footer>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Invoice print error:', err)
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>Erreur lors de la génération</h2><p>${escapeHtml(msg)}</p></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}
