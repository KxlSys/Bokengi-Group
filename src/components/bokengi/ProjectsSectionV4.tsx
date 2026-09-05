import React from 'react'
import Link from 'next/link'
import { Kicker } from './Kicker'
import type { CaseStudyData } from '@/data/bokengi-seed-data'

interface ProjectsSectionV4Props {
  caseStudies: CaseStudyData[]
}

const TARGET_SLUGS = ['esiika', 'portail-kongama', 'fleetguard']

export const ProjectsSectionV4: React.FC<ProjectsSectionV4Props> = ({ caseStudies }) => {
  // Sélectionner dynamiquement les 3 projets cibles par slug
  const matchedProjects = TARGET_SLUGS
    .map((slug) => caseStudies.find((cs) => cs.slug === slug))
    .filter((cs): cs is CaseStudyData => Boolean(cs))

  // Repli transparent sur les 3 premières études de cas si un des projets cibles n'est pas trouvé
  const displayProjects = matchedProjects.length === 3 ? matchedProjects : caseStudies.slice(0, 3)

  return (
    <section className="section-projects-v4">
      <div className="container-v4">
        <div className="projects-v4-header">
          <div>
            <Kicker>RÉALISATIONS & ÉTUDES DE CAS</Kicker>
            <h2 className="projects-v4-title">Des architectures déployées avec rigueur.</h2>
          </div>
          <Link href="/realisations" className="btn-v4-secondary">
            Voir tous les projets →
          </Link>
        </div>

        <div className="projects-v4-grid">
          {displayProjects.map((p) => (
            <div key={p.slug} className="project-v4-item">
              <div className="project-v4-top">
                <span className="project-v4-tag">{p.category}</span>
              </div>
              <h3 className="project-v4-name">{p.title}</h3>
              {p.context && (
                <p className="project-v4-context">
                  <strong>Contexte :</strong> {p.context}
                </p>
              )}
              <p className="project-v4-summary">{p.summary}</p>
              {p.technologies && p.technologies.length > 0 && (
                <div className="project-v4-techs">
                  {p.technologies.map((t) => (
                    <span key={t.name} className="project-tech-pill">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSectionV4
