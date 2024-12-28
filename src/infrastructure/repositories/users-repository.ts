import {RecoveryCodeModel, UsersModel} from "./db";
import {ObjectId, DeleteResult} from "mongodb";
import {UserDBModel} from "../../models/database/UserDBModel";
import {UserViewModel} from "../../models/view/UserViewModel";
import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "./query-repositories/users-query-repository";

@injectable()
export class UsersRepository {

    constructor(
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
    }
    async findByLoginOrEmail(loginOrEmail:string){

        const user =
            await UsersModel.findOne({$or: [
                {"accountData.userName":loginOrEmail},
                {"accountData.email":loginOrEmail}]
            })
        return user ? this.usersQueryRepository.UserMapper(user) : null
    }
    async findUserByID(userID:string){
        const user =
            await UsersModel.findOne({_id: new ObjectId(userID)})

        return user ? this.usersQueryRepository.UserMapper(user) : null
    }

    async createUser(newUser:UserDBModel):Promise<UserViewModel | null> {

        const user = await UsersModel.create(newUser)

        return {
            id: user._id.toString(),
            email:newUser.accountData.email,
            login:newUser.accountData.userName,
            createdAt:newUser.accountData.createdAt,
        }
    }

    async deleteUser(userID:string): Promise<boolean>{

        const result: DeleteResult =
            await UsersModel.deleteOne({_id:new ObjectId(userID)})

        return result.deletedCount === 1
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<any>{
        return RecoveryCodeModel.findOne({recoveryCode:recoveryCode})
    }

    async updateUserPassword(email: string, hash: string): Promise<any>{

        const updatedUser =
            await UsersModel.updateOne(
                {"accountData.email":email},
                {$set:{"accountData.passwordHash":hash}}
            )

        return updatedUser
    }

    async deleteAll(): Promise<boolean> {
        await UsersModel.deleteMany({})
        return (await UsersModel.countDocuments()) === 0
    }
}