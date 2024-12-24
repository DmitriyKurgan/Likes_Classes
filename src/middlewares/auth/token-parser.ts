import {NextFunction, Request, Response} from "express";
import {container} from "../../composition-root";
import {JwtService} from "../../application/jwt-service";

const jwtService = container.resolve(JwtService)

export const tokenParser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (!req.headers.authorization) return next()

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if (!userId) return next()

    req.userId = userId

    return next()
}