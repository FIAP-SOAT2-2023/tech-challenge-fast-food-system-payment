export interface Payment {
  id?: number;
  orderId?: string;
  paymentId?: string;
  qrCode?: string;
  nsu?: number;
  status?: string;
  paidAt?: Date;
  totalPrice?: number;
  checkoutUrl?: string;
  basketOrigin?: string;
}
