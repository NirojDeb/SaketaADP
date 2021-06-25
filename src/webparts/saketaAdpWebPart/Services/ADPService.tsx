import * as React from 'react';
import { Comments, Item, sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import Comment from '../Models/Comment';


export default class ADPService{
    
    public GetAllQuestions():Promise<any>{
        return  sp.web.lists.getByTitle('Questions').items.getAll();
    }

    public GetCurrentUser():Promise<any>{
        return sp.web.currentUser.get();
    }

    public CreateComment(comment:Comment):Promise<any>{
        let newComment={
            Comment:comment.Body,
            Author0Id:comment.AuthorId,
            Title:'New Comment',
            
        }
        console.log('auto'+comment.AuthorId);
        
        return sp.web.lists.getByTitle('Comments').items.add(newComment);

    }

    public GetCommentIdForQuestions(questionId:number):Promise<any>{

        return sp.web.lists.getByTitle('Questions').items.getById(questionId).expand('Comments').select('Comments/Title','Comments/Id').get();
    }

    
    
    // public getUser()
    // {
    //     return await sp.web.siteUsers.
    // }

    public DeleteComment():Promise<any>{
        return null;
    }
   async AddCommentToQuestion(questionId,commentsarray):Promise<any>{
        var x= await sp.web.lists.getByTitle('Questions').items.getById(questionId).update({CommentsId:{results:commentsarray}});
        
        return x;
        
     }

     public getAttachments()
     {
        return sp.web.lists.getByTitle('Questions').items.getById(1).select('Attachments').expand('AttachmentFiles').get()
     }

     public AddAnswertoQuestion(questionId,answerId){
        return sp.web.lists.getByTitle('Questions').items.getById(questionId).update({AnswerId:answerId});
     }
     public AddAnswer(answer){
         return sp.web.lists.getByTitle('Answers').items.add(answer);
     }

    public EditComment():Promise<any>{
        return null;
    }

    public GetCommentForQuestion(questionId:number):Promise<any>
    {
        return sp.web.lists.getByTitle('Questions').items.getById(2).expand('Comments').select('Comments/Title','Comments/Id').get();
       

    }
    public GetAllComments():Promise<any>
    {
        return sp.web.lists.getByTitle('Comments').items.getAll();
    }
    //For Questions

    public GetQuestion(questionId:number):Promise<any>
    {
        return sp.web.lists.getByTitle('Questions').items.getById(questionId).get();
    }

    public GetAuthorName(authorId):Promise<any>{
        return sp.web.siteUsers.getById(authorId).get();
    }

    public GetAnswer(answerId):Promise<any>{
        return sp.web.lists.getByTitle('Answers').items.filter(`Id eq ${answerId}`).get();
    }

    // public getTerms():Promise<any>{
    //     return taxonomy.termStores.getByName("Taxonomy_53IJVqNSVaDGtFGtdWGfyA==").getTermsById('b5761481-959c-4d3e-bbad-c2bf43c42b6b').get();
    // }
   

    

}

