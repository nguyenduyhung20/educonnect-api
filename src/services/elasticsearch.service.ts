import { esClient } from '../config/es-client';
import { ELASTICSEARCH_POST_INDEX_NAME } from '../constants/constants';

export const increaseESView = async (id: string) => {
  try {
    await esClient.update({
      index: ELASTICSEARCH_POST_INDEX_NAME,
      id,
      script: {
        lang: 'painless',
        source: 'ctx._source.view++'
      },
      refresh: false,
      retry_on_conflict: 2
    });
  } catch (error) {
    console.error('Elasticsearch update view error: ', error);
  }
};
