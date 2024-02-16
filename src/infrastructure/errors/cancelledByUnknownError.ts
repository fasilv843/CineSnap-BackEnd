import { STATUS_CODES } from "../constants/httpStausCodes";
import { CustomError } from "./customError";

export class CancelledByUnknownError extends CustomError {
    statusCode = STATUS_CODES.FORBIDDEN
    constructor (message: string) {
        super(message)
    }
    
    serializeErrors(): { status: number; message: string; } {
        return {
            status: this.statusCode,
            message: this.message
        }
    }
}