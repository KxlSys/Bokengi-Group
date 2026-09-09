import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { Posts } from '../src/collections/Posts'
import {
  getPosts,
  getPostBySlug,
  getPostCategories,
  calculateReadingTime,
  formatFrenchDate,
  mapPayloadPostToPostData,
} from '../src/lib/data'
import { POSTS_SEED_DATA } from '../src/data/bokengi-seed-data'

describe('Collection Posts — Configuration & Schéma', () => {
  it('définit correctement le slug et les étiquettes métier', () => {
    assert.equal(Posts.slug, 'posts')
    assert.equal(Posts.labels?.singular, 'Article d\'expertise')
    assert.equal(Posts.labels?.plural, 'Articles d\'expertise')
  })

  it('possède les champs attendus pour le volet éditorial', () => {
    const fields = Posts.fields as any[]
    const fieldNames = fields.map((f: any) => f.name).filter(Boolean)

    assert.ok(fieldNames.includes('title'))
    assert.ok(fieldNames.includes('slug'))
    assert.ok(fieldNames.includes('excerpt'))
    assert.ok(fieldNames.includes('content'))
    assert.ok(fieldNames.includes('author'))
    assert.ok(fieldNames.includes('coverImage'))
    assert.ok(fieldNames.includes('categories'))
    assert.ok(fieldNames.includes('tags'))
    assert.ok(fieldNames.includes('publishedAt'))
    assert.ok(fieldNames.includes('status'))
  })

  it('configure un accès public en lecture et authentifié pour les modifications', () => {
    assert.ok(Posts.access?.read)
    assert.ok(Posts.access?.create)
    assert.ok(Posts.access?.update)
    assert.ok(Posts.access?.delete)
  })
})

describe('Utilitaires éditoriaux — Temps de lecture & Dates', () => {
  it('calcule une estimation cohérente du temps de lecture', () => {
    assert.equal(calculateReadingTime(''), 1)
    assert.equal(calculateReadingTime('Court texte de dix mots seulement pour tester le comportement de base.'), 1)

    // ~400 mots -> 2 minutes
    const fourHundredWords = Array(400).fill('mot').join(' ')
    assert.equal(calculateReadingTime(fourHundredWords), 2)
  })

  it('formate les dates au format français', () => {
    const formatted = formatFrenchDate('2026-03-01T08:00:00.000Z')
    assert.ok(formatted.includes('2026'))
    assert.ok(formatted.includes('mars'))
  })
})

describe('Normalisation des données — mapPayloadPostToPostData', () => {
  it('normalise proprement les objets liés Auteur et Média', () => {
    const rawDoc: any = {
      id: 10,
      title: 'Audit de sécurité des systèmes industriels',
      slug: 'audit-securite-industrielle',
      excerpt: 'Synthèse des vulnérabilités SCADA et OT.',
      content: 'Corps d\'article détaillé avec analyse de protocoles.',
      author: {
        id: 1,
        name: 'Kalel Damba',
        email: 'kalel@bokengi-group.com',
        role: 'super-admin',
      },
      coverImage: {
        id: 5,
        url: '/media/scada.jpg',
        alt: 'Schéma de réseau industriel',
        width: 1920,
        height: 1080,
      },
      categories: [{ name: 'Cybersécurité' }, { name: 'Industrie' }],
      tags: [{ tag: 'SCADA' }, { tag: 'OT' }, { tag: 'Pentest' }],
      publishedAt: '2026-02-20T10:00:00.000Z',
      status: 'published',
    }

    const post = mapPayloadPostToPostData(rawDoc)

    assert.equal(post.id, 10)
    assert.equal(post.title, 'Audit de sécurité des systèmes industriels')
    assert.equal(post.author?.name, 'Kalel Damba')
    assert.equal(post.author?.role, 'super-admin')
    assert.equal(post.coverImage?.url, '/media/scada.jpg')
    assert.deepEqual(post.categories, ['Cybersécurité', 'Industrie'])
    assert.deepEqual(post.tags, ['SCADA', 'OT', 'Pentest'])
    assert.equal(post.readingTime, 1)
    assert.equal(post.status, 'published')
  })

  it('gère élégamment les champs absents ou nuls', () => {
    const minimalDoc: any = {
      title: 'Titre minimal',
      slug: 'titre-minimal',
      content: 'Contenu court',
    }

    const post = mapPayloadPostToPostData(minimalDoc)

    assert.equal(post.title, 'Titre minimal')
    assert.equal(post.author, null)
    assert.equal(post.coverImage, null)
    assert.deepEqual(post.categories, ['Actualité'])
    assert.deepEqual(post.tags, [])
    assert.ok(post.publishedAt)
  })
})

describe('Couche Data — getPosts & getPostBySlug', () => {
  it('ne retourne que des publications au statut "published"', async () => {
    const posts = await getPosts()
    assert.ok(posts.length > 0)
    for (const p of posts) {
      assert.equal(p.status, 'published', `L'article ${p.slug} n'est pas publié !`)
    }
  })

  it('trie les publications par date décroissante (plus récente en tête)', async () => {
    const posts = await getPosts()
    for (let i = 0; i < posts.length - 1; i++) {
      const current = new Date(posts[i].publishedAt).getTime()
      const next = new Date(posts[i + 1].publishedAt).getTime()
      assert.ok(current >= next, `L'article à l'index ${i} n'est pas plus récent que l'index ${i + 1}`)
    }
  })

  it('filtre efficacement les publications par catégorie', async () => {
    const cyberPosts = await getPosts({ category: 'Cybersécurité' })
    assert.ok(cyberPosts.length > 0)
    for (const p of cyberPosts) {
      assert.ok(
        p.categories.some((c) => c.toLowerCase() === 'cybersécurité'),
        `L'article ${p.slug} ne contient pas la catégorie demandée`
      )
    }
  })

  it('respecte la limite demandée', async () => {
    const limitedPosts = await getPosts({ limit: 1 })
    assert.equal(limitedPosts.length, 1)
  })

  it('récupère un article publié spécifique par son slug', async () => {
    const post = await getPostBySlug('souverainete-numerique-afrique')
    assert.ok(post)
    assert.equal(post.slug, 'souverainete-numerique-afrique')
    assert.equal(post.status, 'published')
    assert.ok(post.title.length > 0)
    assert.ok(post.content.length > 0)
  })

  it('rejette strictement un article au statut "draft"', async () => {
    // Le seed contient 'brouillon-interne-non-publie' au statut 'draft'
    const draftPost = await getPostBySlug('brouillon-interne-non-publie')
    assert.equal(draftPost, null, 'Un article au statut draft ne doit jamais être retourné publiquement')
  })

  it('retourne null lorsqu\'un slug n\'existe pas', async () => {
    const notFoundPost = await getPostBySlug('slug-completement-inexistant-xyz-123')
    assert.equal(notFoundPost, null)
  })

  it('retourne null si le slug passé est vide', async () => {
    const emptyPost = await getPostBySlug('')
    assert.equal(emptyPost, null)
  })

  it('extrait la liste de toutes les catégories publiées distinctes', async () => {
    const categories = await getPostCategories()
    assert.ok(categories.length >= 2)
    assert.ok(categories.includes('Infrastructure & Cloud') || categories.includes('Cybersécurité'))
  })
})
