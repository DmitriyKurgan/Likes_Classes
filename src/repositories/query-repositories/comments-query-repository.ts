import {ObjectId} from "mongodb";
import {getCommentsFromDB} from "../../utils/utils";
import {CommentsModel} from "../db";
import {CommentDBModel} from "../../models/database/CommentDBModel";
import {CommentViewModel} from "../../models/view/CommentViewModel";
import {commentsRepository} from "../comments-repository";

export const CommentMapper = async (comment : CommentDBModel, userId?: string) : Promise<CommentViewModel> => {

    let status;

    if (userId) {
        status = await commentsRepository.findUserLikeStatus(comment._id.toString(), new ObjectId(userId));
    }

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
            myStatus: status,
        },
    }
}

export const commentsQueryRepository = {
    async findAllCommentsByPostID(postID: string, query:any, userId: string):Promise<any | { error: string }> {
        return getCommentsFromDB(query, userId, postID)
    },
    async findCommentByID(commentID:string){
        const comment = await CommentsModel.findOne({_id: new ObjectId(commentID)})
        return comment ? CommentMapper(comment) : null
    }
}
