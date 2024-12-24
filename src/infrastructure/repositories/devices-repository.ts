import {DeviceViewModel} from "../../models/view/DeviceViewModel";
import {UsersSessionModel} from "./db";
import {DeleteResult} from "mongodb";

export const devices = [] as DeviceViewModel[]

export class SecurityDevicesRepository {
    async createDevice(session:DeviceViewModel){
        return UsersSessionModel.create(session)
    }
    async updateDevice(
        ip: string,
        deviceId: string,
        issuedAt: number
    ){
        const result: any = await UsersSessionModel.updateOne(
            { deviceId },
            {
                $set: {
                    lastActiveDate: issuedAt,
                    ip,
                },
            }
        )
        return result.matchedCount === 1
    }
    async deleteDevice(deviceID:string){
        const result: DeleteResult = await UsersSessionModel.deleteOne({deviceId: deviceID})
        return result.deletedCount === 1
    }
    async deleteAllOldDevices(currentDeviceID:string){
        return UsersSessionModel.deleteMany({deviceId: {$ne: currentDeviceID}})
    }
    async findDeviceById(deviceID:string){
        const result: DeviceViewModel | null = await UsersSessionModel.findOne({deviceId:deviceID})
        return result
    }
}
