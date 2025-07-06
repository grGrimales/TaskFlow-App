// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, of, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Instala con: npm install jwt-decode

// Define las interfaces para las respuestas y el payload del token
interface AuthResponse {
  token: string;
}

interface DecodedToken {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth'; // URL de tu API de NestJS

  // Usamos BehaviorSubject para saber el estado de autenticación en tiempo real
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  // Método para registrar un usuario
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap(response => this.setSession(response.token))
    );
  }

  // Método para iniciar sesión
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => this.setSession(response.token))
    );
  }

  // Guarda el token en localStorage y actualiza el estado
  private setSession(token: string): void {
    localStorage.setItem('auth_token', token);
    this.authStatus.next(true);
  }

  // Cierra la sesión
  logout(): void {
    localStorage.removeItem('auth_token');
    this.authStatus.next(false);
  }

  // Verifica si hay un token válido
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Decodifica el token para obtener los roles
  getUserRoles(): string[] | null {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.roles;
    } catch (error) {
      console.error("Error decodificando el token", error);
      return null;
    }
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles ? roles.includes(role) : false;
  }
}