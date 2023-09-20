import { KeycloakService } from 'keycloak-angular';
import { AppConfigService } from './shared/models/app-config-service.model';

export function initializeKeycloak(keycloak: KeycloakService, appConfigService: AppConfigService ) {

  return async () =>{

  await appConfigService.loadAppConfig();
  const { key_cloack_config, endpoints } = appConfigService.getAuthModuleData();
  
    await keycloak.init({
      config: {
        url: endpoints.authService,
        realm: key_cloack_config.realm,
        clientId: key_cloack_config.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      }
    });
  }
}
