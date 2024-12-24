import {body, param} from "express-validator";
import {usersQueryRepository} from "../../../infrastructure/repositories/query-repositories/users-query-repository";
import {authQueryRepository} from "../../../infrastructure/repositories/query-repositories/auth-query-repository";

export const validateUserFindByParamId = param("id").custom(
    async (value) => {
        const result = await usersQueryRepository.findUserByID(value)
        if (!result) {
            throw new Error("ID not found")
        }
        return true
    }
)

export const validationUserUnique = (field: string) =>
    body(field).custom(async (value) => {

        const result = await authQueryRepository.findByLoginOrEmail(value)

        if (result) {
            throw new Error("User already registered")
        }

        return true
    })