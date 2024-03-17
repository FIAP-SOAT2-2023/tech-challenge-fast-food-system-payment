
import { Op } from "sequelize";
import IPaymentRepository from "../../../core/domain/repositories/paymentRepository";
import {Payment} from "../../../core/domain/entities/payment";
import PaymentModel from "../models/paymentModel";

export class PaymentRepository implements IPaymentRepository {
    
    async getPaymentByOrderId(orderId: string): Promise<Payment> {
        return new Promise<Payment> (async  (resolve, reject) =>  {            
            
            const paymentModel = await PaymentModel.findOne({
                where: {
                    [Op.or]: [
                        { uuid: orderId },
                        { nsu: orderId }
                    ]                  
                },
            });            

            if (paymentModel == null) {

                reject(new Error("pagamento não cadastrado"))
        
                return
            }

            const { ...paymentValues } = paymentModel?.dataValues;

            const paymentResult: Payment = {
                ...paymentValues
            }            

            resolve(paymentResult)
        })
    }

    async createPayment(paymentNew: Payment): Promise<Payment> {

        return new Promise<Payment> (async  (resolve ) =>  {
            
            paymentNew.nsu = Math.floor(Math.random() * 1000000);
            let paymentCreated: PaymentModel = await PaymentModel.create(paymentNew);

            const {id:idPayment, createdAt, updatedAt, ...paymentValues} =  paymentCreated.dataValues
    
            const payment: Payment = {
                ...paymentValues
            }

            resolve(payment)
        })
    }

    async updatePaymentStatusByOrderId(body: Payment): Promise<Payment> {
        
        return new Promise<Payment> (async  (resolve ) => {
        
            const payment = await PaymentModel.findOne({
                where: {
                    orderId: body.orderId
                }
            });

            if (!payment) {
                throw new Error('Nsu não encontrado.');
            }

            const paymentUpdated = await payment.update({
                status: body.status,
                paidAt: new Date()
            })

            resolve(paymentUpdated.dataValues)
        })
    }

    async updatePayment(body: Payment): Promise<Payment> {
        return new Promise<Payment>(async (resolve) => {
            const payment = await PaymentModel.findOne({
                where: {
                    nsu: body.nsu,
                },
            });
    
            if (!payment) {
                throw new Error('Nsu não encontrado.');
            }
    
            const keysToUpdate = Object.keys(body);
    
            const updates: Record<string, unknown> = {};
            for (const key of keysToUpdate) {
                updates[key] = body[key];
            }
    
            const paymentUpdated = await payment.update(updates);
    
            resolve({
                ...paymentUpdated.get(),
            });
        });
    }
}