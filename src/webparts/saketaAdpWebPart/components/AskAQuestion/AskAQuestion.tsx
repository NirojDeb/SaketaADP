import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import ADPService from '../../Services/ADPService';
import { Dropdown, IDropdownOption, IDropdownStyles, Label } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react';

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

interface IAskAQuestionState{
    Topics:string[];
    Title:string;
    Body:string;
    QuestionAuthorId:string;
    TopicOptions:IDropdownOption[];
}

export default class AskAQuestion extends React.Component<{},IAskAQuestionState>
{
    adpService:ADPService=new ADPService();
    constructor(props) {
        super(props);
        this.state={
            Topics:[],
            Title:'',
            Body:'',
            QuestionAuthorId:'',
            TopicOptions:[]

        }
        
    }

    componentDidMount(){

    }

    public render(): React.ReactElement<{}>
    {
        return (
            <div>
                <h1>Ask a Question</h1>
                <br></br>
                <form>
                    <Label>Title</Label>
                    <TextField name="Title" />
                    <Label>Body</Label>
                    <TextField resizable rows={10} name="Body"></TextField>
                    <Dropdown
                    placeholder="Select options"
                    label="Topics"
                    defaultSelectedKeys={['apple', 'banana', 'grape']}
                    multiSelect
                    options={this.state.TopicOptions}
                    styles={dropdownStyles}
                     />
                </form>
            </div>
        );
    }

}