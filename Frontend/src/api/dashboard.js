import apiRequest  from './client'
import { getRules } from './validationRules'


const getDashboardSummary = async () => {
  const rules = await getRules()

  const totalRules = rules.length
  const activeRules = rules.filter((r) => r.isActive).length
  const inactiveRules = totalRules - activeRules

  // Group by dataset to build the "Datasets Overview" cards
  const byDataset = {}

  rules.forEach((r) => {
    if (!byDataset[r.dataset]) {
      byDataset[r.dataset] = {
        name: r.dataset,
        rules: 0,
        active: 0,
      }
    }

    byDataset[r.dataset].rules += 1

    if (r.isActive) {
      byDataset[r.dataset].active += 1
    }
  })

  const iconFor = (name) => {
    const n = name.toLowerCase()

    if (n.includes('equity')) {
      return 'equity'
    }

    if (n.includes('bond')) {
      return 'bond'
    }

    if (n.includes('commodity')) {
      return 'commodity'
    }

    return 'equity'
  }

  const datasets = Object.values(byDataset).map((d) => ({
    ...d,
    icon: iconFor(d.name),
    progress: d.rules
      ? Math.round((d.active / d.rules) * 100)
      : 0,
  }))

  return {
    totalRules,
    activeRules,
    inactiveRules,
    datasets,
  }
}

const getRecentActivity = () =>
  apiRequest('/dashboard/activity')

export {
  getDashboardSummary,
  getRecentActivity,
}