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
