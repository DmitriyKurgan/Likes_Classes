import {Router} from "express";

import {
    validateAuthorization,
    validateBlogsRequests,
    validateErrorsMiddleware,
    validatePostsRequests, validationBlogsFindByParamId
} from "../middlewares/middlewares";
import {BlogsController} from "../controllers/blogsController";

export const blogsRouter = Router({})

const blogsController = new BlogsController()

blogsRouter.get(
    '/',
    blogsController.getBlogs.bind(blogsController)
)

blogsRouter.get(
    '/:id',
    validationBlogsFindByParamId,
    blogsController.getSpecificBlog.bind(blogsController)
)

blogsRouter.get(
    '/:id/posts',
    blogsController.getPostsForBlog.bind(blogsController)
)

blogsRouter.post(
    '/',
    validateAuthorization,
    validateBlogsRequests,
    validateErrorsMiddleware,
    blogsController.createBlog.bind(blogsController)
)

blogsRouter.post(
    '/:id/posts',
    validateAuthorization,
    validatePostsRequests,
    validateErrorsMiddleware,
    blogsController.createPostForBlog.bind(blogsController)
)

blogsRouter.put(
    '/:id',
    validateAuthorization,
    validationBlogsFindByParamId,
    validateBlogsRequests,
    validateErrorsMiddleware,
    blogsController.updateBlog.bind(blogsController)
)

blogsRouter.delete(
    '/:id',
    validateAuthorization,
    validationBlogsFindByParamId,
    validateErrorsMiddleware,
    blogsController.deleteBlog.bind(blogsController)
)


