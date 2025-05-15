import { Component, Output, EventEmitter ,Input ,OnInit} from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
  todoService = inject(TodoService);
  isEditing: boolean = false;

  faRegularStar = faRegularStar;
  faSolidStar = faSolidStar;
  faPen = faPen;
  faCalendarDays = faCalendarDays;
  faFile = faFile;
  faCommentDots = faCommentDots;
  faPlus = faPlus;
  faXmark = faXmark;

  @Input() id!: string;
  @Input() title: string = 'Type Something Here…';
  @Input() comment?: string = '';
  @Input() deadlineDate?: string = '';
  @Input() deadlineTime?: string = '';
  @Input() isAdding: boolean = false;
  @Input() isCompleted: boolean = false;
  @Input() priority: boolean = false;

  tempTitle: string = '';
  tempComment: string = '';
  tempDeadlineDate: string = '';
  tempDeadlineTime: string = '';
  tempCompleted: boolean = false;
  tempPriority: boolean = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<{
                          title: string;
                          completed: boolean;
                          priority: boolean;
                          comment: string;
                          deadlineDate: string;
                          deadlineTime: string;
                          
                        }>();

  onCancelClick() {
    this.cancel.emit();
  }

  onAddClick() {
    this.addTask.emit({
      title: this.tempTitle,
      completed: this.tempCompleted,
      comment: this.tempComment,
      deadlineDate: this.tempDeadlineDate,
      deadlineTime: this.tempDeadlineTime,
      priority: this.tempPriority
    });
  }

  ngOnInit(): void {
    if (this.isAdding) {
      this.isEditing = true;
      this.tempTitle = this.title;
      this.tempComment = this.comment ?? '';
      this.tempDeadlineDate = this.deadlineDate ?? '';
      this.tempDeadlineTime = this.deadlineTime ?? '';
      this.tempCompleted = this.isCompleted;
      this.tempPriority = this.priority ?? false;
    } else {
      this.todoService.editingTaskId$.subscribe(editingId => {
        this.isEditing = editingId === this.id;
        this.tempTitle = this.title;
        this.tempComment = this.comment ?? '';
        this.tempDeadlineDate = this.deadlineDate ?? '';
        this.tempDeadlineTime = this.deadlineTime ?? '';
        this.tempCompleted = this.isCompleted;
        this.tempPriority = this.priority ?? false;
      });
    }
  }


  onEditClick() {
  this.todoService.setEditingTaskId(this.id); // 通知 Service：現在這筆 task 正在編輯
}

  onCancelEditClick() {
  this.todoService.setEditingTaskId(null); // 通知 Service：現在這筆 task 正在編輯
}

  onSaveEditClick() {
    this.todoService.updateTask({
      id: this.id,
      title: this.tempTitle,
      comment: this.tempComment,
      completed: this.tempCompleted,
      priority: this.tempPriority,
      deadlineDate: this.tempDeadlineDate,
      deadlineTime: this.tempDeadlineTime
    });
    this.todoService.setEditingTaskId(null);
  }

  onCompleteClick() {
    this.todoService.setTaskCompleted(this.id);
  }

  onProiorityClick() {
    this.tempPriority = !this.tempPriority;
    this.todoService.setTaskPriority(this.id, this.tempPriority);
    console.log('TaskCardComponent - 優先權按鈕被點擊了', this.tempPriority);
  }

}