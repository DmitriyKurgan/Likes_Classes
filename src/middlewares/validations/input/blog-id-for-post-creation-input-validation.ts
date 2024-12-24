import {body} from "express-validator";

export const validateBlogIdForPostsRequestsInputParams: any = [
    body("blogId")
        .exists()
        .withMessage("Blog ID is required")
        .isString()
        .withMessage("Type of Blog ID must be string"),
]