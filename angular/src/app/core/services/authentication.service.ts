import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface UserSession {
  username: string;
  displayName: string;
  roles: string[];
  readableNetworkIds: number[];
  serviceAccount: boolean;
}

export class DashboardAccessDeniedError extends Error {}

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements CanActivate, CanActivateChild {
  private readonly userSubject = new BehaviorSubject<UserSession | null>(null);
  readonly user$ = this.userSubject.asObservable();
  private csrfToken: string | null = null;
  private restorePromise: Promise<UserSession | null> | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly appConfig: AppConfigService,
    private readonly router: Router,
  ) {}

  get currentUser(): UserSession | null { return this.userSubject.value; }
  get isAdmin(): boolean { return this.currentUser?.roles.includes('ADMIN') ?? false; }

  restoreSession(): Promise<UserSession | null> {
    if (!this.restorePromise) {
      this.restorePromise = this.http.get<UserSession>(this.url('/me'), { withCredentials: true }).toPromise()
        .then(user => {
          this.userSubject.next(this.canUseDashboard(user) ? user : null);
          return this.userSubject.value;
        })
        .catch(() => {
          this.userSubject.next(null);
          return null;
        });
    }
    return this.restorePromise;
  }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.checkSession(state);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.checkSession(state);
  }

  private async checkSession(state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user = this.currentUser ?? await this.restoreSession();
    return user ? true : this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  async login(username: string, password: string): Promise<UserSession> {
    const csrf = await this.getCsrfToken();
    const user = await this.http.post<UserSession>(
      this.url('/auth/login'), { username, password },
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }) },
    ).toPromise();
    if (!this.canUseDashboard(user)) throw new DashboardAccessDeniedError('Dashboard role is required');
    this.restorePromise = Promise.resolve(user);
    this.userSubject.next(user);
    return user;
  }

  async logout(): Promise<void> {
    this.csrfToken = null;
    const csrf = await this.getCsrfToken();
    await this.http.post<void>(this.url('/auth/logout'), null, {
      withCredentials: true,
      headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }),
    }).toPromise();
    this.userSubject.next(null);
    this.restorePromise = Promise.resolve(null);
    this.csrfToken = null;
  }

  private async getCsrfToken(): Promise<string> {
    if (!this.csrfToken) {
      const response = await this.http.get<{ token: string }>(this.url('/auth/csrf'), {
        withCredentials: true,
      }).toPromise();
      this.csrfToken = response?.token ?? null;
    }
    if (!this.csrfToken) throw new Error('CSRF token was not returned by the API');
    return this.csrfToken;
  }

  private url(path: string): string {
    return `${this.appConfig.getApiBaseUrl()}${path}`;
  }

  private canUseDashboard(user: UserSession): boolean {
    return !user.serviceAccount && user.roles.some(role => role === 'ADMIN' || role === 'DASHBOARD');
  }
}
