import { NextFunction, Request, Response } from 'express';
import { generalResponse } from '../helpers/common.helper';
import { HttpException } from '../exceptions/http.exception';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    return generalResponse(res, [], message, 'error', error.toast ?? false, status);
  } catch (error) {
    next(error);
  }
};

