import {SecurityDevicesService} from "../application/devices-service";
import {Request, Response} from "express";
import {devicesQueryRepository} from "../infrastructure/repositories/query-repositories/devices-query-repository";
import {CodeResponsesEnum} from "../utils/utils";
import {container} from "../composition-root";
import {JwtService} from "../application/jwt-service";
import {inject} from "inversify/lib/esm";

const jwtService = container.resolve(JwtService)
export class SecurityDevicesController {

    private securityDevicesService: SecurityDevicesService

    constructor(
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
    ) {}

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