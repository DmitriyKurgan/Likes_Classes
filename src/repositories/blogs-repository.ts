import {BlogModel} from "../repositories/db";
import {ObjectId, UpdateResult} from "mongodb";
import {BLogType} from "../utils/types";
import {BlogViewModel} from "../models/view/BlogViewModel";
import {BlogDBModel} from "../models/database/BlogDBModel";
export const blogs = [] as BLogType[]


export const blogsRepository = {
    async createBlog(newBlog:BlogDBModel):Promise<BlogViewModel | null> {
        const _id = await BlogModel.create(newBlog);
        return {
            id: _id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    async updateBlog(blogID:string, body:BLogType):Promise<boolean> {
        const result: UpdateResult<BLogType>= await BlogModel.updateOne({_id: new ObjectId(blogID)},
            {$set:{name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
            }}
        );
        return result.matchedCount === 1;
    },
   async deleteBlog(blogID:string): Promise<boolean>{
       const result: any = await BlogModel.deleteOne({_id: new ObjectId(blogID)});
       return result.deletedCount === 1
    }
}