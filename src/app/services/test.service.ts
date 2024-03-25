import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Question, Quiz, QuizResult } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  quizResult!:QuizResult;
http=inject(HttpClient);
  constructor() {
   }
  //  Get questions according to quiz code from fake db
   getQuestions(){
    return this.http.get<Question[]>("http://localhost:3000/questions");
    }

   getQuizByCode(code:string){
    return this.http.get<Quiz[]>("http://localhost:3000/quizs?code=" + code);
    }

    // Join quiz to user
    joinQuiz(quizResult: QuizResult) {
          return this.http.post<QuizResult>('http://localhost:3000/quizResults', quizResult);
    }
    getQuizById(id: number) {
      return this.http.get<Quiz>('http://localhost:3000/quizs/' + id);
    }

    // update result on server
    updateQuizResult(id:number,result:QuizResult){
      return this.http.put<any> ("http://localhost:3000/quizResults/" + id , result);
    }
    // Create getquizresult api which can be called on quiz-score page
    getQuizResult(id:number){
      return this.http.get<QuizResult>('http://localhost:3000/quizResults/' + id);
    }
}
