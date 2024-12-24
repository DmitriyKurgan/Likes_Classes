import {body} from "express-validator";

const loginPattern = /^[a-zA-Z0-9_-]*$/
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const validateUsersRequestsInputParams: any = [
    body("login")
        .exists()
        .withMessage("Login is required")
        .isString()
        .withMessage("Type of Login must be string")
        .matches(loginPattern)
        .trim()
        .withMessage("Login must be in correct format")
        .isLength({
            min: 3,
            max: 10,
        })
        .withMessage(
            "Login length must be more than 2 and less than or equal to 10 symbols"
        ),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Type of password must be a string")
        .trim()
        .isLength({
            min: 6,
            max: 20,
        })
        .withMessage(
            "Password length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("email")
        .exists()
        .withMessage("Email is required")
        .isString()
        .withMessage("Type of email must be string")
        .trim()
        .matches(emailPattern)
        .withMessage("Email must be in correct format")
]