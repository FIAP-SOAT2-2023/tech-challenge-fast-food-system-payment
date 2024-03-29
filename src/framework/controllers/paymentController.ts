import { Request, Response } from "express";
import {PaymentUseCase} from "../../core/applications/usecases/paymentUseCase";


export class PaymentController {

  constructor(private readonly paymentStatusUseCase: PaymentUseCase) { }

  async createPayment(req: Request, res: Response) {
    const body = req.body
    const result = await this.paymentStatusUseCase.createPayment(body);

    res.status(200).json(result);
  }

  async updatePaymentStatusByOrderId(req: Request, res: Response) {
    const body = req.body
    const result = await this.paymentStatusUseCase.updatePaymentStatusByOrderId(body);

    res.status(200).json(result);
  }

  async getPaymentByOrderId(req: Request, res: Response) {
    const orderId = req.params.orderId    

    const result = await this.paymentStatusUseCase.getPaymentByOrderId(orderId);

    res.status(200).json(result);
  }
}
