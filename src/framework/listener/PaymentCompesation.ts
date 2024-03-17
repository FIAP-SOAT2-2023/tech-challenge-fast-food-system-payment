import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";

import { IPaymentUseCase } from "../../core/domain/usecases/IPaymentUseCase";

const paymentCompensation = async (
  paymentStatusUseCase: IPaymentUseCase
) => {
  const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEY,
      secretAccessKey: process.env.AWS_SECRETKEY,
    },
  });

  const processMessage = async (message: AWS.SQS.Message) => {
    try {
      const body = JSON.parse(message.Body!);
      console.log("Mensagem recebida:", body);
      const paymentId = body.order.payment;

      await paymentStatusUseCase.reversedPaymentById(paymentId);

    } catch (Error) {
      console.error("Erro ao processar mensagem:", Error);
    } finally {
      // Upon successful processing, delete the message from the queue
      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.AWS_COMPESATION_PAYMENT_QUEE01,
          ReceiptHandle: message.ReceiptHandle,
        })
      );

      console.debug("Message deleted successfully");
    }
  };

  const receiveMessages = async (sqsClient) => {
    try {
      const params = {
        QueueUrl: process.env.AWS_COMPESATION_PAYMENT_QUEE01,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 20,
      };

      const receiveMessageCommand = new ReceiveMessageCommand(params);
      const readMessage = await sqsClient.send(receiveMessageCommand);

      if (readMessage.Messages && readMessage.Messages.length > 0) {
        readMessage.Messages.forEach(processMessage);
      }
    } catch (error) {
      console.error("Erro ao receber mensagens:", error);
    } finally {
      // Chamar a função novamente para continuar escutando a fila
      receiveMessages(sqsClient);
    }
  };

  try {
    // Iniciar a escuta da fila
    receiveMessages(sqsClient);
  } catch (error) {
    console.error("Erro ao iniciar a escuta da fila:", error);
  }
};

export default paymentCompensation;