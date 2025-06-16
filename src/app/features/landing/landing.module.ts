// landing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module'; // <-- Import ở đây
import { LandingHeader } from './components/header/header';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LandingRoutingModule, // <-- Tích hợp route vào module
    LandingHeader,
  ],
})
export class LandingModule {}
