import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {CommentsModel, LikesStatusModel} from "./db";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {CommentDBModel} from "../models/database/CommentDBModel";
import {LikeStatusType} from "../utils/types";
import {commentsQueryRepository} from "./query-repositories/comments-query-repository";
import {UserDBModel} from "../models/database/UserDBModel";
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

    async updateLikeStatus(
        commentId: string,
        likeStatus: string,
        userId: string
    ): Promise<boolean> {
        const comment: any = await CommentsModel.findById(commentId);
        if (!comment) return false;

        const userIndex = comment.likesInfo.users.findIndex((u: any) => u.userId === userId);
        const currentStatus = userIndex !== -1 ? comment.likesInfo.users[userIndex].likeStatus : "None";

        let incLikes = 0;
        let incDislikes = 0;

        switch (currentStatus) {
            case "None":
                if (likeStatus === "Like") incLikes++;
                if (likeStatus === "Dislike") incDislikes++;
                break;

            case "Like":
                if (likeStatus === "None") incLikes--;
                if (likeStatus === "Dislike") {
                    incLikes--;
                    incDislikes++;
                }
                break;

            case "Dislike":
                if (likeStatus === "None") incDislikes--;
                if (likeStatus === "Like") {
                    incDislikes--;
                    incLikes++;
                }
                break;
        }

        if (userIndex !== -1) {
            if (likeStatus === "None") {
                comment.likesInfo.users.splice(userIndex, 1);
            } else {
                comment.likesInfo.users[userIndex].likeStatus = likeStatus;
            }
        } else if (likeStatus !== "None") {
            comment.likesInfo.users.push({ userId, likeStatus });
        }

        comment.likesInfo.likesCount += incLikes;
        comment.likesInfo.dislikesCount += incDislikes;

        await comment.save();
        return true;
    },

    async findUserLikeStatus(
        commentId: string,
        userId: ObjectId
    ): Promise<string | null> {
        const foundUser: any = await CommentsModel.findOne(
            { _id: commentId },
            {
                "likesInfo.users": {
                    $filter: {
                        input: "$likesInfo.users",
                        cond: { $eq: ["$$this.userId", userId.toString()] },
                    },
                },
            }
        );

        if (!foundUser || foundUser.likesInfo.users.length === 0) {
            return null;
        }

        return foundUser.likesInfo.users[0].likeStatus;
    }
}