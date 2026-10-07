import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('BOKENGI 2.0 — Lot 3 — Blocs Fonctionnels (Domain Cards Workspace IT)', () => {
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

  it('BDC-1: workspace.json includes IT & Infrastructure with the 2 Domain Cards', () => {
    assert.ok(fs.existsSync(workspaceFixturesPath), 'workspace.json must exist');
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');

    assert.ok(itWorkspace, 'IT & Infrastructure workspace must be present');
    const links = itWorkspace.links || [];

    const cardBreaks = links.filter((l: { type: string }) => l.type === 'Card Break');
    assert.strictEqual(cardBreaks.length, 2, 'Must have exactly 2 Card Breaks');
    assert.strictEqual(cardBreaks[0].label, 'Projets & Infrastructure');
    assert.strictEqual(cardBreaks[1].label, 'Support & Opérations');
  });

  it('BDC-2: Domain Card 1 (Projets & Infrastructure) preserves all 4 functional links and DocTypes', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const links = itWorkspace.links || [];

    // Slice links for Card 1 (indices 1 to 4)
    const card1Links = links.slice(1, 5);
    assert.strictEqual(card1Links.length, 4, 'Card 1 must contain 4 links');

    // Link 1: Projets IT (POL-it)
    assert.strictEqual(card1Links[0].label, 'Projets IT (POL-it)');
    assert.strictEqual(card1Links[0].link_type, 'DocType');
    assert.strictEqual(card1Links[0].link_to, 'Project');

    // Link 2: Modèles de Projets
    assert.strictEqual(card1Links[1].label, 'Modèles de Projets');
    assert.strictEqual(card1Links[1].link_type, 'DocType');
    assert.strictEqual(card1Links[1].link_to, 'Project Template');

    // Link 3: Types de Projets
    assert.strictEqual(card1Links[2].label, 'Types de Projets');
    assert.strictEqual(card1Links[2].link_type, 'DocType');
    assert.strictEqual(card1Links[2].link_to, 'Project Type');

    // Link 4: Feuilles de Temps
    assert.strictEqual(card1Links[3].label, 'Feuilles de Temps');
    assert.strictEqual(card1Links[3].link_type, 'DocType');
    assert.strictEqual(card1Links[3].link_to, 'Timesheet');
  });

  it('BDC-3: Domain Card 2 (Support & Opérations) preserves all 3 functional links and DocTypes', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const links = itWorkspace.links || [];

    // Slice links for Card 2 (indices 6 to 8)
    const card2Links = links.slice(6, 9);
    assert.strictEqual(card2Links.length, 3, 'Card 2 must contain 3 links');

    // Link 1: Tickets & Incidents
    assert.strictEqual(card2Links[0].label, 'Tickets & Incidents');
    assert.strictEqual(card2Links[0].link_type, 'DocType');
    assert.strictEqual(card2Links[0].link_to, 'Issue');

    // Link 2: Types d'Activités
    assert.strictEqual(card2Links[1].label, "Types d'Activités");
    assert.strictEqual(card2Links[1].link_type, 'DocType');
    assert.strictEqual(card2Links[1].link_to, 'Activity Type');

    // Link 3: Prospects IT
    assert.strictEqual(card2Links[2].label, 'Prospects IT');
    assert.strictEqual(card2Links[2].link_type, 'DocType');
    assert.strictEqual(card2Links[2].link_to, 'Lead');
  });

  it('BDC-4: Workspace content layout preserves full hierarchical order and col-6 sizing', () => {
    const workspaces = JSON.parse(fs.readFileSync(workspaceFixturesPath, 'utf8'));
    const itWorkspace = workspaces.find((w: { name: string }) => w.name === 'IT & Infrastructure');
    const content = JSON.parse(itWorkspace.content);

    // #01: Custom block Header (Lot 1)
    assert.strictEqual(content[0].type, 'custom_block');
    assert.strictEqual(content[0].data.custom_block_name, 'Bokengi Workspace Header');

    // #02: Actions rapides section heading (Lot 2)
    assert.strictEqual(content[1].type, 'header');
    assert.strictEqual(content[1].data.text, 'Actions rapides');

    // #03..#06: 4 Shortcuts (Lot 2)
    assert.strictEqual(content[2].data.shortcut_name, '+ Nouveau Projet IT');
    assert.strictEqual(content[3].data.shortcut_name, '+ Nouveau Ticket IT');
    assert.strictEqual(content[4].data.shortcut_name, '+ Saisie de Temps');
    assert.strictEqual(content[5].data.shortcut_name, 'Projets IT Bokengi');

    // #07: Intermediate Section Heading
    assert.strictEqual(content[6].type, 'header');
    assert.strictEqual(content[6].data.text, 'Infrastructure & Prestations Informatiques');

    // #08: Card 1 (Projets & Infrastructure, col 6)
    assert.strictEqual(content[7].type, 'card');
    assert.strictEqual(content[7].data.card_name, 'Projets & Infrastructure');
    assert.strictEqual(content[7].data.col, 6);

    // #09: Card 2 (Support & Opérations, col 6)
    assert.strictEqual(content[8].type, 'card');
    assert.strictEqual(content[8].data.card_name, 'Support & Opérations');
    assert.strictEqual(content[8].data.col, 6);
  });

  it('BDC-5: bokengi_desk.css defines Lot 3 Domain Cards styling, subtitles, and accessibility', () => {
    assert.ok(fs.existsSync(cssPath), 'bokengi_desk.css must exist');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Container styling
    assert.ok(css.includes('.widget.links-widget-box'), 'Must style .widget.links-widget-box');
    assert.ok(css.includes('border-radius: 12px'), 'Must use 12px border radius for domain cards');

    // Distinctive Header Icons & Subtitles
    assert.ok(css.includes('Pilotage des projets et ressources IT'), 'Subtitle for Projets & Infrastructure');
    assert.ok(css.includes('Gestion des incidents et opérations IT'), 'Subtitle for Support & Opérations');

    // 2-column grid layout for link buttons
    assert.ok(css.includes('grid-template-columns: repeat(2, 1fr)'), 'Must layout links in 2 columns grid');

    // Link Item Micro-Interactions & Accessibility
    assert.ok(css.includes('.widget.links-widget-box .link-item'), 'Must style link items');
    assert.ok(css.includes('.link-item:focus-visible'), 'Must implement keyboard focus-visible on links');
    assert.ok(css.includes('.link-text::before'), 'Must include leading bullet micro-indicator');
  });

  it('BDC-6: Responsive layout rules support 1024px, 768px, and 480px with zero horizontal overflow', () => {
    const css = fs.readFileSync(cssPath, 'utf8');

    // 1024px breakpoint
    assert.ok(css.includes('@media (max-width: 1024px)'), 'Must include 1024px media query');

    // 768px breakpoint
    assert.ok(css.includes('@media (max-width: 768px)'), 'Must include 768px media query');

    // 480px mobile breakpoint with single column
    assert.ok(css.includes('@media (max-width: 480px)'), 'Must include 480px mobile query');
    assert.ok(css.includes('overflow-x: hidden'), 'Must enforce strict zero horizontal overflow');
  });

  it('BDC-7: Non-regression check: Header (Lot 1), Actions Rapides (Lot 2), and RLS security intact', () => {
    // 1. hooks.py registers app_include_css
    const hooks = fs.readFileSync(hooksPath, 'utf8');
    assert.ok(hooks.includes('app_include_css = "/assets/bokengi_erp/css/bokengi_desk.css'), 'hooks.py intact');

    // 2. pole_permissions.py RLS logic strictly untouched
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
    assert.ok(polePerm.includes('get_lead_permission_query_conditions'), 'Lead RLS intact');
    assert.ok(polePerm.includes('get_project_permission_query_conditions'), 'Project RLS intact');

    // 3. Lot 1 Header fixture intact
    const customBlockPath = path.join(
      rootDir,
      'frappe_apps',
      'bokengi_erp',
      'bokengi_erp',
      'fixtures',
      'custom_html_block.json'
    );
    const blocks = JSON.parse(fs.readFileSync(customBlockPath, 'utf8'));
    assert.ok(blocks.some((b: { name: string }) => b.name === 'Bokengi Workspace Header'), 'Lot 1 Header intact');
  });
});
