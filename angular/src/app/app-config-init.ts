import { AppConfigService } from './core/services/app-config.service';
import { AuthenticationService } from './core/services/authentication.service';

export const appInitializerFn = (appConfig: AppConfigService, auth: AuthenticationService) => async () => {
  await appConfig.loadAppConfig();
  await auth.restoreSession();
};
