import mercadopago from "./config/MercadoPagoConfig";

export interface IMercadoPagoProvider {
    createPayment(valor: number, identifier: number): Promise<string>
    
};

export class MercadoPagoProviderImpl implements IMercadoPagoProvider {

    public async createPayment(valor:number, identifier: number): Promise<string> {
        let preference = {
            external_reference: identifier,
            items: [
                {
                    title: 'Fast Food - Compras',
                    unit_price: valor,
                    quantity: 1,
                }
            ]
        }

        try {
            const preferenceResult = await mercadopago.preferences.create(preference);

            const { response } = preferenceResult

            return response.init_point;
        } catch (err) {
            console.error("Mercado Pago Provider Error: ", err)
            throw new Error()
        }
    }
}
