import {AccessToken, TokenType} from "../utils/types";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {UserDBModel} from "../models/database/UserDBModel";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class JwtService {
    async createJWT(user: UserDBModel & {id:string}, deviceId: string):Promise<TokenType>{

        const accessToken: AccessToken = {
            accessToken: jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '1d' })
        }

        const refreshToken = jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '2d' })

        return { accessToken, refreshToken };
    }
    async getUserIdByToken(token:string):Promise<string | null>{
        try {
            const result:any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId.toString()
        } catch (e:unknown) {
            return null
        }
    }
    async verifyToken(token: string) {
        try {
            return jwt.verify(token, settings.JWT_SECRET) as {
                userId: number
                deviceId: string
                iat: number
                exp: number
            } | any
        } catch (error) {
            console.log(error)
            return null
        }
    }
    getLastActiveDateFromToken(refreshToken: string): string {
        const payload: any = jwt.verify(refreshToken, settings.JWT_SECRET)
        return new Date(payload.iat * 1000).toISOString()
    }
    getDeviceIdFromToken(refreshToken: string): string {
        const payload: any = jwt.verify(refreshToken, settings.JWT_SECRET)
        return payload.deviceId
    }
}
