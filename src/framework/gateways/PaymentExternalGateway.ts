import { Payment } from 'core/domain/entities/payment';
import { IMercadoPagoProvider } from '../../infra/providers/mercadopago/MercadoPagoProvider';

export interface IPaymentExternalGateway {

    create(payment:Payment ): Promise<string>

}

export class PaymentExternalGateway implements IPaymentExternalGateway {

    private readonly mercadoPagoProvider: IMercadoPagoProvider

    constructor(mercadoPagoProvider: IMercadoPagoProvider) {
        this.mercadoPagoProvider = mercadoPagoProvider;
    }

    public async create(payment:Payment): Promise<string> {
        const totalValue = payment?.totalPrice || 0
        const paymentId = payment.id

        return await this.mercadoPagoProvider.createPayment(totalValue, paymentId)


    }



}