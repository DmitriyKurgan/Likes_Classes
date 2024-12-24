import {Router} from "express";
import {CommentsController} from "../controllers/CommentsController";
import {validateBearerAuthorization} from "../middlewares/auth/auth-bearer";
import {tokenParser} from "../middlewares/auth/token-parser";
import {
    validationCommentOwner,
    validationCommentsFindByParamId
} from "../middlewares/validations/find-by-id/comment-validation";
import {validateCommentsRequestsInputParams} from "../middlewares/validations/input/comment-input-validation";
import {
    validateCommentsLikesRequestsInputParams
} from "../middlewares/validations/input/like-for-comment-input-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";
import {container} from "../composition-root";

export const commentsRouter = Router({})

const commentsController = container.resolve(CommentsController)

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
    validateBearerAuthorization,
    validateCommentsRequestsInputParams,
    validateErrorsMiddleware,
    validationCommentOwner,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.put(
    '/:id/like-status',
    validationCommentsFindByParamId,
    validateBearerAuthorization,
    validateCommentsLikesRequestsInputParams,
    validateErrorsMiddleware,
    commentsController.updateLikeStatus.bind(commentsController)
)

commentsRouter.delete(
    '/:id',
    validationCommentsFindByParamId,
    validateBearerAuthorization,
    validateErrorsMiddleware,
    validationCommentOwner,
    commentsController.deleteComment.bind(commentsController)
)


