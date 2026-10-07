import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('BOKENGI 2.0 — Lot 2 — Actions Rapides (Workspace IT & Infrastructure)', () => {
  const rootDir = process.cwd();
  const workspaceFixturesPath = path.join(
    rootDir,
    'frappe_apps',
    'bokengi_erp',
    'bokengi_erp',
    'fixtures',
    'workspace.json'
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

  it('BWS-1: workspace.json includes IT & Infrastructure with the 4 exact functional shortcuts', () => {
    assert.ok(fs.existsSync(workspaceFixturesPath), 'workspace.json must exist');
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');

    assert.ok(itWorkspace, 'IT & Infrastructure workspace must be defined');
    const shortcuts = itWorkspace.shortcuts || [];
    assert.strictEqual(shortcuts.length, 4, 'Must have exactly 4 shortcuts');

    const shortcutLabels = shortcuts.map((s: { label: string }) => s.label);
    assert.deepStrictEqual(shortcutLabels, [
      '+ Nouveau Projet IT',
      '+ Nouveau Ticket IT',
      '+ Saisie de Temps',
      'Projets IT Bokengi',
    ]);
  });

  it('BWS-2: Destinations, views, filters, and DocTypes are strictly preserved for all 4 shortcuts', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const shortcuts = itWorkspace.shortcuts;

    // 1. + Nouveau Projet IT
    const s1 = shortcuts.find((s: { label: string }) => s.label === '+ Nouveau Projet IT');
    assert.strictEqual(s1.type, 'DocType');
    assert.strictEqual(s1.link_to, 'Project');
    assert.strictEqual(s1.doc_view, 'New');

    // 2. + Nouveau Ticket IT
    const s2 = shortcuts.find((s: { label: string }) => s.label === '+ Nouveau Ticket IT');
    assert.strictEqual(s2.type, 'DocType');
    assert.strictEqual(s2.link_to, 'Issue');
    assert.strictEqual(s2.doc_view, 'New');

    // 3. + Saisie de Temps
    const s3 = shortcuts.find((s: { label: string }) => s.label === '+ Saisie de Temps');
    assert.strictEqual(s3.type, 'DocType');
    assert.strictEqual(s3.link_to, 'Timesheet');
    assert.strictEqual(s3.doc_view, 'New');

    // 4. Projets IT Bokengi (filtered list on POL-it)
    const s4 = shortcuts.find((s: { label: string }) => s.label === 'Projets IT Bokengi');
    assert.strictEqual(s4.type, 'DocType');
    assert.strictEqual(s4.link_to, 'Project');
    assert.strictEqual(s4.doc_view, 'List');
    assert.ok(s4.stats_filter, 'Must have stats_filter');
    assert.ok(s4.stats_filter.includes('POL-it'), 'stats_filter must target POL-it');
    assert.ok(s4.stats_filter.includes('custom_treatment_pole'), 'stats_filter must check custom_treatment_pole');
  });

  it('BWS-3: workspace.json content array orders Header (Lot 1) followed by Actions rapides section', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const content = JSON.parse(itWorkspace.content);

    // Block 0: Lot 1 Custom Block Header
    assert.strictEqual(content[0].type, 'custom_block');
    assert.strictEqual(content[0].data.custom_block_name, 'Bokengi Workspace Header');

    // Block 1: Actions rapides section heading
    assert.strictEqual(content[1].type, 'header');
    assert.strictEqual(content[1].data.text, 'Actions rapides');

    // Blocks 2..5: The 4 shortcut cards
    assert.strictEqual(content[2].type, 'shortcut');
    assert.strictEqual(content[2].data.shortcut_name, '+ Nouveau Projet IT');
    assert.strictEqual(content[3].type, 'shortcut');
    assert.strictEqual(content[3].data.shortcut_name, '+ Nouveau Ticket IT');
    assert.strictEqual(content[4].type, 'shortcut');
    assert.strictEqual(content[4].data.shortcut_name, '+ Saisie de Temps');
    assert.strictEqual(content[5].type, 'shortcut');
    assert.strictEqual(content[5].data.shortcut_name, 'Projets IT Bokengi');
  });

  it('BWS-4: bokengi_desk.css defines Lot 2 Action Card visual styling and cybersecurity tokens', () => {
    assert.ok(fs.existsSync(cssPath), 'bokengi_desk.css must exist');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Deep Navy surface & cyan border tokens
    assert.ok(css.includes('#0A192F'), 'Must use Deep Navy #0A192F');
    assert.ok(css.includes('#112240'), 'Must use Elevated Navy #112240');
    assert.ok(css.includes('#64FFDA'), 'Must use Cyan accent #64FFDA');
    assert.ok(css.includes('rgba(100, 255, 218, 0.16)'), 'Must use subtle cyan border token');

    // Base Action Card layout
    assert.ok(css.includes('.widget.shortcut.shortcut-widget-box'), 'Must style .widget.shortcut.shortcut-widget-box');
    assert.ok(css.includes('min-height: 80px'), 'Must provide comfortable min-height for action cards');
    assert.ok(css.includes('border-radius: 10px'), 'Must use refined 10px border-radius');

    // Interactive states
    assert.ok(css.includes('transform: translateY(-3px)'), 'Must include smooth hover lift');
    assert.ok(css.includes(':focus-visible'), 'Must implement keyboard focus visible ring');

    // Subtitle descriptions for all 4 actions
    assert.ok(css.includes("Démarrer un projet d'infrastructure ou cyber"), 'Subtitle for New IT Project');
    assert.ok(css.includes('Ouvrir un incident technique ou support'), 'Subtitle for New IT Ticket');
    assert.ok(css.includes("Enregistrer les heures d'ingénierie"), 'Subtitle for Timesheet');
    assert.ok(css.includes('Consulter les projets du pôle POL-it'), 'Subtitle for IT Projects list');

    // Action Card Icon box (42px) with distinct SVG icons
    assert.ok(css.includes('width: 42px'), 'Icon box dimension width');
    assert.ok(css.includes('height: 42px'), 'Icon box dimension height');
    assert.ok(css.includes('data:image/svg+xml'), 'Must use crisp SVG data URI icons');
  });

  it('BWS-5: bokengi_desk.css implements responsive layout (4 cols desktop, 2 cols tablet, 1 col mobile)', () => {
    const css = fs.readFileSync(cssPath, 'utf8');

    // Desktop (4 columns)
    assert.ok(css.includes('@media (min-width: 1025px)'), 'Must have desktop breakpoint');
    assert.ok(css.includes('grid-template-columns: repeat(4, 1fr)'), 'Desktop 4 columns grid');

    // Tablet (2 columns)
    assert.ok(css.includes('@media (max-width: 1024px) and (min-width: 601px)'), 'Must have tablet breakpoint');
    assert.ok(css.includes('grid-template-columns: repeat(2, 1fr)'), 'Tablet 2 columns grid');

    // Mobile (1 column)
    assert.ok(css.includes('@media (max-width: 640px)'), 'Must have mobile breakpoint');
    assert.ok(css.includes('grid-template-columns: 1fr'), 'Mobile single column layout');
  });

  it('BWS-6: hooks.py registers app_include_css pointing to bokengi_desk.css', () => {
    assert.ok(fs.existsSync(hooksPath), 'hooks.py must exist');
    const hooks = fs.readFileSync(hooksPath, 'utf8');
    assert.ok(
      hooks.includes('app_include_css = "/assets/bokengi_erp/css/bokengi_desk.css'),
      'hooks.py must register app_include_css for Desk'
    );
  });

  it('BWS-7: Non-regression check: Core ERPNext, RLS pole permissions, and Header remain untouched', () => {
    // 1. pole_permissions.py
    const polePermPath = path.join(
      rootDir,
      'frappe_apps',
      'bokengi_erp',
      'bokengi_erp',
      'bokengi_core',
      'pole_permissions.py'
    );
    assert.ok(fs.existsSync(polePermPath), 'pole_permissions.py must exist');
    const polePerm = fs.readFileSync(polePermPath, 'utf8');
    assert.ok(polePerm.includes('POL-it'), 'POL-it logic preserved');
    assert.ok(polePerm.includes('get_lead_permission_query_conditions'), 'RLS conditions intact');
    assert.ok(polePerm.includes('has_project_permission'), 'RLS checks intact');

    // 2. custom_html_block.json (Header Lot 1 prototype)
    const customBlockPath = path.join(
      rootDir,
      'frappe_apps',
      'bokengi_erp',
      'bokengi_erp',
      'fixtures',
      'custom_html_block.json'
    );
    assert.ok(fs.existsSync(customBlockPath), 'custom_html_block.json must exist');
    const blocks = JSON.parse(fs.readFileSync(customBlockPath, 'utf8'));
    const headerBlock = blocks.find((b: { name: string }) => b.name === 'Bokengi Workspace Header');
    assert.ok(headerBlock, 'Bokengi Workspace Header must exist in custom_html_block.json');
  });
});
