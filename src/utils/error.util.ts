import { ERROR_CODE, ERROR_MESSAGE } from '../constants/error';

type ExtensionReturn = { [key: string]: any };

export const errorTemplate = (type: keyof typeof ERROR_CODE, extensionReturn?: ExtensionReturn) => {
  return {
    code: ERROR_CODE[type],
    message: ERROR_MESSAGE[type],
    ...extensionReturn
  };
};
