import {CommentsService} from "../services/comments-service";
import {Request, Response} from "express";
import {CommentViewModel} from "../models/view/CommentViewModel";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {CodeResponsesEnum} from "../utils/utils";

export class CommentsController {
    private commentsService: CommentsService
    constructor() {
        this.commentsService = new CommentsService()
    }

    async getComment (req: Request, res: Response)  {

        const commentID = req.params.id
        const commentByID: CommentViewModel | null = await commentsQueryRepository.findCommentByID(commentID, req.userId!)

        if (!commentID || !commentByID) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.status(CodeResponsesEnum.OK_200).send(commentByID)

    }


    async updateComment (req: Request, res: Response) {

        const commentID = req.params.id
        const isUpdated: boolean = await this.commentsService.updateComment(commentID, req.body)

        if (!isUpdated) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }


    async updateLikeStatus (req: Request, res: Response){

        const commentID = req.params.id
        const userId = req.userId

        const isUpdated: boolean = await this.commentsService.updateLikeStatus(commentID, userId!, req.body.likeStatus)

        if (!isUpdated) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }

    async deleteComment (req: Request, res: Response) {

        const commentID: string = req.params.id
        const isDeleted: boolean = await this.commentsService.deleteComment(commentID)

        if (!isDeleted || !commentID) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }

        res.sendStatus(CodeResponsesEnum.Not_content_204)
    }


}