import { inject } from '@angular/core';

import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    CanMatchFn,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
  } from '@angular/router';

import { AppConfigService } from '../services/app-config.service';

  
  export const canActivateGuard: CanActivateFn = ( 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
   
    return checkStadisticModuleStatus(route);
  };


  const checkStadisticModuleStatus = (route: ActivatedRouteSnapshot) => {
    const appConfig = inject(AppConfigService);
    const router: Router = inject(Router);
    const { path } = route.routeConfig
    const isActivated = appConfig.getModuleStatus( path );
    if(!isActivated){
        return router.navigate(['/']);
    }
  }