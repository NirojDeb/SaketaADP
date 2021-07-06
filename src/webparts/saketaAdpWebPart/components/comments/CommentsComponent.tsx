import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import ICommentsProps from '../ICommentsProps';
import Comment from '../../Models/Comment';
import { IStackTokens, Stack, TextField } from '@fluentui/react';



export default class CommentComponent extends React.Component<ICommentsProps,{}> {
    adpService:ADPService=new ADPService();

     constructor(props) {
        super(props);
        
        this.markAnswer=this.markAnswer.bind(this);
      }

    async componentDidMount(){
       
       
    }
   

   
    async markAnswer(){
      

      var newAnswer={
        AuthorId:this.props.comment.AuthorId,
        Answer:this.props.comment.Body,
        QuestionId:this.props.comment.QuestionId
      };
      var answer=await this.adpService.AddAnswer(newAnswer);
      var ansId=answer.data.Id;
      await this.adpService.AddAnswertoQuestion(this.props.comment.QuestionId,ansId);
      
    }

     

    public render(): React.ReactElement<ICommentsProps>
    { 
        return(
            <div >
              
              {!this.props.isAnswered?
              <div>
                <Stack>
                  <Stack.Item align="end"><PrimaryButton text="Mark As Answer" onClick={this.markAnswer} /></Stack.Item>
                </Stack>
              </div>:""}
              
                <p><b>{this.props.comment && this.props.comment.AuthorTitle}</b></p>
                <p>{this.props.comment && this.props.comment.Body}</p>

            </div>
        )

    }


}