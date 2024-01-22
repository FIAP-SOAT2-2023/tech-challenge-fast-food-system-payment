export interface Payment {
  id?: number;
  orderId?: number;
  qrCode?: string;
  nsu?: number;
  status?: string;
  paidAt?: Date;
  totalPrice?: number;
  checkoutUrl?: string
}
