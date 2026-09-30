import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, DashboardAccessDeniedError } from '../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  pending = false;
  error = false;
  accessDenied = false;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    if (this.auth.currentUser) void this.router.navigateByUrl('/');
  }

  async submit(): Promise<void> {
    if (this.pending) return;
    this.pending = true;
    this.error = false;
    this.accessDenied = false;
    try {
      await this.auth.login(this.username.trim(), this.password);
      this.password = '';
      const destination = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      await this.router.navigateByUrl(destination.startsWith('/') && !destination.startsWith('//') ? destination : '/');
    } catch (cause) {
      this.accessDenied = cause instanceof DashboardAccessDeniedError;
      this.error = !this.accessDenied;
    } finally {
      this.pending = false;
    }
  }
}
