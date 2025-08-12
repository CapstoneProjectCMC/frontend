// landing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, // <-- Tích hợp route vào module
    OrganizationRoutingModule,
  ],
})
export class OrganizationModule {}
