import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminModule, AppConfig, AuthenticationModule, BrokerModule, HistoricModule, HistoricStats, KeyCloackConfig, ValidationModule } from 'src/app/shared/models/app-config.model';


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;
  private historicStatsData: HistoricStats;
  private isActive_statisticsModule: boolean;
  private historicModuleData: HistoricModule;
  private validationModuleData: ValidationModule;
  private adminModuleData: AdminModule;
  private brokerModuleData: BrokerModule;
  private authModuleData: AuthenticationModule;
  private keycloakConfig: KeyCloackConfig

  constructor(private http: HttpClient) { }

  loadAppConfig(): Promise<void> {
    return this.http.get<AppConfig>('./assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
        this.historicStatsData = data.statistics_module.historic_stats;
        this.isActive_statisticsModule = data.statistics_module.active;
        this.historicModuleData = data.historic_module;
        this.validationModuleData = data.validation_module;
        this.adminModuleData = data.admin_module;
        this.brokerModuleData = data.broker_module;
        this.authModuleData = data.authentication_module;
        this.keycloakConfig = data.authentication_module.key_cloack_config;
      });
  }

  //General json data
  getAppConfig() {
    return this.appConfig;
  };

  //Auth module
  getAuthModuleData(){
    return this.authModuleData
  };
  getKeyCloackConfig(){
    this.keycloakConfig;
  };

  //Statistics module
  getHistoricStatsData(){
    return this.historicStatsData;
  };

  getStatisticsModuleStatus(): boolean{
    return this.isActive_statisticsModule
  };

  //Historic module
  getHistoricModuleData(){
    return this.historicModuleData;
  };

  //Validation module
  getValidationModuleData(){
    return this.validationModuleData
  };

  //Admin module
  getAdminModuleData(){
    return this.adminModuleData
  }

  //Broker module
  getBrokerModuleData(){
    return this.brokerModuleData
  };
}