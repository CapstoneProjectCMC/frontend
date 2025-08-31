import { SidebarItem } from '../../models/data-handle';

export function sidebarPaymentRouter(role: string): SidebarItem[] {
  return [
    {
      id: 'payment',
      path: '/service-and-payment/payment',
      label: 'Nạp tiền',
      icon: 'fa-solid fa-qrcode',
    },
    {
      id: 'transaction-history',
      path: '/service-and-payment/transaction-history',
      label: 'Lịch sử giao dịch',
      icon: 'fas fa-bookmark',
    },
    {
      id: 'purchase-history',
      path: '/service-and-payment/purchase-history',
      label: 'Lịch sử giao dịch',
      icon: 'fa-solid fa-cart-shopping',
    },
  ];
}
