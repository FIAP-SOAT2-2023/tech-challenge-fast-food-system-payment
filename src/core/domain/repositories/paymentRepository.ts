import {Payment} from "../entities/payment";

export default interface IPaymentRepository {
  createPayment(paymentNew: Payment): Promise<Payment>
  updatePaymentStatusByOrderId(body: Payment): Promise<Payment>
  getPaymentByOrderId(orderId: string): Promise<Payment>
  updatePayment(paymentNew: Payment): Promise<Payment>
  reversedPaymentById(paymentId: string): Promise<Payment>
}