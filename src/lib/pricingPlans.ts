export type PlanKey = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise'

export type FeatureKey =
  | 'core_product_actions'
  | 'category_performance'
  | 'inventory_risk_alerts'
  | 'forecasting'
  | 'advanced_forecasting'
  | 'trend_detection'
  | 'advanced_trend_detection'
  | 'outcome_tracking'
  | 'advanced_outcome_tracking'
  | 'automation'
  | 'advanced_automation'
  | 'custom_alerts'
  | 'custom_integrations'
  | 'sla_onboarding'

export type MetricKey =
  | 'stores'
  | 'products_tracked'
  | 'team_members'
  | 'pos_commerce_integrations'
  | 'decision_recommendations'
  | 'ask_coodra_messages'

export type PlanConfig = {
  key: PlanKey
  name: string
  price: number | 'Custom'
  highlighted?: boolean
  badge?: string
  description: string
  cta: string
  ctaHref: string
  bullets: string[]
  limits: Record<MetricKey, number | 'Custom' | 'Limited' | 'Included' | 'High-volume'>
  features: Record<FeatureKey, boolean | 'Limited' | 'Basic' | 'Included' | 'Advanced' | 'Custom' | 'Advanced / custom'>
  support: string
  slaOnboarding: string
}

export const planOrder: Record<PlanKey, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  pro: 3,
  enterprise: 4
}

export const pricingPlans: PlanConfig[] = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    description: 'Best for trying Coodra with one small store.',
    cta: 'Start Free',
    ctaHref: '/signup?plan=free',
    bullets: [
      '1 store',
      '250 products tracked',
      '25 decision recommendations / month',
      'Limited Ask Coodra',
      'Core product actions',
      '1 POS / commerce integration',
      '1 team member'
    ],
    limits: {
      stores: 1,
      products_tracked: 250,
      team_members: 1,
      pos_commerce_integrations: 1,
      decision_recommendations: 25,
      ask_coodra_messages: 'Limited'
    },
    features: {
      core_product_actions: true,
      category_performance: false,
      inventory_risk_alerts: 'Limited',
      forecasting: false,
      advanced_forecasting: false,
      trend_detection: false,
      advanced_trend_detection: false,
      outcome_tracking: false,
      advanced_outcome_tracking: false,
      automation: false,
      advanced_automation: false,
      custom_alerts: false,
      custom_integrations: false,
      sla_onboarding: false
    },
    support: 'Help center',
    slaOnboarding: 'Not included'
  },
  {
    key: 'starter',
    name: 'Starter',
    price: 99,
    description: 'Best for small retailers that want regular product guidance.',
    cta: 'Choose Starter',
    ctaHref: '/signup?plan=starter',
    bullets: [
      'Everything in Free',
      '2,500 products tracked',
      '250 decision recommendations / month',
      'Ask Coodra included',
      'Category performance',
      'Inventory risk alerts',
      'Basic trend detection',
      'Email support'
    ],
    limits: {
      stores: 1,
      products_tracked: 2500,
      team_members: 2,
      pos_commerce_integrations: 1,
      decision_recommendations: 250,
      ask_coodra_messages: 'Included'
    },
    features: {
      core_product_actions: true,
      category_performance: true,
      inventory_risk_alerts: true,
      forecasting: false,
      advanced_forecasting: false,
      trend_detection: 'Basic',
      advanced_trend_detection: false,
      outcome_tracking: false,
      advanced_outcome_tracking: false,
      automation: false,
      advanced_automation: false,
      custom_alerts: false,
      custom_integrations: false,
      sla_onboarding: false
    },
    support: 'Email',
    slaOnboarding: 'Not included'
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 199,
    highlighted: true,
    badge: 'Most Popular',
    description: 'Best for growing retailers with larger catalogs or multiple locations.',
    cta: 'Choose Growth',
    ctaHref: '/signup?plan=growth',
    bullets: [
      'Everything in Starter',
      '5 stores',
      '10,000 products tracked',
      '1,000 decision recommendations / month',
      'Forecasting included',
      'Outcome tracking included',
      'Basic automation',
      'Priority email support'
    ],
    limits: {
      stores: 5,
      products_tracked: 10000,
      team_members: 10,
      pos_commerce_integrations: 2,
      decision_recommendations: 1000,
      ask_coodra_messages: 'Included'
    },
    features: {
      core_product_actions: true,
      category_performance: true,
      inventory_risk_alerts: true,
      forecasting: true,
      advanced_forecasting: false,
      trend_detection: 'Included',
      advanced_trend_detection: false,
      outcome_tracking: true,
      advanced_outcome_tracking: false,
      automation: 'Basic',
      advanced_automation: false,
      custom_alerts: false,
      custom_integrations: false,
      sla_onboarding: false
    },
    support: 'Priority email',
    slaOnboarding: 'Not included'
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 399,
    description: 'Best for serious operators using Coodra every day.',
    cta: 'Choose Pro',
    ctaHref: '/signup?plan=pro',
    bullets: [
      'Everything in Growth',
      '15 stores',
      '50,000 products tracked',
      '5,000 decision recommendations / month',
      'Ask Coodra high-volume',
      'Advanced forecasting',
      'Advanced automation',
      'Custom alerts'
    ],
    limits: {
      stores: 15,
      products_tracked: 50000,
      team_members: 25,
      pos_commerce_integrations: 5,
      decision_recommendations: 5000,
      ask_coodra_messages: 'High-volume'
    },
    features: {
      core_product_actions: true,
      category_performance: true,
      inventory_risk_alerts: true,
      forecasting: 'Advanced',
      advanced_forecasting: true,
      trend_detection: 'Advanced',
      advanced_trend_detection: true,
      outcome_tracking: 'Advanced',
      advanced_outcome_tracking: true,
      automation: 'Advanced',
      advanced_automation: true,
      custom_alerts: true,
      custom_integrations: false,
      sla_onboarding: false
    },
    support: 'Priority support',
    slaOnboarding: 'Not included'
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Best for larger teams, custom workflows, and high-volume operators.',
    cta: 'Talk to Sales',
    ctaHref: '/contact?intent=enterprise',
    bullets: [
      'Everything in Pro',
      'Custom stores and catalog volume',
      'Custom decision recommendation volume',
      'Custom Ask Coodra usage',
      'Custom integrations',
      'Custom permissions',
      'SLA and dedicated support'
    ],
    limits: {
      stores: 'Custom',
      products_tracked: 'Custom',
      team_members: 'Custom',
      pos_commerce_integrations: 'Custom',
      decision_recommendations: 'Custom',
      ask_coodra_messages: 'Custom'
    },
    features: {
      core_product_actions: true,
      category_performance: true,
      inventory_risk_alerts: true,
      forecasting: 'Advanced',
      advanced_forecasting: true,
      trend_detection: 'Advanced / custom',
      advanced_trend_detection: true,
      outcome_tracking: 'Advanced',
      advanced_outcome_tracking: true,
      automation: 'Custom',
      advanced_automation: true,
      custom_alerts: true,
      custom_integrations: true,
      sla_onboarding: true
    },
    support: 'Dedicated support',
    slaOnboarding: 'Included'
  }
]

