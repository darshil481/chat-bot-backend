"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const common_helper_1 = require("../helpers/common.helper");
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        return (0, common_helper_1.generalResponse)(res, [], message, 'error', error.toast ?? false, status);
    }
    catch (error) {
        next(error);
    }
};
exports.errorMiddleware = errorMiddleware;
