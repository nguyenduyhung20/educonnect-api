export type ErrorName = keyof typeof ERROR_CODE;
export type ErrorType = { [key in ErrorName]: string };

export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UN_AUTHORIZATION: 'UN_AUTHORIZATION'
};

export const ERROR_MESSAGE: ErrorType = {
  BAD_REQUEST: 'Yêu cầu không chính xác',
  INTERNAL_SERVER_ERROR: 'Một lỗi không ngờ đến đã xảy ra',
  NOT_FOUND: 'Tài nguyên yêu cầu không tìm thấy',
  UN_AUTHORIZATION: 'Tài nguyên không được phép truy cập'
};
