// src/app/components/task-dialog/task-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatListOption } from '@angular/material/list'; // Importar
import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatListModule
  ],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  form: FormGroup;
  boardMembers: User[] = [];
  selectedUserIds: string[] = [];
  isEditMode: boolean; // <-- AÑADIR: Para saber si estamos editando o creando

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    // MODIFICAR: Hacer `task` opcional
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; board: Board }
  ) {
    this.isEditMode = !!data.task; // <-- AÑADIR: Comprobar si existe la tarea
    this.boardMembers = data.board.members;
    // MODIFICAR: Manejar el caso donde no hay tarea
    this.selectedUserIds = data.task?.assignedUsers?.map(user => user._id) || [];

    this.form = this.fb.group({
      // MODIFICAR: Manejar el caso donde no hay tarea
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || '']
    });
  }
  ngOnInit(): void { }

  onSelectionChange(options: MatListOption[]) {
    this.selectedUserIds = options.map(o => o.value);
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        taskData: this.form.value,
        assignedUserIds: this.selectedUserIds
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
