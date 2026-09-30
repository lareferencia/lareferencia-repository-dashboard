import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, HistoricStats } from 'src/app/shared/models/app-config.model';


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;
  private historicStatsData: HistoricStats;

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
    this.historicStatsData = data.statistics_module?.historic_stats;
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

  getModuleStatus(module: string): boolean {
    const modules = this.appConfig as unknown as Record<string, { active?: boolean }>;
    return Boolean(modules?.[module]?.active);
  };

  getApiBaseUrl(): string {
    return (this.appConfig?.apiBaseUrl || '/api/v5').replace(/\/$/, '');
  }

  //Statistics module
  getHistoricStatsData(){
    return this.historicStatsData;
  };

  getValidationPortalUrl(): string | undefined {
    return this.appConfig?.validation_module?.portalService;
  }

  getValidationModuleData() {
    return this.appConfig?.validation_module;
  };
}
