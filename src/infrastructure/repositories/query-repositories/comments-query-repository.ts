import {inject, injectable} from "inversify";
import {CommentsRepository} from "../comments-repository";
import {ObjectId} from "mongodb";
import {getCommentsFromDB} from "../../../utils/utils";
import {CommentsModel} from "../db";
import {CommentDBModel} from "../../../models/database/CommentDBModel";
import {CommentViewModel} from "../../../models/view/CommentViewModel";
import {container} from "../../../composition-root";

@injectable()
export class CommentsQueryRepository {
   constructor(
      @inject(CommentsRepository) protected commentsRepository: CommentsRepository
    ) {}

    async findAllCommentsByPostID(postID: string, query:any, userId: string):Promise<any | { error: string }> {
        return getCommentsFromDB(query, userId, postID)
    }
    async findCommentByID(commentID:string, userId?: string){
        const comment = await CommentsModel.findOne({_id: new ObjectId(commentID)})
        return comment ? this.CommentMapper(comment, userId) : null
    }
    public async CommentMapper (comment : CommentDBModel, userId?: string) : Promise<CommentViewModel> {

        let status
        if (userId) {
            status = await this.commentsRepository.findUserLikeStatus(comment._id.toString(), new ObjectId(userId))
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
                myStatus: status || "None",
            },
        }
    }

}

export async function CommentMapper (comment : CommentDBModel, userId?: string) : Promise<CommentViewModel> {

    const commentsRepository = container.resolve(CommentsRepository)

    let status
    if (userId) {
        status = await commentsRepository.findUserLikeStatus(comment._id.toString(), new ObjectId(userId))
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
            myStatus: status || "None",
        },
    }
}
