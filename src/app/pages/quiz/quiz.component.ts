import { Component, inject } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Question, Quiz, QuizResult } from '../../types';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import { response } from 'express';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [MatRadioModule,MatButtonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  // Inject Service and router and make variables
testService=inject (TestService);
router=inject(Router);
questions:Question[]=[];
quizInfo!:Quiz;
quizResult!:QuizResult;
currentQuestionNo:number=0;

  ngOnInit(){
    this.quizResult = this.testService.quizResult;
    if (!this.quizResult) {
      this.router.navigateByUrl('/');
      return;
    }
    this.testService.getQuestions().subscribe((results) => {
      this.questions = results;
    });
    this.testService.getQuizById(this.quizResult.quizId).subscribe((result) => {
      this.quizInfo = result;
    });
  }

  // Get questions currently related to given quiz code
  get currentQuestion() {
    let questionId = this.quizInfo.questions[this.currentQuestionNo];
    return this.questions.find((x) => x.id == questionId);
  }

  currentSelectedOptionId: string = '';

  // Define function for moving to next question after
  next(){
    // Push users selected response of current question to selected option and then increment towards next question and when moves towards next question make selected option blank so that it can adapt next question's answer and further continues
this.quizResult.response?.push({
  questionId:this.currentQuestion!.id,
  answerOptionId:this.currentSelectedOptionId
  })

  this.currentQuestionNo++;
  this.currentSelectedOptionId="";
  }

  // Define Function to submit quiz for scoring , by clicking button user can go to next take the saved results by calculateResult function and redirect user towards score page
  submit(){
this.next();
this.calculateResult();
this.testService.updateQuizResult(this.quizResult.id!,this.quizResult).subscribe();
this.router.navigateByUrl("quiz-score");
  }
  calculateResult(){
    // Make variables to store results
let score=0;
let correct =0;
let inCorrect=0;
let unAttempt=0;
let percentage=0;
let totalMarks=0;

// For every question take responses and match with stored data
this.quizResult.response?.forEach ((response) => {
  let questionId=response.questionId;
  let selectedOptionId=response.answerOptionId;
  // find question
  let question=this.questions.find(x=>x.id==questionId);
  let correctOption =question?.options.find((x) => x.isCorrect == true);

  totalMarks += question!.marks;
  // Apply increment according to user response
  if(!selectedOptionId){
    unAttempt++;
  }
  else  if(selectedOptionId==correctOption?.id){
    correct++;
    score+=question!.marks;
  }
  else{
    inCorrect++;
    score-=question!.negativeMarks;
  }

});
percentage = Math.round((score/totalMarks)*100);
this.quizResult.correct=correct;
this.quizResult.inCorrect=inCorrect;
this.quizResult.unAttempt=unAttempt;
this.quizResult.score=score;
this.quizResult.percentage=percentage;

}

}
