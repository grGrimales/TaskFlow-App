// src/app/components/task-dialog/task-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatListOption } from '@angular/material/list';
import { Board } from '../../models/board.model';
import { User } from '../../models/user.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Task, Priority } from '../../models/task.model';
import { Observable, of } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.model';
import { LabelsService } from '../../services/labels.service';
import { Label } from '../../models/label.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatListModule,
    MatDatepickerModule, MatSelectModule, MatChipsModule,
    FormsModule, MatIconModule,
  ],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  form: FormGroup;
  boardMembers: User[] = [];
  selectedUserIds: string[] = [];
  isEditMode: boolean;
  priorities: Priority[] = ['Baja', 'Media', 'Alta'];
  comments$!: Observable<Comment[]>;
  newCommentControl = new FormControl('', [Validators.required]);
  boardLabels: Label[] = [];
  // selectedLabelIds: string[] = []; // <-- 1. ELIMINAMOS ESTA PROPIEDAD QUE YA NO SE USA

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private commentsService: CommentsService,
    private labelsService: LabelsService,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; board: Board }
  ) {
    this.isEditMode = !!data.task;
    this.boardMembers = data.board.members;
    this.selectedUserIds = data.task?.assignedUsers?.map(user => user._id) || [];

    this.form = this.fb.group({
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || ''],
      dueDate: [data.task?.dueDate ? new Date(data.task.dueDate) : null],
      priority: [data.task?.priority || 'Media', [Validators.required]],
      labels: [data.task?.labels?.map(l => l._id) || []]
    });
    
    if (this.isEditMode && data.task) {
      this.comments$ = this.commentsService.getCommentsByTask(data.task._id);
    } else {
      this.comments$ = of([]); 
    }
    this.loadBoardLabels();
  }

  ngOnInit(): void { }

  onSelectionChange(options: MatListOption[]) {
    this.selectedUserIds = options.map(o => o.value);
  }

  // --- 2. MÉTODO onSave() CORREGIDO ---
  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        // Ahora `taskData` siempre contendrá los `labels` correctos del formulario.
        taskData: this.form.value,
        assignedUserIds: this.selectedUserIds
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddComment(): void {
    if (this.newCommentControl.invalid || !this.data.task) {
      return;
    }
    const text = this.newCommentControl.value!;
    this.commentsService.addComment(this.data.task._id, text).subscribe(() => {
      this.comments$ = this.commentsService.getCommentsByTask(this.data.task!._id);
      this.newCommentControl.reset();
    });
  }
    
  loadBoardLabels() {
    if (this.data.board) {
      this.labelsService.getLabelsByBoard(this.data.board._id).subscribe(labels => {
        this.boardLabels = labels;
      });
    } else {
      console.error('No se encontró información del tablero (this.data.board) en el diálogo.');
    }
  }

  getLabelById(id: string): Label | undefined {
    return this.boardLabels.find(label => label._id === id);
  }

  removeLabel(labelId: string): void {
    const currentLabels = this.form.controls['labels'].value as string[];
    const newLabels = currentLabels.filter(id => id !== labelId);
    this.form.controls['labels'].setValue(newLabels);
  }
}