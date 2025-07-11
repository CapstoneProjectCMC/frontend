import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../shared/utils/notification';

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
                sendNotification(
                  this.store,
                  res.status,
                  'Đăng nhập Google thành công',
                  'success'
                );
                this.router.navigate(['/main']);
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
        console.log(code);
      } else {
        this.isLoading = false;
        sendNotification(this.store, 'Thất bại', 'Lỗi không xác định', 'error');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
