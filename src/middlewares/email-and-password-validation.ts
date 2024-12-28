import {body} from 'express-validator';
import {container} from "../composition-root";
import {AuthQueryRepository} from "../infrastructure/repositories/query-repositories/auth-query-repository";

const authQueryRepository = container.resolve(AuthQueryRepository)

const emailpattern =
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validateEmail: any = [
    body("email")
        .exists()
        .withMessage("Email is required")
        .isString()
        .withMessage("Type of email must be string")
        .trim()
        .matches(emailpattern)
        .withMessage("Email must be in correct format"),
]

export const validateNewPassword: any = [
    body("newPassword")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Type of Password must be string")
        .trim()
        .isLength({
            min: 6,
            max: 20,
        })
        .withMessage(
            "Password length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("recoveryCode")
        .exists()
        .withMessage("RecoveryCode is required")
        .isString()
        .withMessage("RecoveryCode must be string")
        .trim()
]

export const validateRegistrationConfirmationRequests: any = [
    body("code")
        .exists()
        .withMessage("Confirmation code is required")
        .isString()
        .withMessage("Type of confirmation code must be a string")
        .trim()
]

export const validateEmailResendingRequests = [
    body("email")
        .exists()
        .withMessage("Email is required")
        .isString()
        .withMessage("Type of email must be a string")
        .trim()
        .matches(emailpattern)
        .withMessage("Email must be in correct format")
]

export const validationEmailResend = body("email").custom(async (value) => {

    const user = await authQueryRepository.findByLoginOrEmail(value)

    if (!user || user.emailConfirmation.isConfirmed) {
        throw new Error(
            "User with provided email not found or is already confirmed"
        )
    }

    return true

})

export const validationEmailConfirm = body("code").custom(async (value) => {

    const user = await authQueryRepository.findUserByEmailConfirmationCode(value)

    if (
        !user ||
        user.emailConfirmation.isConfirmed ||
        user.emailConfirmation.confirmationCode !== value ||
        user.emailConfirmation.expirationDate! < new Date()
    ) {
        throw new Error("Confirmation code is incorrect")
    }

    return true

})