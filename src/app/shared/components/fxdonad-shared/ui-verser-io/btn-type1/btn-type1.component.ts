import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-type1',
  imports: [],
  templateUrl: './btn-type1.component.html',
  styleUrl: './btn-type1.component.scss',
})
export class BtnType1Component {
  @Input() thumb: string = 'btn';
  @Input() thumbSize: number = 12;
  @Input() description: string = 'Mô tả';
}
