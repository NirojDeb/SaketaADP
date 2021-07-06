import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PeoplePickerItem } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import { Dropdown, IDropdownOption, IDropdownStyles, Label } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react';
import {
    Panel,
    Stack,
    format,
} from 'office-ui-fabric-react';

import { useState , useEffect} from 'react';
import { UserCustomActions } from '@pnp/sp/user-custom-actions';

interface Props { 
    context: WebPartContext ;
    Title:string;
    QuestionBody:string;
    AuthorId:Number;
    QuestionId:Number;
    editData:(data)=>void
}

const adpService:ADPService=new ADPService();

function EditQuestion(props: Props) {
    const { context,QuestionBody,Title,AuthorId ,QuestionId} = props;
    let [isOpen, setIsOpen] = useState(false);
    let [form, setForm] = useState({ Title: '', QuestionBody: '', AuthorId: null ,AuthorLogin:'',ImgUrl:''});
    let [attachments,setAttachments]=useState([]);

    async function getUserName():Promise<string> {
        var user=await adpService.GetAuthorName(AuthorId);
        
        return user.Email;
        
    }

    async function getAttachments():Promise<any>{
        let attachments=await adpService.getAttachments(QuestionId);
        console.log(attachments);
        
    }

    var ImgFile:any;
    var fileInfos=[];

    useEffect(()=>{
        getUserName().then((result)=>{
            setForm({...form, AuthorId:AuthorId,QuestionBody:QuestionBody,Title:Title,AuthorLogin:result});
        });
        getAttachments();
        
        
    },[])

   async  function EditBtn()
    {
        var updatedQuestion={
            Title:form.Title,
            QuestionBody:form.QuestionBody,
            Author0Id:form.AuthorId
        }
        console.log(form.AuthorId);
        
        if(form.ImgUrl!='')
        {
        // var x=await adpService.addImgtoSite(ImgFile);
        updatedQuestion['Image']=form.ImgUrl
        }

        console.log(form);
        
        
        
        if(fileInfos.length!=0)
        {
            adpService.editAttachments(fileInfos,QuestionId);
        }
        var editedQuestion=await adpService.editQuestion(updatedQuestion,QuestionId); 
        props.editData(QuestionId);
        setIsOpen(false);
    }
function onFile(event){
   
    var fileCount = event.target.files.length;
   
    for (var i = 0; i < fileCount; i++) {
       var fileName = event.target.files[i].name;
       console.log(fileName);
       var file = event.target.files[i];
       var reader = new FileReader();
       reader.onload = (function(file) {
          return function(e) {
             
             //Push the converted file into array
                fileInfos.push({
                   "name": file.name,
                   "content": e.target.result
                   });
                console.log(fileInfos);
                }
          })(file);
       reader.readAsArrayBuffer(file);
     }
  }
  function handlePeople(items) {
     
     if(items[0]!=undefined)
     {setForm({ ...form, AuthorId: items[0].id });
    } 
    
  }

    async function addImage(event)
    {
        var fileName=event.target.files[0].name;
        var file=event.target.files[0];
        ImgFile=file;
        console.log(ImgFile);
        
        var x=await adpService.addImgtoSite(file);
        console.log(x);
        var s=JSON.stringify({serverRelativeUrl:x.data.ServerRelativeUrl,serverUrl:'https://saketaadptest.sharepoint.com'});
        setForm({...form,ImgUrl:s});
    }

    return (
        <div>
            <PrimaryButton text={'Edit'} onClick={() => setIsOpen(true)} />
            <Panel
                isOpen={isOpen}
                headerText='Edit Question'
                onDismiss={() => setIsOpen(false)}
            >
                <Stack tokens={{ childrenGap: 20 }}>
                    <TextField defaultValue={form.Title} label='Title'
                        onChange={(e) =>
                            setForm({ ...form, Title: (e.target as HTMLInputElement).value })
                        } 
                    />
                    <TextField multiline rows={6} defaultValue={QuestionBody} label='QuestionBody' onChange={(e) =>
                        setForm({ ...form, QuestionBody: (e.target as HTMLInputElement).value })} />
                    <TextField label='Question Image' />
                    <input type="file" accept="image/*" onChange={(event)=>{addImage(event)}} />
                    <TextField label='Topics' />
                    <PeoplePicker context={context} titleText='Author' personSelectionLimit={1}
                        defaultSelectedUsers={[form.AuthorLogin]}
                        required={true} ensureUser={true} showHiddenInUI={false} principalTypes={[PrincipalType.User]} onChange={handlePeople} />

                    <TextField label='Attach Files' />
                    <input type="file" multiple  onChange={(event)=>{onFile(event)}} />
                    <Stack horizontal horizontalAlign='end' tokens={{ childrenGap: 10 }}>
                        <PrimaryButton text='Edit' onClick={EditBtn} />
                        <DefaultButton text='Cancel' onClick={() => setIsOpen(false)} />
                    </Stack>
                </Stack>
            </Panel>
        </div>
    )
}

export default EditQuestion
