import * as React from 'react';
import styles from './SaketaAdpWebPart.module.scss';
import { ISaketaAdpWebPartProps } from './ISaketaAdpWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ADPService from '../Services/ADPService';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import CommentsComponent from '../components/comments/CommentsComponent';
import Question from './questions/QuestionComponent';
import Comment from '../Models/Comment';
import { MatchProps } from './IQuestionProps';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,

} from 'react-router-dom';
import { Button, Stack } from 'office-ui-fabric-react';
import { IStackTokens } from '@fluentui/react/lib/Stack';
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

export interface IADPState {
  allQuestions: any;
  filteredQuestions: any;
  allComments: Comment[];
  AuthorAndTimeMap:{},
  open:boolean
}



export default class SaketaAdpWebPart extends React.Component<ISaketaAdpWebPartProps, IADPState> {
  adpService: ADPService = new ADPService();
  constructor(props) {
    super(props);
    this.state = {
      allQuestions: [],
      filteredQuestions: [],
      allComments: [],
      AuthorAndTimeMap:{},
      open:true
    }
    this.filterAll = this.filterAll.bind(this);
    this.filterOpen = this.filterOpen.bind(this);
    this.filterAnswered = this.filterAnswered.bind(this);

  }
  private filterAll(): void {
    this.setState({
      filteredQuestions: this.state.allQuestions
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
      filteredQuestions: tempQuestions
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
      filteredQuestions: tempQuestions
    });
  }

  private truncate(str: string) {
    return str.length > 400 ? str.substring(0, 400) + '...' : str;
  }

  async componentDidMount() {
    var allQuestions = await this.adpService.GetAllQuestions();
    var response = await this.adpService.GetAllComments();
    //var terms= await this.adpService.getTerms();
    //console.log(terms);
    
    var tempComments = [];
    for (var comment of response) {
      let newComment = new Comment(comment.Id, comment.Comment, comment.AuthorId);
      tempComments.push(newComment);
      
      
    }
    var tempAuthorandtime={};
    var x=await this.adpService.getAttachments();
    console.log(x);
    
    
    
    
    for(var question of allQuestions)
    {
      
      
      var authorDate=[];
      var user=await this.adpService.GetAuthorName(question.Author0Id);
      authorDate.push(user.Title);
      authorDate.push(question.Created);

      tempAuthorandtime[question.Id]=authorDate;
    }

    this.setState({
      allQuestions,
      allComments: tempComments,
      filteredQuestions:allQuestions,
      AuthorAndTimeMap:tempAuthorandtime
    });
   
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
                  <PrimaryButton onClick={this.filterAll} className={styles.filterBtn}>All Questions</PrimaryButton>
                  <PrimaryButton onClick={this.filterOpen} className={`${styles.filterBtn} ${this.state.open?'styles.notSelected':''}`}>Open</PrimaryButton>
                  <PrimaryButton onClick={this.filterAnswered} className={styles.filterBtn}>Answered</PrimaryButton>
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

                <Route path="/question/:id" render={({ match }: MatchProps) => <Question AllComments={this.state.allComments} QuestionId={match.params.id} />}>

                </Route>
              </Switch>
            </div>
          </Router>

        </div>

      </div>
    );
  }
}


