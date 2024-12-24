import {param} from "express-validator";
import {blogsQueryRepository} from "../../../infrastructure/repositories/query-repositories/blogs-query-repository";

export const validationBlogsFindByParamId = param("id").custom(
    async (value) => {

        const result = await blogsQueryRepository.findBlogByID(value)

        if (!result) {
            throw new Error("ID not found")
        }

        return true
    }
)