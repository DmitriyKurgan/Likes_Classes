import {Request, Response, Router} from "express";
import {
    authMiddleware,
    validateAuthorization, validateBlogIdForPostsRequests, validateCommentsRequests,
    validateErrorsMiddleware,
    validatePostsRequests, validationPostsCreation
} from "../middlewares/middlewares";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {posts} from "../services/posts-service";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {comments, commentsService} from "../services/comments-service";
import {usersRepository} from "../repositories/users-repository";
import {PostViewModel} from "../models/view/PostViewModel";
import {PostDBModel} from "../models/database/PostDBModel";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {BlogViewModel} from "../models/view/BlogViewModel";
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