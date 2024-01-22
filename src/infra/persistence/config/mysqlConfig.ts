import PaymentModel from "../models/paymentModel";

export default () => {
  // Criação da tabela no banco de dados
  /*
   */
  PaymentModel.sync();
};
