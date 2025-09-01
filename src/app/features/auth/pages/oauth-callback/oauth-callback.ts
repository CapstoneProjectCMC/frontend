import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';
import { Store } from '@ngrx/store';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { setVariable } from '../../../../shared/store/variable-state/variable.actions';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, LoadingOverlayComponent],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.scss',
})
export class OauthCallbackComponent {
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const state = params['state'];
      if (code) {
        // Gửi code về backend để lấy access_token
        if (state === 'login') {
          // Ưu tiên Google, fallback Facebook nếu cần
          this.authService.verifyGoogleCode(code).subscribe({
            next: (res) => {
              this.isLoading = false;
              if (res.code === 20000) {
                this.router.navigate(['/exercise/exercise-layout/list']);
                localStorage.setItem('token', res.result.accessToken);
                localStorage.setItem('refreshToken', res.result.refreshToken);

                if (!res.result.needPasswordSetup) {
                  openModalNotification(
                    this.store,
                    'Cảnh báo',
                    'Tài khoản của bạn chưa có mật khẩu, hãy cài đặt nó sớm nhất có thể để tránh rủi ro.',
                    'Đồng ý',
                    'hủy'
                  );
                  this.store.dispatch(
                    setVariable({ key: 'needPasswordSetup', value: true })
                  );
                }
              } else {
                this.router.navigate(['/auth/identity/login']);
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.router.navigate(['/auth/identity/login']);
            },
          });
        } else {
          this.isLoading = false;
          this.router.navigate(['/auth/identity/login']);
        }
      } else {
        this.isLoading = false;
        sendNotification(this.store, 'Thất bại', 'Lỗi không xác định', 'error');
        this.router.navigate(['/auth/identity/login']);
      }
    });
  }
}
