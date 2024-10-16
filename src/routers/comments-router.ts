import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {
    authMiddleware,
    validateCommentsRequests,
    validateErrorsMiddleware, validationCommentOwner,
    validationCommentsFindByParamId,
} from "../middlewares/middlewares";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsService} from "../services/comments-service";
import {CommentViewModel} from "../models/view/CommentViewModel";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    validationCommentsFindByParamId,
    validateErrorsMiddleware,
    async (req: Request, res: Response) => {
    const commentID = req.params.id;
    const commentByID: CommentViewModel | null = await commentsQueryRepository.findCommentByID(commentID);
    if (!commentID || !commentByID) {
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.status(CodeResponsesEnum.OK_200).send(commentByID);
})


commentsRouter.put('/:id',
    validationCommentsFindByParamId,
    authMiddleware,
    validateCommentsRequests,
    validateErrorsMiddleware,
    validationCommentOwner,
    async (req: Request, res: Response) => {
    const commentID = req.params.id;
    const isUpdated: boolean = await commentsService.updateComment(commentID, req.body);
    if (!isUpdated) {
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});

commentsRouter.delete('/:id',
    validationCommentsFindByParamId,
    authMiddleware,
    validateErrorsMiddleware,
    validationCommentOwner,
    async (req: Request, res: Response) => {
    const commentID: string = req.params.id;
    const isDeleted: boolean = await commentsService.deleteComment(commentID);
    if (!isDeleted || !commentID) {
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


