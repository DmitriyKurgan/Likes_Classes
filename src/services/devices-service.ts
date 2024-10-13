import {devicesRepository} from "../repositories/devices-repository";
import {DeviceViewModel} from "../models/view/DeviceViewModel";
import {DeviceDBModel} from "../models/database/DeviceDBModel";
import {ObjectId} from "mongodb";

export const devices = [] as DeviceViewModel[]
export const devicesService: any = {
    async createDevice(userId: string, ip:string, title:string, lastActiveDate:string, deviceId:string ): Promise<any> {

        const newSession = new DeviceDBModel(
            new ObjectId(),
            ip,
            title,
            userId,
            deviceId,
            lastActiveDate,
        )

        return devicesRepository.createDevice(newSession);
    },
    async updateDevice(
        ip: string,
        deviceId: string,
        issuedAt: number
    ): Promise<boolean> {
        return devicesRepository.updateDevice(ip, deviceId, issuedAt)
    },
    async deleteDevice(deviceID: string): Promise<boolean> {
        return await devicesRepository.deleteDevice(deviceID);
    },
    async deleteAllOldDevices(currentDeviceId:string):Promise<Object | { error: string }> {
      return devicesRepository.deleteAllOldDevices(currentDeviceId);
    },
    async findDeviceById(currentDeviceId:string):Promise<any | { error: string }> {
       return await devicesRepository.findDeviceById(currentDeviceId);
    },
}
