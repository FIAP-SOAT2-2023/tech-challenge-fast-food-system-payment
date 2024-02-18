import PaymentStatus from "../../../framework/enum/paymentStatus";
import OrderStatusKey from "../../../framework/enum//orderStatus";
import { Payment } from "../../domain/entities/payment";
import IPaymentRepository from "../../domain/repositories/paymentRepository";
import { IPaymentUseCase } from "../../domain/usecases/IPaymentUseCase";
import "dotenv/config";
import {
  IPaymentExternalGateway,
  PaymentExternalGateway,
} from "./../../../framework/gateways/PaymentExternalGateway";
import { IPreparationApi } from "src/framework/api/PreparationApi";
import { Preparation } from "src/core/domain/entities/preparation";

export class PaymentUseCase implements IPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentExternalGateway: IPaymentExternalGateway,
    private readonly preparationApi: IPreparationApi
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

      var AWS = require("aws-sdk");
      // Set the region
      AWS.config.update({ region: process.env.AWS_REGION });

      // Create an SQS service object
      var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

      var params = {
        MessageBody: response,
        QueueUrl:
          "https://sqs.us-east-1.amazonaws.com/339713107443/Pagamento01-basico.fifo",
        DelaySeconds: 0,
      };

      sqs.createQueue(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.QueueUrl);
        }
      });

      resolve(response);
    });
  }

  getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.paymentRepository.getPaymentByOrderId(orderId);
  }

  updatePaymentStatusByNsu(body: Payment): Promise<Payment> {
    return new Promise<Payment>(async (resolve) => {
      const payment = await this.paymentRepository.updatePaymentStatusByNsu(
        body
      );

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
    });
  }
}
