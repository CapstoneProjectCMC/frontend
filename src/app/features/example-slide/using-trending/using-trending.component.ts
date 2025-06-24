import { Component } from '@angular/core';
import {
  TrendingItem,
  TrendingComponent,
} from '../../../shared/components/fxdonad-shared/trending/trending.component';

@Component({
  selector: 'app-using-trending',
  imports: [TrendingComponent],
  templateUrl: './using-trending.component.html',
  styleUrl: './using-trending.component.scss',
})
export class UsingTrendingComponent {
  // Trong component cha
  trendingData: TrendingItem[] = [
    { name: 'Angular', views: 15000 },
    { name: 'React', views: 12000 },
    { name: 'Vue', views: 8000 },
    { name: 'TypeScript', views: 5000 },
    { name: 'JavaScript', views: 20000 },
  ];
}
