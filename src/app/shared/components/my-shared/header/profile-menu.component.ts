import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
})
export class ProfileMenuComponent {
  @Input() isVisible: boolean = false;
  @Output() logout = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isVisible &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeMenu.emit();
    }
  }

  onLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('token_scope');
    localStorage.removeItem('user_info');
    this.logout.emit();
  }
}
