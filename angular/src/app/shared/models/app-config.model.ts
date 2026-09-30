export interface AppConfig {
  apiBaseUrl?: string;
  historic_module: { active: boolean };
  validation_module: { active: boolean; portalService?: string };
  statistics_module: { active: boolean; historic_stats?: HistoricStats };
}

export interface HistoricStats {
  widget_url: string;
  is_national_aggregator: boolean;
  event_labels?: { view: string; download: string; outlink: string };
  scope_labels: { L?: string; N: string; R?: string };
  country?: string;
  national_source?: string;
  preview?: boolean;
}
