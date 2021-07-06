export default class Comment{
    Id:number;
    Body:string;
    AuthorId:number;
    QuestionId:number;
    AuthorTitle:string;
    Created:string;

  
    constructor(id,body,authorId,questionId,authorTitle,created) {
       this.Id=id;
       this.Body=body;
       this.AuthorId=authorId; 
       this.QuestionId=questionId;
       this.AuthorTitle=authorTitle;
       this.Created=created;
    }
}