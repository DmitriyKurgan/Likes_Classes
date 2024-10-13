import {commentsRepository} from "../repositories/comments-repository";
import {CommentDBModel, UserLikes} from "../models/database/CommentDBModel";
import {ObjectId} from "mongodb";
import {CommentViewModel} from "../models/view/CommentViewModel";

export const comments = [] as CommentViewModel[]

export const commentsService: any = {
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
                users: []
            }
        )

        const createdComment: CommentViewModel | null = await commentsRepository.createComment(newComment);
        return createdComment
    },
    async deleteComment(commentID: string): Promise<boolean> {
        return await commentsRepository.deleteComment(commentID);
    },
    async updateComment(commentID: string, body: CommentDBModel): Promise<boolean> {
        return await commentsRepository.updateComment(commentID, body);
    },

}