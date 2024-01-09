import { ERROR_CODE, ERROR_MESSAGE } from '../constants/error';

type MoreInformation = { [key: string]: any };

export const errorTemplate = (type: keyof typeof ERROR_CODE, more?: MoreInformation) => {
  return {
    code: ERROR_CODE[type],
    message: ERROR_MESSAGE[type],
    ...more
  };
};
