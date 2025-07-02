import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../breadcrumb.service';
import { NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgForOf, NgIf],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private sub!: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  ngOnInit() {
    // Lấy breadcrumbs lần đầu
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;

    // Cập nhật breadcrumbs mỗi khi route thay đổi
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = this.breadcrumbService.breadcrumbs;
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
