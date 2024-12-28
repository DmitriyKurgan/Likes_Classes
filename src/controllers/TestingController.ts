import { Request, Response } from "express";
import { BlogsRepository } from "../infrastructure/repositories/blogs-repository";
import { PostsRepository } from "../infrastructure/repositories/posts-repository";
import { UsersRepository } from "../infrastructure/repositories/users-repository";
import { CommentsRepository } from "../infrastructure/repositories/comments-repository";
import { SecurityDevicesRepository } from "../infrastructure/repositories/devices-repository";
import { inject, injectable } from "inversify";
import {AttemptsModel, TokensModel} from "../infrastructure/repositories/db";

@injectable()
export class TestingController {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(UsersRepository) protected usersRepository: UsersRepository,
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    @inject(SecurityDevicesRepository) protected devicesRepository: SecurityDevicesRepository,
  ) {}
  async deleteEverything(req: Request, res: Response) {
    await this.blogsRepository.deleteAll()
    await this.postsRepository.deleteAll()
    await this.usersRepository.deleteAll()
    await this.commentsRepository.deleteAll()
    await this.devicesRepository.deleteAll()
    await TokensModel.deleteMany({})
    await AttemptsModel.deleteMany({})
    res.sendStatus(204)
  }
}