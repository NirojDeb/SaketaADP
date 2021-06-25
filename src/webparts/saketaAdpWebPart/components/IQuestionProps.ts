import { RouteComponentProps } from 'react-router-dom';
import Comment from "../Models/Comment";
interface MatchParams {
    id: string;
}
export interface MatchProps extends RouteComponentProps<MatchParams> {
}

export default interface IQuestionProps {
    AllComments:Comment[];
    QuestionId:string
    

}