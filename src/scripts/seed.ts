import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {
  POLES_SEED_DATA,
  SERVICES_SEED_DATA,
  CASE_STUDIES_SEED_DATA,
} from '../data/bokengi-seed-data'

export async function runSeed() {
  console.log('🌱 Démarrage du seed Bokengi Group 2.0...')

  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Seed des 5 Pôles
    console.log('📦 Injection des 5 Pôles...')
    const poleMap: Record<string, string | number> = {}

    for (const pole of POLES_SEED_DATA) {
      const existing = await payload.find({
        collection: 'poles',
        where: { slug: { equals: pole.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        const created = await payload.create({
          collection: 'poles',
          data: {
            name: pole.name,
            slug: pole.slug,
            shortDescription: pole.shortDescription,
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: pole.description, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            icon: pole.icon,
            order: pole.order,
            status: pole.status,
            seo: {
              title: pole.seo.title,
              description: pole.seo.description,
            },
          },
        })
        poleMap[pole.slug] = created.id
        console.log(`  ✓ Pôle créé : ${pole.name}`)
      } else {
        poleMap[pole.slug] = existing.docs[0].id
        console.log(`  ℹ Pôle existant : ${pole.name}`)
      }
    }

    // 2. Seed des Services
    console.log('⚙️ Injection des Services par Pôle...')
    for (const srv of SERVICES_SEED_DATA) {
      const poleId = poleMap[srv.poleSlug]
      if (!poleId) {
        console.warn(`  ⚠ Pôle parent introuvable pour le service : ${srv.title}`)
        continue
      }

      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: srv.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'services',
          data: {
            title: srv.title,
            slug: srv.slug,
            pole: poleId as any,
            category: srv.category,
            shortDescription: srv.shortDescription,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: srv.content, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            technicalTags: srv.technicalTags,
            featured: srv.featured,
            order: srv.order,
            seo: {
              title: `${srv.title} · Bokengi Group`,
              description: srv.shortDescription,
            },
          },
        })
        console.log(`  ✓ Service créé : ${srv.title}`)
      } else {
        console.log(`  ℹ Service existant : ${srv.title}`)
      }
    }

    // 3. Seed des 5 Case Studies
    console.log('💼 Injection des 5 Case Studies officiels...')
    for (const cs of CASE_STUDIES_SEED_DATA) {
      const existing = await payload.find({
        collection: 'case-studies',
        where: { slug: { equals: cs.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'case-studies',
          data: {
            title: cs.title,
            slug: cs.slug,
            clientName: cs.clientName,
            category: cs.category,
            summary: cs.summary,
            context: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: cs.context, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            challenge: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: cs.challenge, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            solution: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: cs.solution, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            results: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: cs.results, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            technologies: cs.technologies,
            architecture: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: cs.architecture, version: 1 }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            } as any,
            featured: cs.featured,
            publishedDate: cs.publishedDate,
            seo: {
              title: cs.seo.title,
              description: cs.seo.description,
            },
          },
        })
        console.log(`  ✓ Étude de cas créée : ${cs.title}`)
      } else {
        console.log(`  ℹ Étude de cas existante : ${cs.title}`)
      }
    }

    // 4. Seed Site Settings
    console.log('⚙️ Configuration globale siteSettings...')
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        companyName: 'Bokengi Group',
        contactEmail: process.env.CONTACT_EMAIL || '',
        domains: {
          production: 'https://bokengi-group.com',
          preview: 'https://bokengi.vercel.app',
        },
      },
    })
    console.log('  ✓ siteSettings configuré.')

    console.log('✨ Seed Bokengi Group 2.0 achevé avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du seed :', error)
  }
}

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
