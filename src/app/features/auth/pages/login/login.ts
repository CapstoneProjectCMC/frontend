import { Component } from '@angular/core';
import { OAuthConfig } from '../../../../core/services/config-service/oauth.configuration';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  onGoogleLogin() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.clientId,
      redirect_uri: window.location.origin + '/',
      response_type: 'token',
      scope: 'email profile openid',
      include_granted_scopes: 'true',
      state: 'login',
    });
    window.location.href = `${OAuthConfig.authUri}?${params.toString()}`;
  }
}
