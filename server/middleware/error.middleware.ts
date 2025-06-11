import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
  statusCode?: number
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    }
  })
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const err: ApiError = new Error(`Not Found - ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}
