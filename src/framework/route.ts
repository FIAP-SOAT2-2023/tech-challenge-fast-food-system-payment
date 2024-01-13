import { Payment } from "../core/domain/entities/payment";
import {
  IPaymentExternalGateway,
  PaymentExternalGateway,
} from "./gateways/PaymentExternalGateway";

import express, { Request, Response, NextFunction } from "express";

import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../infra/docs/swagger";

import { PaymentRepository } from "../infra/persistence/repositories/paymentRepository";
import IPaymentRepository from "../core/domain/repositories/paymentRepository";
import { PaymentUseCase } from "../core/applications/usecases/paymentUseCase";
import { PaymentController } from "./controllers/paymentController";
import {
  IMercadoPagoProvider,
  MercadoPagoProviderImpl,
} from "../infra/providers/mercadopago/MercadoPagoProvider";

export interface Error {
  message?: string;
}
export class Route {
  static async asyncWrapper(
    req: Request,
    res: Response,
    next: NextFunction,
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ): Promise<void> {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error:", error);
      if (res.headersSent) {
        return;
      }

      const errorValue = error as Error;
      const { message } = errorValue;

      if (message) {
        res.status(400).json({ error: [message] });
      } else {
        res.status(500).json({ error: ["Internal Server Error"] });
      }
    }
  }

  static Setup() {
    const paymentRepository: IPaymentRepository = new PaymentRepository();

    const mercadoPagoProvider: IMercadoPagoProvider = new MercadoPagoProviderImpl();
    const paymentExternalGateway: IPaymentExternalGateway = new PaymentExternalGateway(mercadoPagoProvider);

    const paymentUseCase = new PaymentUseCase(
      paymentRepository,
      paymentExternalGateway
    );

    const paymentController = new PaymentController(paymentUseCase);

    const app = express();
    app.use(express.json());

    app.use("/docs", swaggerUi.serve);
    app.get("/docs", swaggerUi.setup(swaggerDocs));

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/payment", async (req, resp, next) => {
      await Route.asyncWrapper(
        req,
        resp,
        next,
        paymentController.createPayment.bind(paymentController)
      );
    });

    app.post("/payment/webhook-notification", async (req, resp, next) => {
      await Route.asyncWrapper(
        req,
        resp,
        next,
        paymentController.updatePaymentStatusByNsu.bind(paymentController)
      );
    });

    app.get("/payment/:orderId", async (req, resp, next) => {
      await Route.asyncWrapper(
        req,
        resp,
        next,
        paymentController.getPaymentByOrderId.bind(paymentController)
      );
    });

    app.listen(3000, () =>
      console.log(
        "Server is listening on port 3000 \n SWAGGER: http://localhost:3000/docs"
      )
    );
  }
}
