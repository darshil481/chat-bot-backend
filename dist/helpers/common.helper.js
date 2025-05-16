"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalResponse = void 0;
const generalResponse = (response, data = [], message = '', responseType = 'success', toast = false, statusCode = 200) => {
    response.status(statusCode).send({
        data: data,
        message: message,
        toast: toast,
        responseType: responseType,
    });
};
exports.generalResponse = generalResponse;
