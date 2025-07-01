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
      if (code) {
        // Gửi code về backend để lấy access_token
        this.authService.verifyGoogleCode(code).subscribe({
          next: (res) => {
            // Xử lý thành công, chuyển hướng
            this.isLoading = false;
            if (res.code === 20000) {
              sendNotification(this.store, 'Thành công', res.status, 'success');
              this.router.navigate(['/main']);
            } else {
              this.router.navigate(['/auth/identity/login']);
            }
          },
          error: (err) => {
            // Xử lý lỗi, chuyển hướng về login
            this.isLoading = false;
            sendNotification(
              this.store,
              'Thất bại',
              'Có sự cố xảy ra khi đăng nhập',
              'error'
            );
            this.router.navigate(['/auth/identity/login']);
          },
        });
        console.log(code);
      } else {
        this.isLoading = false;
        sendNotification(this.store, 'Thất bại', 'Lỗi không xác định', 'error');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
