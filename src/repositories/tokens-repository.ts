import {MongoRefreshTokenType} from "../utils/types";
import {TokensModel} from "./db";

export const blacklistedTokensRepository = {
    // Create new blacklisted token
    async createNewToken(
        newToken: MongoRefreshTokenType
    ): Promise<MongoRefreshTokenType> {
        await TokensModel.create(newToken);
        return newToken;
    },

    // Delete all blacklisted tokens
    async deleteAll(): Promise<boolean> {
        await TokensModel.deleteMany({});
        return (await TokensModel.countDocuments()) === 0;
    },
};