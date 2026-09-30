import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AuthenticationService } from './core/services/authentication.service';

import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { AppConfigService } from './core/services/app-config.service';
import { appInitializerFn } from './app-config-init';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule,
    HomeModule,
    AppRoutingModule,
    LayoutModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService, AuthenticationService]
    },
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
