import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthConfig } from '../../../../core/services/config-service/oauth.configuration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private router: Router) {}

  onGoogleLogin() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'token',
      scope: 'email profile openid',
      include_granted_scopes: 'true',
      state: 'login',
      prompt: 'select_account',
    });
    window.location.href = `${OAuthConfig.authUri}?${params.toString()}`;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('token_scope');
    localStorage.removeItem('user_info');

    const googleLogoutUrl = 'https://accounts.google.com/logout';
  }

  loginWithDifferentAccount() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.clientId,
      redirect_uri: window.location.origin,
      response_type: 'token',
      scope: 'email profile openid',
      include_granted_scopes: 'true',
      state: 'login',
      prompt: 'select_account consent',
    });
    window.location.href = `${OAuthConfig.authUri}?${params.toString()}`;
  }
}
