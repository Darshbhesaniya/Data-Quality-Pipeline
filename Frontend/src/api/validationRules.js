import apiRequest  from './client'

// Matches your ready backend API:
// GET    /rules
// POST   /rules
// PUT    /rules/:id
// DELETE /rules/:id
//
// Backend (MySQL table `validation_rules`) uses snake_case columns:
//   rule_name, dataset, column_name, operator, rule_value, error_message, is_active
// Frontend form uses camelCase:
//   ruleName, dataset, column, operator, value, errorMessage, isActive
// These two helpers convert between them so neither side has to change its naming.

const toBackend = (rule) => {
  return {
    rule_name: rule.ruleName,
    dataset: rule.dataset,
    column_name: rule.column,
    operator: rule.operator,
    rule_value: rule.value,
    error_message: rule.errorMessage,
    is_active: rule.isActive,
  }
}

const toFrontend = (row) => {
  return {
    id: row.id,
    ruleName: row.rule_name,
    dataset: row.dataset,
    column: row.column_name,
    operator: row.operator,
    value: row.rule_value,
    errorMessage: row.error_message,
    isActive: !!row.is_active,
  }
}

const getRules = async () => {
  const res = await apiRequest('/rules')

  // Backend returns: { success, count, data: [...] }
  return (res.data || []).map(toFrontend)
}

const createRule = async (rule) => {
  const res = await apiRequest('/rules', {
    method: 'POST',
    body: JSON.stringify(toBackend(rule)),
  })

  // Backend returns: { success, message, data: {...} }
  return toFrontend(res.data)
}

const updateRule = async (id, rule) => {
  const res = await apiRequest(`/rules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toBackend(rule)),
  })

  // Backend returns: { success, message, data: {...} }
  return toFrontend(res.data)
}

const deleteRule = (id) =>
  apiRequest(`/rules/${id}`, {
    method: 'DELETE',
  })

// Backend returns: { success, message } — no data needed,
// the page already knows which id to remove from local state.

export {
  getRules,
  createRule,
  updateRule,
  deleteRule,
}