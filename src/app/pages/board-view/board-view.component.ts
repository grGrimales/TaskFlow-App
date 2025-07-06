    // src/app/pages/board-view/board-view.component.ts
    import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ActivatedRoute, RouterLink } from '@angular/router';
    import { FormsModule } from '@angular/forms';
    // Importar las funciones necesarias del CDK
    import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

    import { BoardService } from '../../services/board.service';
    import { ColumnService } from '../../services/column.service';
    import { TaskService } from '../../services/task.service';
    import { Board } from '../../models/board.model';
    import { Column } from '../../models/column.model';
    import { Task } from '../../models/task.model';

    @Component({
      selector: 'app-board-view',
      standalone: true,
      imports: [ CommonModule, RouterLink, FormsModule, DragDropModule ],
      templateUrl: './board-view.component.html',
    })
    export class BoardViewComponent implements OnInit {
      boardId!: string;
      board: Board | null = null;
      columns: Column[] = [];

      isAddingColumn = false;
      newColumnName = '';

      constructor(
        private route: ActivatedRoute,
        private boardService: BoardService,
        private columnService: ColumnService,
        private taskService: TaskService
      ) {}

      ngOnInit(): void {
        this.boardId = this.route.snapshot.paramMap.get('id')!;
        if (this.boardId) {
          this.loadBoardDetails();
          this.loadColumns();
        }
      }

      loadBoardDetails() {
        this.boardService.getBoard(this.boardId).subscribe(board => this.board = board);
      }

      loadColumns() {
        this.columnService.getColumnsForBoard(this.boardId).subscribe(cols => this.columns = cols);
      }

      // --- Método para Drag & Drop de COLUMNAS ---
      dropColumn(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        const columnIds = this.columns.map(column => column._id);
        this.boardService.updateColumnOrder(this.boardId, columnIds).subscribe({
          next: () => console.log('Orden de columnas guardado.'),
          error: (err) => console.error('Error al guardar orden:', err)
        });
      }

   // ... (código anterior)
  dropTask(event: CdkDragDrop<Task[]>) {
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;
    const taskToMove = event.previousContainer.data[event.previousIndex] || event.container.data[event.currentIndex];

    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        previousContainer.data,
        currentContainer.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const sourceColumnId = previousContainer.id;
    const destinationColumnId = currentContainer.id;
    const sourceTaskIds = previousContainer.data.map(task => task._id);
    const destinationTaskIds = currentContainer.data.map(task => task._id);

    const payload = {
      taskId: taskToMove._id,
      sourceColumnId,
      sourceTaskIds,
      destinationColumnId,
      destinationTaskIds
    };

    // --- AÑADE ESTE CONSOLE.LOG ---
    console.log('FRONTEND: Enviando payload al backend:', payload);
    // -----------------------------

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
        this.loadColumns();
      }
    });
  }
// ... (resto del código)

      // ... (resto de métodos para columnas y tareas)
      addColumn() {
        if (this.newColumnName.trim() === '') return;
        this.columnService.createColumn(this.boardId, this.newColumnName).subscribe(() => {
          this.loadColumns();
          this.newColumnName = '';
          this.isAddingColumn = false;
        });
      }

      deleteColumn(columnId: string) {
        if (confirm('¿Estás seguro?')) {
          this.columnService.deleteColumn(columnId).subscribe(() => this.loadColumns());
        }
      }

      updateColumnName(column: Column) {
        const newName = prompt('Nuevo nombre:', column.name);
        if (newName && newName.trim() !== '' && newName !== column.name) {
          this.columnService.updateColumn(column._id, newName).subscribe(() => this.loadColumns());
        }
      }

      addTask(columnId: string) {
        const title = prompt('Nueva tarea:');
        if (title && title.trim() !== '') {
          this.taskService.createTask(columnId, { title }).subscribe(() => this.loadColumns());
        }
      }

      deleteTask(taskId: string) {
        if (confirm('¿Estás seguro?')) {
          this.taskService.deleteTask(taskId).subscribe(() => this.loadColumns());
        }
      }

      updateTask(task: Task) {
        const newTitle = prompt('Nuevo título:', task.title);
        if (newTitle && newTitle.trim() !== '' && newTitle !== task.title) {
          this.taskService.updateTask(task._id, { title: newTitle }).subscribe(() => this.loadColumns());
        }
      }
    }
    