import {UsersSessionModel} from "../db";
import {DeviceDBModel} from "../../../models/database/DeviceDBModel";
import {DeviceViewModel} from "../../../models/view/DeviceViewModel";
import {injectable} from "inversify";

@injectable()
export class SecurityDevicesQueryRepository {

    async getAllDevices(userId:string):Promise<any | { error: string }> {
        const devices: DeviceDBModel[] = await UsersSessionModel.find({userId}).lean();
        return this.DevicesMapping(devices)
    }

    public async DevicesMapping (devices: DeviceDBModel[]) {
            return devices.map((device: DeviceDBModel): DeviceViewModel => {
                return {
                ip: device.ip,
                title: device.title,
                lastActiveDate: new Date(device.lastActiveDate).toISOString(),
                deviceId: device.deviceId,
            }
        })
    }
}


