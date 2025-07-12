import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-column-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-column-form.component.html',
})
export class AddColumnFormComponent {
  @Output() columnAdded = new EventEmitter<string>();
  
  isAddingColumn = false;
  newColumnName = '';

  onAddColumn(): void {
    if (this.newColumnName.trim()) {
      this.columnAdded.emit(this.newColumnName);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newColumnName = '';
    this.isAddingColumn = false;
  }
}