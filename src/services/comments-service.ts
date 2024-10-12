import {CommentType, OutputCommentType} from "../utils/types";
import {commentsRepository} from "../repositories/comments-repository";

export const comments = [] as OutputCommentType[]

export const commentsService: any = {
    async createComment(body: CommentType, postID: string, userID:string, userLogin:string): Promise<OutputCommentType | null> {
        const newComment: CommentType = {
            postId:postID,
            content: body.content,
            commentatorInfo: {
                userId: userID,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString()
        }
        const createdComment: OutputCommentType | null = await commentsRepository.createComment(newComment);
        return createdComment
    },
    async deleteComment(commentID: string): Promise<boolean> {
        return await commentsRepository.deleteComment(commentID);
    },
    async updateComment(commentID: string, body: CommentType): Promise<boolean> {
        return await commentsRepository.updateComment(commentID, body);
    },

}