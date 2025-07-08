import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthConfig } from '../../../../core/services/config-service/oauth.configuration';
import { Router } from '@angular/router';
import { slides } from '../../../../core/constants/value.constant';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { loginResponse } from '../../../../core/models/api-response';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../shared/utils/notification';
import { FormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { DecodedJwtPayload } from '../../../../core/models/data-handle';
import { CookieService } from 'ngx-cookie-service';
import { validateLogin } from '../../validation/login-validation';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LoadingOverlayComponent, Tooltip],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLoading = false;
  rememberMe = false;
  currentSlide = 0;

  slides = slides;

  showPassword = false;

  userInfo: DecodedJwtPayload = {
    sub: '',
    permissions: [],
    scope: '',
    roles: [],
    iss: '',
    active: false,
    exp: 0,
    token_type: '',
    iat: 0,
    userId: '',
    jti: '',
    email: '',
  };

  dataLogin = {
    accountName: '',
    password: '',
  };

  loginResponse: loginResponse = {
    tokenAccessType: '',
    accessToken: '',
    refreshToken: '',
    accessExpiry: '',
    refreshExpiry: '',
    authenticated: false,
    enabled: false,
    active: false,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  linkToRegister() {
    this.router.navigate(['/auth/identity/register']);
  }

  onLogin() {
    const warning = validateLogin(
      this.dataLogin.accountName,
      this.dataLogin.password
    );
    if (warning) {
      sendNotification(this.store, 'Cảnh báo!', warning, 'warning');
      return;
    }
    this.isLoading = true;
    let data: any = {
      password: this.dataLogin.password,
    };

    if (this.dataLogin.accountName.includes('@')) {
      data.email = this.dataLogin.accountName;
    } else {
      data.username = this.dataLogin.accountName;
    }

    this.authService.login(data).subscribe({
      next: (res) => {
        this.loginResponse = res.result;
        this.isLoading = false;
        this.userInfo = decodeJWT(res.result.accessToken)?.payload;

        //Hiện có thể lưu tại 3 chỗ
        this.saveUserInfoToSession(this.userInfo);
        this.saveUserInfoToCookie(this.userInfo);
        localStorage.setItem('token', res.result.accessToken);
        sendNotification(this.store, res.status, res.message, 'success');
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onGoogleLogin() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'code',
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

  saveUserInfoToSession(userInfo: DecodedJwtPayload) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  saveUserInfoToCookie(userInfo: DecodedJwtPayload) {
    this.cookieService.set('userInfo', JSON.stringify(userInfo));
  }
}
