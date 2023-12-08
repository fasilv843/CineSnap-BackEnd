import { ERR_MESSAGE, STATUS_CODES } from "../../constants/httpStausCodes";
import { IShowRes } from "../../interfaces/schema/showSchema";

interface IApiRes<T extends IShowRes | null> {
    status: number;
    message: string;
    data: T;
}

export function get200Response<T extends IShowRes>(data: T): IApiRes<T> {
    return {
        status: STATUS_CODES.OK,
        message: 'Success',
        data: data
    };
}

export function get500Response(error: Error): IApiRes<null> {
    console.log(error, 'error 500');
    return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null
    };
}

export function getErrorResponse(errCode: number, customMessage?: string): IApiRes<null> {
    const message = customMessage || ERR_MESSAGE[errCode] || 'Unknown Error';

    return {
        status: errCode,
        message: message,
        data: null
    };
}