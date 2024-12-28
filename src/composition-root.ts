import "reflect-metadata";
import { BlogsController } from "./controllers/BlogsController";
import { PostsService } from "./application/posts-service";
import { BlogsService } from "./application/blogs-service";
import {BlogsQueryRepository} from "./infrastructure/repositories/query-repositories/blogs-query-repository";
import {PostsQueryRepository} from "./infrastructure/repositories/query-repositories/posts-query-repository";
import { BlogsRepository } from "./infrastructure/repositories/blogs-repository";
import { PostsRepository } from "./infrastructure/repositories/posts-repository";

import {AuthController} from "./controllers/AuthController";

import { CommentsService } from "./application/comments-service";

import { PostsController } from "./controllers/PostsController";

import { UsersService } from "./application/users-service";
import { UsersRepository } from "./infrastructure/repositories/users-repository";
import { AuthService } from "./application/auth-service";
import {UsersController} from "./controllers/UsersController";
import {SecurityDevicesController} from "./controllers/SecurityDevicesController";
import {CommentsController} from "./controllers/CommentsController";
import {CommentsRepository} from "./infrastructure/repositories/comments-repository";
import {SecurityDevicesRepository} from "./infrastructure/repositories/devices-repository";
import {SecurityDevicesService} from "./application/devices-service";
import {TestingController} from "./controllers/TestingController";
import {JwtService} from "./application/jwt-service";
import {AuthRepository} from "./infrastructure/repositories/auth-repository";
import {AuthQueryRepository} from "./infrastructure/repositories/query-repositories/auth-query-repository";
import {UsersQueryRepository} from "./infrastructure/repositories/query-repositories/users-query-repository";
import {SecurityDevicesQueryRepository} from "./infrastructure/repositories/query-repositories/devices-query-repository";
import {CommentsQueryRepository} from "./infrastructure/repositories/query-repositories/comments-query-repository";
import { Container } from "inversify";

export const container = new Container()
container.bind(AuthController).to(AuthController)

container.bind(PostsController).to(PostsController)
container.bind(UsersController).to(UsersController)

container.bind(BlogsController).to(BlogsController)
container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(CommentsController).to(CommentsController)
container.bind(TestingController).to(TestingController)

container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(UsersService).to(UsersService)
container.bind(AuthService).to(AuthService)
container.bind(JwtService).to(JwtService)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(CommentsService).to(CommentsService)

container.bind(BlogsRepository).to(BlogsRepository)
container.bind(AuthRepository).to(AuthRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)
container.bind(CommentsRepository).to(CommentsRepository)

container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(AuthQueryRepository).to(AuthQueryRepository)
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)