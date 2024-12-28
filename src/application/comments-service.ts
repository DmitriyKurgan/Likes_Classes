import {CommentDBModel} from "../models/database/CommentDBModel";
import {ObjectId} from "mongodb";
import {CommentViewModel} from "../models/view/CommentViewModel";

import {inject, injectable} from "inversify";
import {CommentsRepository} from "../infrastructure/repositories/comments-repository";
import {CommentsQueryRepository} from "../infrastructure/repositories/query-repositories/comments-query-repository";

export const comments = [] as CommentViewModel[]
@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
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

    async updateLikeStatus(
        commentId: string,
        userId: ObjectId,
        likeStatus: string,
    ): Promise<boolean> {

        const foundComment = await this.commentsQueryRepository.findCommentByID(
            commentId
        )

        if (!foundComment) {
            return false
        }

        let likesCount = foundComment.likesInfo.likesCount
        let dislikesCount = foundComment.likesInfo.dislikesCount

        const foundUser = await this.commentsRepository.findUserInLikesInfo(
            commentId,
            userId
        )

        if (!foundUser) {
            await this.commentsRepository.pushUserInLikesInfo(
                commentId,
                userId,
                likeStatus
            );

            if (likeStatus === "Like") {
                likesCount++
            }

            if (likeStatus === "Dislike") {
                dislikesCount++
            }

            return this.commentsRepository.updateLikesCount(
                commentId,
                likesCount,
                dislikesCount
            )
        }

        let userLikeDBStatus = await this.commentsRepository.findUserLikeStatus(
            commentId,
            userId
        )

        switch (userLikeDBStatus) {
            case "None":
                if (likeStatus === "Like") {
                    likesCount++
                }

                if (likeStatus === "Dislike") {
                    dislikesCount++
                }

                break

            case "Like":
                if (likeStatus === "None") {
                    likesCount--
                }

                if (likeStatus === "Dislike") {
                    likesCount--
                    dislikesCount++
                }
                break

            case "Dislike":
                if (likeStatus === "None") {
                    dislikesCount--
                }

                if (likeStatus === "Like") {
                    dislikesCount--
                    likesCount++
                }
        }

        await this.commentsRepository.updateLikesCount(
            commentId,
            likesCount,
            dislikesCount
        )

        return this.commentsRepository.updateLikesStatus(
            commentId,
            userId,
            likeStatus
        )
    }
}
