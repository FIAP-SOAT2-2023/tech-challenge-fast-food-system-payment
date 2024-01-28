import { Preparation } from "../../core/domain/entities/preparation";

export interface IPreparationApi {
    create(preparation: Preparation): Promise<Preparation>;
}

export class PreparationApi implements IPreparationApi {
    public async create(preparation: Preparation): Promise<Preparation> {
        try {
            const newPreparationData = { paymentId: preparation.paymentId, status: preparation.status };
            const apiUrl = process.env.PREPARATION_HOST + "/api/orders/create";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPreparationData),
            };

            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`Erro na solicitação: ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("Dados da resposta:", responseData);
            return responseData;
        } catch (error) {
            console.error("Erro na solicitação:", error);
            throw error;
        }
    }
}
