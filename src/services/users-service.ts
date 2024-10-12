import {EazeUserType, OutputUserType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {UserDBModel} from "../models/database/UserDBModel";
import {UserViewModel} from "../models/view/UserViewModel";

export const users = [] as EazeUserType[]

export const usersService:any = {

    async createUser(login:string, email:string, password:string):Promise<UserViewModel | null> {
        const passwordSalt = await bcrypt.genSalt(10);

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = new UserDBModel(
            new ObjectId(),
            {
                userName:login,
                email,
                passwordHash,
                createdAt: new Date().toISOString(),
                isMembership: false
            },
            {
                confirmationCode:uuidv4(),
                expirationDate:add(new Date(), {
                    hours: 3,
                    minutes: 10
                }),
                isConfirmed:false,
            }
        )
        const createdUser = await usersRepository.createUser(newUser);
        return createdUser
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await usersRepository.deleteUser(userID);
    },
    async checkCredentials(loginOrEmail:string, password:string):Promise<OutputUserType | null> {
        const user:OutputUserType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user){
            return null
        }
        const isPasswordsMatch = await bcrypt.compare(password, user.accountData.passwordHash)
        if (!isPasswordsMatch) return null
        return user
    },

    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    },

    async findUserRecoveryCodeAndChangeNewPassword(newPassword:string, recoveryCode:string):Promise<any> {
        const userCode = await usersRepository.findUserByRecoveryCode(recoveryCode);
        if (!userCode) return
        const passwordSalt = await bcrypt.genSalt(10)
        const hash = await this._generateHash(newPassword, passwordSalt)
        const result = await usersRepository.updateUserPassword(userCode.email, hash)
        return result
    }
}