"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message, toast) {
        super(message);
        Object.setPrototypeOf(this, HttpException.prototype);
        this.status = status;
        this.message = message;
        this.toast = toast ?? false;
    }
}
exports.HttpException = HttpException;
