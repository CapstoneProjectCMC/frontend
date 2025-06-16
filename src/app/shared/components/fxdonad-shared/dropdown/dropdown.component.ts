import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InteractiveButtonComponent } from '../button/button.component';
import { truncateString } from '../../../utils/stringProcess';

interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown-button',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveButtonComponent],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownButtonComponent,
      multi: true,
    },
  ],
})
export class DropdownButtonComponent
  implements AfterViewInit, OnInit, ControlValueAccessor
{
  @Input() title_label: string = '';
  @Input() label: string = 'Select Option';
  @Input() options: DropdownOption[] = [];
  @Input() variant: 'primary' | 'secondary' | 'outlined' | 'text' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() customDropField:
    | 'first-type'
    | 'year-filter'
    | 'third-type'
    | 'second-type'
    | 'four-type'
    | 'first-type' = 'first-type';
  @Input() minHeight: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiSelect: boolean = false;
  @Input() isDisplayCheckbox: boolean = false;
  @Input() isDisplaySelectedOpptionLabels: boolean = false;
  @Input() isButtonControl: boolean = false;
  @Input() isSearchable: boolean = false; // Cho phép bật/tắt tìm kiếm
  @Input() isOpen: boolean = false;
  @Input() needIndexColor: boolean = true;

  @Output() onSelect = new EventEmitter<DropdownOption | DropdownOption[]>();
  @Output() onOpen = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  @ViewChild('dropdownButton') dropdownButton!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  selectedIndex: number = -1;
  selectedOptions: DropdownOption[] = [];
  onChange: any = () => {};
  onTouch: any = () => {};
  loading = false;
  searchTerm: string = '';
  filteredOptions: DropdownOption[] = [];

  handleClick(event: any): void {
    console.log('Button clicked!', event);
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  handleCancel(event: any): void {
    this.selectedOptions = [];
  }

  handleHover(isHovered: boolean): void {
    console.log('Button hover:', isHovered);
  }

  handleFocus(isFocused: boolean): void {
    console.log('Button focus:', isFocused);
  }

  ngOnInit(): void {
    this.setupKeyboardNavigation();
    this.filteredOptions = [...this.options]; // Sao chép danh sách ban đầu
  }
  ngAfterViewInit(): void {
    this.setupKeyboardNavigation();
  }

  // Hàm này phục vụ việc tránh mở nhiều dropdown cùng lúc, nếu mở nhiều thì không cần gọi
  onToggle() {
    this.toggle.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      !this.dropdownButton.nativeElement.contains(target) &&
      !this.dropdownMenu.nativeElement.contains(target)
    ) {
      this.closeDropdown();
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onOpen.emit();
    } else {
      this.onClose.emit();
    }
  }

  get selectedLabels(): string {
    if (
      this.isDisplaySelectedOpptionLabels &&
      this.selectedOptions.length > 0
    ) {
      if (this.selectedOptions.length > 3) {
        return `${this.selectedOptions
          .slice(0, 3)
          .map((o) => o.label)
          .join(', ')} ...`;
      }
      return this.selectedOptions.map((o) => o.label).join(', ');
    }
    return this.label;
  }

  truncateString(str: string, length: number) {
    return truncateString(str, length);
  }

  filterOptions(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.options]; // Nếu không nhập gì, hiển thị lại tất cả
    } else {
      const lowerSearch = this.searchTerm.toLowerCase().trim();
      this.filteredOptions = this.options.filter((option) =>
        option.label.toLowerCase().includes(lowerSearch)
      );
    }
  }

  selectOption(option: DropdownOption, index: number): void {
    if (option.disabled) return;

    if (this.multiSelect) {
      const exists = this.selectedOptions.some((o) => o.value === option.value);
      if (exists) {
        this.selectedOptions = this.selectedOptions.filter(
          (o) => o.value !== option.value
        );
      } else {
        this.selectedOptions.push(option);
      }

      this.onSelect.emit(this.selectedOptions);
      this.onChange(this.selectedOptions.map((opt) => opt.value));
    } else {
      // Nếu option hiện tại đã được chọn, thì bỏ chọn nó
      // this.onToggle(); //tránh phải click 2 lần mới mở lại được
      // if (
      //   this.selectedOptions.length &&
      //   this.selectedOptions[0].value === option.value
      // ) {
      //   this.selectedOptions = [];
      //   this.selectedIndex = -1;
      //   this.onSelect.emit([]);
      //   this.onChange(null);
      // } else {
      this.selectedOptions = [option];
      this.selectedIndex = index;
      this.onSelect.emit(option);
      this.onChange(option.value);
      // }
      this.closeDropdown();
    }

    this.onTouch();
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedOptions.some((o) => o.value === option.value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    const target = event.target as HTMLElement;
    const isInputField =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.onOpen.emit();
        } else if (this.selectedIndex >= 0) {
          this.selectOption(
            this.options[this.selectedIndex],
            this.selectedIndex
          );
        }
        break;

      case ' ':
        if (!isInputField) {
          event.preventDefault();
          if (!this.isOpen) {
            this.isOpen = true;
            this.onOpen.emit();
          }
        }
        break;

      case 'Escape':
        this.closeDropdown();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.onOpen.emit();
        }
        this.navigateOptions(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.onOpen.emit();
        }
        this.navigateOptions(-1);
        break;
    }
  }

  private navigateOptions(direction: number): void {
    const newIndex = this.selectedIndex + direction;
    if (newIndex >= 0 && newIndex < this.options.length) {
      this.selectedIndex = newIndex;
    }
  }

  private closeDropdown(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.onClose.emit();
      this.onToggle(); //tránh phải click 2 lần mới mở lại được
    }
  }

  writeValue(value: any): void {
    if (this.multiSelect && Array.isArray(value)) {
      this.selectedOptions = this.options.filter((option) =>
        value.includes(option.value)
      );
    } else {
      const option = this.options.find((option) => option.value === value);
      this.selectedOptions = option ? [option] : [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private setupKeyboardNavigation(): void {
    if (!this.dropdownButton || !this.dropdownButton.nativeElement) {
      return;
    }

    this.dropdownButton.nativeElement.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          this.closeDropdown();
        }
      }
    );
  }
}
