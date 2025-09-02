import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { AdminRoutingModule } from '../../dashboard/dashboard-routing.module';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonModule } from '@angular/common';
import { sidebarExercises } from '../../../core/router-manager/vetical-menu-dynamic/exercise-vetical-menu';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { SidebarItem } from '../../../core/models/data-handle';

@Component({
  selector: 'app-exercise-layout',
  imports: [CommonModule, MainSidebarComponent, AdminRoutingModule],
  templateUrl: './exercise-layout.component.html',
  styleUrl: './exercise-layout.component.scss',
})
export class ExerciseLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = true;
  sidebarData: SidebarItem[] = [];

  showSidebar = true;

  // Danh sách các route cần ẩn sidebar
  private routesToHideSidebar: string[] = [
    '/quiz-submission',
    '/code-submission',
  ];

  private routerSubscription!: Subscription;

  constructor(private router: Router) {
    const roles = decodeJWT(localStorage.getItem('token') ?? '')?.payload.roles;
    this.sidebarData = sidebarExercises(roles);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Kiểm tra URL hiện tại có trong danh sách cần ẩn sidebar không
        const shouldHideSidebar = this.shouldHideSidebar(event.url);
        this.showSidebar = !shouldHideSidebar;
      });

    // Kiểm tra lần đầu khi load component
    const shouldHideSidebar = this.shouldHideSidebar(this.router.url);
    this.showSidebar = !shouldHideSidebar;
  }

  /**
   * Kiểm tra xem route hiện tại có cần ẩn sidebar không
   * @param url URL hiện tại
   * @returns true nếu cần ẩn sidebar, false nếu hiển thị sidebar
   */
  private shouldHideSidebar(url: string): boolean {
    return this.routesToHideSidebar.some((route) => url.includes(route));
  }

  /**
   * Thêm route cần ẩn sidebar
   * @param route Route cần thêm
   */
  addRouteToHide(route: string): void {
    if (!this.routesToHideSidebar.includes(route)) {
      this.routesToHideSidebar.push(route);
    }
  }

  /**
   * Xóa route khỏi danh sách ẩn sidebar
   * @param route Route cần xóa
   */
  removeRouteToHide(route: string): void {
    this.routesToHideSidebar = this.routesToHideSidebar.filter(
      (r) => r !== route
    );
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
