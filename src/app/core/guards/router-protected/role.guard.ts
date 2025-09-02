// role.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { sendNotification } from '../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store,
    private location: Location
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const expectedRoles = next.data['roles'] as string[]; // lấy roles từ route
    const userRoles = decodeJWT(localStorage.getItem('token') ?? '')?.payload
      .roles;

    if (!expectedRoles || expectedRoles.length === 0) {
      return true; // không yêu cầu role -> cho vào
    }

    if (userRoles && userRoles.some((role) => expectedRoles.includes(role))) {
      return true;
    } else {
      sendNotification(
        this.store,
        'Cảnh báo!',
        'Bạn không có quyền truy cập vào chức năng này!',
        'warning'
      );
      // nếu không đủ quyền, redirect sang trang 403 hoặc trang chủ
      this.location.back();
      // return this.router.createUrlTree(['/']); // về trang chủ
      return false;
    }
  }
}

/* cách dùng: Thêm các option này vào router, 
        data: { roles: ['ROLE_ADMIN'] },
        canActivate: [RoleGuard]

    Ví dụ:
      {
        path: 'service-and-payment',
        loadChildren: () =>
          import('./features/service-payment/service-and-payment.module').then(
            (m) => m.ServiceAndPaymentModule
          ),
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard],
      },

*/
