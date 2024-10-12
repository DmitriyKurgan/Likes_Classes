import {ObjectId, WithId, UpdateResult, DeleteResult} from "mongodb";
import {OutputPostModel, PostType} from "../utils/types";
import {PostsModel} from "./db";
import {ExtendedUserLikes, PostDBModel} from "../models/database/PostDBModel";
import {PostViewModel} from "../models/view/PostViewModel";
export const posts = [] as PostType[]

export const postsRepository = {
   async createPost(newPost:PostDBModel):Promise<PostViewModel | null> {
       const _id = await PostsModel.create(newPost)

       return {
           id: _id.toString(),
           title: newPost.title,
           shortDescription: newPost.shortDescription,
           content: newPost.content,
           blogId: newPost.blogId,
           blogName: newPost.blogName,
           createdAt: newPost.createdAt,
           extendedLikesInfo: {
               likesCount: newPost.likesInfo.likesCount,
               dislikesCount: newPost.likesInfo.dislikesCount,
               myStatus: "None",
               newestLikes: []
           }
       }
    },
   async updatePost(postID:string, body:PostType): Promise<boolean> {
        const result: UpdateResult<PostType> = await PostsModel.updateOne({_id: new ObjectId(postID)},
            {$set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                }});
       return result.matchedCount === 1
    },
   async deletePost(postID:string){

        const result: DeleteResult = await PostsModel.deleteOne({_id: new ObjectId(postID)})

       return result.deletedCount === 1
    }

}