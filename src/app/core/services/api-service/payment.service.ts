import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleScriptCheckPaid } from '../../../../environments/environment.secret';
import { ApiMethod } from '../config-service/api.methods';
import { ITransactionStatus } from '../../models/service-and-payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient, private api: ApiMethod) {}

  checkTransactionStatus() {
    return this.http.get<ITransactionStatus>(googleScriptCheckPaid);
  }
}
