import {MongoRefreshTokenType} from "../utils/types";
import {blacklistedTokensRepository} from "../repositories/tokens-repository";
import {ObjectId} from "mongodb";

export const tokensService = {
    // Create new blacklisted refresh token
    async createNewBlacklistedRefreshToken(
        refreshToken: string
    ): Promise<MongoRefreshTokenType | null> {
        const newToken = {
            _id: new ObjectId(),
            refreshToken,
        };
        return blacklistedTokensRepository.createNewToken(newToken);
    },

    // Delete all blacklisted refresh tokens
    async deleteAll(): Promise<boolean> {
        return blacklistedTokensRepository.deleteAll();
    },
};