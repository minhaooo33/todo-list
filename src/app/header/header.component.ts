import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

selectedFilter: 'myTask' | 'completed' | 'inProgress' = 'myTask';
constructor(private todoService: TodoService) {}

ngOnInit(): void {
    this.showAllTasks(); // 預設顯示全部
    this.selectedFilter = 'myTask';
  }

 showAllTasks() {
  this.todoService.setFilter('myTask');
  this.selectedFilter = 'myTask';
}
  
showCompletedTasks() {
  this.todoService.setFilter('completed');

  const completed = this.todoService.getTodos().filter(todo => todo.completed);
  this.selectedFilter = 'completed';
  console.log('✅ 已完成任務:', completed);
}

showInProgressTasks() {
  this.todoService.setFilter('inProgress');
  this.selectedFilter = 'inProgress';
  const inProgress = this.todoService.getTodos().filter(todo => !todo.completed);
  console.log('⏳ 進行中任務:', inProgress);

}
}