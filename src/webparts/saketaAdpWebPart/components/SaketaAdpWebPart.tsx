import * as React from 'react';
import styles from './SaketaAdpWebPart.module.scss';
import { ISaketaAdpWebPartProps } from './ISaketaAdpWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ADPService from '../Services/ADPService';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import Question from './questions/QuestionComponent';
import { MatchProps } from './IQuestionProps';
import { AskAQuestionFormForm } from './AskAQuestion/AskAQuestion';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,


} from 'react-router-dom';
import { Button, Stack } from 'office-ui-fabric-react';
import { IStackTokens } from '@fluentui/react/lib/Stack';
import EditQuestion from './EditQuestion/EditQuestion';
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

export interface IADPState {
  allQuestions: any;
  filteredQuestions: any;
  filter: number;
  AuthorAndTimeMap: {},
  open: boolean
}



export default class SaketaAdpWebPart extends React.Component<ISaketaAdpWebPartProps, IADPState> {
  adpService: ADPService = new ADPService();
  constructor(props) {
    super(props);
    this.state = {
      allQuestions: [],
      filteredQuestions: [],
      filter: 1,
      AuthorAndTimeMap: {},
      open: true
    }
    this.filterAll = this.filterAll.bind(this);
    this.filterOpen = this.filterOpen.bind(this);
    this.filterAnswered = this.filterAnswered.bind(this);
    this.recievedData=this.recievedData.bind(this); 
    this.editData=this.editData.bind(this);

  }
  private filterAll(): void {
    this.setState({
      filteredQuestions: this.state.allQuestions,
      filter: 1
    })

  }
  private filterOpen(): void {
    var tempQuestions: any = [];
    for (var question of this.state.allQuestions) {
      if (question.AnswerId == null) {
        tempQuestions.push(question);
      }
    }
    this.setState({
      filteredQuestions: tempQuestions,
      filter: 2
    });

  }
  private filterAnswered(): void {
    var tempQuestions: any = [];
    for (var question of this.state.allQuestions) {
      if (question.AnswerId != null) {
        tempQuestions.push(question);
      }
    }
    this.setState({
      filteredQuestions: tempQuestions,
      filter: 3
    });
  }

  private truncate(str: string) {
    return str.length > 400 ? str.substring(0, 400) + '...' : str;
  }

  async AuthorDateMapper(){
    var tempAuthorandtime = {};
    console.log(this.state.allQuestions);
    
    for (var question of this.state.allQuestions) {
      var authorDate = [];
      var user = await this.adpService.GetAuthorName(question.Author0Id);
      authorDate.push(user.Title);
      authorDate.push(question.Created);
      tempAuthorandtime[question.Id] = authorDate;
    }
    this.setState({
      AuthorAndTimeMap:tempAuthorandtime
    })

  }
  


  async componentDidMount() {
    var allQuestions = [];
    var tempAuthorandtime = {};
    

    this.adpService.getTermStore(this.props.context).then((result:any)=>{
      console.log(result);
      
    })

    this.adpService.getQuestions(this.props.context).then(async (result)=>{
      allQuestions=result;
      console.log(allQuestions);
      
      for (var question of allQuestions) {
        var authorDate = [];
        var user = await this.adpService.GetAuthorName(question.Author0Id);
        authorDate.push(user.Title);
        authorDate.push(question.Created);
        tempAuthorandtime[question.Id] = authorDate;
      }
      this.setState({

        allQuestions,
        filteredQuestions: allQuestions,
        AuthorAndTimeMap: tempAuthorandtime
      });

    });

    // this.adpService.GetAllQuestions().then((result) => {
    //   allQuestions = result;
    // }).then(async () => {
    //   for (var question of allQuestions) {


    //     var authorDate = [];
        
    //     var user = await this.adpService.GetAuthorName(question.Author0Id);
    //     authorDate.push(user.Title);
    //     authorDate.push(question.Created);

    //     tempAuthorandtime[question.Id] = authorDate;
    //   }
    //   this.setState({

    //     allQuestions,
    //     filteredQuestions: allQuestions,
    //     AuthorAndTimeMap: tempAuthorandtime
    //   });

    // });

  }

  async editData(data)
  {
    var x= await this.adpService.getQuestion(data);
    console.log(x);
    var user =await this.adpService.GetAuthorName(x.Author0Id);
    var authorDate=[];
    authorDate.push(user.Title);
    authorDate.push(x.Modified);
    var newMap={...this.state.AuthorAndTimeMap};
    newMap[x.Id]=authorDate;
    var allQuestions= await this.adpService.GetAllQuestions();
    this.setState({
      allQuestions:allQuestions,
      AuthorAndTimeMap:newMap
    });

    
    
  }

