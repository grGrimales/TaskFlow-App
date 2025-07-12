import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Board } from '../../models/board.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-select.component.html',
})
export class UserSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() task!: Task;
  @Input() board!: Board;
  @Output() usersAssigned = new EventEmitter<void>();

  userSelectControl = new FormControl<string[]>([]);
  searchControl = new FormControl('');
  filteredMembers: User[] = [];

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (this.task && this.task.assignedUsers) {
      this.userSelectControl.setValue(this.task.assignedUsers.map(u => u._id));
    }

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(() => {
        this.filterMembers();
      });
  }

  

ngOnChanges(changes: SimpleChanges): void {
  const boardChange = changes['board'];
  console.log(boardChange)
  if (boardChange && boardChange.currentValue) {
    this.filteredMembers = this.board.members;
  }
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectionChange(selectedUserIds: string[]): void {
    this.assignUsers(selectedUserIds);
  }

  private filterMembers(): void {
    if (!this.board.members) {
      this.filteredMembers = [];
      return;
    }
    let search = this.searchControl.value?.toLowerCase() || '';
    if (!search) {
      this.filteredMembers = [...this.board.members];
      return;
    }
    this.filteredMembers = this.board.members.filter(member =>
      member.name.toLowerCase().includes(search) || member.email.toLowerCase().includes(search)
    );
  }

  private assignUsers(userIds: string[]): void {
    this.taskService.assignUsers(this.task._id, userIds).subscribe({
      next: () => {
        console.log('Users assigned successfully');
        this.usersAssigned.emit();
      },
      error: (err) => console.error('Error assigning users:', err)
    });
  }
}