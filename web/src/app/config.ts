type DashboardModule = { active: boolean }
export type HistoricStats = {
  widget_url?: string; is_national_aggregator?: boolean; scope_labels?: { N?: string; R?: string }
}
export type RuntimeConfig = {
  apiBaseUrl: string
  historic_module: DashboardModule
  validation_module: DashboardModule & { portalService?: string }
  statistics_module: DashboardModule & { historic_stats?: HistoricStats }
}

export async function loadConfig(base: string): Promise<RuntimeConfig> {
  const response = await fetch(`${base}/assets/data/appConfig.json`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const config = await response.json()
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('appConfig.json')
  for (const key of ['historic_module', 'validation_module', 'statistics_module']) {
    if (config[key] !== undefined && typeof config[key]?.active !== 'boolean') throw new Error(key)
  }
  // Older installations can omit entire modules. Only an explicit active flag enables one.
  return {
    historic_module: { active: false },
    validation_module: { active: false },
    statistics_module: { active: false },
    ...config,
    apiBaseUrl: (config.apiBaseUrl || '/api/v5').replace(/\/$/, ''),
  }
}
