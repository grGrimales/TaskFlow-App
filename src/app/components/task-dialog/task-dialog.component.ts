import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';

import { User } from '../../models/user.model';
import { Task, Priority, ChecklistItem } from '../../models/task.model';
import { Comment } from '../../models/comment.model';
import { Label } from '../../models/label.model';
import { CommentsService } from '../../services/comments.service';
import { LabelsService } from '../../services/labels.service';
import { TaskService } from '../../services/task.service';
import { Board } from '../../models/board.model';



@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatListModule,
    MatDatepickerModule, MatSelectModule, MatChipsModule,
    FormsModule, MatIconModule, MatProgressBarModule, MatCheckboxModule,
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private commentsService: CommentsService,
    private labelsService: LabelsService,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task; board: Board }
  ) {
    this.isEditMode = !!data.task?._id;
    this.boardMembers = data.board.members;
    this.selectedUserIds = data.task?.assignedUsers?.map((user: User) => user._id) || [];

    if (!this.data.task.checklist) {
        this.data.task.checklist = [];
    }

    this.form = this.fb.group({
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || ''],
      dueDate: [data.task?.dueDate ? new Date(data.task.dueDate) : null],
      priority: [data.task?.priority || 'Media', [Validators.required]],
      labels: [data.task?.labels || []]
    });

    if (this.isEditMode) {
      this.comments$ = this.commentsService.getCommentsByTask(data.task._id);
    } else {
      this.comments$ = of([]);
    }
    this.loadBoardLabels();
  }

  ngOnInit(): void { }

  onSelectionChange(options: MatListOption[]): void {
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

  onAddComment(): void {
    if (this.newCommentControl.invalid || !this.data.task?._id) {
      return;
    }
    const text = this.newCommentControl.value!;
    this.commentsService.addComment(this.data.task._id, text).subscribe(() => {
      this.comments$ = this.commentsService.getCommentsByTask(this.data.task._id);
      this.newCommentControl.reset();
    });
  }

  loadBoardLabels(): void {
    if (this.data.board) {
      this.labelsService.getLabelsByBoard(this.data.board._id).subscribe((labels: Label[]) => {
        this.boardLabels = labels;
      });
    }
  }

  getLabelFromObject(label: Label): Label | undefined {
    return this.boardLabels.find(boardLabel => boardLabel._id === label._id);
  }

  removeLabel(labelToRemove: Label): void {
    const currentLabels = this.form.controls['labels'].value as Label[];
    const newLabels = currentLabels.filter(label => label._id !== labelToRemove._id);
    this.form.controls['labels'].setValue(newLabels);
  }

  onAddChecklistItem(input: HTMLInputElement): void {
    const title = input.value.trim();
    if (title && this.data.task?._id) {
      this.taskService.addChecklistItem(this.data.task._id, title).subscribe((updatedTask: Task) => {
        this.data.task.checklist = updatedTask.checklist;
        input.value = '';
      });
    }
  }

  onChecklistItemToggle(item: ChecklistItem): void {
    if (this.data.task?._id) {
        this.taskService.updateChecklistItem(this.data.task._id, item._id, !item.completed).subscribe((updatedTask: Task) => {
            const index = this.data.task.checklist?.findIndex((i: ChecklistItem) => i._id === item._id);
            if (this.data.task.checklist && index !== undefined && index > -1) {
                const updatedItem = updatedTask.checklist?.find((i: ChecklistItem) => i._id === item._id);
                if (updatedItem) {
                    this.data.task.checklist[index] = updatedItem;
                }
            }
        });
    }
  }

  onRemoveChecklistItem(itemId: string): void {
    if (this.data.task?._id) {
        this.taskService.removeChecklistItem(this.data.task._id, itemId).subscribe((updatedTask: Task) => {
            this.data.task.checklist = updatedTask.checklist;
        });
    }
  }

  getCompletedItems(): number {
    return this.data.task.checklist?.filter((item: ChecklistItem) => item.completed).length || 0;
  }

  getChecklistProgress(): number {
    if (!this.data.task.checklist || this.data.task.checklist.length === 0) {
      return 0;
    }
    return (this.getCompletedItems() / this.data.task.checklist.length) * 100;
  }
}