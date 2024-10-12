import {UserMapper} from "./users-query-repository";
import {UsersModel} from "../db";
import {UserDBModel} from "../../models/database/UserDBModel";


export const authQueryRepository = {
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const userAccount: UserDBModel | null = await UsersModel.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return userAccount ? UserMapper(userAccount) : null
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const userAccount: UserDBModel | null = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return userAccount ? UserMapper(userAccount) : null
    },
}
