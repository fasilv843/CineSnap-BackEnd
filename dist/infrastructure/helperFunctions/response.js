"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorResponse = exports.get500Response = exports.get200Response = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
function get200Response(data) {
    return {
        status: httpStatusCodes_1.STATUS_CODES.OK,
        message: 'Success',
        data: data
    };
}
exports.get200Response = get200Response;
function get500Response(error) {
    console.log(error, 'error 500');
    return {
        status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null
    };
}
exports.get500Response = get500Response;
function getErrorResponse(errCode, customMessage) {
    const message = customMessage || httpStatusCodes_1.ERR_MESSAGE[errCode] || 'Unknown Error';
    return {
        status: errCode,
        message: message,
        data: null
    };
}
exports.getErrorResponse = getErrorResponse;
