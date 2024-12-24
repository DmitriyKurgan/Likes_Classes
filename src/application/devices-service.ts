import {SecurityDevicesRepository} from "../infrastructure/repositories/devices-repository";
import {DeviceViewModel} from "../models/view/DeviceViewModel";
import {DeviceDBModel} from "../models/database/DeviceDBModel";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";

export const devices = [] as DeviceViewModel[]
@injectable()
export class SecurityDevicesService {
    constructor(
        @inject(SecurityDevicesRepository) protected securityDevicesRepository: SecurityDevicesRepository
    ) {}

    async createDevice(userId: string, ip:string, title:string, lastActiveDate:string, deviceId:string ): Promise<any> {

        const newSession = new DeviceDBModel(
            new ObjectId(),
            ip,
            title,
            userId,
            deviceId,
            lastActiveDate,
        )

        return this.securityDevicesRepository.createDevice(newSession);
    }
    async updateDevice(
        ip: string,
        deviceId: string,
        issuedAt: number
    ): Promise<boolean> {
        return this.securityDevicesRepository.updateDevice(ip, deviceId, issuedAt)
    }
    async deleteDevice(deviceID: string): Promise<boolean> {
        return await this.securityDevicesRepository.deleteDevice(deviceID)
    }
    async deleteAllOldDevices(currentDeviceId:string):Promise<Object | { error: string }> {
        return this.securityDevicesRepository.deleteAllOldDevices(currentDeviceId)
    }
    async findDeviceById(currentDeviceId:string):Promise<any | { error: string }> {
        return await this.securityDevicesRepository.findDeviceById(currentDeviceId)
    }
}
