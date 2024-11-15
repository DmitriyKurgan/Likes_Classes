import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {CommentsModel, LikesStatusModel} from "./db";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {CommentDBModel} from "../models/database/CommentDBModel";
import {LikeStatusType} from "../utils/types";
import {commentsQueryRepository} from "./query-repositories/comments-query-repository";
export const comments = [] as CommentViewModel[]

export const commentsRepository = {
    async createComment(newComment: CommentDBModel): Promise<CommentViewModel | null> {
        const comment = await CommentsModel.create(newComment)

        return {
            id: comment._id.toString(),
            content: newComment.content,
            commentatorInfo: {
                userId: newComment.commentatorInfo.userId,
                userLogin: newComment.commentatorInfo.userLogin,
            },
            createdAt: newComment.createdAt,
            likesInfo: {
                likesCount: newComment.likesInfo.likesCount,
                dislikesCount: newComment.likesInfo.dislikesCount,
                myStatus: newComment.likesInfo.myStatus,
            },
        }
    },

    async updateComment(commentID: string, body: CommentDBModel): Promise<boolean> {
        const result: UpdateResult<CommentDBModel> = await CommentsModel
            .updateOne({_id: new ObjectId(commentID)},
                {
                    $set: {
                        ...body,
                        content: body.content,
                        postId: body.postId
                    }
                });
        return result.matchedCount === 1
    },
    async deleteComment(commentID: string) {

        const result: DeleteResult = await CommentsModel.deleteOne({_id: new ObjectId(commentID)})

        return result.deletedCount === 1
    },

    async updateLikeStatus(commentID: string, userId: string, likeStatus: string): Promise<UpdateResult | any> {

        const comment: any = await CommentsModel.findById(commentID);

        if (!comment) return null

        const userIndex = comment.likesInfo.users.findIndex(u => u.userId === userId);
        const currentStatus = userIndex !== -1 ? comment.likesInfo.users[userIndex].likeStatus : "None";

        let incLikes = 0, incDislikes = 0;

        if (likeStatus === "Like") {
            incLikes = currentStatus === "Like" ? -1 : 1;
            incDislikes = currentStatus === "Dislike" ? -1 : 0;
        } else if (likeStatus === "Dislike") {
            incLikes = currentStatus === "Like" ? -1 : 0;
            incDislikes = currentStatus === "Dislike" ? -1 : 1;
        } else {
            incLikes = currentStatus === "Like" ? -1 : 0;
            incDislikes = currentStatus === "Dislike" ? -1 : 0;
        }

        if (userIndex !== -1) {
            if (likeStatus === "None") comment.likesInfo.users.splice(userIndex, 1);
            else comment.likesInfo.users[userIndex].likeStatus = likeStatus;
        } else if (likeStatus !== "None") {
            comment.likesInfo.users.push({ userId, likeStatus });
        }

        comment.likesInfo.likesCount += incLikes;
        comment.likesInfo.dislikesCount += incDislikes;
        comment.likesInfo.myStatus = likeStatus;

        await comment.save();

        return comment;

    }
}