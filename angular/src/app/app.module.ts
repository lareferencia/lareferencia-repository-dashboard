import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeKeycloak } from './keycloak-init';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { AuthenticationService } from './core/services/authentication.service';
import { CoreModule } from './core/core.module';
import { HarvestingModule } from './components/harvesting/harvesting.module';
import { TemplateModule } from './components/template/template.module';
import { HomeModule } from './components/home/home.module';
import { BrokerModule } from './components/broker/broker.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    CoreModule,
    HarvestingModule,
    TemplateModule,
    HomeModule,
    BrokerModule,
  ],
  providers: [
    AuthenticationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
