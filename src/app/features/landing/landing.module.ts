// landing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module'; // <-- Import ở đây
import { HeaderComponent } from '../../shared/components/my-shared/header/header';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LandingRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class LandingModule {}
