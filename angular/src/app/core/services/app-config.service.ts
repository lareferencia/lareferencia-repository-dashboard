import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminModule, AppConfig, AuthenticationModule, BrokerModule, HarvestingAdminModule, HistoricModule, HistoricStats, KeyCloackConfig, ValidationModule } from 'src/app/shared/models/app-config.model';


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;
  private historicStatsData: HistoricStats;
  private historicModuleData: HistoricModule;
  private validationModuleData: ValidationModule;
  private adminModuleData: AdminModule;
  private brokerModuleData: BrokerModule;
  private authModuleData: AuthenticationModule;
  private harvestingAdminModule: HarvestingAdminModule;
  private keycloakConfig: KeyCloackConfig

  constructor(private http: HttpClient) { }

  public isInitialized = false;


  loadAppConfig(): Promise<void> {
    return this.http.get<AppConfig>('./assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.initializeAppConfig(data);
        this.isInitialized = true;
      })
      .catch(error => {
        console.log('Error loading the application config');
        this.isInitialized = false;
        this.displayOnInitErrorMessage();
      });
  };
  
  private initializeAppConfig(data: AppConfig): void {
    this.appConfig = data;
    this.historicStatsData = data.statistics_module.historic_stats;
    this.historicModuleData = data.historic_module;
    this.validationModuleData = data.validation_module;
    this.adminModuleData = data.admin_module;
    this.harvestingAdminModule = data.harvesting_admin_module;
    this.brokerModuleData = data.broker_module;
    this.authModuleData = data.authentication_module;
    this.keycloakConfig = data.authentication_module.key_cloack_config;
  };
  
  private displayOnInitErrorMessage(): void {
    const onInitErrorMsg = document.querySelector('body');
    if (onInitErrorMsg) {
      onInitErrorMsg.innerHTML = `
        <div id="oninit-error"> 
          <h3>El archivo "appConfig.json" debe ser configurado.</h3>
        </div>
      `;
    }
  };

  //General json data
  getAppConfig() {
    return this.appConfig;
  };

  getModuleStatus( module: string ): boolean{    
    return this.appConfig[module].active
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

  //Historic module
  getHistoricModuleData(){
    return this.historicModuleData;
  };

  //Havesting Administrator module
  getHarvestingAdminModuleData(){
    return this.harvestingAdminModule;
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