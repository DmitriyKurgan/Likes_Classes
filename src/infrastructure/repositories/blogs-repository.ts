import {BlogModel} from "./db";
import {ObjectId, UpdateResult} from "mongodb";
import {BlogViewModel} from "../../models/view/BlogViewModel";
import {BlogDBModel} from "../../models/database/BlogDBModel";
import {injectable} from "inversify";
export const blogs = [] as BlogDBModel[]
@injectable()
export class BlogsRepository {
    async createBlog(newBlog:BlogDBModel):Promise<BlogViewModel | null> {
        const blog = await BlogModel.create(newBlog);
        return {
            id: blog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    }
    async updateBlog(blogID:string, body: BlogDBModel):Promise<boolean> {
        const result: UpdateResult<BlogDBModel>= await BlogModel.updateOne({_id: new ObjectId(blogID)},
            {$set:{name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }}
        );
        return result.matchedCount === 1
    }
    async deleteBlog(blogID:string): Promise<boolean>{
        const result: any = await BlogModel.deleteOne({_id: new ObjectId(blogID)})
        return result.deletedCount === 1
    }

    async deleteAll(): Promise<boolean> {
        await BlogModel.deleteMany({})
        return (await BlogModel.countDocuments()) === 0
    }
}
