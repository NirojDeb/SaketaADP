import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PeoplePickerItem } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import { Dropdown, IDropdownOption, IDropdownStyles, Label } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react';
import styles from './AskAQuestion.module.scss';


import {
  Panel,
  Stack,
  format,
} from 'office-ui-fabric-react';

import { useState } from 'react';

interface IAskAQuestionFormProps {
  context: WebPartContext;
  submitData:(data)=>void;

  }

interface IAskAQuestionFormPropsStates {
  isOpen: boolean;

}

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const adpService:ADPService=new ADPService();



export function AskAQuestionFormForm(props: IAskAQuestionFormProps) {
  let [isOpen, setIsOpen] = useState(false);
  let [form, setForm] = useState({ Title: '', QuestionBody: '', AuthorId: null ,ImgUrl:''});
  var fileInfos = [];
  var ImgFile:any;
  async function createQuestion() {
    if(ImgFile!=null)
    {
      var x=await adpService.addImgtoSite(ImgFile);
    }
    
    var newQuestion={
      Title:form.Title,
      QuestionBody:form.QuestionBody,
      Author0Id:form.AuthorId,
      Image:form.ImgUrl

    }
    var q=await adpService.addAQuestion(newQuestion);
    await adpService.addAttachment(fileInfos,q.data.Id);
    props.submitData(q.data)
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
  async function addImage(event)
  {
    var fileName=event.target.files[0].name;
    var file=event.target.files[0];
    ImgFile=file;
    var x=await adpService.addImgtoSite(file);
    console.log(x);
    var s=JSON.stringify({serverRelativeUrl:x.data.ServerRelativeUrl,serverUrl:'https://saketaadptest.sharepoint.com'});
    setForm({...form,ImgUrl:s});

  }

  function handlePeople(items) {
    setForm({ ...form, AuthorId: items[0].id });
  
  }

  return (
    <div>
      <PrimaryButton className={styles.askBtn} text={'Ask A Question'} onClick={() => setIsOpen(true)} />
      <Panel
        isOpen={isOpen}
        headerText='Ask a question'
        onDismiss={() => setIsOpen(false)}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          <TextField
            label='Title'
            onChange={(e) =>
              setForm({ ...form, Title: (e.target as HTMLInputElement).value })
            }
          />
          <TextField multiline rows={6} label='QuestionBody' onChange={(e) =>
            setForm({ ...form, QuestionBody: (e.target as HTMLInputElement).value })} />
          <TextField label='Question Image' />
          <input type="file"  accept="image/*" onChange={(event)=>{addImage(event)}} />
          <TextField label='Topics' />
          <PeoplePicker context={props.context} titleText='Author' personSelectionLimit={1}
            required={true} ensureUser={true} showHiddenInUI={false} principalTypes={[PrincipalType.User]} onChange={handlePeople} />

          <input type="file" multiple  onChange={(event)=>{onFile(event)}} />

          <Stack horizontal horizontalAlign='end' tokens={{ childrenGap: 10 }}>
            <PrimaryButton text='Create' onClick={createQuestion} />
            <DefaultButton text='Cancel' onClick={() => setIsOpen(false)} />
          </Stack>
        </Stack>
      </Panel>
    </div>
  );
}