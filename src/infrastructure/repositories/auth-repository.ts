import {ObjectId, UpdateResult} from "mongodb";
import {RecoveryCodeModel, UsersModel} from "./db";
import {RecoveryCodeType} from "../../utils/types";
import {injectable} from "inversify";

@injectable()
export class AuthRepository {
    async updateConfirmation(userID:string):Promise<boolean>{
        const result: UpdateResult = await UsersModel.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.isConfirmed':true}});
        return result.matchedCount === 1
    }
    async updateConfirmationCode(userID:string, confirmationCode:string):Promise<boolean>{
        const result: UpdateResult = await UsersModel.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.confirmationCode':confirmationCode}});
        return result.matchedCount === 1
    }
    async addRecoveryUserCode(recoveryCode:RecoveryCodeType):Promise<any> {
        return await RecoveryCodeModel.create(recoveryCode)
    }
}
