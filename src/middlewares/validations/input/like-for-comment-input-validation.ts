import {body} from "express-validator";
import {LikeStatusEnum} from "../../../utils/types";

export const validateCommentsLikesRequestsInputParams: any = [
    body("likeStatus")
        .exists()
        .withMessage("Like Status is required")
        .isString()
        .withMessage("Type of Like Status must be a string")
        .trim()
        .withMessage("Like Status must be in correct format")
        .isLength({
            min: 0,
            max: 300,
        })
        .withMessage(
            "Like Status length must be more than 0 and less than or equal to 300 symbols"
        )
        .isIn(Object.values(LikeStatusEnum))
        .withMessage("Like Status must be one of the allowed values: Like, Dislike, or None"),
]