import {Router} from "express";
import {
    authMiddleware,
    validateAuthorization, validateBlogIdForPostsRequests, validateCommentsRequests,
    validateErrorsMiddleware,
    validatePostsRequests, validationPostsCreation
} from "../middlewares/middlewares";
import {PostsController} from "../controllers/postsController";

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
    authMiddleware,
    validateErrorsMiddleware,
    postsController.getAllCommentsOfPost.bind(postsController)
)

postsRouter.post(
    '/',
    validateAuthorization,
    validatePostsRequests,
    validateBlogIdForPostsRequests,
    validationPostsCreation,
    validateErrorsMiddleware,
    postsController.createPost.bind(postsController)
)

postsRouter.post(
    '/:id/comments',
    authMiddleware,
    validateCommentsRequests,
    validateErrorsMiddleware,
    postsController.createCommentForPost.bind(postsController)
)


postsRouter.put(
    '/:id',
    validateAuthorization,
    validatePostsRequests,
    validateBlogIdForPostsRequests,
    validationPostsCreation,
    validateErrorsMiddleware,
    postsController.updatePost.bind(postsController)
)

postsRouter.delete(
    '/:id',
    validateAuthorization,
    validateErrorsMiddleware,
    postsController.deletePost.bind(postsController)
)