import {BlogsServiceType, BLogType} from "../utils/types";
import {blogsRepository} from "../repositories/blogs-repository";
import {BlogDBModel} from "../models/database/BlogDBModel";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/view/BlogViewModel";
export const blogs = [] as BlogViewModel[]

export const blogsService:BlogsServiceType = {

    async createBlog(body:BlogDBModel):Promise<BlogViewModel | null> {

        const newBlog = new BlogDBModel(
             new ObjectId(),
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
           false
        )

        const createdBlog: BlogViewModel | null = await blogsRepository.createBlog(newBlog);
        return createdBlog;
    },
    async updateBlog(blogID:string, body:BlogDBModel):Promise<boolean> {
        return await blogsRepository.updateBlog(blogID,body)
    },
   async deleteBlog(blogID:string): Promise<boolean>{
       return await blogsRepository.deleteBlog(blogID);
    }

}