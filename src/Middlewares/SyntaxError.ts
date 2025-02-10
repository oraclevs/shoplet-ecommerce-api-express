import { Request, Response, NextFunction, ErrorRequestHandler } from 'express-serve-static-core';

const jsonSyntaxErrorHandler: ErrorRequestHandler = (err, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        const error = err as SyntaxError & { status?: number };
        if (error.status === 400) {
            res.status(400).json({ error: 'Invalid JSON syntax' });
            return; // Ensure the function returns void
        }
    }
    next(err); // Pass the error to the next middleware if it's not a SyntaxError
};

export default jsonSyntaxErrorHandler;



