import {PostsRepository} from "../infrastructure/repositories/posts-repository";
import {PostViewModel} from "../models/view/PostViewModel";
import {PostDBModel} from "../models/database/PostDBModel";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
export const posts = [] as PostViewModel[]
@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository
    ) {}
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

        const createdPost: PostViewModel | null = await this.postsRepository.createPost(newPost)
        return createdPost

    }
    async updatePost(postID:string, body:PostDBModel): Promise<boolean> {
        return await this.postsRepository.updatePost(postID,body)
    }
    async deletePost(postID:string){
        return await this.postsRepository.deletePost(postID)
    }
}
