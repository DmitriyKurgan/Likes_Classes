import {Request, Response, Router} from "express";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {
    validateAuthorization,
    validateErrorsMiddleware, validateUserFindByParamId, validateUsersRequests,
} from "../middlewares/middlewares";
import {users, usersService} from "../services/users-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {EazeUserType} from "../utils/types";

export const usersRouter = Router({});

usersRouter.get('/', validateAuthorization, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const queryValues = getQueryValues({
        pageNumber:req.query.pageNumber,
        pageSize:req.query.pageSize,
        sortBy:req.query.sortBy,
        sortDirection:req.query.sortDirection,
        searchLoginTerm:req.query.searchLoginTerm,
        searchEmailTerm:req.query.searchEmailTerm});
    const users = await usersQueryRepository.getAllUsers({...queryValues});
    res.status(CodeResponsesEnum.OK_200).send(users)
})


usersRouter.post('/', validateAuthorization, validateUsersRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const newUser: EazeUserType | null = await usersService.createUser(req.body.login, req.body.email, req.body.password);
    if (newUser) {
        users.push(newUser);
        res.status(CodeResponsesEnum.Created_201).send(newUser);
    }
});

usersRouter.delete('/:id', validateAuthorization, validateUserFindByParamId, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const userID: string = req.params.id;
    const isDeleted: boolean = await usersService.deleteUser(userID);
    if (!isDeleted || !userID) {
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


