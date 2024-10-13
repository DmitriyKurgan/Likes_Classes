import {ObjectId} from "mongodb";
import {getCommentsFromDB} from "../../utils/utils";
import {CommentsModel} from "../db";
import {CommentDBModel, UserLikes} from "../../models/database/CommentDBModel";
import {CommentViewModel} from "../../models/view/CommentViewModel";

export const CommentMapper = (comment : CommentDBModel) : CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: status || "None",
        },
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
