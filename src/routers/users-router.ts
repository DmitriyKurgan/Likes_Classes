import {Router} from "express";
import {
    validateAuthorization,
    validateErrorsMiddleware, validateUserFindByParamId, validateUsersRequests,
} from "../middlewares/middlewares";
import {UsersController} from "../controllers/usersController";

export const usersRouter = Router({})

const usersController = new UsersController()
usersRouter.get(
    '/',
    validateAuthorization,
    validateErrorsMiddleware,
    usersController.getUsers.bind(usersController)
)


usersRouter.post(
    '/',
    validateAuthorization,
    validateUsersRequests,
    validateErrorsMiddleware,
    usersController.createUser.bind(usersController)
)

usersRouter.delete(
    '/:id',
    validateAuthorization,
    validateUserFindByParamId,
    validateErrorsMiddleware,
    usersController.deleteUser.bind(usersController)
)


