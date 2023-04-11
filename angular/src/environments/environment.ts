// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const keycloakConfig: any = {
  url: 'https://auth.lareferencia.info/auth/',
  realm: 'lareferencia',
  clientId: 'dashboard-lareferencia',
};

export const environment = {
  production: false,
  harvestingService: 'https://validador.lareferencia.info/api/v2/harvesting/source/',
  validationService: 'https://validador.lareferencia.info/api/v2/validation/source/',
  brokerService: 'https://validador.lareferencia.info/api/v2/oabroker/source/',
  securityService: 'https://validador.lareferencia.info/api/v2/security/management/',
  keycloakConfig: keycloakConfig,
  hmr: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
