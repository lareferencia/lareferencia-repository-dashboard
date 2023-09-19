import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, StatisticsModule } from 'src/app/shared/models/app-config.model';


@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;
  private statisticsModule: StatisticsModule;

  constructor(private http: HttpClient) { }

  loadAppConfig(): Promise<void> {
    return this.http.get<AppConfig>('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
        this.statisticsModule = data.statistics_module;
      });
  }

  getConfig() {
    return this.appConfig;
  }
  getStatisticsModuleConfig(){
    return this.statisticsModule
  }
}