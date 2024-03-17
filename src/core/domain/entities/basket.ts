export interface Basket {
  uuid?: string;
  customer?: any;
  totalPrice?: number;
  isTakeOut?: boolean;
  createdAt?: Date;
  items?: any[];
  order?: any;
  payment?: any;
  checkoutUrl?: string;
  product?: any[];
}
