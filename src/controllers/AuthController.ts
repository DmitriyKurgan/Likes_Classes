import {Request, Response} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {AuthService} from "../application/auth-service";
import {emailService} from "../application/email-service";
import {tokensService} from "../application/tokens-service";
import {usersQueryRepository} from "../infrastructure/repositories/query-repositories/users-query-repository";
import {randomUUID, UUID} from "crypto";
import {UserViewModel} from "../models/view/UserViewModel";
import {UsersService} from "../application/users-service";
import {UsersRepository} from "../infrastructure/repositories/users-repository";
import {SecurityDevicesService} from "../application/devices-service";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
    ) {}

    async loginUser (req: Request, res: Response)  {

        const {loginOrEmail, password} = req.body
        const user = await this.usersService.checkCredentials(loginOrEmail, password)

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
        const dbUser: UserViewModel | null = await this.usersService.createUser(req.body.login, req.body.email, req.body.password);
        const userAccount = await this.usersRepository.findByLoginOrEmail(req.body.email);
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
        const user = await this.usersRepository.findUserByID(myID);
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

        const cookieRefreshToken = req.cookies.refreshToken!

        const { deviceId } = await this.jwtService.verifyToken(cookieRefreshToken)

        const clearTokensPair =  await tokensService.createNewBlacklistedRefreshToken(cookieRefreshToken);

        if (!clearTokensPair) return res.sendStatus(CodeResponsesEnum.Unauthorized_401)

        if (deviceId) {
            await this.securityDevicesService.deleteDevice(deviceId)
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

        const result = await this.usersService.findUserRecoveryCodeAndChangeNewPassword(newPassword, recoveryCode)

        if (!result) return res.status(400).send({
            errorsMessages: [{
                message: "Error",
                field: "recoveryCode"
            }]
        })
        res.sendStatus(204)
    }

}