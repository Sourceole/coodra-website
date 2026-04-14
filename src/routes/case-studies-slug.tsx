import type { MetaFunction } from 'react-router'
import CaseStudyDetailPage from '../pages/CaseStudyDetailPage'
import { getCaseStudyBySlug } from '../data/caseStudies'

export const meta: MetaFunction = ({ params }) => {
  const study = getCaseStudyBySlug(params.slug || '')
  const title = study ? `${study.title} - Case Study - Coodra` : 'Case Study - Coodra'
  const description = study
    ? `${study.industry} case study: ${study.challenge}`
    : 'Retail case study from Coodra.'
  const url = study
    ? `https://www.coodra.com/case-studies/${study.slug}`
    : 'https://www.coodra.com/case-studies'

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Coodra' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
    { name: 'robots', content: 'index, follow' },
    { tagName: 'link', rel: 'canonical', href: url },
  ]
}

export default CaseStudyDetailPage

