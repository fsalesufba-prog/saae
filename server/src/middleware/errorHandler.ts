import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Erro:', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            status: 'error'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message,
            status: 'validation_error'
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Não autorizado',
            status: 'unauthorized'
        });
    }

    return res.status(500).json({
        error: 'Erro interno do servidor',
        status: 'internal_error'
    });
};