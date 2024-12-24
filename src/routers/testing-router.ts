import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {
    AttemptsModel,
    BlogModel, CommentsModel, PostsModel, TokensModel,
    UsersModel, UsersSessionModel
} from "../infrastructure/repositories/db";
import {container} from "../composition-root";
import {TestingController} from "../controllers/TestingController";
export const testingRouter = Router({})

testingRouter.delete('/', async (req:Request, res: Response) => {
    try {
        const testingController = container.resolve(TestingController)

        testingRouter.delete(
            "/all-data",
            testingController.deleteEverything.bind(testingController)
        )

        res.sendStatus(CodeResponsesEnum.Not_content_204)

    } catch (error) {
        console.error("Error occurred while clearing the database:", error);
        res.sendStatus(500);
    }
})

