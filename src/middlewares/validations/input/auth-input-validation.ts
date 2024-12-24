import {body} from "express-validator";

export const validateAuthRequestsInputParams: any = [
    body("loginOrEmail")
        .exists()
        .withMessage("LoginOrEmail is required")
        .isString()
        .withMessage("Type of LoginOrEmail must be string")
        .trim(),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .trim()
]