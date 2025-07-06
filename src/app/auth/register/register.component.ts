// src/app/auth/register/register.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
      private authService: AuthService,
       private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Getters para un acceso más fácil en la plantilla
  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.registerError = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        // Después de un registro exitoso, se navega al dashboard principal
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error de registro:', err);
        if (err.status === 409) { // 409 Conflict (email ya existe)
          this.registerError = 'Este correo electrónico ya está en uso.';
        } else {
          this.registerError = 'Ocurrió un error durante el registro.';
        }
      }
    });
  }
}