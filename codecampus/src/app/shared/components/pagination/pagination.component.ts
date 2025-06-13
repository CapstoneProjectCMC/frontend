import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalData: number = 0;
  @Input() amountDataPerPage: number = 10;
  @Input() currentPageIndex: number = 1;
  @Output() onPageChange = new EventEmitter<number>();

  totalPages: number = 0;
  canPressStart: boolean = false;
  canPressEnd: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalData'] || changes['amountDataPerPage']) {
      this.totalPages = Math.ceil(this.totalData / this.amountDataPerPage);
    }
    if (changes['currentPageIndex']) {
      this.currentPageIndex = changes['currentPageIndex'].currentValue || 1;
    }
    this.checkPress();
  }

  pageIndex(pageNumber: number) {
    if (
      pageNumber >= 1 &&
      pageNumber <= this.totalPages &&
      pageNumber !== this.currentPageIndex
    ) {
      this.currentPageIndex = pageNumber; // Cập nhật UI
      this.onPageChange.emit(this.currentPageIndex); // Gửi sự kiện ra ngoài
      this.checkPress();
    }
  }

  generatePageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 1) return pages;

    pages.push(1);

    if (this.totalPages >= 10) {
      if (this.currentPageIndex <= 5) {
        for (let i = 2; i <= Math.min(7, this.totalPages - 1); i++) {
          pages.push(i);
        }
        if (this.totalPages > 8) pages.push('...');
      } else if (
        this.currentPageIndex > 5 &&
        this.currentPageIndex < this.totalPages - 4
      ) {
        pages.push('...');
        for (
          let i = this.currentPageIndex - 2;
          i <= this.currentPageIndex + 2;
          i++
        ) {
          pages.push(i);
        }
        pages.push('...');
      } else {
        pages.push('...');
        for (let i = this.totalPages - 6; i < this.totalPages; i++) {
          pages.push(i);
        }
      }
    } else {
      for (let i = 2; i <= Math.min(8, this.totalPages - 1); i++) {
        pages.push(i);
      }
    }

    if (this.totalPages > 1) pages.push(this.totalPages);
    return pages;
  }

  checkPress() {
    this.canPressStart = this.currentPageIndex > 1;
    this.canPressEnd = this.currentPageIndex < this.totalPages;
  }
}
