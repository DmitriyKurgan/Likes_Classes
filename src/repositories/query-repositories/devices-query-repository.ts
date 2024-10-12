import {WithId} from "mongodb";
import {DeviceType} from "../../utils/types";
import {UsersSessionModel} from "../db";

export const DevicesMapping = (devices: WithId<DeviceType>[]) => {
    return devices.map((device: WithId<DeviceType>) => {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: new Date(device.lastActiveDate).toISOString(),
            deviceId: device.deviceId,
        };
})}

export const devicesQueryRepository = {
    async getAllDevices(userId:string):Promise<any | { error: string }> {
        const devices: WithId<DeviceType>[] = await UsersSessionModel.find({userId}).lean();
        return DevicesMapping(devices)
    },
}
