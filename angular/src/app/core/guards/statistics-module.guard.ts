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

  const checkStadisticModuleStatus = () => {
    const appConfig = inject(AppConfigService);
    const router: Router = inject(Router);

    const isActivated = appConfig.getStatisticsModuleConfig().active

    if(!isActivated){
        return router.navigate(['/']);
    }

  }
  export const canActivateGuard: CanActivateFn = ( 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
   
    return checkStadisticModuleStatus();
  };
   
  export const canMatchGuard: CanMatchFn = ( 
    route: Route,
    segments: UrlSegment[]
  ) => {
   
    return checkStadisticModuleStatus();
  };