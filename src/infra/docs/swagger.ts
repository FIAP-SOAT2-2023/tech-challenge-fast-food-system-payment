const swaggerConfig = {
  openapi: "3.0.0",
  tags: [
    {
      name: "Payment",
    },
  ],
  paths: {
    "/payment/webhook-notification": {
      post: {
        summary: "Atualiza pagamento",
        parameters: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaymentWebHook",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Pagamento atualizado com sucesso",
          },
          404: {
            description: "Pagamento não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/payment/{orderId}": {
      get: {
        summary: "coleta o pagamento com o id do pedido",
        parameters: [
          {
            in: "path",
            name: "orderId",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID do pedido ou NSU do pedido",
          },
        ],
        responses: {
          200: {
            description: "Pagamento atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaymentInfo",
                },
              },
            },
          },
          404: {
            description: "Pagamento não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Payment: {
        type: "object",
        properties: {
          orderId: {
            type: "number",
            minimum: 2,
            maximum: 10,
            example: 125,
          },
          totalPrice: {
            type: "number",
            minimum: 2,
            maximum: 10,
            example: 1000,
          },
        },
      },
      PaymentWebHook: {
        type: "object",
        properties: {
          nsu: {
            type: "integer",
            maxLength: 100,
            minLength: 2,
            example: 1234,
          },
          status: {
            type: "string",
            enum: ["APPROVED", "REPROVED"],
          },
        },
      },
      PaymentInfo: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          uuid: {
            type: "string",
            format: "uuid",
          },
          status: {
            type: "string",
          },
          nsu: {
            type: "string",
          },
          qrCode: {
            type: "string",
          },
          paidAt: {
            type: "string",
            format: "date-time",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
  },
};

export default swaggerConfig;
