
export interface AppConfig {
    authentication_module: AuthenticationModule;
    main_module:           MainModule;
    historic_module:       Module;
    validation_module:     Module;
    statistics_module:     StatisticsModule;
    broker_module:         BrokerModule;
  }
  
  export interface AuthenticationModule {
    key_cloack_config: KeyCloackConfig;
  }
  
  export interface KeyCloackConfig {
    url:      string;
    realm:    string;
    clientId: string;
  }
  
  export interface BrokerModule {
    endpoints: BrokerModuleEndpoints;
  }
  
  export interface BrokerModuleEndpoints {
    brokerService: string;
  }
  
  export interface Module {
    endpoints: HistoricModuleEndpoints;
  }
  
  export interface HistoricModuleEndpoints {
    harvestingService: string;
    validationService: string;
  }
  
  export interface MainModule {
    endpoints: MainModuleEndpoints;
  }
  
  export interface MainModuleEndpoints {
    securityService: string;
  }
  
  export interface StatisticsModule {
    active:          boolean;
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