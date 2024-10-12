import {UsersSessionModel} from "./db";
import {DeleteResult, WithId} from "mongodb";
import {DeviceType, } from "../utils/types";
import {ExtendedSessionType} from "../services/devices-service";

export const devices = [] as DeviceType[]

export const devicesRepository = {

    async createDevice(session:ExtendedSessionType){
        return UsersSessionModel.create(session);
    },

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
        );
        return result.matchedCount === 1;
    },
   async deleteDevice(deviceID:string){
       const result: DeleteResult = await UsersSessionModel.deleteOne({deviceId: deviceID});
       return result.deletedCount === 1;
    },
    async deleteAllOldDevices(currentDeviceID:string){
        return UsersSessionModel.deleteMany({deviceId: {$ne: currentDeviceID}});
    },
    async findDeviceById(deviceID:string){
        const result: WithId<DeviceType> | null = await UsersSessionModel.findOne({deviceId:deviceID});
        return result
    }
}
