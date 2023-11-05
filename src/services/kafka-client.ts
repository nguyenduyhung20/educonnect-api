import { Kafka, Partitioners, EachMessagePayload } from 'kafkajs';

const brokers = ["localhost:29092"]

export async function consumer(topic: string, clientId = "kafka-consumer-client") {
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId })
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload ) => {
            console.log(`received message: ${topic} ${partition} ${message.value}`)
        },
    })
};

export async function producer(topic: string, messages: any, clientId = "kafka-producer-client") {
    const kafka = new Kafka({
        clientId,
        brokers
    });

    const producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    await producer.send({
        topic,
        messages: messages
    })
};


// produce()
//     .then(() => {
//         console.log("produced successfully");
//     })
//     .catch((err) => console.log(err));


// consume().
//     then((data) => { 
//         console.log("consumed successfully") 
//         console.log(data)
//     })
//     .catch(err => console.log(err));