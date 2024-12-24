import {param} from "express-validator";
import {SecurityDevicesService} from "../../../application/devices-service";
import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../../application/jwt-service";

const securityDevicesService = new SecurityDevicesService()
export const validationDevicesFindByParamId = param("deviceId").custom(

    async (value) => {

        const result = await securityDevicesService.findDeviceById(value)

        if (!result) {
            throw new Error("ID not found")
        }

        return true

    }
)

export const validationDeviceOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookieRefreshToken = req.cookies.refreshToken

    if (!cookieRefreshToken) {
        res.sendStatus(401)
        return
    }

    const cookieRefreshTokenObj = await jwtService.verifyToken(
        cookieRefreshToken
    )

    if (!cookieRefreshTokenObj) {
        res.sendStatus(401)
        return
    }

    const deviceId = req.params.deviceId
    const device = await securityDevicesService.findDeviceById(deviceId)

    const deviceUserId = device?.userId
    const cookieUserId = cookieRefreshTokenObj.userId.toString()

    if (deviceUserId !== cookieUserId) {
        res.sendStatus(403)
        return
    }

    next()
}