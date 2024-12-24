import {Router} from "express";
import {BlogsController} from "../controllers/blogsController";
import {validateBasicAuthorization} from "../middlewares/auth/auth-basic";
import {validationBlogsFindByParamId} from "../middlewares/validations/find-by-id/blog-validation";
import {validateBlogsRequestsInputParams} from "../middlewares/validations/input/blog-input-validation";
import {validatePostsRequestsInputParams} from "../middlewares/validations/input/post-input-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";

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
    validateBasicAuthorization,
    validateBlogsRequestsInputParams,
    validateErrorsMiddleware,
    blogsController.createBlog.bind(blogsController)
)

blogsRouter.post(
    '/:id/posts',
    validateBasicAuthorization,
    validatePostsRequestsInputParams,
    validateErrorsMiddleware,
    blogsController.createPostForBlog.bind(blogsController)
)

blogsRouter.put(
    '/:id',
    validateBasicAuthorization,
    validationBlogsFindByParamId,
    validateBlogsRequestsInputParams,
    validateErrorsMiddleware,
    blogsController.updateBlog.bind(blogsController)
)

blogsRouter.delete(
    '/:id',
    validateBasicAuthorization,
    validationBlogsFindByParamId,
    validateErrorsMiddleware,
    blogsController.deleteBlog.bind(blogsController)
)


