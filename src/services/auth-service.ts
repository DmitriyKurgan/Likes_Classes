import {RecoveryCodeType, TokenType} from "../utils/types";
import bcrypt from 'bcrypt'
import {authRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/query-repositories/auth-query-repository";
import {randomUUID} from "crypto";
import {emailService} from "./email-service";
import {jwtService} from "../application/jwt-service";
import {tokensService} from "./tokens-service";
import {devicesService} from "./devices-service";
import {UserDBModel} from "../models/database/UserDBModel";
import {UserViewModel} from "../models/view/UserViewModel";
export const users = [] as UserViewModel[]

export const authService:any = {
    async loginUser (user: UserDBModel & {id:string}, deviceId: string, ip: string, deviceTitle: string): Promise<TokenType> {
        const {refreshToken, accessToken} = await jwtService.createJWT(user, deviceId);
        const lastActiveDate = jwtService.getLastActiveDateFromToken(refreshToken);
        const session = await devicesService.createDevice(user.id, ip, deviceTitle , lastActiveDate, deviceId)
        return {refreshToken, accessToken}
    },
    async refreshToken (oldRefreshToken: string, user: UserViewModel, deviceId: string, ip: string): Promise<TokenType> {

        const {refreshToken, accessToken} = await jwtService.createJWT(user, deviceId);

        await tokensService.createNewBlacklistedRefreshToken(oldRefreshToken);
        const newRefreshTokenObj = await jwtService.verifyToken(
            refreshToken
        );

        const newIssuedAt = newRefreshTokenObj!.iat;
        await devicesService.updateDevice(ip, deviceId, newIssuedAt);
        return {accessToken, refreshToken};

    },
    async confirmRegistration(confirmationCode:string):Promise<boolean>{

        const userAccount: UserDBModel | null = await authQueryRepository.findUserByEmailConfirmationCode(confirmationCode);

        if (!userAccount) return false;

        if (userAccount.emailConfirmation.isConfirmed) return false;
        if (userAccount.emailConfirmation.confirmationCode !== confirmationCode) return false;
        if (userAccount.emailConfirmation.expirationDate! < new Date()) return false;

        return await authRepository.updateConfirmation(userAccount._id.toString());

    },
    async updateConfirmationCode(userAccount:UserDBModel, confirmationCode:string):Promise<boolean>{
        return await authRepository.updateConfirmationCode(userAccount._id.toString(), confirmationCode);
    },
    async _generateHash(password:string, salt:string):Promise<string>{
        return await bcrypt.hash(password, salt);
    },
    async resendEmail(email: string): Promise<boolean> {
        const userAccount: UserDBModel | null = await authQueryRepository.findByLoginOrEmail(email);

        if (!userAccount || !userAccount.emailConfirmation.confirmationCode) {
            return false;
        }

        const newConfirmationCode:string = randomUUID();

        await emailService.sendEmail(userAccount.accountData.email, newConfirmationCode)

        return authService.updateConfirmationCode(
            userAccount,
            newConfirmationCode
        );
    },
    async findUserByEmailAndSendHimLetter(email: string): Promise<any> {

        const recoveryCode: RecoveryCodeType = {
            email: email,
            recoveryCode: randomUUID()
        }

        const result = await authRepository.addRecoveryUserCode(recoveryCode)

        try {
           await emailService.sendEmailRecovery(recoveryCode)
        } catch (error) {
            console.log(error)
            return null
        }

        return result
    },

}