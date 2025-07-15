import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-invite-member-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatListModule, MatCheckboxModule, MatProgressSpinnerModule
  ],
  templateUrl: './invite-member-dialog.component.html',
})
export class InviteMemberDialogComponent implements OnInit {
  
  searchControl = new FormControl('');
  users$: Observable<User[]>;
  isLoading = false;
  selectedUsers = new Map<string, User>(); 

  constructor(
    public dialogRef: MatDialogRef<InviteMemberDialogComponent>,
    private userService: UserService

  ) {
    this.users$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(term => this.userService.search(term || '').pipe(
          catchError(() => of([])), 
          tap(() => this.isLoading = false)
        )
      )
    );
  }

  ngOnInit(): void {}

  toggleSelection(user: User): void {
    if (this.selectedUsers.has(user.email)) {
      this.selectedUsers.delete(user.email);
    } else {
      this.selectedUsers.set(user.email, user);
    }
  }

  onInviteClick(): void {
    const selectedEmails = Array.from(this.selectedUsers.keys());
    this.dialogRef.close(selectedEmails);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}