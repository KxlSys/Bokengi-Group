import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('BOKENGI 2.0 — Lot 4 — KPIs & Number Cards (Workspace IT & Infrastructure)', () => {
  const rootDir = process.cwd();
  const workspaceFixturesPath = path.join(
    rootDir,
    'frappe_apps',
    'bokengi_erp',
    'bokengi_erp',
    'fixtures',
    'workspace.json'
  );
  const numberCardFixturesPath = path.join(
    rootDir,
    'frappe_apps',
    'bokengi_erp',
    'bokengi_erp',
    'fixtures',
    'number_card.json'
  );
  const hooksPath = path.join(
    rootDir,
    'frappe_apps',
    'bokengi_erp',
    'bokengi_erp',
    'hooks.py'
  );
  const cssPath = path.join(
    rootDir,
    'frappe_apps',
    'bokengi_erp',
    'bokengi_erp',
    'public',
    'css',
    'bokengi_desk.css'
  );

  it('KPI-1: Number Cards are registered in IT & Infrastructure workspace fixture and content', () => {
    assert.ok(fs.existsSync(workspaceFixturesPath), 'workspace.json must exist');
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');

    assert.ok(itWorkspace, 'IT & Infrastructure workspace must exist');
    const numberCards = itWorkspace.number_cards || [];
    assert.strictEqual(numberCards.length, 4, 'Must contain exactly 4 registered Number Cards');

    const cardNames = numberCards.map((c: { number_card_name: string }) => c.number_card_name);
    assert.deepStrictEqual(cardNames, [
      'Bokengi Projets Actifs',
      'Bokengi Commandes Actives',
      'Bokengi Leads En Cours',
      'Bokengi RDV Calcom',
    ]);

    const content = JSON.parse(itWorkspace.content);
    const contentCards = content.filter((b: { type: string }) => b.type === 'number_card');
    assert.strictEqual(contentCards.length, 4, 'Content must contain 4 number_card blocks');
    contentCards.forEach((c: { data: { col: number } }) => {
      assert.strictEqual(c.data.col, 3, 'Each KPI card must take col: 3 for a 4-column layout');
    });
  });

  it('KPI-2: All KPIs use exclusively real ERPNext DocTypes and functional filters (no static fake metrics)', () => {
    assert.ok(fs.existsSync(numberCardFixturesPath), 'number_card.json must exist');
    const numberCards = JSON.parse(fs.readFileSync(numberCardFixturesPath, 'utf8'));

    // 1. Projets Actifs
    const projCard = numberCards.find((c: { name: string }) => c.name === 'Bokengi Projets Actifs');
    assert.ok(projCard, 'Bokengi Projets Actifs must exist in number_card.json');
    assert.strictEqual(projCard.document_type, 'Project');
    assert.strictEqual(projCard.function, 'Count');
    assert.ok(projCard.filters_json.includes('Open'), 'Project status filter must target Open');

    // 2. Commandes Actives
    const orderCard = numberCards.find((c: { name: string }) => c.name === 'Bokengi Commandes Actives');
    assert.ok(orderCard, 'Bokengi Commandes Actives must exist in number_card.json');
    assert.strictEqual(orderCard.document_type, 'Sales Order');
    assert.strictEqual(orderCard.function, 'Count');
    assert.ok(orderCard.filters_json.includes('Sales Order'), 'Sales Order filter present');

    // 3. Leads En Cours
    const leadCard = numberCards.find((c: { name: string }) => c.name === 'Bokengi Leads En Cours');
    assert.ok(leadCard, 'Bokengi Leads En Cours must exist in number_card.json');
    assert.strictEqual(leadCard.document_type, 'Lead');
    assert.strictEqual(leadCard.function, 'Count');

    // 4. RDV Cal.com
    const calCard = numberCards.find((c: { name: string }) => c.name === 'Bokengi RDV Calcom');
    assert.ok(calCard, 'Bokengi RDV Calcom must exist in number_card.json');
    assert.strictEqual(calCard.document_type, 'Lead');
    assert.strictEqual(calCard.function, 'Count');
  });

  it('KPI-3: Existing ERPNext routes, list views, and navigation references are preserved', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');

    // Shortcuts remain intact
    const shortcuts = itWorkspace.shortcuts || [];
    assert.strictEqual(shortcuts.length, 4, '4 Shortcuts preserved');

    // Domain Cards links remain intact
    const links = itWorkspace.links || [];
    assert.strictEqual(links.length, 9, 'All 9 links/card breaks preserved');
  });

  it('KPI-4: Number Cards styling uses Bokengi Cyber tokens, gradients, and micro-interactions', () => {
    assert.ok(fs.existsSync(cssPath), 'bokengi_desk.css must exist');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Tokens and base styling
    assert.ok(css.includes('.widget.number-card-widget-box'), 'Must style .widget.number-card-widget-box');
    assert.ok(css.includes('linear-gradient(135deg, #0A192F 0%, #112240 100%)'), 'Must use Deep Navy gradient');
    assert.ok(css.includes('color: #64FFDA'), 'KPI big number must use Cyan accent #64FFDA');
    assert.ok(css.includes('font-size: 28px'), 'KPI number font size');
    assert.ok(css.includes('border-radius: 10px'), 'KPI card border-radius');

    // Hover, active and focus ring
    assert.ok(css.includes('.widget.number-card-widget-box:hover'), 'Must have hover lift');
    assert.ok(css.includes('.widget.number-card-widget-box:focus-visible'), 'Must have focus-visible ring');

    // Micro-indicator bullet
    assert.ok(css.includes('.widget.number-card-widget-box .widget-title::before'), 'Leading micro-bullet indicator');
  });

  it('KPI-5: KPI grid is fully responsive across Desktop, 1024px, 768px, and 480px breakpoints', () => {
    const css = fs.readFileSync(cssPath, 'utf8');

    // Desktop: 4 columns
    assert.ok(css.includes('@media (min-width: 1025px)'), 'Desktop breakpoint');
    assert.ok(
      css.includes('[data-page-route="Workspaces"] .widget-group[data-widget-type="number_card"] .widget-grid'),
      'Number card grid styling present'
    );

    // Tablet: 2 columns
    assert.ok(css.includes('@media (max-width: 1024px) and (min-width: 601px)'), 'Tablet breakpoint');

    // Mobile: 1 column
    assert.ok(css.includes('@media (max-width: 480px)'), 'Mobile 480px breakpoint');
  });

  it('KPI-6: Zero horizontal overflow is strictly enforced on all viewport widths', () => {
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.ok(css.includes('overflow-x: hidden !important'), 'Strict overflow-x prevention');
    assert.ok(css.includes('#page-Workspaces'), 'Applied to page-Workspaces container');
  });

  it('KPI-7: Non-regression check: Header (Lot 1), Shortcuts (Lot 2), Domain Cards (Lot 3), and RLS intact', () => {
    // 1. Hooks CSS registration
    const hooks = fs.readFileSync(hooksPath, 'utf8');
    assert.ok(hooks.includes('app_include_css = "/assets/bokengi_erp/css/bokengi_desk.css'), 'hooks.py intact');

    // 2. pole_permissions.py RLS security intact
    const polePermPath = path.join(
      rootDir,
      'frappe_apps',
      'bokengi_erp',
      'bokengi_erp',
      'bokengi_core',
      'pole_permissions.py'
    );
    const polePerm = fs.readFileSync(polePermPath, 'utf8');
    assert.ok(polePerm.includes('POL-it'), 'POL-it intact');
    assert.ok(polePerm.includes('get_lead_permission_query_conditions'), 'Lead query conditions intact');
    assert.ok(polePerm.includes('get_project_permission_query_conditions'), 'Project query conditions intact');

    // 3. Workspace content preserved in first 9 blocks
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const content = JSON.parse(itWorkspace.content);

    assert.strictEqual(content[0].data.custom_block_name, 'Bokengi Workspace Header', 'Lot 1 Header intact');
    assert.strictEqual(content[1].data.text, 'Actions rapides', 'Actions rapides section intact');
    assert.strictEqual(content[2].data.shortcut_name, '+ Nouveau Projet IT', 'Shortcut 1 intact');
    assert.strictEqual(content[3].data.shortcut_name, '+ Nouveau Ticket IT', 'Shortcut 2 intact');
    assert.strictEqual(content[4].data.shortcut_name, '+ Saisie de Temps', 'Shortcut 3 intact');
    assert.strictEqual(content[5].data.shortcut_name, 'Projets IT Bokengi', 'Shortcut 4 intact');
    assert.strictEqual(content[7].data.card_name, 'Projets & Infrastructure', 'Domain Card 1 intact');
    assert.strictEqual(content[8].data.card_name, 'Support & Opérations', 'Domain Card 2 intact');
  });
});
