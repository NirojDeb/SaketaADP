import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './Question.module.scss';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import IQuestionProps from '../IQuestionProps'
import { TextField } from '@fluentui/react';
import Comment from '../../Models/Comment';
import CommentComponent from '../comments/CommentsComponent';
import {RouteComponentProps} from 'react-router-dom';


export interface IQuestionState{
    Title:string;
    QuestionBody:string;
    Topics:string[];
    Comments:number[];
    Image:string;
    AllComments:Comment[];
    isAnswered:boolean;
    commentsArray:number[];
    imgUrl:string;
    answerBody:any;
    answerAuthor:string;
    answerTime:string;
}


export default class Question extends React.Component<IQuestionProps,IQuestionState> {
    adpService:ADPService=new ADPService();

    constructor(props) {
        super(props);
        this.state={
          Title:'',
          QuestionBody:'',
          Topics:[],
          Comments:[],
          Image:'',
          AllComments:[],
          isAnswered:null,
          commentsArray:[],
          imgUrl:"",
          answerBody:'',
          answerAuthor:'',
          answerTime:''
        }
        this.handleFormSubmit=this.handleFormSubmit.bind(this);
        
      }
      async  handleFormSubmit(event):Promise<any>
      {
        
        let commentBody= event.target.comment.value;
        var user=await this.adpService.GetCurrentUser();
        let comment=new Comment(1,commentBody,user.Id);
        var response:any=await this.adpService.CreateComment(comment);
        var comm=this.state.commentsArray;
        var id:number=response.data.Id;
        comm.push(id);
        console.log(comm);
        
        await this.adpService.AddCommentToQuestion(this.props.QuestionId,comm);
    
        
        var allComments=await this.adpService.GetAllComments();
        var tempComments = [];
        
        for (var comments of allComments) {
            let newComment = new Comment(comments.Id, comments.Comment, comments.AuthorId);
            tempComments.push(newComment);
        }
        this.setState({
            AllComments:tempComments,
            commentsArray:comm
        });
        console.log(this.state.commentsArray);

      }

    async componentDidMount(){
        var question=await this.adpService.GetQuestion(Number(this.props.QuestionId));
        console.log(question);
        
        var Topics=[];
        for(let topic of question.Topics)
        {
            Topics.push(topic.Label);
        }
        var answered=false;
        

        if(question.AnswerId!=null)
        {
            
            answered=true;
            var answer=await this.adpService.GetAnswer(question.AnswerId);
            console.log(answer);
            var user=await this.adpService.GetAuthorName(answer[0].Author0Id);
            var parser = new DOMParser();
            var doc = parser.parseFromString(answer[0].Answer, "text/html")
            this.setState({
                answerBody:doc.body.innerText,
                answerTime:answer[0].Created,
                answerAuthor:user.TItle
            });
            console.log(doc.body.innerText);
            
            
        }
        var imgUrl='';
        if(question.Image)
        {
        var img=JSON.parse(question.Image);
        
        imgUrl=imgUrl+img.serverUrl+img.serverRelativeUrl;
        console.log(imgUrl);
        }
        
        var tempComments = [];
        var allComments=await this.adpService.GetAllComments();
        for (var comment of allComments) {
            let newComment = new Comment(comment.Id, comment.Comment, comment.AuthorId);
            tempComments.push(newComment);
        }
        this.setState({
            Topics,
            Comments:question.CommentsId,
            Title:question.Title,
            Image:question.Image,
            QuestionBody:question.QuestionBody,
            isAnswered:answered,
            AllComments:tempComments,
            commentsArray:question.CommentsId,
            imgUrl
        });
        
        

        var comm=await this.adpService.GetCommentIdForQuestions(1);
        console.log(this.props.QuestionId);
        
        
        
    }
    
    

    public render(): React.ReactElement<IQuestionProps>
    {
        return(
            <div>
                <h1 className={styles.heading}>{this.state.Title}</h1>
                <img src={this.state.imgUrl} alt="" />
                <p>{this.state.QuestionBody}</p>
                <small>Topics: </small>
                {this.state.Topics.map((topic)=>{
                    return (<small>&nbsp;{topic}&nbsp;</small>)
                })}
                <br></br>
                <div className={styles.correctanswer}><p>{this.state.isAnswered && this.state.answerAuthor} {this.state.isAnswered && this.state.answerTime}</p>{this.state.isAnswered && this.state.answerBody}</div>
                <h2>Write a Comment</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <TextField name="comment" placeholder="Write Something..." multiline rows={6} resizable></TextField>
                    <br></br>
                    <PrimaryButton type="submit">Post</PrimaryButton>
                </form>
                <h1><b>{this.state.Comments.length} Comments</b></h1>
                {this.state.Comments.map((comment)=>{
                    return <div><CommentComponent Allcomment={this.props.AllComments} commentId={comment} questionId={this.props.QuestionId} isAnswered={this.state.isAnswered} ></CommentComponent><br/></div>
                })}

            </div>
        )

    }


}