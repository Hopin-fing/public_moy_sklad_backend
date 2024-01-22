import ErrorResponse from '@src/Infrastructure/Utils/errorResponse';
import * as express from 'express';

const asyncHandler = async <T>(result: Promise<T>, res: express.Response, statusError = 400, messageError = '') => {
    return result
        .then((data) => res.status(200).json(data))
        .catch((err: ErrorResponse) => res.status(err.statusCode ? err.statusCode : statusError).json({ error: messageError ? messageError : err.message }));
};

export default asyncHandler;
