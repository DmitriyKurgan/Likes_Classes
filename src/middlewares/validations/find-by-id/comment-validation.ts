import {param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {CodeResponsesEnum} from "../../../utils/utils";
import {container} from "../../../composition-root";
import {
    CommentsQueryRepository
} from "../../../infrastructure/repositories/query-repositories/comments-query-repository";

const commentsQueryRepository = container.resolve(CommentsQueryRepository)
export const validationCommentsFindByParamId = param("id").custom(
    async (value) => {

        const result = await commentsQueryRepository.findCommentByID(value)

        if (!result) {
            throw new Error("ID not found")
        }

        return true
    }
)

export const validationCommentOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const foundComment = await commentsQueryRepository
        .findCommentByID(req.params.id, req.userId!)

    if (!foundComment || foundComment.commentatorInfo.userId !== req.userId) {
        return res.sendStatus(CodeResponsesEnum.Forbidden_403)
    }

    next()

}