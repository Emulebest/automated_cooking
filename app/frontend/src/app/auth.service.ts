import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private oauthUrl = '/oauth2/convert-token';
  private localAuthUrlBase = '/auth';
  private localRegisterUrl = this.localAuthUrlBase + '/register/';
  private localLoginUrl = this.localAuthUrlBase + '/token/';
  private localLogoutUrl = this.localAuthUrlBase + '/token/revoke/';
  private localRefreshUrl = this.localAuthUrlBase + '/token/refresh/';
  private accessToken = '';
  private refreshToken = '';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

  getIdentity() {
    this.http.get(environment.apiUrl);
  }
}
