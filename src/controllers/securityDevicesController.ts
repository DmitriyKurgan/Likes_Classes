import {SecurityDevicesService} from "../services/devices-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {devicesQueryRepository} from "../repositories/query-repositories/devices-query-repository";
import {CodeResponsesEnum} from "../utils/utils";

export class SecurityDevicesController {
    private securityDevicesService: SecurityDevicesService
    constructor() {
        this.securityDevicesService = new SecurityDevicesService()
    }

    async getAllUserDevices (req:Request, res:Response){

        const cookieRefreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(cookieRefreshToken)

        if (userId) {
            const foundDevices = await devicesQueryRepository.getAllDevices(
                userId
            )
            return res.status(CodeResponsesEnum.OK_200).send(foundDevices)
        } else {
           return res.sendStatus(401)
        }
    }

    async deleteDevice (req:Request, res:Response){
        const isDeleted = await this.securityDevicesService.deleteDevice(
            req.params.deviceId
        );
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }


    async deleteAllOldDevices (req:Request, res:Response){

        const cookieRefreshToken = req.cookies.refreshToken
        const deviceId = jwtService.getDeviceIdFromToken(cookieRefreshToken)
        const isDeviceValid = await this.securityDevicesService.findDeviceById(deviceId)

        if (deviceId && isDeviceValid) {
            await this.securityDevicesService.deleteAllOldDevices(deviceId)
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }


}