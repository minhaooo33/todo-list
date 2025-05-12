import { Component, Output, EventEmitter } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'app-task-card',
  imports: [FontAwesomeModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  faRegularStar = faRegularStar;
  faPen = faPen;
  faCalendarDays = faCalendarDays;
  faFile = faFile;
  faCommentDots = faCommentDots;
  faPlus = faPlus;
  faXmark = faXmark;

  @Output() cancel = new EventEmitter<void>();

  onCancelClick() {
    this.cancel.emit();
  }
}
