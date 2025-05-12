import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
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

handleStartAdding() {
  this.adding = !this.adding;
}
}
