import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, HistoricStats } from 'src/app/shared/models/app-config.model';


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;
  private historicStatsData: HistoricStats;
  private isActive_statisticsModule: boolean;

  constructor(private http: HttpClient) { }

  loadAppConfig(): Promise<void> {
    return this.http.get<AppConfig>('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
        this.historicStatsData = data.statistics_module.historic_stats;
        this.isActive_statisticsModule = data.statistics_module.active
      });
  }

  getAppConfig() {
    return this.appConfig;
  };

  getHistoricStatsData(){
    return this.historicStatsData
  };

  getStatisticsModuleStatus(): boolean{
    return this.isActive_statisticsModule
  }
}