import { Request, Response, NextFunction } from 'express-serve-static-core';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Route not found' });
};

export default notFoundHandler;
