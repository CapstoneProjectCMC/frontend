import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/fxdonad-shared/pagination/pagination.component'; // Chỉnh đường dẫn
import { avatarUrlDefault } from '../../../../core/constants/value.constant'; // Chỉnh đường dẫn
import { PaymentService } from '../../../../core/services/api-service/payment.service';
import {
  ApiResponse,
  IPaginationResponse,
} from '../../../../core/models/api-response';
import { PurchaseHistoryResponse } from '../../../../core/models/service-and-payment';

interface PurchaseState {
  response?: ApiResponse<IPaginationResponse<PurchaseHistoryResponse[]>>;
  isLoading: boolean;
  error?: string;
}

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseHistoryComponent implements OnInit {
  pageIndex = 1;
  readonly pageSize = 4;
  avatarDefault = avatarUrlDefault;

  private pageSubject = new BehaviorSubject<number>(this.pageIndex);

  state$!: Observable<PurchaseState>;

  constructor(private purchaseService: PaymentService) {}

  ngOnInit(): void {
    this.state$ = this.pageSubject.asObservable().pipe(
      switchMap((page) =>
        this.purchaseService.getMyPurchaseHistory(page, this.pageSize).pipe(
          map((response) => ({ response, isLoading: false })),
          catchError((err) =>
            of({ isLoading: false, error: 'Không thể tải lịch sử mua hàng.' })
          ),
          startWith({ isLoading: true })
        )
      )
    );
  }

  goToPage(page: number): void {
    this.pageIndex = page;
    this.pageSubject.next(this.pageIndex);
  }

  handlePageChange(newPage: number): void {
    this.goToPage(newPage);
  }

  /**
   * Ánh xạ loại sản phẩm sang icon và text để hiển thị đẹp hơn
   * @param itemType Loại sản phẩm từ API
   * @returns Object chứa icon và text
   */
  mapItemType(itemType: string): { icon: string; text: string } {
    switch (itemType.toUpperCase()) {
      case 'QUIZ':
        return { icon: '📚', text: 'Bài tập trắc nghiệm' };
      case 'CODING':
        return { icon: '📝', text: 'Bài tập viết mã' };

      default:
        return { icon: '📦', text: 'Khác' };
    }
  }
}
