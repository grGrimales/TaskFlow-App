import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { Column } from '../../models/column.model';
import { Task } from '../../models/task.model';
import   { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  templateUrl: './column.component.html',
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() connectedDropListsIds!: string[];
  
  @Output() editName = new EventEmitter<Column>();
  @Output() delete = new EventEmitter<string>();
  @Output() addTask = new EventEmitter<string>();
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  
  // Eventos que se propagan desde task-card
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }
}