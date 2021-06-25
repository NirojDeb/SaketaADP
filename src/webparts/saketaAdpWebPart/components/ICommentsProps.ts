
import Comment from "../Models/Comment";
export default interface ICommentsProps {
    Allcomment:Comment[],
    commentId:number,
    questionId:string,
    isAnswered:boolean
 
}
