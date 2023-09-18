import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AppConfig {
  authentication: Authentication;
  endpoints:      Endpoints;
  app_modules:    AppModules;
}

export interface AppModules {
  active:            boolean;
  statistics_module: StatisticsModule;
}

export interface StatisticsModule {
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

export interface Authentication {
  key_cloack_config: KeyCloackConfig;
}

export interface KeyCloackConfig {
  url:      string;
  realm:    string;
  clientId: string;
}

export interface Endpoints {
  harvestingService: string;
  validationService: string;
  brokerService:     string;
  securityService:   string;
}


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig(): Promise<void> {
    return this.http.get<AppConfig>('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}