import {users, UsersService} from "../services/users-service";
import {Request, Response} from "express";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {UserViewModel} from "../models/view/UserViewModel";
export class UsersController {
    private usersService: UsersService
    constructor() {
        this.usersService = new UsersService()
    }

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