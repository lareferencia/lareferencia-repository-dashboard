import { 
    AdminModule, 
    AppConfig, 
    AuthenticationModule, 
    BrokerModule, 
    HistoricModule, 
    HistoricStats, 
    ValidationModule 
} from "./app-config.model";

export interface AppConfigService{
    
    loadAppConfig(): Promise <void>;
    getAppConfig(): AppConfig;
    getAuthModuleData(): AuthenticationModule;
    getHistoricStatsData(): HistoricStats;
    getStatisticsModuleStatus(): boolean;
    getHistoricModuleData(): HistoricModule;
    getValidationModuleData(): ValidationModule;
    getAdminModuleData(): AdminModule;
    getBrokerModuleData(): BrokerModule;

}