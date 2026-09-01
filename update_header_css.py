with open(r"E:\01_Projets\Actifs\kal-cooperation\bokengi-group\src\bokengi-brand.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the previous NAVBAR V2 section with the new LUXURY HEADER section
old_nav_marker = "/* ── NAVBAR V2 ── */"
subsequent_marker = "/* ── HERO V2 (EDITORIAL ASYMMETRICAL) ── */"

luxury_nav_css = """/* ── LUXURY CORPORATE HEADER (ELITE GROUP STANDARD) ── */
.luxury-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1100;
  height: 78px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.header-backdrop-filter {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--bg-main) 78%, transparent);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
}

.luxury-header.is-scrolled .header-backdrop-filter {
  background: color-mix(in srgb, var(--bg-main) 92%, transparent);
  border-bottom-color: var(--border-medium);
  box-shadow: 0 10px 30px rgba(0, 18, 77, 0.05);
}

body.dark-theme .luxury-header.is-scrolled .header-backdrop-filter {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

/* 01 Brand Lockup */
.brand-lockup {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  cursor: pointer;
}

.brand-emblem-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-lockup:hover .brand-emblem-wrap {
  transform: scale(1.06);
}

.brand-emblem-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.brand-titles {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-wordmark {
  font-family: var(--font-display);
  font-size: 1.32rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1.05;
  color: var(--ink-heading);
  display: flex;
  align-items: baseline;
}

.brand-k-accent {
  color: #0055D4;
  font-weight: 900;
  margin: 0 0.5px;
}

body.dark-theme .brand-k-accent {
  color: #0EA5E9;
}

.brand-subgroup {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

.subgroup-rule {
  height: 1px;
  flex: 1;
  background: var(--border-medium);
}

.subgroup-text {
  font-family: var(--font-mono);
  font-size: 0.56rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--blue-accent);
}

body.dark-theme .subgroup-text {
  color: var(--blue-glow);
}

/* 02 Desktop Navigation */
.desktop-navigation {
  display: flex;
  align-items: center;
}

.nav-menu-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link-item {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink-muted);
  text-decoration: none;
  padding: 0.55rem 0.95rem;
  border-radius: var(--radius-xs);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  position: relative;
}

.nav-link-item:hover {
  color: var(--ink-heading);
  background: var(--bg-surface);
}

.nav-link-item.is-active {
  color: var(--ink-heading);
  font-weight: 600;
  background: var(--bg-elevated);
}

/* Dropdown Menu Architecture */
.nav-dropdown-wrapper {
  position: relative;
}

.dropdown-chevron {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--ink-faint);
}

.dropdown-chevron.is-flipped {
  transform: rotate(180deg);
  color: var(--blue-accent);
}

.luxury-dropdown-menu {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  width: 640px;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-elevated);
  padding: 1.5rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1200;
  backdrop-filter: blur(20px);
}

.luxury-dropdown-menu.is-visible,
.nav-dropdown-wrapper:hover .luxury-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1.15rem;
}

.dropdown-panel-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--blue-accent);
  font-weight: 700;
}

body.dark-theme .dropdown-panel-kicker {
  color: var(--blue-glow);
}

.dropdown-panel-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--ink-heading);
  font-weight: 700;
}

.dropdown-panel-all-btn {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  color: var(--blue-accent);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.2s ease;
}

.dropdown-panel-all-btn:hover {
  color: var(--ink-heading);
  text-decoration: underline;
}

.dropdown-poles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.dropdown-pole-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: var(--bg-main);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-pole-card:hover {
  border-color: var(--border-medium);
  background: var(--bg-elevated);
  transform: translateY(-2px);
  box-shadow: var(--shadow-subtle);
}

.pole-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.pole-card-tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid;
}

.pole-card-arrow {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--ink-faint);
  transition: transform 0.2s ease, color 0.2s ease;
}

.dropdown-pole-card:hover .pole-card-arrow {
  transform: translateX(4px);
  color: var(--blue-accent);
}

.pole-card-name {
  font-family: var(--font-display);
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--ink-heading);
  margin-bottom: 0.25rem;
}

.pole-card-desc {
  font-size: 0.76rem;
  color: var(--ink-muted);
  line-height: 1.45;
  margin: 0;
}

/* 03 Actions Right */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.15rem;
}

.theme-switch-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-medium);
  background: var(--bg-surface);
  color: var(--ink-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-switch-btn:hover {
  border-color: var(--blue-accent);
  color: var(--blue-accent);
  transform: scale(1.06);
}

.header-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--navy-primary);
  color: #FFFFFF !important;
  padding: 0.78rem 1.45rem;
  border-radius: var(--radius-xs);
  text-decoration: none;
  border: 1px solid var(--navy-primary);
  box-shadow: 0 4px 14px rgba(0, 18, 77, 0.14);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

body.dark-theme .header-cta-button {
  background: #0033A0;
  border-color: #0044CC;
  box-shadow: 0 4px 16px rgba(0, 51, 160, 0.35);
}

.header-cta-button:hover {
  background: var(--blue-accent);
  border-color: var(--blue-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 85, 212, 0.25);
}

/* Mobile Hamburger Button */
.mobile-burger-btn {
  display: none;
  width: 40px;
  height: 40px;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xs);
  cursor: pointer;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

.burger-line {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--ink-heading);
  transition: all 0.25s ease;
}

.mobile-burger-btn.is-active .burger-line:first-child {
  transform: translateY(4px) rotate(45deg);
}

.mobile-burger-btn.is-active .burger-line:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

/* Mobile Drawer Overlay */
.mobile-drawer-overlay {
  display: none;
  position: fixed;
  top: 78px;
  left: 0; right: 0; bottom: 0;
  background: color-mix(in srgb, var(--bg-main) 96%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1050;
  overflow-y: auto;
  padding: 2rem var(--gutter-desktop);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-drawer-overlay.is-open {
  opacity: 1;
  visibility: visible;
  display: block;
}

.mobile-drawer-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-drawer-link {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-heading);
  text-decoration: none;
  transition: color 0.2s ease;
}

.mobile-drawer-link.section-label {
  font-size: 1.1rem;
  color: var(--blue-accent);
  margin-bottom: 0.5rem;
}

.mobile-poles-subgrid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-left: 1rem;
}

.mobile-pole-sublink {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  text-decoration: none;
}

.mobile-sublink-name {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ink-heading);
}

.mobile-sublink-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--ink-faint);
  text-transform: uppercase;
}

.mobile-drawer-footer {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-medium);
}
"""

if old_nav_marker in css and subsequent_marker in css:
    start_idx = css.index(old_nav_marker)
    end_idx = css.index(subsequent_marker)
    new_css = css[:start_idx] + luxury_nav_css + "\n\n" + css[end_idx:]
    with open(r"E:\01_Projets\Actifs\kal-cooperation\bokengi-group\src\bokengi-brand.css", "w", encoding="utf-8") as f:
        f.write(new_css)
    print("Updated bokengi-brand.css with luxury header CSS!")
else:
    print("Markers not found, appending luxury header CSS")
