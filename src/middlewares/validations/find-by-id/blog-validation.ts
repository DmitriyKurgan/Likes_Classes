import {container} from "../../../composition-root";

import {param} from "express-validator";
import {
    BlogsQueryRepository,
} from "../../../infrastructure/repositories/query-repositories/blogs-query-repository";

const blogsQueryRepository = container.resolve(BlogsQueryRepository)

export const validationBlogsFindByParamId = param("id").custom(
    async (value) => {

        const result = await blogsQueryRepository.findBlogByID(value)

        if (!result) {
            throw new Error("ID not found")
        }

        return true
    }
)