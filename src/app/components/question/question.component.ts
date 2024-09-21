import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit{
  
  constructor(public http: HttpService, private route: Router) { }

  ngOnInit(): void {
    this.getQuestionsListWithPagination();
  }

  questionList: any[] = [];

  getAll() {
    this.http.getAllQuestions().subscribe((result: any) => {
      this.questionList = result;
    })
  }

  deleteQuestion(id: any){
    this.http.deleteQuestion(id).subscribe((result: any) => {
      this.getAll();
    })
  }
  searchTerm: string = '';

  pageSize: number = 10; // Default page size
  offset: number = 0; // Starting offset
  totalElements: number = 0;
  totalPages!: number;

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.getQuestionsListWithPagination();
  }
  
  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.offset = 0; // Reset to the first page
    this.getQuestionsListWithPagination();
  }

  getQuestionsListWithPagination(){
    this.http.getQuestionListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.questionList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.questionList = []; // Handle the case where content is not found
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }

  
  onSearch(event: any) {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.searchQuestion(searchTerm);
    } else {
      this.getQuestionsListWithPagination();
    }
  }
  
  searchQuestion(term: string) {
    this.http.searchQuestion(term).subscribe(
      (result: any) => {
        console.log(result); // Debugging output
        this.questionList = result;
        this.totalElements = result.length; // Update total elements if necessary
      },
      (error) => {
        console.error('Error occurred while searching campaigns:', error);
      }
    );
  }
}
