import {AccessToken, TokenType} from "../utils/types";
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {UserDBModel} from "../models/database/UserDBModel";

export const jwtService:any = {

    async createJWT(user: UserDBModel & {id:string}, deviceId: string):Promise<TokenType>{

        const accessToken: AccessToken = {
            accessToken: jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '10m' })
        };

        const refreshToken = jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '20m' })

        return { accessToken, refreshToken };
    },
    async getUserIdByToken(token:string):Promise<ObjectId | null>{
        try {
           const result:any = jwt.verify(token, settings.JWT_SECRET);
           return result.userId;
        } catch (e:unknown) {
            return null
        }
    },
    async verifyToken(token: string) {
        try {
            return jwt.verify(token, settings.JWT_SECRET)
        } catch (error) {
            console.log(error)
            return null;
        }
    },
    getLastActiveDateFromToken(refreshToken: string): string {
        const payload: any = jwt.verify(refreshToken, settings.JWT_SECRET)
        return new Date(payload.iat * 1000).toISOString()
    },
    getDeviceIdFromToken(refreshToken: string): string {
        const payload: any = jwt.verify(refreshToken, settings.JWT_SECRET)
        return payload.deviceId
    }
}