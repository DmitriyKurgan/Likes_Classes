import {NextFunction, Request, Response} from "express";
import {tokensQueryRepository} from "../../infrastructure/repositories/query-repositories/tokens-query-repository";
import {usersQueryRepository} from "../../infrastructure/repositories/query-repositories/users-query-repository";
import {SecurityDevicesService} from "../../application/devices-service";
import {container} from "../../composition-root";
import {JwtService} from "../../application/jwt-service";

const securityDevicesService = container.resolve(SecurityDevicesService)
const jwtService = container.resolve(JwtService)
export const validationRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(401)

    const isBlacklisted = await tokensQueryRepository.findBlackListedToken(req.cookies.refreshToken);

    if (isBlacklisted) {
        return res.sendStatus(401);
    }

    const userId = await jwtService.getUserIdByToken(refreshToken)

    if (!userId) return res.sendStatus(401)

    const foundUserById = await usersQueryRepository.findUserByID(userId)

    if (!foundUserById) return res.sendStatus(401)

    const currentDeviceId = jwtService.getDeviceIdFromToken(refreshToken)

    const lastActiveDate = jwtService.getLastActiveDateFromToken(refreshToken)

    const userSession = await securityDevicesService.findDeviceById(currentDeviceId)

    if (!userSession) return res.sendStatus(401)

    req.userId = userId
    req.deviceId = currentDeviceId

    next()

}