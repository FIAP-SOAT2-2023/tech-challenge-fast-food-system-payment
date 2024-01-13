
import { Payment } from '../../domain/entities/payment';
import IPaymentRepository from '../../domain/repositories/paymentRepository';
import { IPaymentUseCase } from '../../domain/usecases/IPaymentUseCase';

import { IPaymentExternalGateway, PaymentExternalGateway } from './../../../framework/gateways/PaymentExternalGateway';


export class PaymentUseCase implements IPaymentUseCase {
  
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentExternalGateway: IPaymentExternalGateway
    
  ) {}

  async createPayment(paymentNew: Payment): Promise<Payment> {
    return new Promise<Payment> (async (resolve) =>
    {
        const payment = await this.paymentRepository.createPayment(paymentNew)

        const checkoutUrl = await this.paymentExternalGateway.create(payment)
        payment.checkoutUrl = checkoutUrl;

        resolve(payment);
    })
  }
  
  getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.paymentRepository.getPaymentByOrderId(orderId);
  }
 
  updatePaymentStatusByNsu(body: Payment): Promise<Payment> {
    return this.paymentRepository.updatePaymentStatusByNsu(body);
  }
}
