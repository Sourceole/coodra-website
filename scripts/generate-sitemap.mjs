import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE_URL = 'https://www.coodra.com'
const ROOT = resolve(process.cwd())

const BLOG_FILE = resolve(ROOT, 'src/data/blogPosts.ts')
const CASE_FILE = resolve(ROOT, 'src/data/caseStudies.ts')
const OUTPUT_FILE = resolve(ROOT, 'public/sitemap.xml')

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/integrations', changefreq: 'weekly', priority: '0.8' },
  { path: '/security', changefreq: 'monthly', priority: '0.8' },
  { path: '/comparisons', changefreq: 'weekly', priority: '0.9' },
  { path: '/resources', changefreq: 'weekly', priority: '0.7' },
  { path: '/inventory-management', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/case-studies', changefreq: 'weekly', priority: '0.8' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.6' },
  { path: '/terms', changefreq: 'yearly', priority: '0.6' },
]

function extractBlogEntries() {
  const raw = readFileSync(BLOG_FILE, 'utf8')
  const blocks = raw.match(/\{[\s\S]*?slug:\s*'[^']+'[\s\S]*?\}/g) ?? []
  return blocks
    .map((block) => {
      const slug = block.match(/slug:\s*'([^']+)'/)?.[1]
      const date = block.match(/isoPublishedAt:\s*'([^']+)'/)?.[1]
      if (!slug) return null
      return {
        path: `/blog/${slug}`,
        lastmod: date ?? new Date().toISOString().slice(0, 10),
        changefreq: 'monthly',
        priority: '0.7',
      }
    })
    .filter(Boolean)
}

function extractCaseStudyEntries() {
  const raw = readFileSync(CASE_FILE, 'utf8')
  const slugMatches = [...raw.matchAll(/slug:\s*'([^']+)'/g)]
  const lastmod = new Date().toISOString().slice(0, 10)
  return slugMatches.map((m) => ({
    path: `/case-studies/${m[1]}`,
    lastmod,
    changefreq: 'monthly',
    priority: '0.7',
  }))
}

function buildXml() {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [
    ...staticRoutes.map((route) => ({ ...route, lastmod: today })),
    ...extractBlogEntries(),
    ...extractCaseStudyEntries(),
  ]

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => `  <url>
    <loc>${SITE_URL}${entry.path}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    ),
    '</urlset>',
    '',
  ]

  return lines.join('\n')
}

writeFileSync(OUTPUT_FILE, buildXml(), 'utf8')
console.log(`Generated sitemap: ${OUTPUT_FILE}`)
