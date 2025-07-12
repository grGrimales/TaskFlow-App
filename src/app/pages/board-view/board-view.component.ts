// Imports originales
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from '../../services/board.service';
import { ColumnService } from '../../services/column.service';
import { TaskService } from '../../services/task.service';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Task } from '../../models/task.model';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

// Nuevos imports de los componentes hijos
import { ColumnComponent } from '../../components/column/column.component';
import { AddColumnFormComponent } from '../../components/add-column-form/add-column-form.component';
import { InviteMemberDialogComponent } from '../../components/invite-member-dialog/invite-member-dialog.component';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    DragDropModule,
    ColumnComponent,
    AddColumnFormComponent
  ],
  templateUrl: './board-view.component.html',
})
export class BoardViewComponent implements OnInit {
  boardId!: string;
  board: Board | null = null;
  columns: Column[] = [];

  // Las propiedades `isAddingColumn` y `newColumnName` se han movido a AddColumnFormComponent

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}

  get columnIds(): string[] {
    return this.columns.map(column => column._id);
  }

  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('id')!;
    if (this.boardId) {
      this.loadBoardDetails();
      this.loadColumns();
    }
  }

  // --- MÉTODOS DE CARGA DE DATOS (sin cambios) ---
  loadBoardDetails() {
    this.boardService.getBoard(this.boardId).subscribe(board => this.board = board);
  }

  loadColumns() {
    this.columnService.getColumnsForBoard(this.boardId).subscribe(cols => this.columns = cols);
  }

  // --- MÉTODOS DE DRAG & DROP (sin cambios) ---
  dropColumn(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    const columnIds = this.columns.map(column => column._id);
    this.boardService.updateColumnOrder(this.boardId, columnIds).subscribe({
      next: () => console.log('Orden de columnas guardado.'),
      error: (err) => console.error('Error al guardar orden:', err)
    });
  }

  dropTask(event: CdkDragDrop<Task[]>) {
    // La lógica de dropTask permanece aquí porque necesita coordinar entre diferentes arrays de tareas
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;

    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        previousContainer.data,
        currentContainer.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const taskToMove = event.item.data;
    const sourceColumnId = previousContainer.id;
    const destinationColumnId = currentContainer.id;
    const sourceTaskIds = previousContainer.data.map(task => task._id);
    const destinationTaskIds = currentContainer.data.map(task => task._id);

    this.taskService.moveTask(
      taskToMove._id,
      sourceColumnId,
      sourceTaskIds,
      destinationColumnId,
      destinationTaskIds
    ).subscribe({
      next: () => console.log('Movimiento de tarea guardado.'),
      error: (err) => {
        console.error('Error al mover la tarea:', err);
        this.loadColumns(); // Recargar para revertir el cambio visual en caso de error
      }
    });
  }

  // --- MÉTODOS DE MANEJO DE EVENTOS (lanzados por los hijos) ---

  addColumn(newColumnName: string) {
    this.columnService.createColumn(this.boardId, newColumnName).subscribe(() => {
      this.loadColumns();
    });
  }

  deleteColumn(columnId: string) {
    if (confirm('¿Estás seguro de eliminar esta columna?')) {
      this.columnService.deleteColumn(columnId).subscribe(() => this.loadColumns());
    }
  }

  updateColumnName(column: Column) {
    const newName = prompt('Nuevo nombre para la columna:', column.name);
    if (newName && newName.trim() !== '' && newName !== column.name) {
      this.columnService.updateColumn(column._id, newName).subscribe(() => this.loadColumns());
    }
  }

 addTask(columnId: string) {
    if (!this.board) return; // Asegurarse de que el tablero está cargado

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      // No pasamos una 'task' para que el diálogo sepa que es modo de creación
      data: { board: this.board }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el usuario guardó el diálogo y el resultado existe
      if (result) {
        // 1. Crear la tarea con la información del formulario
        this.taskService.createTask(columnId, result.taskData).subscribe(createdTask => {
          
          // 2. Si se asignaron usuarios, actualizamos la tarea recién creada
          if (result.assignedUserIds && result.assignedUserIds.length > 0) {
            this.taskService.assignUsers(createdTask._id, result.assignedUserIds).subscribe(() => {
              this.loadColumns(); // Recargamos las columnas después de todo
            });
          } else {
            this.loadColumns(); // Recargamos si no hubo usuarios que asignar
          }
        });
      }
    });
  }

  deleteTask(taskId: string) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe(() => this.loadColumns());
    }
  }

  updateTask(task: Task) {
    if (!this.board) return;
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: { task, board: this.board }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task._id, result.taskData).subscribe(() => {
          this.taskService.assignUsers(task._id, result.assignedUserIds).subscribe(() => {
            this.loadColumns();
          });
        });
      }
    });
  }


  inviteMember(): void {
    const dialogRef = this.dialog.open(InviteMemberDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((selectedEmails: string[] | undefined) => {
      if (selectedEmails && selectedEmails.length > 0) {
        this.boardService.addMembers(this.boardId, selectedEmails).subscribe({
          next: () => {
            alert('Miembros invitados exitosamente.');
            this.loadBoardDetails();
          },
          // --- CAMBIO AQUÍ ---
          // Añade el tipo HttpErrorResponse al parámetro 'err'
          error: (err: HttpErrorResponse) => alert(`Error al invitar: ${err.error.message}`)
        });
      }
    });
  }
}