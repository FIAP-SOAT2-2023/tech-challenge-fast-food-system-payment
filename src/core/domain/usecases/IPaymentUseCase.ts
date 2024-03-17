import { Payment } from "../entities/payment";


export interface IPaymentUseCase {

    updatePaymentStatusByOrderId(body: Payment): Promise<Payment>

    getPaymentByOrderId(orderId: string): Promise<Payment>

    createPayment(paymentNew: Payment): Promise<Payment>

    reversedPaymentById(paymentId: string): Promise<Payment>

}
