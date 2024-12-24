import {body} from "express-validator";

export const validateCommentsRequestsInputParams: any = [
    body("content")
        .exists()
        .withMessage("Content is required")
        .isString()
        .withMessage("Type of content must be a string")
        .trim()
        .withMessage("Content must be in correct format")
        .isLength({
            min: 20,
            max: 300,
        })
        .withMessage(
            "Content length must be more than 20 and less than or equal to 300 symbols"
        )
]