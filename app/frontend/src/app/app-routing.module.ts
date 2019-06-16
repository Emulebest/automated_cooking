import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './_guards/auth.guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {DeviceStatisticsComponent} from './device-statistics/device-statistics.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'statistics', component: DeviceStatisticsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
