import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {CommentsModel} from "./db";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {CommentDBModel} from "../models/database/CommentDBModel";
export const comments = [] as CommentViewModel[]

export const commentsRepository = {
   async createComment(newComment:CommentDBModel):Promise<CommentViewModel | null> {
       const comment = await CommentsModel.create(newComment)

       return {
           id: comment._id.toString(),
           content: newComment.content,
           commentatorInfo: {
               userId: newComment.commentatorInfo.userId,
               userLogin: newComment.commentatorInfo.userLogin,
           },
           createdAt: newComment.createdAt,
           likesInfo: {
               likesCount: newComment.likesInfo.likesCount,
               dislikesCount: newComment.likesInfo.dislikesCount,
               myStatus: "None",
           },
       }
    },

   async updateComment(commentID:string, body:CommentDBModel): Promise<boolean> {
        const result: UpdateResult<CommentDBModel> = await CommentsModel
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