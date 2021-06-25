import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import ICommentsProps from '../ICommentsProps';
import Comment from '../../Models/Comment';

export interface ICommentsState{
    comment:Comment;
    user:any;
    commentsArray:[];
}


export default class CommentComponent extends React.Component<ICommentsProps,ICommentsState> {
    adpService:ADPService=new ADPService();

     constructor(props) {
        super(props);
        this.state={
          comment:null,
          user:{},
          commentsArray:[]
          
        }
        this.markAnswer=this.markAnswer.bind(this);
      }

    async componentDidMount(){
        console.log('hello');
        this.fetchComment();
        
        
        

    }
   

    async fetchComment(){
      
      
      var temp=null;
        for(var x of this.props.Allcomment)
        {
          if(x.Id==this.props.commentId)
          {
            temp=x;
          }
        }
        var user=await this.adpService.GetAuthorName(x.AuthorId);
        
        this.setState({
          comment:temp,
          user
        });
    }
    async markAnswer(){
      

      var newAnswer={
        AuthorId:this.state.comment.AuthorId,
        Answer:this.state.comment.Body
      };
      var answer=await this.adpService.AddAnswer(newAnswer);
      var ansId=answer.data.Id;
      await this.adpService.AddAnswertoQuestion(this.props.questionId,ansId);
    

      
      
      
    }

    

    componentDidUpdate()
    {
      
      if(this.state.comment==null)
      {
        this.fetchComment();

      }
     
      
      
    }

    public render(): React.ReactElement<ICommentsProps>
    {
        return(
            <div >
              {!this.props.isAnswered?<div onClick={this.markAnswer}>Mark as Answer</div>:""}
              
                <p>{this.state.user && this.state.user.Title}</p>
                <p>{this.state.comment && this.state.comment.Body}</p>

            </div>
        )

    }


}