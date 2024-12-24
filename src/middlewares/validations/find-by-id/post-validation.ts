import {body} from "express-validator";
import {blogsQueryRepository} from "../../../infrastructure/repositories/query-repositories/blogs-query-repository";

export const validationPostFindByParamId = body("blogId").custom(

    async (value) => {

        const result = await blogsQueryRepository.findBlogByID(value)

        if (!result) {
            throw new Error("Blog with provided ID not found")
        }

        return true
    })