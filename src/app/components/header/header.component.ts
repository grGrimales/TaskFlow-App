import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);

  // Output para notificar al componente padre que se debe hacer logout
  @Output() onLogout = new EventEmitter<void>();

  user: { name: string } | null = null;
  userInitial: string = '';
  isDropdownOpen = false;

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.user = this.authService.getCurrentUser();
    this.userInitial = this.user ? this.user.name.charAt(0).toUpperCase() : '?';
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.onLogout.emit(); // Emite el evento para que el padre reaccione
  }
}