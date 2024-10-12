import {ObjectId, WithId, UpdateResult, DeleteResult} from "mongodb";
import {CommentType, OutputCommentType, PostType} from "../utils/types";
import {CommentMapper} from "./query-repositories/comments-query-repository";
import {CommentsModel} from "./db";
export const comments = [] as PostType[]

export const commentsRepository = {
   async createComment(newComment:CommentType):Promise<OutputCommentType | null> {
       const _id = await CommentsModel.create(newComment)
       const comment:WithId<CommentType> | null = await CommentsModel.findOne({_id})
       return comment ? CommentMapper(comment) : null
    },
   async updateComment(commentID:string, body:CommentType): Promise<boolean> {
        const result: UpdateResult<CommentType> = await CommentsModel
            .updateOne({_id: new ObjectId(commentID)},
            {$set: {
                    ...body,
                    content: body.content,
                    postId:body.postId
                }});
       return result.matchedCount === 1
    },
   async deleteComment(commentID:string){

        const result: DeleteResult = await CommentsModel.deleteOne({_id: new ObjectId(commentID)})

       return result.deletedCount === 1
    }

}