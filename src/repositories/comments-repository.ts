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

    // async updateLikeStatus(commentID: string, userId: string, likeStatus: string): Promise<UpdateResult | any> {
    //
    //     const comment: any = await CommentsModel.findById(commentID);
    //
    //     if (!comment) return null
    //
    //     const userIndex = comment.likesInfo.users.findIndex((u: any )=> u.userId === userId);
    //     const currentStatus = userIndex !== -1 ? comment.likesInfo.users[userIndex].likeStatus : "None";
    //
    //     let incLikes = 0, incDislikes = 0;
    //
    //     if (likeStatus === "Like") {
    //         incLikes = currentStatus === "Like" ? -1 : 1;
    //         incDislikes = currentStatus === "Dislike" ? -1 : 0;
    //     } else if (likeStatus === "Dislike") {
    //         incLikes = currentStatus === "Like" ? -1 : 0;
    //         incDislikes = currentStatus === "Dislike" ? -1 : 1;
    //     } else {
    //         incLikes = currentStatus === "Like" ? -1 : 0;
    //         incDislikes = currentStatus === "Dislike" ? -1 : 0;
    //     }
    //
    //     if (userIndex !== -1) {
    //         if (likeStatus === "None") comment.likesInfo.users.splice(userIndex, 1);
    //         else comment.likesInfo.users[userIndex].likeStatus = likeStatus;
    //     } else if (likeStatus !== "None") {
    //         comment.likesInfo.users.push({ userId, likeStatus });
    //     }
    //
    //     comment.likesInfo.likesCount += incLikes;
    //     comment.likesInfo.dislikesCount += incDislikes;
    //     comment.likesInfo.myStatus = likeStatus;
    //
    //     await comment.save();
    //
    //     return comment;
    //
    // },

    async updateLikeStatus(commentID: string, userId: string, likeStatus: string): Promise<UpdateResult | any> {

        const comment: any = await CommentsModel.findById(commentID);

        if (!comment) return null;

        const userIndex = comment.likesInfo.users.findIndex((u: any) => u.userId === userId);
        const currentStatus = userIndex !== -1 ? comment.likesInfo.users[userIndex].likeStatus : "None";

        let incLikes = 0, incDislikes = 0;

        if (likeStatus === "Like") {
            if (currentStatus === "Like") {
                // Снимаем лайк
                incLikes = -1;
                likeStatus = "None";
            } else if (currentStatus === "Dislike") {
                // Меняем дизлайк на лайк
                incLikes = 1;
                incDislikes = -1;
            } else {
                // Ставим лайк
                incLikes = 1;
            }
        } else if (likeStatus === "Dislike") {
            if (currentStatus === "Dislike") {
                // Снимаем дизлайк
                incDislikes = -1;
                likeStatus = "None";
            } else if (currentStatus === "Like") {
                // Меняем лайк на дизлайк
                incDislikes = 1;
                incLikes = -1;
            } else {
                // Ставим дизлайк
                incDislikes = 1;
            }
        }

        // Обновление информации о пользователе
        if (userIndex !== -1) {
            if (likeStatus === "None") {
                comment.likesInfo.users.splice(userIndex, 1); // Удаляем пользователя
            } else {
                comment.likesInfo.users[userIndex].likeStatus = likeStatus; // Обновляем статус
            }
        } else if (likeStatus !== "None") {
            comment.likesInfo.users.push({ userId, likeStatus }); // Добавляем пользователя
        }

        // Обновление счетчиков
        comment.likesInfo.likesCount = Math.max(0, comment.likesInfo.likesCount + incLikes);
        comment.likesInfo.dislikesCount = Math.max(0, comment.likesInfo.dislikesCount + incDislikes);

        await comment.save();

        return comment;
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