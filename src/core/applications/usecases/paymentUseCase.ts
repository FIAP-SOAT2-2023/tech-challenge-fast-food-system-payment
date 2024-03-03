import PaymentStatus from "../../../framework/enum/paymentStatus";
import OrderStatusKey from "../../../framework/enum//orderStatus";
import { Payment } from "../../domain/entities/payment";
import IPaymentRepository from "../../domain/repositories/paymentRepository";
import { IPaymentUseCase } from "../../domain/usecases/IPaymentUseCase";
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
  ) {}

  async createPayment(paymentNew: Payment): Promise<Payment> {
    return new Promise<Payment>(async (resolve) => {
      const payment = await this.paymentRepository.createPayment(paymentNew);
      const checkoutUrl = await this.paymentExternalGateway.create(payment);

      payment.checkoutUrl = checkoutUrl;
      const paymentUpdate = await this.paymentRepository.updatePayment(payment);

      const response = {
        ...paymentUpdate,
        qrCode: undefined,
        paidAt: undefined,
      };

      const sqsClient = new SQSClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESSKEY,
          secretAccessKey: process.env.AWS_SECRETKEY,
        },
      });

      const params = {
        QueueUrl: process.env.AWS_PAYMENT_QUEE01,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 20,
      };

      try {
        const receiveMessageCommand = new ReceiveMessageCommand(params);
        const readMessage = await sqsClient.send(receiveMessageCommand);
        if (readMessage.Messages && readMessage.Messages.length > 0) {
          for (const message of readMessage.Messages) {
            console.log("Corpo da Mensagem:", message.Body);
            if (message.Body !== undefined) {
              const params2 = {
                QueueUrl: process.env.AWS_ORDER_QUEE01,
                MessageBody: ` Detalhes do pedido:  
                ${message.Body}`,
                MessageGroupId: process.env.AWS_GRUPO01,
              };
              const command = new SendMessageCommand(params2);
              const response2 = await sqsClient.send(command);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao receber mensagens da fila:", error);
      }

      resolve(response);
    });
  }

  getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.paymentRepository.getPaymentByOrderId(orderId);
  }

  updatePaymentStatusByNsu(body: Payment): Promise<Payment> {
    return new Promise<Payment>(async (resolve) => {
      const payment = this.paymentRepository.updatePaymentStatusByNsu(body);

      let orderStatus: string;

      if (body.status === PaymentStatus.APPROVED) {
        orderStatus = OrderStatusKey.PREPARATION;
      } else {
        orderStatus = OrderStatusKey.CANCELLED;
      }

      //Chamar o serviço de preparação (cozinha)

      resolve(payment);
    });
  }
}
