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
import { ForgotPasswordModalComponent } from '../../components/modal/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    Tooltip,
    ForgotPasswordModalComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLoading = false;
  rememberMe = false;
  currentSlide = 0;

  slides = slides;

  showPassword = false;
  isOpenForgotModal = false;

  userInfo: DecodedJwtPayload = {
    sub: '',
    permissions: [],
    org_id: '',
    org_role: '',
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
    username: '',
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
    needPasswordSetup: false,
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

  goToHome() {
    this.router.navigate(['/']);
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

        localStorage.setItem('token', res.result.accessToken);
        localStorage.setItem('refreshToken', res.result.refreshToken);
        sessionStorage.removeItem('avatar-url');

        this.router.navigate(['/post-features/post-list']);
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onGoogleLogin() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.google.clientId,
      redirect_uri: OAuthConfig.google.redirectUriServer,
      response_type: 'code',
      scope: 'email profile openid',
      include_granted_scopes: 'true',
      state: 'login',
      prompt: 'select_account',
    });
    window.location.href = `${OAuthConfig.google.authUri}?${params.toString()}`;
  }

  onFacebookLogin() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.facebook.clientId,
      redirect_uri: OAuthConfig.facebook.redirectUri,
      response_type: 'code',
      scope: 'email public_profile',
      state: 'login',
      auth_type: 'rerequest',
      display: 'popup',
    });
    window.location.href = `${
      OAuthConfig.facebook.authUri
    }?${params.toString()}`;
  }

  loginWithDifferentAccount() {
    const params = new URLSearchParams({
      client_id: OAuthConfig.google.clientId,
      redirect_uri: window.location.origin,
      response_type: 'token',
      scope: 'email profile openid',
      include_granted_scopes: 'true',
      state: 'login',
      prompt: 'select_account consent',
    });
    window.location.href = `${OAuthConfig.google.authUri}?${params.toString()}`;
  }

  openForgotPassModal() {
    this.isOpenForgotModal = !this.isOpenForgotModal;
  }

  onCloseForgotModal() {
    this.isOpenForgotModal = false;
  }

  saveUserInfoToSession(userInfo: DecodedJwtPayload) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  saveUserInfoToCookie(userInfo: DecodedJwtPayload) {
    this.cookieService.set('userInfo', JSON.stringify(userInfo));
  }
}
