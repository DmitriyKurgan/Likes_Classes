import "reflect-metadata";
import { BlogsRepository } from "./infrastructure/repositories/blogs-repository";
import { BlogsService } from "./application/blogs-service";
import { BlogsController } from "./controllers/BlogsController";
import { PostsService } from "./application/posts-service";
import { PostsRepository } from "./infrastructure/repositories/posts-repository";
import { CommentsService } from "./application/comments-service";
import { PostsController } from "./controllers/PostsController";
import { UsersService } from "./application/users-service";
import { UsersRepository } from "./infrastructure/repositories/users-repository";
import { AuthService } from "./application/auth-service";
import { Container } from "inversify";
import {UsersController} from "./controllers/usersController";
import {SecurityDevicesController} from "./controllers/securityDevicesController";
import {CommentsController} from "./controllers/commentsController";
import {CommentsRepository} from "./infrastructure/repositories/comments-repository";
import {SecurityDevicesRepository} from "./infrastructure/repositories/devices-repository";
import {SecurityDevicesService} from "./application/devices-service";
import {TestingController} from "./controllers/TestingController";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/authController";

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(PostsController).to(PostsController)
container.bind(UsersController).to(UsersController)
container.bind(AuthController).to(AuthController)
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
container.bind(PostsRepository).to(PostsRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)
container.bind(CommentsRepository).to(CommentsRepository)

// container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
// container.bind(PostsQueryRepository).to(PostsQueryRepository)
// container.bind(UsersQueryRepository).to(UsersQueryRepository)
// container.bind(DevicesQueryRepository).to(DevicesQueryRepository)
// container.bind(CommentsQueryRepository).to(CommentsQueryRepository)