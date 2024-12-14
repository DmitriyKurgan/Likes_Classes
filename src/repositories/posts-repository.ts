import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {PostsModel} from "./db";
import {PostDBModel} from "../models/database/PostDBModel";
import {PostViewModel} from "../models/view/PostViewModel";
export const posts = [] as PostViewModel[]

export class PostsRepository {
    async createPost(newPost:PostDBModel):Promise<PostViewModel | null> {
        const post = await PostsModel.create(newPost)

        return {
            id: post._id.toString(),
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
    }
    async updatePost(postID:string, body: PostDBModel): Promise<boolean> {
        const result: UpdateResult<PostDBModel> = await PostsModel.updateOne({_id: new ObjectId(postID)},
            {$set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                }});
        return result.matchedCount === 1
    }
    async deletePost(postID:string){

        const result: DeleteResult = await PostsModel.deleteOne({_id: new ObjectId(postID)})

        return result.deletedCount === 1
    }
}
