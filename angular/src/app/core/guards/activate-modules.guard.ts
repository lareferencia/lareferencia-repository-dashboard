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
    
    return checkModuleStatus(route);
  };


  const checkModuleStatus = (route: ActivatedRouteSnapshot) => {
    const appConfig = inject(AppConfigService);
    const router: Router = inject(Router);

    const { module } = route.data
    const isActivated = appConfig.getModuleStatus( module );
    
    if(!isActivated){
        return router.navigate(['/']);
    }
  }