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
        userId: ObjectId,
        likeStatus: string,
    ): Promise<boolean> {
        const foundComment = await commentsQueryRepository.findCommentByID(
            commentId
        );

        if (!foundComment) {
            return false;
        }

        let likesCount = foundComment.likesInfo.likesCount;
        let dislikesCount = foundComment.likesInfo.dislikesCount;

        const foundUser = await commentsRepository.findUserInLikesInfo(
            commentId,
            userId
        );

        if (!foundUser) {
            await commentsRepository.pushUserInLikesInfo(
                commentId,
                userId,
                likeStatus
            );

            if (likeStatus === "Like") {
                likesCount++;
            }

            if (likeStatus === "Dislike") {
                dislikesCount++;
            }

            return commentsRepository.updateLikesCount(
                commentId,
                likesCount,
                dislikesCount
            );
        }

        let userLikeDBStatus = await commentsRepository.findUserLikeStatus(
            commentId,
            userId
        );

        switch (userLikeDBStatus) {
            case "None":
                if (likeStatus === "Like") {
                    likesCount++;
                }

                if (likeStatus === "Dislike") {
                    dislikesCount++;
                }

                break;

            case "Like":
                if (likeStatus === "None") {
                    likesCount--;
                }

                if (likeStatus === "Dislike") {
                    likesCount--;
                    dislikesCount++;
                }
                break;

            case "Dislike":
                if (likeStatus === "None") {
                    dislikesCount--;
                }

                if (likeStatus === "Like") {
                    dislikesCount--;
                    likesCount++;
                }
        }

        await commentsRepository.updateLikesCount(
            commentId,
            likesCount,
            dislikesCount
        );

        return commentsRepository.updateLikesStatus(
            commentId,
            userId,
            likeStatus
        );
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
    },

    async pushUserInLikesInfo(
        commentId: string,
        userId: ObjectId,
        likeStatus: string
    ): Promise<boolean> {
        const result: any = await CommentsModel.updateOne(
            { _id: commentId },
            {
                $push: {
                    "likesInfo.users": {
                        userId,
                        likeStatus,
                    },
                },
            }
        );
        return result.matchedCount === 1;
    },

    async updateLikesCount(
        commentId: string,
        likesCount: number,
        dislikesCount: number
    ): Promise<boolean> {
        const result: any = await CommentsModel.updateOne(
            { _id: commentId },
            {
                $set: {
                    "likesInfo.likesCount": likesCount,
                    "likesInfo.dislikesCount": dislikesCount,
                },
            }
        );
        return result.matchedCount === 1;
    },

    async updateLikesStatus(
        commentId: string,
        userId: ObjectId,
        likeStatus: string
    ): Promise<boolean> {
        const result: any = await CommentsModel.updateOne(
            { _id: commentId, "likesInfo.users.userId": userId },
            {
                $set: {
                    "likesInfo.users.$.likeStatus": likeStatus,
                },
            }
        );
        return result.matchedCount === 1;
    },

    async findUserInLikesInfo(
        commentId: string,
        userId: ObjectId
    ): Promise<CommentDBModel | null> {
        const foundUser = await CommentsModel.findOne(
            CommentsModel.findOne({
                _id: commentId,
                "likesInfo.users.userId": userId,
            })
        );

        if (!foundUser) {
            return null;
        }

        return foundUser;
    }
}