import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation(); 
    this.delete.emit(this.task._id);
  }

  onEditClick(): void {
    this.edit.emit(this.task);
  }
}