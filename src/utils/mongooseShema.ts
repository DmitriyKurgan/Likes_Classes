import * as mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {MongoRefreshTokenType, RateLimitType, RecoveryCodeType} from "./types";
import {BlogViewModel} from "../models/view/BlogViewModel";
import {UserDBModel} from "../models/database/UserDBModel";
import {PostDBModel} from "../models/database/PostDBModel";
import {CommentDBModel} from "../models/database/CommentDBModel";
import {DeviceDBModel} from "../models/database/DeviceDBModel";


export const BlogsSchema = new mongoose.Schema<BlogViewModel>({
    id: String,
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: String,
    isMembership: Boolean
})

export const PostsSchema = new mongoose.Schema<PostDBModel>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    likesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true },
        users: [
            {
                addedAt: String,
                userId: String,
                userLogin: String,
                likeStatus: String,
            },
        ],
    },
})

export const CommentsSchema = new mongoose.Schema<CommentDBModel>({
    postId:{type: String, required: true},
    content:{type: String, required: true},
    commentatorInfo:{
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt:{type: String, required: true},
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    }
})

export const UsersSchema = new mongoose.Schema<UserDBModel>({
    _id: ObjectId,
    accountData: {
        userName: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        createdAt: String,
        isMembership: Boolean,
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    }
})

export const TokensSchema = new mongoose.Schema<MongoRefreshTokenType>({
    refreshToken: {type: String, required: true}
})

export const UsersSessionSchema = new mongoose.Schema<DeviceDBModel>({
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String,
    userId: String,
})

export const AttemptsSchema = new mongoose.Schema<RateLimitType>({
    userIP: String,
    url: String,
    time: Date
})

export const RecoveryCodeSchema = new mongoose.Schema<RecoveryCodeType>({
    email: String,
    recoveryCode: String
})

// export const LikeStatusSchema = new mongoose.Schema<LikeStatusType>({
//     parentId: String,
//     userId: String,
//     login: String,
//     addedAt: Date,
//     likeStatus: {type: String, enum: LikeStatusEnum}
// })