  async  recievedData(data)
  {
      var authorDate = [];
      var user = await this.adpService.GetAuthorName(data.Author0Id);
      authorDate.push(user.Title);
      authorDate.push(data.Created);
       
      var newMap={...this.state.AuthorAndTimeMap};
      newMap[data.Id]=authorDate;

    if(this.state.filter==1)
    {
      this.setState({
        allQuestions:[...this.state.allQuestions , data ],
        filteredQuestions:[...this.state.filteredQuestions,data],
        AuthorAndTimeMap:newMap
      });
    }
    else if(this.state.filter==2)
    {
      if(data.AnswerId==null)
      {
        this.setState({
          allQuestions:[...this.state.allQuestions , data ],
          filteredQuestions:[...this.state.filteredQuestions,data],
          AuthorAndTimeMap:newMap
        });
      }
      else{
        this.setState({
          allQuestions:[...this.state.allQuestions , data ],
          AuthorAndTimeMap:newMap
        });
      }
    }
    else if(this.state.filter==3)
    {
      if(data.AnswerId!=null)
      {
        this.setState({
          allQuestions:[...this.state.allQuestions , data ],
          filteredQuestions:[...this.state.filteredQuestions,data],
          AuthorAndTimeMap:newMap
        });
      }
      else{
        this.setState({
          allQuestions:[...this.state.allQuestions , data ],
          AuthorAndTimeMap:newMap
        });
      }
    }

    this.AuthorDateMapper();

  }

  public render(): React.ReactElement<ISaketaAdpWebPartProps> {

    return (
      <div className={styles.saketaAdpWebPart}>
        <div >
          {/* <iframe src="https://saketaadptest.sharepoint.com/sites/SaketaTasksNiroj/Lists/Questions/Attachments/1/new.PNG" title="File">
        </iframe> */}


          <Router>
            <div>
              <Switch>
                <Route path="/home">
                  <AskAQuestionFormForm submitData={this.recievedData}  context={this.props.context} />
                  <br />
                  <PrimaryButton onClick={this.filterAll} className={this.state.filter == 1 ? styles.SelectedfilterBtn : styles.filterBtn}>All Questions</PrimaryButton>
                  <PrimaryButton onClick={this.filterOpen} className={this.state.filter == 2 ? styles.SelectedfilterBtn : styles.filterBtn}>Open</PrimaryButton>
                  <PrimaryButton onClick={this.filterAnswered} className={this.state.filter == 3 ? styles.SelectedfilterBtn : styles.filterBtn}>Answered</PrimaryButton>
                  <div className={styles.showingQuestions}><h3 className={styles.showingh3}>Showing 1-{this.state.filteredQuestions.length} Questions</h3></div>
                  {this.state.filteredQuestions.map((question) => {
                    return (
                      <div className={styles.allQuestions}>
                        <Stack horizontal className={styles.stackEle} tokens={itemAlignmentsStackTokens}>
                          <Stack.Item align="start">
                            <small className={styles.author}>Asked by {this.state.AuthorAndTimeMap[question.Id][0]}&nbsp;&nbsp;</small>
                            <small> On {this.state.AuthorAndTimeMap[question.Id][1]}</small>
                          </Stack.Item>
                          <Stack.Item align="end" className={styles.stackitemEle}>
                            {question.AnswerId != null ? (
                              <div>
                                <DefaultButton text='Answered' className={styles.Answered} />
                              </div>
                            ) : null
                            } 
                          </Stack.Item>
                          <Stack.Item align='end' className={styles.stackitemEleEdit}>
                          <EditQuestion context={this.props.context} Title={question.Title} QuestionBody={question.QuestionBody} AuthorId={question.Author0Id} QuestionId={question.Id} editData={this.editData} />
                          </Stack.Item>
                        </Stack>
                        
                        <li className={styles.litags}>
                          <Link className={styles.atag} to={`/question/${question.Id}`}><h1 className={styles.linktag}>{question.Title}</h1></Link>
                        </li>

                        <p>{this.truncate(question.QuestionBody)}</p>
                        {question.Topics.map((topic) => {
                          return (<small className={styles.topics}>{topic.Label} &nbsp;&nbsp;</small>)
                        })}
                        <br></br>
                        <br />
                      </div>
                    )
                  })}
                </Route>

                <Route path="/question/:id" render={({ match }: MatchProps) => <Question context={this.props.context} QuestionId={match.params.id} />}>

                </Route>
              </Switch>
            </div>
          </Router>

        </div>

      </div>
    );
  }
}


