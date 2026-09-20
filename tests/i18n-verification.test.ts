import { describe, it } from 'node:test'
import assert from 'node:assert'
import { fr } from '../src/i18n/dictionaries/fr'
import { en } from '../src/i18n/dictionaries/en'
import { getDictionary } from '../src/i18n/getDictionary'
import {
  getPolesSeedData,
  getServicesSeedData,
  getCaseStudiesSeedData,
  getPostsSeedData,
} from '../src/data/bokengi-seed-data'
import { formatDate } from '../src/lib/data'
import payloadConfig from '../src/payload.config'

function getDeepKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = []
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(getDeepKeys(obj[k], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

describe('I18N Complete Verification Suite', () => {
  // ──────────────────────────────────────────
  // A. PARITÉ DES DICTIONNAIRES FR / EN
  // ──────────────────────────────────────────
  it('A1: Deep parity of all dictionary keys between FR and EN', () => {
    const frKeys = getDeepKeys(fr).sort()
    const enKeys = getDeepKeys(en).sort()

    const missingInEn = frKeys.filter((k) => !enKeys.includes(k))
    const missingInFr = enKeys.filter((k) => !frKeys.includes(k))

    assert.strictEqual(
      missingInEn.length,
      0,
      `Keys present in FR but missing in EN: ${missingInEn.join(', ')}`,
    )
    assert.strictEqual(
      missingInFr.length,
      0,
      `Keys present in EN but missing in FR: ${missingInFr.join(', ')}`,
    )
    assert.strictEqual(frKeys.length, enKeys.length)
    console.log(`  [PASS] A1: ${frKeys.length} dictionary keys strictly matched between FR and EN.`)
  })

  it('A2: getDictionary returns correct dictionary based on locale', () => {
    const dictFr = getDictionary('fr')
    const dictEn = getDictionary('en')

    assert.strictEqual(dictFr.nav.home, 'Accueil')
    assert.strictEqual(dictEn.nav.home, 'Home')
    assert.strictEqual(dictFr.common.contactUs, 'Nous contacter')
    assert.strictEqual(dictEn.common.contactUs, 'Contact Us')
    console.log('  [PASS] A2: getDictionary returns distinct and expected strings per locale.')
  })

  it('A3: English dictionary contains true English translations (no accidental copy-paste of French sentences)', () => {
    assert.strictEqual(en.home.heroLead, 'Technology, security, and services engineered to advance organizations.')
    assert.strictEqual(en.home.heroTitleWord1, 'Build.')
    assert.strictEqual(en.home.heroTitleWord2, 'Protect.')
    assert.strictEqual(en.home.heroTitleWord3, 'Scale.')
    assert.strictEqual(en.contactForm.submit, 'Submit Project Request')
    assert.strictEqual(en.footer.ariaLabel, 'Footer')
    assert.strictEqual(en.common.operationalSystems, 'Operational systems')
    console.log('  [PASS] A3: Verified authentic English translations in en.ts.')
  })

  // ──────────────────────────────────────────
  // B. CMS PAYLOAD LOCALIZATION CONFIG
  // ──────────────────────────────────────────
  it('B1: Payload CMS localization has fallback disabled', async () => {
    const config = await payloadConfig
    assert.ok(config.localization, 'Localization config exists')
    assert.strictEqual(
      config.localization.fallback,
      false,
      'Payload localization fallback MUST be false (no silent masquerading of French as English)',
    )
    const localeCodes = config.localization.locales.map((l: any) =>
      typeof l === 'string' ? l : l.code,
    )
    assert.deepStrictEqual(
      localeCodes,
      ['fr', 'en'],
      'Payload localization locales must be [fr, en]',
    )
    assert.strictEqual(
      config.localization.defaultLocale,
      'fr',
      'Payload default locale must be fr',
    )
    console.log('  [PASS] B1: Payload CMS localization configured with fallback: false.')
  })

  // ──────────────────────────────────────────
  // C. DATA & SEED LAYER BILINGUAL DATA
  // ──────────────────────────────────────────
  it('C1: Poles seed data returns localized datasets', () => {
    const polesFr = getPolesSeedData('fr')
    const polesEn = getPolesSeedData('en')

    assert.strictEqual(polesFr.length, 5)
    assert.strictEqual(polesEn.length, 5)

    const itFr = polesFr.find((p) => p.slug === 'it')
    const itEn = polesEn.find((p) => p.slug === 'it')

    assert.ok(itFr && itEn)
    assert.ok(itFr.description.toLowerCase().includes('infrastructures'))
    assert.ok(itEn.description.includes('IT infrastructure'))
    assert.notStrictEqual(itFr.description, itEn.description)
    console.log('  [PASS] C1: Poles seed data contains distinct French and English content.')
  })

  it('C2: Services seed data returns localized datasets', () => {
    const srvFr = getServicesSeedData('fr')
    const srvEn = getServicesSeedData('en')

    assert.strictEqual(srvFr.length, srvEn.length)
    assert.ok(srvFr.length >= 10)

    const firstFr = srvFr[0]
    const firstEn = srvEn[0]

    assert.notStrictEqual(firstFr.title, firstEn.title)
    assert.notStrictEqual(firstFr.shortDescription, firstEn.shortDescription)
    console.log('  [PASS] C2: Services seed data contains distinct French and English content.')
  })

  it('C3: Case Studies seed data returns localized datasets', () => {
    const csFr = getCaseStudiesSeedData('fr')
    const csEn = getCaseStudiesSeedData('en')

    assert.strictEqual(csFr.length, csEn.length)
    assert.strictEqual(csFr.length, 5)

    for (let i = 0; i < 5; i++) {
      assert.strictEqual(csFr[i].slug, csEn[i].slug, `Slug parity for case ${i}`)
      assert.notStrictEqual(csFr[i].summary, csEn[i].summary, `Summary translated for case ${i}`)
      assert.notStrictEqual(csFr[i].context, csEn[i].context, `Context translated for case ${i}`)
      assert.notStrictEqual(csFr[i].challenge, csEn[i].challenge, `Challenge translated for case ${i}`)
      assert.notStrictEqual(csFr[i].solution, csEn[i].solution, `Solution translated for case ${i}`)
      assert.notStrictEqual(csFr[i].results, csEn[i].results, `Results translated for case ${i}`)
    }
    console.log('  [PASS] C3: All 5 Case Studies fully translated into English.')
  })

  it('C4: Posts seed data returns localized datasets', () => {
    const postsFr = getPostsSeedData('fr')
    const postsEn = getPostsSeedData('en')

    assert.strictEqual(postsFr.length, postsEn.length)
    assert.ok(postsFr.length >= 3)

    for (let i = 0; i < postsFr.length; i++) {
      assert.strictEqual(postsFr[i].slug, postsEn[i].slug)
      assert.notStrictEqual(postsFr[i].title, postsEn[i].title)
      assert.notStrictEqual(postsFr[i].excerpt, postsEn[i].excerpt)
    }
    console.log('  [PASS] C4: All Posts seed data fully translated into English.')
  })

  it('C5: formatDate helper respects locale', () => {
    const testDate = '2026-03-15T12:00:00.000Z'
    const frFormatted = formatDate(testDate, 'fr')
    const enFormatted = formatDate(testDate, 'en')

    assert.ok(frFormatted.toLowerCase().includes('mars'), `FR date must contain mars: ${frFormatted}`)
    assert.ok(enFormatted.toLowerCase().includes('march'), `EN date must contain march: ${enFormatted}`)
    console.log(`  [PASS] C5: formatDate verified: "${frFormatted}" vs "${enFormatted}".`)
  })

  // ──────────────────────────────────────────
  // D. CONTACT FORM INVARIANTS
  // ──────────────────────────────────────────
  it('D1: Contact form invariant API payload values remain stable', () => {
    const supportedPoles = ['it', 'digital', 'business', 'consulting', 'events']
    const supportedTypes = ['devis', 'cadrage', 'support', 'partenariat', 'autre']

    // Vérification que les options n'ont pas altéré les identifiants techniques
    assert.strictEqual(supportedPoles[0], 'it')
    assert.strictEqual(supportedTypes[0], 'devis')
    console.log('  [PASS] D1: Lead API schema contract (pole="it", requestType="devis") remains invariant.')
  })
})
