import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      
      let language = window.location.pathname.split('/')[1];
      if (language !== 'en' && language !== 'pt' && language !== 'es')
        language = '';
      else language = '/' + language;
      
      await this.keycloak.login({
        redirectUri: window.location.origin + language + state.url,
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data.roles;

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }

  public async logout(){
    this.keycloak.logout();
  }

  public async getFirstName () : Promise<string> {
    const userDetails = await this.keycloak.loadUserProfile();
    return userDetails.firstName;
  }

  public async getUserName () : Promise<string> {
    const userDetails = await this.keycloak.loadUserProfile();
    return userDetails.username;
  }

  public isAdmUser () : boolean {
    return this.keycloak.isUserInRole("dashboard-admin");
  }
}
