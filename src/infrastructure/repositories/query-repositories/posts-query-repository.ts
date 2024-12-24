import {ObjectId} from "mongodb";
import {getPostsFromDB} from "../../../utils/utils";
import {PostsModel} from "../db";
import {PostDBModel} from "../../../models/database/PostDBModel";
import {HydratedDocument} from "mongoose";

export const postsQueryRepository = {
    async findPostByID(postID:string):Promise<HydratedDocument<PostDBModel> | null> {
        return PostsModel.findOne({_id: new ObjectId(postID)});
    },
    async getAllPosts(query:any):Promise<any | { error: string }> {
        return getPostsFromDB(query);
    },
    async findAllPostsByBlogID(blogID: string, query:any):Promise<any | { error: string }> {
        return getPostsFromDB(query, blogID)
    },
}
