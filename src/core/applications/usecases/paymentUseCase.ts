import PaymentStatus from "../../../framework/enum/paymentStatus";
import OrderStatusKey from "../../../framework/enum//orderStatus";
import {Payment} from "../../domain/entities/payment";
import IPaymentRepository from "../../domain/repositories/paymentRepository";
import {IPaymentUseCase} from "../../domain/usecases/IPaymentUseCase";
import {
    IPaymentExternalGateway,
    PaymentExternalGateway,
} from "./../../../framework/gateways/PaymentExternalGateway";
import {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import "dotenv/config";

export class PaymentUseCase implements IPaymentUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly paymentExternalGateway: IPaymentExternalGateway
    ) {
    }

    async createPayment(paymentNew: Payment): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            const payment = await this.paymentRepository.createPayment(paymentNew);
            const checkoutUrl = await this.paymentExternalGateway.create(payment);

            payment.checkoutUrl = checkoutUrl;
            const paymentUpdate = await this.paymentRepository.updatePayment(payment);

            const response = {
                ...paymentUpdate,
                qrCode: undefined,
                paidAt: undefined,
            };

            resolve(response);
        });
    }

    getPaymentByOrderId(orderId: string): Promise<Payment> {
        return this.paymentRepository.getPaymentByOrderId(orderId);
    }

    updatePaymentStatusByOrderId(body: Payment): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            const payment = await this.paymentRepository.updatePaymentStatusByOrderId(body);

            if (!payment){
                reject('Pagamento não encontrado');
            }


            const sqsClient = new SQSClient({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESSKEY,
                    secretAccessKey: process.env.AWS_SECRETKEY,
                },
            });

            if (payment.status != PaymentStatus.APPROVED) {

                await this.sendCompensationMessage(sqsClient, payment);
                resolve(payment);
                return

            }


            const bodyJson = JSON.stringify(JSON.parse(payment.basketOrigin));

            try {

                console.debug("Enviando mensagem para fila de pagamento", bodyJson);

                const command = new SendMessageCommand({
                    QueueUrl: process.env.AWS_PAYMENT_QUEE01,
                    MessageBody: bodyJson,
                    MessageGroupId: process.env.AWS_GRUPO01,
                    MessageDeduplicationId: payment?.orderId,
                });

                const responseCreated = await sqsClient.send(command);

                console.log("Mensagem enviada com sucesso:", responseCreated);
            } catch (error) {
                console.error("Erro ao receber mensagens da fila:", error);
                await this.sendCompensationMessage(sqsClient, payment)

            }


            resolve(payment);
        });
    }

     async sendCompensationMessage(sqsClient: SQSClient, payment: Payment) {
        console.error('Enviando mensagem para fila de compensação');
        // Enviar mensagem para fila de compensação
        await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.AWS_COMPESATION_ORDER_QUEE01,
            MessageBody: JSON.stringify(payment),
            MessageDeduplicationId: payment?.orderId,
            MessageGroupId: 'compensation'
        }));
    }
}
