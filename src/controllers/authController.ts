import {Request, Response} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";

import {jwtService} from "../application/jwt-service";
import {AuthService} from "../services/auth-service";
import {emailService} from "../services/email-service";
import {usersRepository} from "../repositories/users-repository";
import {tokensService} from "../services/tokens-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {devicesService} from "../services/devices-service";
import {randomUUID, UUID} from "crypto";
import {UserViewModel} from "../models/view/UserViewModel";

export class AuthController {
    private authService: AuthService
    constructor() {
        this.authService = new AuthService()
    }
    async loginUser (req: Request, res: Response)  {

        const {loginOrEmail, password} = req.body
        const user = await usersService.checkCredentials(loginOrEmail, password)

        if (!user) {
            return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
        }

        const deviceId:UUID = randomUUID();
        const ip = req.ip!;
        const deviceTitle =  req.headers['user-agent'] || "browser not found"

        const {refreshToken, accessToken} = await this.authService.loginUser(user, deviceId, ip, deviceTitle);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
            .status(CodeResponsesEnum.OK_200)
            .send(accessToken);

    }

    async registerUser (req: Request, res: Response) {
        const dbUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password);
        console.log('dbUser: ', dbUser)
        const userAccount = await usersRepository.findByLoginOrEmail(req.body.email);
        if (!userAccount) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        await emailService.sendEmail(userAccount.accountData.email, userAccount?.emailConfirmation?.confirmationCode);
        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }

    async refreshToken (req: Request, res: Response)  {

        const {deviceId, userId, ip} = req;

        if (!userId || !deviceId || !ip) {
            return res.sendStatus(CodeResponsesEnum.Unauthorized_401);
        }

        const user = await usersQueryRepository.findUserByID(userId as string);
        const {refreshToken, accessToken} = await this.authService.refreshToken(req.cookies.refreshToken, user, deviceId, ip);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
        res.status(CodeResponsesEnum.OK_200).send(accessToken)

    }

    async confirmRegistration (req: Request, res: Response) {
        const confirmationCode = req.body.code;
        const confirmationResult = this.authService.confirmRegistration(confirmationCode);
        if (!confirmationResult) {
          return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);
        }
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    }

    async resendEmail(req: Request, res: Response) {
        const userEmail = req.body.email;
        const confirmationCodeUpdatingResult = await this.authService.resendEmail(userEmail);
        if (!confirmationCodeUpdatingResult) return;
        res.sendStatus(CodeResponsesEnum.Not_content_204);
        }

     async me (req: Request, res: Response) {
        const myID = req.userId
        if (!myID) {
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401);
        }
        const user = await usersRepository.findUserByID(myID);
        if (!user) {
            return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
        }
        res.status(CodeResponsesEnum.OK_200).send({
            email: user.accountData.email,
            login: user.accountData.userName,
            userId: myID
        })
    }

    async logoutUser (req: Request, res: Response) {

        const cookieRefreshToken = req.cookies.refreshToken!;
        const { deviceId } = await jwtService.verifyToken(
        cookieRefreshToken
        );

        const clearTokensPair =  await tokensService.createNewBlacklistedRefreshToken(cookieRefreshToken);

        if (!clearTokensPair) return res.sendStatus(CodeResponsesEnum.Unauthorized_401)

        if (deviceId) {
            await devicesService.deleteDevice(deviceId);
            res.sendStatus(204);
        } else {
            res.sendStatus(401);
        }
        }
    async recoverUserPassword (req: Request, res: Response) {
        const email = req.body.email
        await this.authService.findUserByEmailAndSendHimLetter(email)
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    }

    async createNewPassword (req: Request, res: Response)  {
        const {newPassword, recoveryCode} = req.body

        const result = await usersService.findUserRecoveryCodeAndChangeNewPassword(newPassword, recoveryCode)

        if (!result) return res.status(400).send({
            errorsMessages: [{
                message: "Error",
                field: "recoveryCode"
            }]
        })
        res.sendStatus(204)
    }

}