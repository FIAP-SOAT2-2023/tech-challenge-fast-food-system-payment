
import PaymentStatus from '../../../framework/enum/paymentStatus';
import OrderStatusKey from '../../../framework/enum//orderStatus';
import { Payment } from '../../domain/entities/payment';
import IPaymentRepository from '../../domain/repositories/paymentRepository';
import { IPaymentUseCase } from '../../domain/usecases/IPaymentUseCase';

import { IPaymentExternalGateway, PaymentExternalGateway } from './../../../framework/gateways/PaymentExternalGateway';
import { IPreparationApi } from 'src/framework/api/PreparationApi';
import { Preparation } from 'src/core/domain/entities/preparation';


export class PaymentUseCase implements IPaymentUseCase {
  
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentExternalGateway: IPaymentExternalGateway,
    private readonly preparationApi: IPreparationApi
    
  ) {}

  async createPayment(paymentNew: Payment): Promise<Payment> {
    return new Promise<Payment> (async (resolve) =>
    { 
        const payment = await this.paymentRepository.createPayment(paymentNew)
        const checkoutUrl = await this.paymentExternalGateway.create(payment)

        payment.checkoutUrl = checkoutUrl;
        const paymentUpdate =await this.paymentRepository.updatePayment(payment)

        const response = {
          ...paymentUpdate,
          qrCode: undefined,
          paidAt: undefined,
      };

        resolve(response);
    })
  }
  
  getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.paymentRepository.getPaymentByOrderId(orderId);
  }
 
  updatePaymentStatusByNsu(body: Payment): Promise<Payment> {
    return new Promise<Payment> (async (resolve) =>
    { 
      const payment = await this.paymentRepository.updatePaymentStatusByNsu(body);

      let orderStatus: string;

      if (body.status === PaymentStatus.APPROVED) {
          orderStatus = OrderStatusKey.PREPARATION;
      } else {
          orderStatus = OrderStatusKey.CANCELLED;
      }
      
      const preparationData: Preparation = {
          paymentId: body.nsu,
          status: orderStatus,  
      };
      
      await this.preparationApi.create(preparationData);

      resolve(payment);
  })
}
}
