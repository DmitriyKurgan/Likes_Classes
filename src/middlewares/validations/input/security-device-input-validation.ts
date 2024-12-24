import {body} from "express-validator";

export const validateUsersRequestsInputParams: any = [
    body('ip')
        .isString().withMessage('IP address must be a string')
        .notEmpty().withMessage('IP address is required'),
    body('title')
        .isString().withMessage('Device name must be a string')
        .notEmpty().withMessage('Device name is required'),
    body('lastActiveDate')
        .isString().withMessage('Last active date must be a string')
        .notEmpty().withMessage('Last active date is required'),
    body('deviceId')
        .isString().withMessage('Device ID must be a string')
        .notEmpty().withMessage('Device ID is required'),
]
