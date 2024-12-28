import {SecurityDevicesService} from "../application/devices-service";
import {Request, Response} from "express";
import {SecurityDevicesQueryRepository} from "../infrastructure/repositories/query-repositories/devices-query-repository";
import {CodeResponsesEnum} from "../utils/utils";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityDevicesController {
    constructor(
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityDevicesQueryRepository) protected securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    ) {}

    async getAllUserDevices (req:Request, res:Response){

        const cookieRefreshToken = req.cookies.refreshToken
        const userId = await this.jwtService.getUserIdByToken(cookieRefreshToken)

        if (userId) {
            const foundDevices = await this.securityDevicesQueryRepository.getAllDevices(
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
        const deviceId = this.jwtService.getDeviceIdFromToken(cookieRefreshToken)
        const isDeviceValid = await this.securityDevicesService.findDeviceById(deviceId)

        if (deviceId && isDeviceValid) {
            await this.securityDevicesService.deleteAllOldDevices(deviceId)
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }


}