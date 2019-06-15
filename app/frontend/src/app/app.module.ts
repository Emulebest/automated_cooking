import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {AlertComponent} from './alert/alert.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './_guards/auth.guard';
import {AlertService} from './_services/alert.service';
import {AuthService} from './_services/auth.service';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule, MatGridListModule, MatIconModule,
  MatInputModule,
  MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule, MatStepperModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { DeviceComponent } from './device/device.component';
import { DeviceListComponent } from './device-list/device-list.component';
import {DeviceService} from './_services/device.service';
import {WebsocketService} from './_services/websocket.service';
import {NotificationService} from './_services/notification.service';
import { DeviceControlComponent } from './device-control/device-control.component';
import { CreateDeviceDialogComponent } from './create-device-dialog/create-device-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    AlertComponent,
    LoginComponent,
    NavbarComponent,
    DeviceComponent,
    DeviceListComponent,
    DeviceControlComponent,
    CreateDeviceDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatProgressBarModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthService,
    DeviceService,
    WebsocketService,
    NotificationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

  ],
  entryComponents: [
    CreateDeviceDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
