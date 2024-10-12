import {CommentType, OutputCommentType} from "../../utils/types";
import {ObjectId, WithId} from "mongodb";
import {getCommentsFromDB} from "../../utils/utils";
import {CommentsModel} from "../db";

export const CommentMapper = (comment : WithId<CommentType>) : OutputCommentType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo:{
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt:comment.createdAt
    }
}

export const commentsQueryRepository = {
    async findAllCommentsByPostID(postID: string, query:any):Promise<any | { error: string }> {
        return getCommentsFromDB(query, postID)
    },
    async findCommentByID(commentID:string){
        const comment = await CommentsModel.findOne({_id: new ObjectId(commentID)})
        return comment ? CommentMapper(comment) : null
    }
}
