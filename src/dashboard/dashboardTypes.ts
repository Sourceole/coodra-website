export type DashboardPageId = 'command-center' | 'decisions' | 'merchandise' | 'operations' | 'intelligence' | 'integrations' | 'workspace' | 'settings' | 'help'

export type BootUser = {
  userId: string | null
  email: string
  firstName: string
  company: string
  region: string
  backendJwt: string
  backendJwtExp: number
  role: string
  supabaseAccessToken: string
}

export type MetricTone = 'teal' | 'blue' | 'amber' | 'red' | 'green' | 'neutral'

export type MetricCardData = {
  label: string
  value: string
  change?: string
  detail?: string
  tone?: MetricTone
  spark?: number[]
}

export type DecisionStatus = 'suggested' | 'pending' | 'approved' | 'executed' | 'measured' | 'dismissed'

export type MerchantDecision = {
  id: string
  title: string
  why: string
  category: string
  action: string
  impact: string
  urgency: 'High' | 'Medium' | 'Low'
  confidence: number
  owner?: string
  due?: string
  status: DecisionStatus
  createdAt?: string
  approvedAt?: string
  dismissedAt?: string
  executedAt?: string
  decidedAt?: string
}

export type SimpleRow = {
  id: string
  title: string
  subtitle?: string
  metric?: string
  detail?: string
  status?: string
  tone?: MetricTone
}

export type IntegrationCard = {
  provider: string
  description: string
  status: 'Connected' | 'Pending' | 'Error' | 'Not connected'
  lastSync?: string
  accent?: MetricTone
}

export type ProfitSeriesPoint = {
  month: string
  thisYear: number
  lastYear: number
}

export type DashboardData = {
  generatedAt: string
  billing?: {
    planCode: string
    status: string
    periodStart?: string | null
    periodEnd?: string | null
    entitlements?: Record<string, unknown>
    capabilities?: Record<string, unknown>
    usageSummary?: {
      metrics?: Record<string, {
        code: string
        label: string
        used: number
        limit: number
        unlimited: boolean
        remaining: number | null
        percent: number | null
        near_limit: boolean
        reached: boolean
        level: string
      }>
      near_limits?: Record<string, boolean>
    }
  }
  stores?: Array<{
    id: string
    name: string
    subtitle?: string
  }>
  commandCenter: {
    hero: {
      title: string
      summary: string
      impactLabel: string
      impactValue: string
      spark: number[]
    }
    metrics: MetricCardData[]
    decisions: MerchantDecision[]
    agentInsight: string
    outcomes: MetricCardData[]
    profitSeries: ProfitSeriesPoint[]
    bottomCards: SimpleRow[]
  }
  decisions: {
    metrics: MetricCardData[]
    queue: MerchantDecision[]
    outcomes: SimpleRow[]
    automation: SimpleRow[]
    dismissedReasons: SimpleRow[]
    approvalVelocity: {
      medianHours: string
      velocityChange: string
      predictionAccuracy: string
      accuracyChange: string
      chart: Array<{ month: string; velocityHours: number; accuracyPct: number | null }>
    }
  }
  merchandise: {
    metrics: MetricCardData[]
    roleMix: SimpleRow[]
    opportunities: SimpleRow[]
    catalogTasks: SimpleRow[]
    highlights: SimpleRow[]
  }
  operations: {
    metrics: MetricCardData[]
    reorders: SimpleRow[]
    suppliers: SimpleRow[]
    purchaseOrders: SimpleRow[]
    transfers: SimpleRow[]
  }
  intelligence: {
    metrics: MetricCardData[]
    performanceSeries: number[]
    forecastSeries: number[]
    signals: SimpleRow[]
    reports: SimpleRow[]
  }
  workspace: {
    metrics: MetricCardData[]
    integrations: IntegrationCard[]
    automation: SimpleRow[]
    activity: SimpleRow[]
    team: SimpleRow[]
  }
}
