import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import * as mongoose from "mongoose";
import {
    AttemptsSchema,
    BlogsSchema, CommentSchema,
    PostsSchema, RecoveryCodeSchema, TokensSchema, UsersSchema, UsersSessionSchema,
} from "../utils/mongooseShema";
dotenv.config()
const mongoURI = process.env.MONGO_URL || "mongodb+srv://dimas:jcm9I93KGt526fpO@blogsplatform.mxifx0s.mongodb.net/?retryWrites=true&w=majority&appName=BlogsPlatform"
console.log('mongoURI: ', mongoURI)
if (!mongoURI){
    throw new Error('Database url is not defined!')
}
export const client = new MongoClient(mongoURI);

export const BlogModel = mongoose.model('blogs', BlogsSchema);
export const PostsModel = mongoose.model('posts', PostsSchema)
export const CommentsModel = mongoose.model('comments', CommentSchema)
export const UsersModel = mongoose.model('users', UsersSchema)
export const TokensModel = mongoose.model('refresh-tokens-blacklist', TokensSchema)
export const UsersSessionModel = mongoose.model('usersSession', UsersSessionSchema)
export const AttemptsModel = mongoose.model('attempts', AttemptsSchema)
export const RecoveryCodeModel = mongoose.model('recoveryCode', RecoveryCodeSchema)
// export const LikesStatusModel = mongoose.model('likesStatus', LikeStatusSchema)

export async function runDB (){
    try {
        await mongoose.connect(mongoURI, {dbName: 'learning'})
        console.log('Successfully connected to server');
    } catch (error) {
        console.log(error)
        console.log('Problem with connection to DB');
        await client.close();
    }
}