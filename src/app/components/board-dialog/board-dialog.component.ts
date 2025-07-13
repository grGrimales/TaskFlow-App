// src/app/components/board-dialog/board-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './board-dialog.component.html',
})
export class BoardDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { board?: Board }
  ) {
    this.isEditMode = !!data.board;
    this.form = this.fb.group({
      name: [data.board?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [data.board?.description || '', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    console.log('Form Value:', this.form.value);
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}