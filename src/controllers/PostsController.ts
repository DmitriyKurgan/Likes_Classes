import {posts, PostsService} from "../application/posts-service";
import {Request, Response} from "express";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {PostDBModel} from "../models/database/PostDBModel";
import {CommentsQueryRepository} from "../infrastructure/repositories/query-repositories/comments-query-repository";
import {BlogViewModel} from "../models/view/BlogViewModel";
import {PostViewModel} from "../models/view/PostViewModel";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {comments, CommentsService} from "../application/comments-service";
import {UsersRepository} from "../infrastructure/repositories/users-repository";
import {inject, injectable} from "inversify";
import {PostsQueryRepository} from "../infrastructure/repositories/query-repositories/posts-query-repository";
import {BlogsQueryRepository} from "../infrastructure/repositories/query-repositories/blogs-query-repository";

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async getPosts (req:Request, res:Response){

        const queryValues = getQueryValues({
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            searchNameTerm: req.query.searchNameTerm
        })

        const posts =  await this.postsQueryRepository.getAllPosts({...queryValues})

        if (!posts || !posts.items.length) {
            return res.status(CodeResponsesEnum.OK_200).send([])
        }

        res.status(CodeResponsesEnum.OK_200).send(posts)
    }

    async getSpecificPost (req:Request, res:Response){

        const postID:string = req.params.id
        const postByID:PostDBModel|null = await this.postsQueryRepository.findPostByID(postID)

        if (!postID || !postByID){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.status(CodeResponsesEnum.OK_200).send(postByID)
    }

    async getAllCommentsOfPost (req:Request, res:Response){

        const queryValues = getQueryValues({
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
        })

        const postID:string = req.params.id
        const postByID:PostDBModel|null = await this.postsQueryRepository.findPostByID(postID)

        if (!postID || !postByID){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        const commentsForParticularPost = await this.commentsQueryRepository.findAllCommentsByPostID(postID, queryValues, req.userId!)

        if (!commentsForParticularPost || !commentsForParticularPost.items.length) {
            return res.status(CodeResponsesEnum.OK_200).send([])
        }

        res.status(CodeResponsesEnum.OK_200).send(commentsForParticularPost)
    }

    async createPost (req:Request, res:Response){

        const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlogByID(req.body.blogId)

        if (!blog){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        const newPost: PostViewModel| null = await this.postsService.createPost( req.body, blog.name, blog.id)

        if (!newPost) {
            return
        }

        posts.push(newPost)
        res.status(CodeResponsesEnum.Created_201).send(newPost)
    }

    async createCommentForPost (req:Request, res:Response){

        const post: PostDBModel | null = await this.postsQueryRepository.findPostByID(req.params.id)

        if (!post){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        const user = await this.usersRepository.findUserByID(req.userId!)
        const newComment: CommentViewModel | null = await this.commentsService.createComment(req.body, post._id.toString(), req.userId!, user!.accountData.userName)

        if (!newComment) {
            return
        }

        comments.push(newComment)
        res.status(CodeResponsesEnum.Created_201).send(newComment)
    }

    async updatePost (req:Request, res:Response){

        const postID = req.params.id
        const isUpdated = await this.postsService.updatePost(postID, req.body)

        if (!isUpdated || !postID){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        const postByID = await this.postsQueryRepository.findPostByID(postID)

        res.status(CodeResponsesEnum.Not_content_204).send(postByID)
    }

    async deletePost (req:Request, res:Response){

        const postID = req.params.id
        const isDeleted = await this.postsService.deletePost(postID)

        if(!isDeleted || !postID){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }

}