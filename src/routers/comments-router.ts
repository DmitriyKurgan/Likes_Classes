import {Router} from "express";
import {
    authMiddleware, tokenParser, validateCommentsLikesRequests,
    validateCommentsRequests,
    validateErrorsMiddleware, validationCommentOwner,
    validationCommentsFindByParamId,
} from "../middlewares/middlewares";
import {CommentsController} from "../controllers/commentsController";

export const commentsRouter = Router({})

const commentsController = new CommentsController()
commentsRouter.get(
    '/:id',
    validationCommentsFindByParamId,
    tokenParser,
    validateErrorsMiddleware,
    commentsController.getComment.bind(commentsController)
)


commentsRouter.put(
    '/:id',
    validationCommentsFindByParamId,
    authMiddleware,
    validateCommentsRequests,
    validateErrorsMiddleware,
    validationCommentOwner,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.put(
    '/:id/like-status',
    validationCommentsFindByParamId,
    authMiddleware,
    validateCommentsLikesRequests as any,
    validateErrorsMiddleware,
    commentsController.updateLikeStatus.bind(commentsController)
)

commentsRouter.delete(
    '/:id',
    validationCommentsFindByParamId,
    authMiddleware,
    validateErrorsMiddleware,
    validationCommentOwner,
    commentsController.deleteComment.bind(commentsController)
)


