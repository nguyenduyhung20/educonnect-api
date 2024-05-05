import { NextFunction, Request, Response } from 'express';
import { ExploreModel } from '../models/explore.model';
import { UserModel } from '../models/user.model';
import { esClient } from '../config/es-client';
import { ELASTICSEARCH_POST_INDEX_NAME } from '../constants/constants';
import { SearchTermSuggestOption } from '@elastic/elasticsearch/lib/api/types';

export const handleGetExplorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await ExploreModel.getExplorePost();
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const handleGetPublicExplorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await ExploreModel.getPublicExplorePost();
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const handleGetPublicMostUserFollower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getUserMostFollower();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

type SearchQuery = {
  input?: string;
  mode?: SearchMode;
};
type SearchMode = 'suggest' | 'query';

export const handleExploreSearch = async (
  req: Request<unknown, unknown, unknown, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const SEARCH_RETURN_SIZE = 20;
  const { mode, input } = req.query;
  try {
    let results = {};
    if (mode && input) {
      if (mode === 'suggest') {
        const result = await esClient.search({
          index: ELASTICSEARCH_POST_INDEX_NAME,
          suggest: {
            query_typo: {
              text: input,
              term: {
                field: 'title',
                size: 1,
                sort: 'score',
                suggest_mode: 'always'
              }
            }
          },
          size: 0
        });
        results = {
          suggest: result.suggest?.query_typo
            ?.map((item) => {
              const options = item.options as SearchTermSuggestOption[];
              if (options && options.length > 0) {
                return options[0].text;
              } else {
                return item.text;
              }
            })
            .join(' ')
        };
      }
      if (mode === 'query') {
        const posts = await esClient.search({
          index: ELASTICSEARCH_POST_INDEX_NAME,
          query: {
            dis_max: {
              queries: [
                {
                  multi_match: {
                    query: input,
                    fields: ['title^4', 'content^2'],
                    type: 'phrase',
                    slop: 0,
                    boost: 4
                  }
                },
                {
                  multi_match: {
                    fields: ['title^2', 'content'],
                    query: input,
                    fuzziness: 'AUTO',
                    max_expansions: SEARCH_RETURN_SIZE
                  }
                }
              ],
              tie_breaker: 0.3
            }
          },
          size: SEARCH_RETURN_SIZE,
          _source: ['id', 'title', 'content']
        });
        results = {
          posts: posts.hits.hits.map((item) => ({ data: item._source, score: item._score }))
        };
      }
    }

    return res.status(200).json({ data: results });
  } catch (error) {
    next(error);
  }
};
