"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundNotAllowedError = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const customError_1 = require("./customError");
class RefundNotAllowedError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = httpStatusCodes_1.STATUS_CODES.FORBIDDEN;
    }
    serializeErrors() {
        return {
            status: this.statusCode,
            message: this.message
        };
    }
}
exports.RefundNotAllowedError = RefundNotAllowedError;
