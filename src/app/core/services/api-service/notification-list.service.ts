import { Injectable } from '@angular/core';

import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import {
  GetAllNoticeResponse,
  ReadStatusNotice,
} from '../../models/notice.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationListService {
  constructor(private api: ApiMethod) {}
  getAllMyNotification(
    page: number,
    size: number,
    statusRead: ReadStatusNotice
  ) {
    return this.api.get<
      ApiResponse<IPaginationResponse<GetAllNoticeResponse[]>>
    >(
      API_CONFIG.ENDPOINTS.GET.GET_ALL_MY_NOTIFICATIONS(page, size, statusRead)
    );
  }

  markAsReadNotification(Ids: string[]) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.MARK_AS_READ_NOTIFICATION,
      Ids
    );
  }
}
