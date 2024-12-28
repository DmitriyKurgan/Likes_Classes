import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {CommentsModel, UsersModel} from "./db";
import {CommentViewModel} from "../../models/view/CommentViewModel";
import {CommentDBModel} from "../../models/database/CommentDBModel";
import {injectable} from "inversify";

export const comments = [] as CommentViewModel[]
@injectable()
export class CommentsRepository {

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
            }
        }
    }

    async updateComment(commentID: string, body: CommentDBModel): Promise<boolean> {
        const result: UpdateResult<CommentDBModel> = await CommentsModel
            .updateOne({_id: new ObjectId(commentID)},
                {
                    $set: {
                        ...body,
                        content: body.content,
                        postId: body.postId
                    }
                })
        return result.matchedCount === 1
    }
    async deleteComment(commentID: string) {

        const result: DeleteResult = await CommentsModel.deleteOne({_id: new ObjectId(commentID)})

        return result.deletedCount === 1
    }

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
        )

        if (!foundUser || foundUser.likesInfo.users.length === 0) {
            return null
        }

        return foundUser.likesInfo.users[0].likeStatus
    }

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
        return result.matchedCount === 1
    }

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
        )
        return result.matchedCount === 1
    }

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
        )

        return result.matchedCount === 1
    }

    async findUserInLikesInfo(
        commentId: string,
        userId: ObjectId
    ): Promise<CommentDBModel | null> {
        const foundUser = await CommentsModel.findOne(
            CommentsModel.findOne({
                _id: commentId,
                "likesInfo.users.userId": userId,
            })
        )

        if (!foundUser) {
            return null
        }

        return foundUser
    }

    async deleteAll(): Promise<boolean> {
        await CommentsModel.deleteMany({})
        return (await CommentsModel.countDocuments()) === 0
    }

}