import { AppConfigService } from "./shared/models/app-config-service.model";

export const appInitializerFn = (appConfig: AppConfigService) => {
    return () => {
      return appConfig.loadAppConfig();
    };
  };