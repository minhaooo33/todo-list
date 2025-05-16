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
  @Input() fileName?: string;
  @Input() fileUploadTime?: string;

  tempTitle: string = '';
  tempComment: string = '';
  tempDeadlineDate: string = '';
  tempDeadlineTime: string = '';
  tempCompleted: boolean = false;
  tempPriority: boolean = false;
  isMemoEditable: boolean = false;

  @Output() fileSelected = new EventEmitter<Event>();
  @Output() cancel = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<{
                          title: string;
                          completed: boolean;
                          priority: boolean;
                          comment: string;
                          deadlineDate: string;
                          deadlineTime: string;
                          fileName?: string;
                          fileUploadTime?: string;
                        }>();
  

  onCancelClick() {
    this.cancel.emit();
  }

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const uploadTime = new Date().toLocaleString();

  if (this.isAdding) {
    // 如果是新增任務階段，傳給父元件
    this.fileSelected.emit(event);
  } else {
    // 如果是編輯中，直接更新這筆 task
    const currentTask = this.todoService.getTodos().find(t => t.id === this.id);
    if (!currentTask) return;

    // 先更新 component 的變數（顯示用）
    this.fileName = file.name;
    this.fileUploadTime = uploadTime;

    // 寫入 service
    this.todoService.updateTask({
      ...currentTask,
      fileName: file.name,
      fileUploadTime: uploadTime,
    });
  }
}

  onAddClick() {
    this.addTask.emit({
      title: this.tempTitle,
      completed: this.tempCompleted,
      comment: this.tempComment,
      deadlineDate: this.tempDeadlineDate,
      deadlineTime: this.tempDeadlineTime,
      priority: this.tempPriority,
      fileName: this.fileName,
      fileUploadTime: this.fileUploadTime,
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
      this.fileName = this.fileName ?? '';
      this.fileUploadTime = this.fileUploadTime ?? '';
    } else {
      this.todoService.editingTaskId$.subscribe(editingId => {
        this.isEditing = editingId === this.id;
        this.tempTitle = this.title;
        this.tempComment = this.comment ?? '';
        this.tempDeadlineDate = this.deadlineDate ?? '';
        this.tempDeadlineTime = this.deadlineTime ?? '';
        this.tempCompleted = this.isCompleted;
        this.tempPriority = this.priority ?? false;
        this.fileName = this.fileName ?? '';
        this.fileUploadTime = this.fileUploadTime ?? '';
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
     const currentTask = this.todoService.getTodos().find(t => t.id === this.id);
  if (!currentTask) return; 
    this.todoService.updateTask({
      id: this.id,
      title: this.tempTitle,
      comment: this.tempComment,
      completed: this.tempCompleted,
      priority: this.tempPriority,
      deadlineDate: this.tempDeadlineDate,
      deadlineTime: this.tempDeadlineTime,
      order: currentTask.order,
      fileName: this.fileName,
      fileUploadTime: this.fileUploadTime,
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