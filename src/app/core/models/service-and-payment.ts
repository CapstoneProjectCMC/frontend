import { UserBasicInfo } from './exercise.model';

//GoogleScript response
export interface ITransactionStatus {
  data: ITransaction[];
  error: boolean;
}
export interface ITransaction {
  'Mã GD': number;
  'Mô tả': string;
  'Giá trị': number;
  'Ngày diễn ra': string;
  'Số tài khoản': string;
  'Mã tham chiếu': string;
}
export interface IDepositGPData {
  amount: number;
  currency: 'GP';
  transactionCode: string;
  counterpartBankCode: string;
}

//topup request
export type TransactionRequest = {
  transactionId: string;
  referenceId: string | null;
  amount: number;
  currency: string;

  itemId: string | null;
  itemType: 'COURSE' | 'SUBSCRIPTION' | null;
  itemPrice: number | null;
  itemName: string | null;
};

export interface TransactionResponse extends TransactionRequest {
  status: string;
  paidAt: string;
  balanceAfter: number;
  payer: UserBasicInfo;
}

export type WalletResponse = {
  balance: number;
  owner: UserBasicInfo;
};

export type PurchaseHistoryResponse = {
  purchaseId: string;
  itemId: string;
  itemType: string;
  itemName: string;
  itemPrice: number;
  transactionId: string;
  buyer: UserBasicInfo;
};

export type TransactionHistoryResponse = {
  transactionId: string;
  referenceCode: string;
  transactionType: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
  user: UserBasicInfo;
};
