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

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LoadingOverlayComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLoading = false;

  dataLogin = {
    accountName: '',
    password: '',
  };

  loginResponse: loginResponse = {
    username: '',
    email: '',
    tokenId: '',
    tokenAccessType: '',
    accessToken: '',
    refreshToken: '',
    accessExpiry: '',
    refreshExpiry: '',
    authenticated: false,
    enabled: false,
    active: false,
  };

  currentSlide = 0;

  slides = slides;

  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  onLogin() {
    this.isLoading = true;
    let data: any = {
      password: this.dataLogin.password,
    };

    if (this.dataLogin.accountName.includes('@')) {
      data.email = this.dataLogin.accountName;
    } else {
      data.username = this.dataLogin.accountName;
    }

    this.authService.loginByUsername(data).subscribe({
      next: (res) => {
        this.loginResponse = res.result;
        this.isLoading = false;

        sendNotification(this.store, res.status, res.message, 'success');
      },
      error: (err) => {
        console.log(err);
        sendNotification(
          this.store,
          'Thất bại!',
          'Đăng nhập thật bại, vui lòng thử lại!',
          'error'
        );
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
}
