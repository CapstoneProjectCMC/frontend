import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, LoadingOverlayComponent],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.scss',
})
export class OauthCallbackComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        // Gửi code về backend để lấy access_token
        // this.authService.exchangeGoogleCodeForToken(code).subscribe({
        //   next: (res) => {
        //     // Xử lý thành công, chuyển hướng
        //     this.router.navigate(['/dashboard']);
        //   },
        //   error: (err) => {
        //     // Xử lý lỗi, chuyển hướng về login
        //     this.router.navigate(['/auth/login']);
        //   },
        // });
        console.log(code);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
