// src/app/auth/login/login.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule // Módulo clave para formularios reactivos
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Definimos nuestro formulario con su tipo
  loginForm: FormGroup;
  loginError: string | null = null; // Para mostrar errores en la UI

  // Inyectamos FormBuilder para construir el formulario
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      // Definimos los controles: valor inicial y validadores
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Métodos getter para acceder fácilmente a los campos del formulario en el HTML
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.error('Formulario inválido:', this.loginForm.errors);
      return;
    }
    this.loginError = null; 

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        if (this.authService.hasRole('admin')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.loginError = 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    });
  }


}