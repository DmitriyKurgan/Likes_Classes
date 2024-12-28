import {UsersModel} from "../db";
import {UserDBModel} from "../../../models/database/UserDBModel";
import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "./users-query-repository";

@injectable()
export class AuthQueryRepository {
    constructor(
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
    }
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const userAccount: UserDBModel | null = await UsersModel.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return userAccount ? this.usersQueryRepository.UserMapper(userAccount) : null
    }
    async findByLoginOrEmail(loginOrEmail:string){
        const userAccount: UserDBModel | null = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return userAccount ?  this.usersQueryRepository.UserMapper(userAccount) : null
    }
}