import {postsRepository} from "../repositories/posts-repository";
import {PostViewModel} from "../models/view/PostViewModel";
import {PostDBModel} from "../models/database/PostDBModel";
import {ObjectId} from "mongodb";
import {PostsServiceType} from "../utils/types";
export const posts = [] as PostViewModel[]

export const postsService: PostsServiceType = {
   async createPost(body:PostDBModel, blogName:string,blogID:string):Promise<PostViewModel | null> {

        const newPost = new PostDBModel(
          new ObjectId(),
          body.title,
          body.shortDescription,
          body.content,
          body.blogId ?? blogID,
           blogName,
          new Date().toISOString(),
       {
           likesCount: 0,
           dislikesCount: 0,
           users: [],
          }
        )

       const createdPost: PostViewModel | null = await postsRepository.createPost(newPost);
       return createdPost

    },
   async updatePost(postID:string, body:PostDBModel): Promise<boolean> {
       return await postsRepository.updatePost(postID,body);
    },
   async deletePost(postID:string){
       return await postsRepository.deletePost(postID);
    }

}