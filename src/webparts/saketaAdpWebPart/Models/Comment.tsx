export default class Comment{
    Id:number;
    Body:string;
    AuthorId:number;

  
    constructor(id,body,authorId) {
       this.Id=id;
       this.Body=body;
       this.AuthorId=authorId; 
    }
}