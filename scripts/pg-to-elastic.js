const { Client: ESClient } = require('@elastic/elasticsearch');
const { PrismaClient } = require('@prisma/client');
const { Kafka, Partitioners } = require('kafkajs');

const esClient = new ESClient({ node: 'http://localhost:9200' });
const prisma = new PrismaClient();
const brokers = ['localhost:29092'];

const kafka = new Kafka({
  clientId: 'web-server-client',
  brokers
});
const producerInstance = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

async function producer(topic, messages, producer = producerInstance) {
  await producer.connect();
  await producer.send({
    topic,
    messages: messages
  });
}

fetchData(0);

async function fetchData(offset) {
  const limit = 1000;
  try {
    const rows = await prisma.post.findMany({
      where: {
        deleted: false
      },
      include: {
        post_summarization: {
          select: {
            content_summarization: true
          }
        }
      },
      take: limit,
      skip: offset
    });
    if (rows.length === 0) {
      console.log('All rows fetched');
      process.exit(0);
    }

    processRows(rows)
      .then(() => {
        fetchData(offset + limit);
      })
      .catch((err) => {
        console.error('Error processing rows:', err);
      });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    process.exit(1);
  }
}

async function processRows(rows) {
  for (const row of rows) {
    const id = row.id;
    const exists = await searchById('post-index', id);
    if (!exists) {
      const messages = [
        {
          key: 'post',
          value: JSON.stringify({
            id: row.id,
            title: row.title,
            content: row.content,
            content_summarization: row.post_summarization?.content_summarization || null,
            file_content: row.file_content,
            post_uuid: row.post_uuid,
            user_id: row.user_id,
            parent_post_id: row.parent_post_id,
            group_id: row.group_id,
            view: 0,
            create_at: row.create_at,
            update_at: row.update_at,
            deleted: row.deleted
          })
        }
      ];
      producer('post-topic', messages);
      console.log(`Indexing ${id}`);
    } else {
      console.log(`Row with id ${id} already exists in Elasticsearch`);
    }
  }
}

async function searchById(indexName, id) {
  try {
    const searchResponse = await esClient.get({
      index: indexName,
      id: id
    });
    return searchResponse ? true : false;

    // const searchResponse = await esClient.search({
    //   index: indexName,
    //   body: {
    //     query: {
    //       term: {
    //         id: id
    //       }
    //     }
    //   }
    // });

    // return searchResponse?.hits?.hits.length ? true : false;
  } catch (error) {
    if (error?.meta?.statusCode != 404) {
      console.error(error);
    }
    return false;
  }
}
