import {ObjectId} from "mongodb";
import {getUsersFromDB} from "../../../utils/utils";
import {UsersModel} from "../db";
import {UserDBModel} from "../../../models/database/UserDBModel";import { HydratedDocument } from "mongoose";
import {injectable} from "inversify";

@injectable()
export class UsersQueryRepository {
    async getAllUsers(query: any): Promise<any | { error: string }> {
        return getUsersFromDB(query);
    }
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user
    }
    async findUserByID(userID:string):Promise<HydratedDocument<UserDBModel> | null>{
        return UsersModel.findOne({_id: new ObjectId(userID)})
    }

    public async UserMapper (user : UserDBModel) {
            return {
            _id: user._id,
            id: user._id.toString(),
            accountData:{...user.accountData},
            emailConfirmation:{...user.emailConfirmation},
        }
    }
}