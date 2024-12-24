import {ObjectId} from "mongodb";
import {getUsersFromDB} from "../../../utils/utils";
import {UsersModel} from "../db";
import {UserViewModel} from "../../../models/view/UserViewModel";
import {UserDBModel} from "../../../models/database/UserDBModel";import { HydratedDocument } from "mongoose";

export const UserMapper = (user : UserDBModel) : any => {
    return {
        id: user._id.toString(),
        accountData:{...user.accountData},
        emailConfirmation:{...user.emailConfirmation},
    }
}
export const UserSimpleMapper = (user : UserDBModel):UserViewModel =>{
    return {
        id: user._id.toString(),
        email:user.accountData.email,
        login:user.accountData.userName,
        createdAt:user.accountData.createdAt,
    }
}

export const usersQueryRepository = {
    async getAllUsers(query: any): Promise<any | { error: string }> {
        return getUsersFromDB(query);
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user
},
    async findUserByID(userID:string):Promise<HydratedDocument<UserDBModel> | null>{
        return UsersModel.findOne({_id: new ObjectId(userID)})
    }
}

