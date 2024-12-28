import {ObjectId} from "mongodb";
import {getBlogsFromDB} from "../../../utils/utils";
import {BlogModel} from "../db";
import {BlogViewModel} from "../../../models/view/BlogViewModel";
import {BlogDBModel} from "../../../models/database/BlogDBModel";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BlogsQueryRepository {
    async findBlogByID(blogID:string):Promise<BlogViewModel | null> {
        const blog: BlogDBModel | null = await BlogModel.findOne({_id: new ObjectId(blogID)})

        if (!blog) {
            return null
        }

        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    }
    async getAllBlogs(query:any):Promise<any | { error: string }> {
        return getBlogsFromDB(query);
    }
}