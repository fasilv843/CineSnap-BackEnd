"use strict";
// export abstract class CustomError extends Error {
//     abstract statusCode: number;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
//     constructor(message: string) {
//       super(message);
//       Object.setPrototypeOf(this, CustomError.prototype);
//     }
//     abstract serializeErrors(): { message: string; field?: string }[];
// }
class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
