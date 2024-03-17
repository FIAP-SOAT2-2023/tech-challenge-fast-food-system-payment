import db from "../database/connection";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    Association,
    DataTypes,
    UUIDV4,
    UUID,
    Sequelize
} from 'sequelize';


class PaymentModel extends Model<InferAttributes<PaymentModel>, InferCreationAttributes<PaymentModel>> {

    declare id: CreationOptional<number>

    declare uuid: CreationOptional<string>

    declare orderId: CreationOptional<string>

    declare paymentId: CreationOptional<string>

    declare status: CreationOptional<string>

    declare paidAt: CreationOptional<Date>

    declare nsu: CreationOptional<number>

    declare qrCode: CreationOptional<string>

    declare createdAt: CreationOptional<Date>

    declare updatedAt: CreationOptional<Date>

    declare totalPrice: CreationOptional<number>

    declare checkoutUrl: CreationOptional<string>

    declare basketOrigin: CreationOptional<string>
}

PaymentModel.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        orderId: {
            type: DataTypes.STRING,
        },
        paymentId: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "PENDING"
        },
        nsu: {
            type: DataTypes.STRING,
            allowNull: true
        },
        qrCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paidAt: {
            type: DataTypes.DATE
        },

        totalPrice: {
            type: DataTypes.DOUBLE.UNSIGNED,
        },

        checkoutUrl: {
            type: DataTypes.STRING,
        },

        basketOrigin: {
            type: DataTypes.TEXT,


        },


        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: db,
        modelName: "Payments",
    })

export default PaymentModel