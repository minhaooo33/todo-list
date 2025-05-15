import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop ,moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskAddComponent } from './task-add/task-add.component';
import { HeaderComponent } from './header/header.component';
import { TodoService, Task} from './services/todo.service';

@Component({
  selector: 'app-root',
  imports: [
            CommonModule,
            RouterOutlet, 
            TaskCardComponent,
            TaskAddComponent,
            HeaderComponent, 
            FormsModule,
            DragDropModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
/*export class AppComponent implements OnInit {
 todos$!: Observable<Task[]>;
  
  constructor(private todoService: TodoService) {}
  
  ngOnInit() {
    this.todos$ = this.todoService.todos$;
  }
}*/
export class AppComponent {
  todos$: Observable<Task[]>;

  constructor(private todoService: TodoService) {
    // Make sure to initialize the todos$ variable here
    this.todos$ = this.todoService.filteredTodos$;
  }

drop(event: CdkDragDrop<Task[]>) {
  if (event.previousIndex === event.currentIndex) return;
  this.todoService.reorderTasks(event.previousIndex, event.currentIndex);
}

trackById(index: number, task: Task): string {
  console.log('trackById called', index, task);
  return task.id;
}

}