import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleScriptCheckPaid } from '../../../../environments/environment.secret';
import { ApiMethod } from '../config-service/api.methods';
import {
  ITransactionStatus,
  PurchaseHistoryResponse,
  TransactionHistoryResponse,
  TransactionRequest,
  TransactionResponse,
  WalletResponse,
} from '../../models/service-and-payment';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient, private api: ApiMethod) {}

  checkTransactionStatus() {
    return this.http.get<ITransactionStatus>(googleScriptCheckPaid);
  }

  requestTopUp(data: TransactionRequest) {
    return this.api.post<ApiResponse<TransactionResponse>>(
      API_CONFIG.ENDPOINTS.POST.TOPUP,
      data
    );
  }

  purchaseItem(data: TransactionRequest) {
    return this.api.post<ApiResponse<TransactionResponse | null>>(
      API_CONFIG.ENDPOINTS.POST.PURCHASE,
      data
    );
  }

  getMyWallet() {
    return this.api.get<ApiResponse<WalletResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_MY_WALLET
    );
  }

  getMyPurchaseHistory(page: number, size: number) {
    return this.api.get<
      ApiResponse<IPaginationResponse<PurchaseHistoryResponse[]>>
    >(API_CONFIG.ENDPOINTS.GET.GET_HISTORY_PURCHASE(page, size));
  }

  getTransactionHistory(page: number, size: number) {
    return this.api.get<
      ApiResponse<IPaginationResponse<TransactionHistoryResponse[]>>
    >(API_CONFIG.ENDPOINTS.GET.GET_TRANSACTION_HISTORY(page, size));
  }
}
