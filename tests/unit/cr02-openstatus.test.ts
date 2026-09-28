import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — CR-02 : OpenStatus Decommissioning & Standby Suite', () => {
  const WRANGLER_PATH = path.resolve(process.cwd(), 'wrangler.jsonc')
  const BADGE_PATH = path.resolve(process.cwd(), 'src/components/bokengi/OpenStatusBadge.tsx')
  const FOOTER_PATH = path.resolve(process.cwd(), 'src/components/bokengi/Footer.tsx')

  it('CR02-1: Verify wrangler.jsonc has OpenStatus explicitly disabled', () => {
    assert(fs.existsSync(WRANGLER_PATH), 'wrangler.jsonc must exist')
    const content = fs.readFileSync(WRANGLER_PATH, 'utf-8')
    assert(content.includes('"NEXT_PUBLIC_OPENSTATUS_ENABLED": "false"'), 'NEXT_PUBLIC_OPENSTATUS_ENABLED must be "false"')
  })

  it('CR02-2: Verify OpenStatusBadge component is decommissioned and unreferenced', () => {
    assert(!fs.existsSync(BADGE_PATH), 'OpenStatusBadge.tsx should be removed')
    assert(fs.existsSync(FOOTER_PATH), 'Footer.tsx must exist')
    const content = fs.readFileSync(FOOTER_PATH, 'utf-8')
    assert(!content.includes("import { OpenStatusBadge }"), 'OpenStatusBadge must not be imported in Footer')
    assert(!content.includes('<OpenStatusBadge'), 'OpenStatusBadge must not be rendered in Footer')
  })
})
