import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/fxdonad-shared/input/input';
import { InteractiveButtonComponent } from '../../../shared/components/fxdonad-shared/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-using-input-button',
  imports: [CommonModule, InputComponent, InteractiveButtonComponent],
  templateUrl: './using-input-button.component.html',
  styleUrl: './using-input-button.component.scss',
})
export class UsingInputButtonComponent {
  username: string = '';
  searchIcon = '/icon-assets/search-icon.svg';
  usernameError: string | null = null;
  follow = false;

  handleInputChange(value: string | number): void {
    this.username = value.toString();

    // // Validate input
    // if (!this.username) {
    //   this.usernameError = 'Không được để trống';
    // } else if (this.username.length < 3) {
    //   this.usernameError = 'Tối thiểu 3 ký tự';
    // } else {
    //   this.usernameError = null;
    // }

    // Emit changes if needed
    console.log('Input changed:', this.username);
  }

  onClick() {
    console.log('Clicked');
    this.follow = !this.follow;
  }
}
