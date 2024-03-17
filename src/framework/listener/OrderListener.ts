import {DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import * as AWS from 'aws-sdk';
import {Payment} from "../../core/domain/entities/payment";
import {IPaymentUseCase} from "../../core/domain/usecases/IPaymentUseCase";
const orderListener = async (paymentUseCase: IPaymentUseCase) => {

    const sqsClient = new SQSClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESSKEY,
            secretAccessKey: process.env.AWS_SECRETKEY,
        },
    });

    function sendCompensation(message: AWS.SQS.Message) {
        console.error('Enviando mensagem para fila de compensação');
        // Enviar mensagem para fila de compensação
        sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.AWS_COMPESATION_ORDER_QUEE01,
            MessageBody: message.Body!,
            MessageDeduplicationId: message.MessageId!,
            MessageGroupId: 'compensation'
        }));
    }

    const processMessage = async (message: AWS.SQS.Message) => {
        try {
            const body = JSON.parse(message.Body!);
            console.log('Mensagem recebida:', body);
            const orderId = body.orderId;

            const paymentNew: Payment = {
                orderId: body?.order?.uuid,
                totalPrice: body.totalPrice,
                paymentId: body.order.payment,
                basketOrigin: JSON.stringify(body)
            }

            // Simulando erro
            if (body.totalPrice == 1313) {
                throw new Error("Simulacao de erro");
            }

            const paymentResult = await paymentUseCase.createPayment(paymentNew);

            console.log('Pagamento criado:', paymentResult);

        } catch (Error) {
            console.error('Erro ao processar mensagem:', Error);

            sendCompensation(message)
        } finally {
            // Upon successful processing, delete the message from the queue
            await sqsClient.send(new DeleteMessageCommand({
                QueueUrl: process.env.AWS_ORDER_QUEE01,
                ReceiptHandle: message.ReceiptHandle,
            }));

            console.debug("Message deleted successfully");
        }
    };


    // Função para receber mensagens da fila
    const receiveMessages = async (sqsClient) => {
        try {
            const params = {
                QueueUrl: process.env.AWS_ORDER_QUEE01,
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
            console.error('Erro ao receber mensagens:', error);


        } finally {
            // Chamar a função novamente para continuar escutando a fila
            receiveMessages(sqsClient);
        }
    };

    try {
    // Iniciar a escuta da fila
    receiveMessages(sqsClient);

    } catch (error) {
        console.error('Erro ao iniciar a escuta da fila:', error);
        orderListener(paymentUseCase);
    }


}

export default orderListener;