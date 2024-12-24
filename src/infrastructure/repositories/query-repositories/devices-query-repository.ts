import {WithId} from "mongodb";
import {UsersSessionModel} from "../db";
import {DeviceDBModel} from "../../../models/database/DeviceDBModel";
import {DeviceViewModel} from "../../../models/view/DeviceViewModel";

export const DevicesMapping = (devices: DeviceDBModel[]) => {
    return devices.map((device: DeviceDBModel): DeviceViewModel => {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: new Date(device.lastActiveDate).toISOString(),
            deviceId: device.deviceId,
        };
})}

export const devicesQueryRepository = {
    async getAllDevices(userId:string):Promise<any | { error: string }> {
        const devices: DeviceDBModel[] = await UsersSessionModel.find({userId}).lean();
        return DevicesMapping(devices)
    },
}
