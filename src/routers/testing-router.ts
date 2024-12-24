import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {
    AttemptsModel,
    BlogModel, CommentsModel, PostsModel, TokensModel,
    UsersModel, UsersSessionModel
} from "../infrastructure/repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/', async (req:Request, res: Response) => {
    try {
        await BlogModel.deleteMany({});
        await PostsModel.deleteMany({});
        await UsersModel.deleteMany({});
        await CommentsModel.deleteMany({});
        await UsersSessionModel.deleteMany({});
        await TokensModel.deleteMany({});
        await AttemptsModel.deleteMany({});
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    } catch (error) {
        console.error("Error occurred while clearing the database:", error);
        res.sendStatus(500);
    }
})

