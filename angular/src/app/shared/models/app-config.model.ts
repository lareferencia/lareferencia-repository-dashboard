export interface AppConfig {
  authentication_module: AuthenticationModule;
  main_module:           MainModule;
  admin_module:          AdminModule;
  historic_module:       HistoricModule;
  validation_module:     ValidationModule;
  statistics_module:     StatisticsModule;
  broker_module:         BrokerModule;
}

export interface AdminModule {
  active:    boolean;
  endpoints: AdminModuleEndpoints;
}

export interface AdminModuleEndpoints {
  securityService: string;
}

export interface AuthenticationModule {
  active:            boolean;
  endpoints:         AuthenticationModuleEndpoints;
  key_cloack_config: KeyCloackConfig;
}

export interface AuthenticationModuleEndpoints {
  authService: string;
}

export interface KeyCloackConfig {
  realm:    string;
  clientId: string;
}

export interface BrokerModule {
  active:    boolean;
  endpoints: BrokerModuleEndpoints;
}

export interface BrokerModuleEndpoints {
  brokerService: string;
}

export interface HistoricModule {
  active:    boolean;
  endpoints: HistoricModuleEndpoints;
}
export interface HistoricModuleEndpoints {
  harvestingService: string;
  validationService: string;
}

export interface ValidationModule {
  active:    boolean;
  endpoints: HistoricModuleEndpoints;
}

export interface ValidationModuleEndpoints {
  harvestingService: string;
  validationService: string;
}

export interface MainModule {
}

export interface StatisticsModule {
  active:         boolean;
  historic_stats: HistoricStats;
}

export interface HistoricStats {
  widget_url:      string;
  event_labels:    EventLabels;
  scope_labels:    ScopeLabels;
  country:         string;
  national_source: string;
  preview:         boolean;
}

export interface EventLabels {
  view:     string;
  download: string;
  outlink:  string;
}

export interface ScopeLabels {
  L: string;
  N: string;
  R: string;
}