import {ObjectId} from "mongodb";
import {PostDBModel} from "../models/database/PostDBModel";
import {PostViewModel} from "../models/view/PostViewModel";
import {BlogViewModel} from "../models/view/BlogViewModel";
import {BlogDBModel} from "../models/database/BlogDBModel";


export type RateLimitType = {
    userIP: string
    url: string
    time: Date
}


export type BlogsServiceType = {
    createBlog(body: BlogDBModel): Promise<BlogViewModel | null>
    updateBlog(blogID: string, body: BlogDBModel): Promise<boolean>
    deleteBlog(blogID: string): Promise<boolean>
}

export type PostsServiceType = {
    createPost(body: PostDBModel, blogName: string, blogID: string):Promise<PostViewModel | null>
    updatePost(postID: string, body: PostDBModel): Promise<boolean>
    deletePost(postID: string): Promise<boolean>
}

export type AccessToken = {
    accessToken: string;
};


export type TokenType = { accessToken: AccessToken; refreshToken: string }

export type MongoRefreshTokenType = {
    refreshToken: string;
};

export type RecoveryCodeType = {
    email: string
    recoveryCode: string
}

export enum LikeStatusEnum  {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
};

export type LikeStatusType = {
    parentId: string;
    userId: string;
    // login: string;
    likeStatus: LikeStatusEnum;
    addedAt: Date;
};
