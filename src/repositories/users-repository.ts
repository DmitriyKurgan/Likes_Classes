import {RecoveryCodeModel, UsersModel} from "./db";
import {ObjectId, DeleteResult} from "mongodb";
import {UserMapper,} from "./query-repositories/users-query-repository";
import {UserDBModel} from "../models/database/UserDBModel";
import {UserViewModel} from "../models/view/UserViewModel";

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user ? UserMapper(user) : null
    },
    async findUserByID(userID:string){
        const user = await UsersModel.findOne({_id: new ObjectId(userID)})
        return user ? UserMapper(user) : null
    },


    async createUser(newUser:UserDBModel):Promise<UserViewModel | null> {
        const user = await UsersModel.create(newUser);
         return {
             id: user._id.toString(),
             email:newUser.accountData.email,
             login:newUser.accountData.userName,
             createdAt:newUser.accountData.createdAt,
         }
    },

   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await UsersModel.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<any>{
        return RecoveryCodeModel.findOne({recoveryCode:recoveryCode})
    },

    async updateUserPassword(email: string, hash: string): Promise<any>{
       const updatedUser = await UsersModel.updateOne({"accountData.email":email}, {$set:{
           "accountData.passwordHash":hash
       }});
       return updatedUser
       },
}