import {MongoRefreshTokenType} from "../../utils/types";
import {TokensModel} from "../db";

export const tokensQueryRepository = {
    async findBlackListedToken(token: string): Promise<MongoRefreshTokenType | null> {
        return TokensModel.findOne({
            refreshToken: token,
        });
    },
};