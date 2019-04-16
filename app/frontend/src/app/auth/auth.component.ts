// import { Component, OnInit } from '@angular/core';
// import { OAuthService, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
//
// export const authConfig: AuthConfig = {
//
//   // Url of the Identity Provider
//   issuer: 'https://accounts.google.com',
//
//   // URL of the SPA to redirect the user to after login
//   redirectUri: window.location.origin + '/index',
//
//   silentRefreshRedirectUri: window.location.origin + '/silent-refresh',
//
//   // The SPA's id. The SPA is registerd with this id at the auth-server
//   clientId: '577955276766-nlpt4jjg6g85aenr4mcm8lfpriqlekap.apps.googleusercontent.com',
//   scope: 'profile email',
//   responseType: 'token',
//   strictDiscoveryDocumentValidation: false,
//   showDebugInformation: true,
//
//   oidc: false
// };
//
// @Component({
//   selector: 'app-auth',
//   templateUrl: 'auth.component.html',
// })
// export class AuthComponent implements OnInit {
//
//   constructor(private oauthService: OAuthService) {
//     this.oauthService.configure(authConfig);
//     this.oauthService.tokenValidationHandler = new JwksValidationHandler();
//     this.oauthService.loadDiscoveryDocumentAndTryLogin().then((h) => {
//       console.log(h);
//       console.log(this.oauthService.getAccessToken());
//       console.dir(this.oauthService.getIdentityClaims());
//     });
//   }
//
//   login() {
//     this.oauthService.initImplicitFlow();
//   }
//
//   logout() {
//     this.oauthService.logOut();
//   }
//
//   // get givenName() {
//   //   console.log('Hey');
//   //   // const claims: any = this.oauthService.getIdentityClaims();
//   // //   console.log(claims);
//   // //   if (!claims) {
//   // //     return null;
//   // //   }
//   // //   return claims.name;
//   // }
//
//   ngOnInit() {
//   }
//
// }
import { Component, OnInit } from '@angular/core';
import { GoogleSignInSuccess } from 'angular-google-signin';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  constructor() {
  }

  private myClientId = '577955276766-nlpt4jjg6g85aenr4mcm8lfpriqlekap.apps.googleusercontent.com';

  onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    const googleUser: gapi.auth2.GoogleUser = event.googleUser;
    event.googleUser.isSignedIn()
    const id: string = googleUser.getId();
    const profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();
    console.log('ID: ' +
      profile
        .getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
  }
  ngOnInit() {
  }
}
