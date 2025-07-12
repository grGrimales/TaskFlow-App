// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // <-- 1. Importar RouterLink
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../../components/board-dialog/board-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // <-- 2. Añadir RouterLink aquí
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private boardService = inject(BoardService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public dialog = inject(MatDialog);

  boards: Board[] = [];

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.boardService.getBoards().subscribe(boards => {
      console.log('Boards loaded:', boards);
      this.boards = boards;
    });
  }

  openBoardDialog(board?: Board): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '500px',
      data: { board }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (board) {
          // Lógica de Edición
          this.boardService.updateBoard(board._id, result).subscribe(() => this.loadBoards());
        } else {
          // Lógica de Creación
          this.boardService.createBoard(result).subscribe(() => this.loadBoards());
        }
      }
    });
  }

  deleteBoard(boardId: string, event: MouseEvent): void {
    event.stopPropagation(); // Evita que se active el click del contenedor
    if (confirm('¿Estás seguro de que quieres eliminar este tablero?')) {
      this.boardService.deleteBoard(boardId).subscribe(() => this.loadBoards());
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
