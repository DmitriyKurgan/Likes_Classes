import { Router } from "express";
import {
    validateEmail,
    validateEmailResendingRequests,
    validateNewPassword,
    validateRegistrationConfirmationRequests,
    validationEmailConfirm,
    validationEmailResend,
} from "../middlewares/email-and-password-validation";
import {AuthController} from "../controllers/AuthController";
import {validateBearerAuthorization} from "../middlewares/auth/auth-bearer";
import {validateUsersRequestsInputParams} from "../middlewares/validations/input/user-input-validation";
import {requestAttemptsMiddleware} from "../middlewares/raze-limiter";
import {validationRefreshToken} from "../middlewares/auth/refresh-token";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";
import {validateAuthRequestsInputParams} from "../middlewares/validations/input/auth-input-validation";
import {validationUserUnique} from "../middlewares/validations/find-by-id/user-validation";
import {container} from "../composition-root";

export const authRouter = Router({})

const authController = container.resolve(AuthController)

authRouter.post(
    '/login',
    validateAuthRequestsInputParams,
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    authController.loginUser.bind(authController)
)

authRouter.post(
    '/refresh-token',
    validationRefreshToken,
    authController.refreshToken.bind(authController)
)

authRouter.post('/registration',
    validateUsersRequestsInputParams,
    validationUserUnique("email"),
    validationUserUnique("login"),
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    authController.registerUser.bind(authController)
)

authRouter.post('/registration-confirmation',
    validateRegistrationConfirmationRequests,
    validationEmailConfirm,
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    authController.confirmRegistration.bind(authController)
)

authRouter.post('/registration-email-resending',
    validateEmailResendingRequests,
    validationEmailResend,
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    authController.resendEmail.bind(authController)
)

authRouter.get(
    '/me',
    validateBearerAuthorization,
    authController.me.bind(authController)
)

authRouter.post(
    '/logout',
    validationRefreshToken,
    authController.logoutUser.bind(authController)
)

authRouter.post('/password-recovery',
    requestAttemptsMiddleware,
    validateEmail,
    validateErrorsMiddleware,
    authController.recoverUserPassword.bind(authController)
)

authRouter.post('/new-password',
    requestAttemptsMiddleware,
    validateNewPassword,
    validateErrorsMiddleware,
    authController.createNewPassword.bind(authController)
)