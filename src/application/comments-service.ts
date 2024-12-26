import {CommentsRepository} from "../infrastructure/repositories/comments-repository";
import {CommentDBModel} from "../models/database/CommentDBModel";
import {ObjectId, UpdateResult} from "mongodb";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {commentsQueryRepository} from "../infrastructure/repositories/query-repositories/comments-query-repository";
import {inject, injectable} from "inversify";
import "reflect-metadata";

export const comments = [] as CommentViewModel[]
@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository
    ) {}
    async createComment(body: CommentDBModel, postID: string, userID:string, userLogin:string): Promise<CommentViewModel | null> {
        const newComment = new CommentDBModel(
            new ObjectId(),
            body.content,
            {
                userId: userID,
                userLogin: userLogin
            },
            postID,
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                users: []
            }
        )

        const createdComment: CommentViewModel | null = await this.commentsRepository.createComment(newComment);
        return createdComment
    }
    async deleteComment(commentID: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(commentID);
    }
    async updateComment(commentID: string, body: CommentDBModel): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentID, body);
    }
    async updateLikeStatus(commentID: string, userId: string, likeStatus: string): Promise<UpdateResult | any> {
        const comment = await commentsQueryRepository.findCommentByID(commentID, userId);
        if (!comment) return null
        return this.commentsRepository.updateLikeStatus(commentID, new ObjectId(userId), likeStatus);
    }
}
