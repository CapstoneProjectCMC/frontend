import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseRoutingModule } from './exercise-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, // <-- Tích hợp route vào module
    ExerciseRoutingModule,
  ],
})
export class ExerciseModule {}
