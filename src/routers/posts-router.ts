import {Router} from "express";
import {PostsController} from "../controllers/postsController";
import {validateBasicAuthorization} from "../middlewares/auth/auth-basic";
import {validateBearerAuthorization} from "../middlewares/auth/auth-bearer";
import {validationPostFindByParamId} from "../middlewares/validations/find-by-id/post-validation";
import {validatePostsRequestsInputParams} from "../middlewares/validations/input/post-input-validation";
import {validateCommentsRequestsInputParams} from "../middlewares/validations/input/comment-input-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";
import {
    validateBlogIdForPostsRequestsInputParams
} from "../middlewares/validations/input/blog-id-for-post-creation-input-validation";

export const postsRouter = Router({})

const postsController = new PostsController()

postsRouter.get(
    '/',
    postsController.getPosts.bind(postsController)
)

postsRouter.get(
    '/:id',
    postsController.getSpecificPost.bind(postsController)
)

postsRouter.get(
    '/:id/comments',
    validateBearerAuthorization,
    validateErrorsMiddleware,
    postsController.getAllCommentsOfPost.bind(postsController)
)

postsRouter.post(
    '/',
    validateBasicAuthorization,
    validatePostsRequestsInputParams,
    validateBlogIdForPostsRequestsInputParams,
    validationPostFindByParamId,
    validateErrorsMiddleware,
    postsController.createPost.bind(postsController)
)

postsRouter.post(
    '/:id/comments',
    validateBearerAuthorization,
    validateCommentsRequestsInputParams,
    validateErrorsMiddleware,
    postsController.createCommentForPost.bind(postsController)
)


postsRouter.put(
    '/:id',
    validateBasicAuthorization,
    validatePostsRequestsInputParams,
    validateBlogIdForPostsRequestsInputParams,
    validationPostFindByParamId,
    validateErrorsMiddleware,
    postsController.updatePost.bind(postsController)
)

postsRouter.delete(
    '/:id',
    validateBasicAuthorization,
    validateErrorsMiddleware,
    postsController.deletePost.bind(postsController)
)