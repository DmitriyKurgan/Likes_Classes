import { Router } from "express";
import {
    authMiddleware, requestAttemptsMiddleware,
    validateAuthRequests, validateEmail,
    validateEmailResendingRequests,
    validateErrorsMiddleware, validateNewPassword,
    validateRegistrationConfirmationRequests,
    validateUsersRequests,
    validationEmailConfirm,
    validationEmailResend,
    validationRefreshToken,
    validationUserUnique
} from "../middlewares/middlewares";
import {AuthController} from "../controllers/authController";

export const authRouter = Router({})

const authController = new AuthController()

authRouter.post(
    '/login',
    validateAuthRequests,
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
    validateUsersRequests,
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
    authMiddleware,
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