import {Router} from "express";
import {UsersController} from "../controllers/usersController";
import {validateBasicAuthorization} from "../middlewares/auth/auth-basic";
import {validateUserFindByParamId} from "../middlewares/validations/find-by-id/user-validation";
import {validateUsersRequestsInputParams} from "../middlewares/validations/input/user-input-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";

export const usersRouter = Router({})

const usersController = new UsersController()
usersRouter.get(
    '/',
    validateBasicAuthorization,
    validateErrorsMiddleware,
    usersController.getUsers.bind(usersController)
)


usersRouter.post(
    '/',
    validateBasicAuthorization,
    validateUsersRequestsInputParams,
    validateErrorsMiddleware,
    usersController.createUser.bind(usersController)
)

usersRouter.delete(
    '/:id',
    validateBasicAuthorization,
    validateUserFindByParamId,
    validateErrorsMiddleware,
    usersController.deleteUser.bind(usersController)
)


