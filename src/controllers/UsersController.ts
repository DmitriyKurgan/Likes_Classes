import {users, UsersService} from "../application/users-service";
import {Request, Response} from "express";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {usersQueryRepository} from "../infrastructure/repositories/query-repositories/users-query-repository";
import {UserViewModel} from "../models/view/UserViewModel";
import {inject} from "inversify/lib/esm";

export class UsersController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
    ) {}

    async getUsers (req: Request, res: Response){

        const queryValues = getQueryValues({
            pageNumber:req.query.pageNumber,
            pageSize:req.query.pageSize,
            sortBy:req.query.sortBy,
            sortDirection:req.query.sortDirection,
            searchLoginTerm:req.query.searchLoginTerm,
            searchEmailTerm:req.query.searchEmailTerm})

        const users = await usersQueryRepository.getAllUsers({...queryValues})

        res.status(CodeResponsesEnum.OK_200).send(users)
    }


    async createUser (req: Request, res: Response){

        const newUser: UserViewModel | null =
            await this.usersService.createUser(req.body.login, req.body.email, req.body.password)

        if (newUser) {
            users.push(newUser)
            res.status(CodeResponsesEnum.Created_201).send(newUser)
        }
    }

    async deleteUser (req: Request, res: Response){

        const userID: string = req.params.id
        const isDeleted: boolean = await this.usersService.deleteUser(userID)

        if (!isDeleted || !userID) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }

}