"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundNotAllowedError = void 0;
const httpStausCodes_1 = require("../../constants/httpStausCodes");
const customError_1 = require("./customError");
class RefundNotAllowedError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = httpStausCodes_1.STATUS_CODES.FORBIDDEN;
    }
    serializeErrors() {
        return {
            status: this.statusCode,
            message: this.message
        };
    }
}
exports.RefundNotAllowedError = RefundNotAllowedError;