export const pricingComparisonGroups = [
  {
    title: 'Usage',
    rows: [
      ['Stores', 'stores'],
      ['Products tracked', 'products_tracked'],
      ['Team members', 'team_members'],
      ['POS / commerce integrations', 'pos_commerce_integrations'],
      ['Decision recommendations / month', 'decision_recommendations'],
      ['Ask Coodra messages', 'ask_coodra_messages']
    ] as Array<[string, MetricKey]>
  },
  {
    title: 'Intelligence',
    rows: [
      ['Core product actions', 'core_product_actions'],
      ['Category performance', 'category_performance'],
      ['Inventory risk alerts', 'inventory_risk_alerts'],
      ['Forecasting', 'forecasting'],
      ['Trend detection', 'trend_detection'],
      ['Outcome tracking', 'outcome_tracking']
    ] as Array<[string, FeatureKey]>
  },
  {
    title: 'Workflow',
    rows: [
      ['Automation', 'automation'],
      ['Custom alerts', 'custom_alerts'],
      ['Custom integrations', 'custom_integrations']
    ] as Array<[string, FeatureKey]>
  },
  {
    title: 'Support',
    rows: [
      ['Support', 'support'],
      ['SLA / onboarding', 'slaOnboarding']
    ] as Array<[string, 'support' | 'slaOnboarding']>
  }
]

export function getPlan(key: string | null | undefined) {
  return pricingPlans.find((plan) => plan.key === key) || pricingPlans[0]
}

export function formatPlanValue(value: unknown) {
  if (value === true) return 'Included'
  if (value === false || value == null) return 'Not included'
  if (typeof value === 'number') return value.toLocaleString()
  return String(value)
}

export function planIncludes(currentPlan: string | null | undefined, requiredPlan: PlanKey) {
  const current = getPlan(currentPlan).key
  return planOrder[current] >= planOrder[requiredPlan]
}
