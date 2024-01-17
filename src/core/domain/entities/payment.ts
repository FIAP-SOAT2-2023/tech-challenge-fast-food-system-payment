export interface Payment {
  id?: number;
  qrCode?: string;
  nsu?: string;
  status?: string;
  paidAt?: Date;
  totalPrice?: number;
  checkoutUrl?: string
}
