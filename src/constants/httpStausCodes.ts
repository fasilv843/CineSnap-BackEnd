export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  // Add more HTTP status codes as needed
};

interface ErrorMessage {
  [errorCode: number]: string;
}

export const ERR_MESSAGE: ErrorMessage = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
    // Add more error codes and messages here
};

// // Example usage:
// const errorCode = 403;
// console.log(errorMessages[errorCode]); // Outputs: 'Forbidden'
