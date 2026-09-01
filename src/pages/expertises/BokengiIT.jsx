import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import PageHeader from '../../components/PageHeader';
import CTASection from '../../components/CTASection';

const BokengiIT = () => {
  const domains = [
    {
      title: 'Cybersécurité',
      desc: 'Protéger vos données, vos accès et la réputation de votre organisation contre les menaces actuelles.',
      services: [
        'Audit de sécurité & tests d\'intrusion légers',
        'Analyse de vulnérabilités & durcissement système',
        'Sécurisation des postes de travail & politiques EDR',
        'Sécurité réseau & pare-feu (Firewall / UTM)',
        'Gestion des identités & accès (IAM)',
        'Authentification multi-facteurs (MFA / 2FA)',
        'Sensibilisation des équipes & bonnes pratiques',
        'Plan de sauvegarde chiffrée & continuité d\'activité (PRA/PCA)',
        'Accompagnement et gouvernance sécurité',
      ],
    },
    {
      title: 'Systèmes & Réseaux',
      desc: 'Bâtir des infrastructures fiables, cloisonnées et supervisées en continu.',
      services: [
        'Administration Linux & Windows Server',
        'Gestion d\'annuaires Active Directory & GPO',
        'Configuration DNS, DHCP & services d\'infrastructure',
        'Segmentation réseau VLAN & sécurité périmétrique',
        'Mise en place de tunnels VPN sécurisés (site-à-site & nomades)',
        'Déploiement de bornes Wi-Fi professionnelles managées',
        'Configuration de commutateurs (Switches) & routage',
        'Virtualisation (Proxmox, VMware, Hyper-V)',
        'Supervision proactive & monitoring d\'infrastructures',
      ],
    },
    {
      title: 'Développement Logiciel',
      desc: 'Créer des applications sur mesure, des API robustes et des automatisations adaptées à vos flux métier.',
      services: [
        'Sites vitrines institutionnels & portails d\'entreprise',
        'Applications web métier sécurisées (React, Node.js, PHP, Python)',
        'Conception & sécurisation d\'API REST et Webhooks',
        'Modélisation & optimisation de bases de données (PostgreSQL, MySQL)',
        'Plateformes e-commerce avec intégration Mobile Money & cartes',
        'Automatisation de processus & synchronisation de données',
        'Intégration d\'outils tiers (CRM, ERP, Passerelles de paiement)',
      ],
    },
    {
      title: 'Maintenance & Support',
      desc: 'Garantir la continuité de service et assister vos utilisateurs au quotidien.',
      services: [
        'Maintenance préventive (mises à jour, correctifs, optimisations)',
        'Maintenance corrective & dépannage rapide',
        'Support technique utilisateur (Helpdesk / ticketing)',
        'Installation, configuration & masterisation de postes',
        'Projets de migration système, messagerie & données',
        'Supervision de santé des serveurs et alertes en temps réel',
        'Gestion et inventaire de parc informatique',
      ],
    },
  ];

  return (
    <div className="page-pole page-pole-it">
      <SEO 
        title="Bokengi IT · Technologie, Infrastructure & Sécurité" 
        description="Pôle technologique de Bokengi Group : cybersécurité, administration systèmes & réseaux, développement d'applications et maintenance informatique." 
      />

      <PageHeader
        eyebrow="Pôle Technologique Principal"
        badge="Technology · Infrastructure · Sécurité"
        title="Bokengi IT"
        subtitle="Nous concevons, déployons, sécurisons et maintenons les infrastructures et applications informatiques indispensables à votre activité."
        breadcrumbs={[
          { label: 'Expertises', to: '/expertises' },
          { label: 'Bokengi IT' },
        ]}
      />

      <section style={{ padding: '90px 0' }}>
        <div className="container-v4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {domains.map((dom, idx) => (
              <div key={idx} style={{ padding: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--blue-cyan)', fontWeight: 700 }}>0{idx + 1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--blue-cyan)', fontWeight: 700 }}>Bokengi IT</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', margin: '0.5rem 0 0.85rem' }}>{dom.title}</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>{dom.desc}</p>
                <div style={{ background: 'var(--bg-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue-cyan)', marginBottom: '1rem', fontWeight: 700 }}>
                    Prestations & expertises :
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {dom.services.map((srv, sIdx) => (
                      <li key={sIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--ink-body)' }}>
                        <span style={{ color: 'var(--blue-cyan)', fontWeight: 700 }}>•</span> {srv}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        pole="it"
        title="Un besoin technique ou de sécurité informatique ?"
        text="Nos spécialistes Bokengi IT étudient votre architecture et vous apportent une réponse adaptée et chiffrée."
        primaryLabel="Demander un devis IT"
        secondaryLabel="Parler à un expert"
      />
    </div>
  );
};

export default BokengiIT;
