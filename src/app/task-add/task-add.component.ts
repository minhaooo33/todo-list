import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
import { TodoService, Task} from '../services/todo.service';

@Component({
  selector: 'app-task-add',
  standalone:  true,
  imports: [FontAwesomeModule,TaskCardComponent, CommonModule],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.css'
})
export class TaskAddComponent {
adding = false;
faPlus = faPlus;
isCompleted: boolean = false;
priority: boolean = false;
constructor(private todoSvc: TodoService) {}

handleStartAdding() {
  this.adding = !this.adding;
}

handleAddNewTask(payload: { 
    title: string, 
    completed: boolean,
    priority: boolean,
    comment: string,
    deadlineDate: string,
    deadlineTime: string,

}

)  {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 15),
      title: payload.title,
      completed: payload.completed,
      priority: payload.priority,
      deadlineDate:  payload.deadlineDate,
      deadlineTime: payload.deadlineTime,
      comment: payload.comment,
    };
    this.todoSvc.addTask(newTask);
    this.adding = false;
     console.log('newTask', newTask);
  }
 
}
