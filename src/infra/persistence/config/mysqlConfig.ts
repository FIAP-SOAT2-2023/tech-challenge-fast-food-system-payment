import PaymentModel from "../models/paymentModel";

export default () => {
  // Criação da tabela no banco de dados
  /*
  basketsModel.sync();
  itensModel.sync();
  productsModel.sync();
  customerModel.sync();
  addressModel.sync();
  OrderModel.sync();

   */
  PaymentModel.sync();
  //OrderStatusModel.sync();
};
