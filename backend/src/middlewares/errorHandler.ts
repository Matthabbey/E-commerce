import express, {Request, Response, NextFunction, Errback} from 'express'
import { HttpError } from 'http-errors';


export const notFound = (req: Request, res: Response, next: NextFunction)=>{
    const error = new Error(`Not Found: ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) =>{
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack
    })
}