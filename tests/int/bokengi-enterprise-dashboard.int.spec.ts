import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Bokengi Enterprise Cockpit — Fixtures & Configuration Audit', () => {
  const fixturesDir = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/fixtures');
  const hooksPath = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/hooks.py');

  it('1. should verify workspace.json fixture exists and has valid Frappe v15 structure', () => {
    const workspacePath = path.join(fixturesDir, 'workspace.json');
    expect(fs.existsSync(workspacePath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(workspacePath, 'utf8'));
    expect(Array.isArray(content)).toBe(true);
    expect(content.length).toBeGreaterThan(0);

    const workspace = content[0];
    expect(workspace.doctype).toBe('Workspace');
    expect(workspace.name).toBe('Bokengi Enterprise Cockpit');
    expect(workspace.title).toBe('Bokengi Enterprise Cockpit');
    expect(workspace.module).toBe('Bokengi Core');
    expect(workspace.public).toBe(1);
    if (workspace.is_standard !== undefined) {
      expect(workspace.is_standard).toBe(0);
    }
    expect(workspace.roles.length).toBeGreaterThan(0);
    expect(workspace.number_cards.length).toBe(8);
    expect(workspace.charts.length).toBe(2);
    expect(workspace.shortcuts.length).toBeGreaterThan(0);
  });

  it('2. should verify number_card.json fixture contains 8 native ERPNext cards', () => {
    const numberCardPath = path.join(fixturesDir, 'number_card.json');
    expect(fs.existsSync(numberCardPath)).toBe(true);

    const cards = JSON.parse(fs.readFileSync(numberCardPath, 'utf8'));
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBe(8);

    const cardNames = cards.map((c: { name: string }) => c.name);
    expect(cardNames).toContain('Bokengi CA Mensuel');
    expect(cardNames).toContain('Bokengi Creances Clients');
    expect(cardNames).toContain('Bokengi Solde Tresorerie');
    expect(cardNames).toContain('Bokengi Commandes Actives');
    expect(cardNames).toContain('Bokengi Leads En Cours');
    expect(cardNames).toContain('Bokengi RDV Calcom');
    expect(cardNames).toContain('Bokengi Stock Critique');
    expect(cardNames).toContain('Bokengi Projets Actifs');

    // Check document_type mapping for each card
    cards.forEach((card: { doctype: string; document_type: string; is_standard: number }) => {
      expect(card.doctype).toBe('Number Card');
      expect(card.is_standard).toBe(0);
      expect(['Sales Invoice', 'GL Entry', 'Sales Order', 'Lead', 'Bin', 'Project']).toContain(card.document_type);
    });
  });

  it('3. should verify dashboard_chart.json fixture contains 2 charts', () => {
    const chartPath = path.join(fixturesDir, 'dashboard_chart.json');
    expect(fs.existsSync(chartPath)).toBe(true);

    const charts = JSON.parse(fs.readFileSync(chartPath, 'utf8'));
    expect(Array.isArray(charts)).toBe(true);
    expect(charts.length).toBe(2);

    const chartNames = charts.map((c: { name: string }) => c.name);
    expect(chartNames).toContain('Bokengi Evolution Ventes 12M');
    expect(chartNames).toContain('Bokengi Pipeline Commercial');

    charts.forEach((chart: { doctype: string; is_standard: number; type: string }) => {
      expect(chart.doctype).toBe('Dashboard Chart');
      expect(chart.is_standard).toBe(0);
      expect(['Bar', 'Donut']).toContain(chart.type);
    });
  });

  it('4. should verify custom_html_block.json fixture contains Bokengi Cockpit Header', () => {
    const customBlockPath = path.join(fixturesDir, 'custom_html_block.json');
    expect(fs.existsSync(customBlockPath)).toBe(true);

    const blocks = JSON.parse(fs.readFileSync(customBlockPath, 'utf8'));
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThanOrEqual(1);

    const headerBlock = blocks.find((b: { name: string }) => b.name === 'Bokengi Cockpit Header');
    expect(headerBlock).toBeDefined();
    expect(headerBlock.doctype).toBe('Custom HTML Block');
    expect(headerBlock.name).toBe('Bokengi Cockpit Header');
    expect(headerBlock.html).toContain('BOKENGI GROUP');
    expect(headerBlock.html).toContain('ENTERPRISE COCKPIT 2.0');
    expect(headerBlock.html).toContain('#0A192F');
  });

  it('5. should verify hooks.py exports Workspace, Number Card, Dashboard Chart, and Custom HTML Block', () => {
    expect(fs.existsSync(hooksPath)).toBe(true);
    const hooksContent = fs.readFileSync(hooksPath, 'utf8');

    expect(hooksContent).toContain('"dt": "Workspace"');
    expect(hooksContent).toContain('"dt": "Number Card"');
    expect(hooksContent).toContain('"dt": "Dashboard Chart"');
    expect(hooksContent).toContain('"dt": "Custom HTML Block"');
    expect(hooksContent).toContain('"Bokengi Enterprise Cockpit"');
  });
});
