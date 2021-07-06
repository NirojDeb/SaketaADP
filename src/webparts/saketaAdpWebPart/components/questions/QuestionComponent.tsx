import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './Question.module.scss';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import IQuestionProps from '../IQuestionProps'
import { IStackTokens, Stack, TextField } from '@fluentui/react';
import Comment from '../../Models/Comment';
import CommentComponent from '../comments/CommentsComponent';
import { RouteComponentProps } from 'react-router-dom';
import EditQuestion from '../EditQuestion/EditQuestion';
import { createRef } from 'react';


const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};

export interface IQuestionState {
    Title: string;
    QuestionBody: string;
    Topics: string[];
    Comments: number[];
    Image: string;
    commentObjects: Comment[];
    isAnswered: boolean;
    commentsArray: number[];
    imgUrl: string;
    answerBody: any;
    answerAuthor: string;
    answerTime: string;
    attachments: any;
}


export default class Question extends React.Component<IQuestionProps, IQuestionState> {
    adpService: ADPService = new ADPService();
    
 
    constructor(props) {
        super(props);
        this.state = {
            Title: '',
            QuestionBody: '',
            Topics: [],
            Comments: [],
            Image: '',
            commentObjects: [],
            isAnswered: null,
            commentsArray: [],
            imgUrl: "",
            answerBody: '',
            answerAuthor: '',
            answerTime: '',
            attachments: [],
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.downloadAttachment = this.downloadAttachment.bind(this);
      


    }
    async handleFormSubmit(event): Promise<any> {
        event.preventDefault();
        let commentBody = event.target.comment.value;
        var user = await this.adpService.GetCurrentUser();
        let comment = new Comment(1, commentBody, user.Id, this.props.QuestionId, user.Title, '');
        
        this.adpService.CreateCommentHttp(this.props.context,comment).then(async (response:any)=>{
            var comm = this.state.commentsArray;
            console.log(response);
            
        var id: number = response.Id;
 


        await this.adpService.AddCommentToQuestion(this.props.QuestionId, comm);
        var newresponse = await this.adpService.getCommentsforQuestion(this.props.QuestionId);

        var commentObjs = [];

        for (var com of newresponse) {
            var user = await this.adpService.GetAuthorName(com.Author0Id);
            var newComment = new Comment(com.Id, com.Comment, com.Author0Id, com.QuestionId, user.Title, com.Created);
            commentObjs.push(newComment);
        }
        this.setState({

            commentsArray: comm,
            commentObjects: commentObjs
        });
        })
        


    }

    public downloadAttachment(attachment) {
        console.log(attachment);
        console.log(this.props.context.pageContext.site.serverRelativeUrl);
        console.log(this.props.context.pageContext.site.absoluteUrl);
        var url=`https://saketaadptest.sharepoint.com${attachment.ServerRelativeUrl}`
        window.open(url);
    }

    async componentDidMount() {
        var question = await this.adpService.GetQuestion(Number(this.props.QuestionId));
        console.log(question);

        var Topics = [];
        for (let topic of question.Topics) {
            Topics.push(topic.Label);
        }
        var answered = false;
        var allAttachments = await this.adpService.getAttachments(Number(question.Id));
        console.log(allAttachments);



        if (question.AnswerId != null) {

            answered = true;
            var answer = await this.adpService.GetAnswer(question.AnswerId);
            console.log(answer);
            if(answer[0].AuthorId !=null)
            {
                var user= await this.adpService.GetAuthorName(answer[0].AuthorId);
            }
            else{
                var user = await this.adpService.GetAuthorName(answer[0].Author0Id);
            }
            
            var parser = new DOMParser();
            var doc = parser.parseFromString(answer[0].Answer, "text/html")
            this.setState({
                answerBody: doc.body.innerText,
                answerTime: answer[0].Created,
                answerAuthor: user.Title
            });



        }
        var imgUrl = '';
        if (question.Image) {
            var img = JSON.parse(question.Image);

            imgUrl = imgUrl + img.serverUrl + img.serverRelativeUrl;
            console.log(imgUrl);
        }
        var response = await this.adpService.getCommentsforQuestion(this.props.QuestionId);
        console.log('last');
        console.log(response);
        var commentObjs = [];

        for (var com of response) {
            var user = await this.adpService.GetAuthorName(com.Author0Id);
            var newComment = new Comment(com.Id, com.Comment, com.Author0Id, com.QuestionId, user.Title, com.Created);
            commentObjs.push(newComment);
        }





        this.setState({
            Topics,
            attachments: allAttachments.AttachmentFiles,
            commentObjects: commentObjs,
            Comments: question.CommentsId,
            Title: question.Title,
            Image: question.Image,
            QuestionBody: question.QuestionBody,
            isAnswered: answered,
            commentsArray: question.CommentsId,
            imgUrl
        });

    }



    public render(): React.ReactElement<IQuestionProps> {
        return (
            <div>
                <h1 className={styles.heading}>{this.state.Title}</h1>
                <img src={this.state.imgUrl} alt="" />
                <p>{this.state.QuestionBody}</p>
                <small>Topics: </small>
                {this.state.Topics.map((topic) => {
                    return (<small>&nbsp;{topic}&nbsp;</small>)
                })}
                <br />
                <br />
                <small>Attachments :</small>
                {this.state.attachments.map((attachment) => {
                    return (<div onClick={()=>{this.downloadAttachment(attachment)}} className={styles.attachemntTile}>{attachment.FileName}</div>)
                })}

                <br />
                <br />


                {this.state.isAnswered ? <div className={styles.correctanswer}>
                    <Stack horizontal tokens={itemAlignmentsStackTokens} className={styles.stackEle}>
                        <Stack.Item align="start">
                            <small><p><b>Answered By {this.state.answerAuthor}</b> On {this.state.answerTime}</p></small>

                        </Stack.Item>
                        <Stack.Item align='end' className={styles.stackitemEle}>
                            <DefaultButton text="Correct Answer" className={styles.CorrectAnswereBtn}></DefaultButton>
                        </Stack.Item>

                    </Stack>

                    <p>{this.state.answerBody}</p>

                </div> : ""}


                <h2>Write a Comment</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <TextField name="comment"   placeholder="Write Something..." multiline rows={6} resizable></TextField>
                    <br></br>
                    <PrimaryButton type="submit">Post</PrimaryButton>
                </form>
                <h1><b>{this.state.commentObjects.length} Comments</b></h1>
                {this.state.commentObjects.map((comment) => {
                    return <div className={styles.commentTile}><CommentComponent comment={comment} isAnswered={this.state.isAnswered} ></CommentComponent><br /></div>
                })}

            </div>
        )

    }


}