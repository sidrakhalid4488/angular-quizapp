import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { TestService } from '../../services/test.service';
import { QuizResult } from '../../types';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-join',
  standalone: true,
  imports: [MatButtonModule,MatInputModule,FormsModule],
  templateUrl: './quiz-join.component.html',
  styleUrl: './quiz-join.component.css'
})
export class QuizJoinComponent {
code!:string;
name!:string;
testService=inject(TestService);
router=inject(Router);
join(){
  if(this.code && this.name){
    this.testService.getQuizByCode(this.code).subscribe((result) => {
    let quiz=result[0];
    let quizResult: QuizResult = {
      name: this.name,
      quizId: quiz.id,
      response:[]
    }
    this.testService.joinQuiz(quizResult).subscribe(response =>{
      this.testService.quizResult=response;
      this.router.navigateByUrl("/quiz-info");
    });
    })

  }
  else{
    
  }
}
}
