const swaggerConfig = {
  openapi: "3.0.0",
  tags: [
    {
      name: "Products",
    },
    {
      name: "Customers",
    },
    {
      name: "Checkout",
    },
  ],
  paths: {
    "/products": {
      get: {
        summary: "Retorna todos os produtos",
        tags: ["Products"],
        parameters: [
          {
            in: "query",
            name: "category",
            schema: {
              type: "string",
              enum: ["Lanche", "Acompanhamento", "Bebida", "Sobremesa"],
            },
            description: "Filtrar por categoria",
          },
        ],
        responses: {
          200: {
            description: "Lista de produtos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      post: {
        summary: "Cria um novo produto",
        tags: ["Products"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Produto criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/products/{id}": {
      put: {
        summary: "Atualiza um produto existente",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID do produto a ser atualizado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado com sucesso",
          },
          404: {
            description: "Produto não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        summary: "Retorna um produto pelo ID",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID do produto a ser recuperado",
          },
        ],
        responses: {
          200: {
            description: "Produto retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          404: {
            description: "Produto não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      delete: {
        summary: "Deleta um produto pelo ID",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID do produto a ser deletado",
          },
        ],
        responses: {
          200: {
            description: "Produto deletado com sucesso",
          },
          404: {
            description: "Produto não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/customers": {
      post: {
        summary: "Cria um novo cliente",
        tags: ["Customers"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Customer",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Customer",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/customers/{document}": {
      get: {
        summary: "Retorna um cliente pelo Documento",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "document",
            required: true,
            schema: {
              type: "string",
            },
            description: "Documento do cliente a ser recuperado",
          },
        ],
        responses: {
          200: {
            description: "cliente retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Customer",
                },
              },
            },
          },
          404: {
            description: "cliente não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/customers/{mail}": {
      get: {
        summary: "Retorna um cliente pelo E-mail",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "mail",
            required: true,
            schema: {
              type: "string",
            },
            description: "E-mail do cliente a ser recuperado",
          },
        ],
        responses: {
          200: {
            description: "cliente retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Customer",
                },
              },
            },
          },
          404: {
            description: "cliente não encontrado",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/checkout": {
      post: {
        summary: "Cria um novo pedido",
        tags: ["Checkout"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Basket",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Checkout criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Basket",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/checkout/pending": {
      get: {
        summary: "Retorna todos os pedidos pendentes",
        tags: ["Checkout"],
        parameters: [],
        responses: {
          200: {
            description: "Lista de produtos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Basket",
                  },
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/orders/status": {
      get: {
        summary: "Retorna todos os Status",
        tags: ["Order Status"],
        parameters: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Pagamento criado com sucesso",
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
    "/payment/webhook-notification": {
      post: {
        summary: "Atualiza pagamento",
        tags: ["Payment"],
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
        tags: ["Payment"],
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
