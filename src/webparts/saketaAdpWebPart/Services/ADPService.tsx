import * as React from 'react';
import { Comments, Item, sp } from "@pnp/sp/presets/all";
import "@pnp/sp/sites";
import { IContextInfo } from "@pnp/sp/sites";
import { Web } from "@pnp/sp/webs";
import axios from 'axios';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import "@pnp/sp/lists";
import Comment from '../Models/Comment';
import { WebPartContext } from '@microsoft/sp-webpart-base';



export default class ADPService{

    
    
    public GetAllQuestions():Promise<any>{
        return sp.web.lists.getByTitle('Questions').items.getAll();
    }


    public getQuestion(QuestionId):Promise<any>{
        return sp.web.lists.getByTitle('Questions').items.getById(QuestionId).get();
    }

    public getQuestions(context:WebPartContext):Promise<any>{
        return new Promise((resolve,reject)=>{
            context.spHttpClient.get(`${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Questions')/items`,SPHttpClient.configurations.v1)
            .then((res:SPHttpClientResponse)=>{
                res.json().then((result:any)=>{
                    console.log(result);
                    
                    resolve(result.value);
                }),(error:any)=>{
                    reject(error);
                }
            })
        })
    }

    public getTermStore(context:WebPartContext):Promise<any>
    {
        var endPoint='https://saketaadptest.sharepoint.com/_api/v2.1/termStore/groups';
        return new Promise((resolve,reject)=>{
            context.spHttpClient.get(endPoint,SPHttpClient.configurations.v1)
            .then((res:SPHttpClientResponse)=>{
                res.json().then((result:any)=>{
                    console.log(result);
                    resolve(result.value);
                    
                })
            })
        })
    }

   


    public GetCurrentUser():Promise<any>{
        return sp.web.currentUser.get();
    }

    public CreateCommentHttp(context:WebPartContext,comment:Comment)
    {
        var body=JSON.stringify({
            Comment:comment.Body,
            Author0Id:comment.AuthorId,
            Title:'New Comment',
            QuestionId:comment.QuestionId 
        });
        return new Promise<any>((resolve,reject)=>{
            context.spHttpClient.post(`${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items`,SPHttpClient.configurations.v1,{body:body})
            .then((res:SPHttpClientResponse)=>{
                res.json().then((result:any)=>{

                    
                    resolve(result);
                }),(error:any)=>{
                    reject(error);
                }
            })
        })

    }

    public CreateComment(comment:Comment):Promise<any>{
        let newComment={
            Comment:comment.Body,
            Author0Id:comment.AuthorId,
            Title:'New Comment',
            QuestionId:comment.QuestionId
            
        }        
        return sp.web.lists.getByTitle('Comments').items.add(newComment);

    }

    public GetCommentIdForQuestions(questionId:number):Promise<any>{

        return sp.web.lists.getByTitle('Questions').items.getById(questionId).expand('Comments').select('Comments/Title','Comments/Id').get();
    }

    
    
    // public getUser()
    // {
    //     return await web.siteUsers.
    // }

    public DeleteComment():Promise<any>{
        return null;
    }
   async AddCommentToQuestion(questionId,commentsarray):Promise<any>{
        var x= await sp.web.lists.getByTitle('Questions').items.getById(questionId).update({CommentsId:{results:commentsarray}});
        
        return x;
        
     }

     public getAttachments(questionId)
     {
        
        return sp.web.lists.getByTitle('Questions').items.getById(questionId).select('Attachments').expand('AttachmentFiles').get()
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


    // public getTerms():Promise<any>
    //     return taxonomy.termStores.getByName("Taxonomy_53IJVqNSVaDGtFGtdWGfyA==").getTermsById('b5761481-959c-4d3e-bbad-c2bf43c42b6b').get();
    // }
   
    public getCommentsforQuestion(questionId)
    {
        return sp.web.lists.getByTitle('Comments').items.filter(`QuestionId eq ${questionId}`).get();
    }

    public addAQuestion(question)
    {
        return sp.web.lists.getByTitle('Questions').items.add(question);
    }

    

    public editQuestion(question,questionId){
        return sp.web.lists.getByTitle('Questions').items.getById(questionId).update(question);
    }

    async editAttachments(files,questionId){

        var x= await this.getAttachments(questionId);
        console.log(x);
        var filesToBeDeleted=[];

        for(var file of x.AttachmentFiles)
        {
            filesToBeDeleted.push(file.FileName);
        }
        
        await sp.web.lists.getByTitle('Questions').items.getById(questionId).attachmentFiles.deleteMultiple(...filesToBeDeleted);
        this.addAttachment(files,questionId);
    }


    public addAttachment(files,questionId){
        sp.web.lists.getByTitle('Questions').items.getById(questionId).attachmentFiles.addMultiple(files);
    }


    // public addImg(file)
    // {
    //     return sp.web.lists.getByTitle('Questions').items.getById(26).update({Image:file});
    // }


    public addImgtoSite(file)
    {
        return sp.web.getFolderByServerRelativeUrl("/sites/SaketaTasksNiroj/SiteAssets/Lists/a64ff8b0-d0ea-46f4-89d6-9307913f2f16").files.add(file.name, file, true);
    }


    

    
    
    
    

}

