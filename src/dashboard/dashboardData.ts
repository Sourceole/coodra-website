import type { DashboardData } from './dashboardTypes'

export const dashboardFallbackData: DashboardData = {
  generatedAt: '2026-05-05T00:00:00.000Z',
  commandCenter: {
    hero: {
      title: 'No open decisions yet',
      summary: 'Live recommendations will appear after connected data creates decision signals.',
      impactLabel: 'Projected 30-day impact',
      impactValue: '$0',
      spark: []
    },
    metrics: [
      { label: 'Revenue', value: '$0', change: 'Awaiting sales data', detail: 'Connected data', tone: 'neutral', spark: [] },
      { label: 'Gross Margin', value: 'Measuring', change: 'Needs margin data', detail: 'Margin rate', tone: 'neutral', spark: [] },
      { label: 'Units Sold', value: '0', change: 'Awaiting sales data', detail: 'Sales volume', tone: 'neutral', spark: [] },
      { label: 'Inventory Risks', value: '0', change: 'No current risks', detail: 'Inventory-backed', tone: 'green', spark: [] }
    ],
    decisions: [],
    agentInsight: 'Coodra will summarize the highest-impact recommendation once live signals are available.',
    outcomes: [
      { label: 'Decisions approved', value: '0', change: 'Needs decisions', detail: 'Decision workflow', tone: 'neutral' },
      { label: 'Positive outcome rate', value: 'Measuring', change: 'Needs measured outcomes', detail: 'Measured actions', tone: 'neutral' },
      { label: 'Gross profit lift', value: 'Measuring', change: 'Needs settled actions', detail: 'Attributed', tone: 'neutral' }
    ],
    profitSeries: [],
    bottomCards: []
  },
  decisions: {
    metrics: [
      { label: 'Pending decisions', value: '0', change: 'No open decisions', tone: 'green' },
      { label: 'Projected impact', value: '$0', change: 'No open estimate', tone: 'neutral' },
      { label: 'Approval rate', value: 'Measuring', change: 'Needs decisions', tone: 'neutral' },
      { label: 'Measured lift', value: 'Measuring', change: 'Needs outcomes', tone: 'neutral' }
    ],
    queue: [],
    outcomes: [],
    automation: [],
    dismissedReasons: [],
    approvalVelocity: {
      medianHours: 'Measuring',
      velocityChange: 'Needs approvals',
      predictionAccuracy: 'Measuring',
      accuracyChange: 'Needs outcomes',
      chart: []
    }
  },
  merchandise: {
    metrics: [
      { label: 'Products analyzed', value: '0', change: 'Awaiting sales data', tone: 'neutral' },
      { label: 'SKU roles classified', value: '0', change: 'Needs SKU roles', tone: 'neutral' },
      { label: 'At-risk items', value: '0', change: 'No current risks', tone: 'green' },
      { label: 'Catalog tasks', value: '0', change: 'No readiness tasks', tone: 'neutral' }
    ],
    roleMix: [],
    opportunities: [],
    catalogTasks: [],
    highlights: []
  },
  operations: {
    metrics: [
      { label: 'Inventory at risk', value: '0', change: 'No current risks', tone: 'green' },
      { label: 'Reorder queue', value: '0', change: 'No reorder candidates', tone: 'green' },
      { label: 'Open POs', value: '0', change: 'No PO records yet', tone: 'neutral' },
      { label: 'Connected systems', value: '0', change: 'No live integrations', tone: 'amber' }
    ],
    reorders: [],
    suppliers: [],
    purchaseOrders: [],
    transfers: []
  },
  intelligence: {
    metrics: [
      { label: 'Revenue', value: '$0', change: 'Awaiting sales data', tone: 'neutral' },
      { label: 'Gross Margin', value: 'Measuring', change: 'Needs margin data', tone: 'neutral' },
      { label: 'Low inventory risks', value: '0', change: 'No current risks', tone: 'green' },
      { label: 'Forecast Accuracy', value: 'Measuring', change: 'Needs forecast snapshots', tone: 'neutral' }
    ],
    performanceSeries: [],
    forecastSeries: [],
    signals: [],
    reports: []
  },
  workspace: {
    metrics: [
      { label: 'Connected integrations', value: '0', change: 'No live integrations', tone: 'amber' },
      { label: 'Active automations', value: '0', change: 'No guardrails enabled', tone: 'neutral' },
      { label: 'Usage this month', value: 'Not metered', change: 'Usage events unavailable', tone: 'neutral' },
      { label: 'Plan status', value: 'Unknown', change: 'Needs billing data', tone: 'neutral' }
    ],
    integrations: [],
    automation: [],
    activity: [],
    team: []
  }
}
