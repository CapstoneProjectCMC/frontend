import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Bỏ qua nếu route có skipBreadcrumb hoặc thuộc auth
      const skipBreadcrumb = child.snapshot.data['skipBreadcrumb'];
      const isAuthRoute = url.includes('/auth'); // Kiểm tra đường dẫn chứa 'auth'
      if (skipBreadcrumb || isAuthRoute) {
        return this.createBreadcrumbs(child, url, breadcrumbs); // Bỏ qua và tiếp tục với route con
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({
          label,
          url,
          isActive: !child.children.length,
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
