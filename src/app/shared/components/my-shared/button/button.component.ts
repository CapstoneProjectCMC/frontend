import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() onClick: () => void = () => {};
  @Input() width: string = '40px';
  @Input() height: string = '40px';
  @Input() variant: 'solid' | 'outline' = 'solid'; // loại button
}
