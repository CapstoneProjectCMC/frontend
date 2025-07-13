import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { sendNotification } from '../../../utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
})
export class ProfileMenuComponent {
  @Input() isVisible: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  status = '';
  loading = false;
  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private store: Store
  ) {}

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
    this.loading = true;
    this.authService.logout().subscribe({
      next: (res) => {
        this.loading = false;
        this.status = res.status;
        sendNotification(this.store, 'Thông báo', res.message, 'success');
      },
      error: (err) => {
        this.loading = false;
        console.log('lỗi logout');
      },
    });
  }
}
