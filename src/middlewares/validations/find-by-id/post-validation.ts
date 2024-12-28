import {container} from "../../../composition-root";

import {body} from "express-validator";
import {
    BlogsQueryRepository,
} from "../../../infrastructure/repositories/query-repositories/blogs-query-repository";

const blogsQueryRepository = container.resolve(BlogsQueryRepository)

export const validationPostFindByParamId = body("blogId").custom(

    async (value) => {

        const result = await blogsQueryRepository.findBlogByID(value)

        if (!result) {
            throw new Error("Blog with provided ID not found")
        }

        return true
    })