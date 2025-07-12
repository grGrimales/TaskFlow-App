// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, of, BehaviorSubject, throwError, map, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Instala con: npm install jwt-decode

// Define las interfaces para las respuestas y el payload del token
interface AuthResponse {
  access_token: string;      // <-- Debe llamarse 'access_token'
  refresh_token?: string;
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
   private userApiUrl = 'http://localhost:3000/users'; // URL para verificar usuario


  // Usamos BehaviorSubject para saber el estado de autenticación en tiempo real
private authStatus = new BehaviorSubject<boolean>(this.hasToken());


  // Método para registrar un usuario
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(

      tap(response => this.setSession({ access_token: response.access_token, refresh_token: response.refresh_token })),
    );
  }

  // Método para iniciar sesión
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => this.setSession(response)), // Guarda el token en localStorage
    );
  }

  // Guarda el token en localStorage y actualiza el estado
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('access_token', authResult.access_token);
    if (authResult.refresh_token) {
      localStorage.setItem('refresh_token', authResult.refresh_token);
    }
    this.authStatus.next(true); // <-- ¡Punto clave! Notifica que el usuario está autenticado
  }

  // Cierra la sesión
 logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.authStatus.next(false); // <-- Notifica que la sesión se ha cerrado
  }

  // Verifica si hay un token válido
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  getUserIdFromToken(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub; // 'sub' es el campo estándar para el ID de usuario en JWT
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }
    refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserIdFromToken();

    if (!refreshToken || !userId) {
      // En un escenario real, manejarías este error de forma más robusta
      return throwError(() => new Error('No refresh token or user ID available'));
    }

    return this.http.post(`${this.apiUrl}/refresh`, { userId, refreshToken }).pipe(
      tap((response: any) => {
        this.setSession(response); // Guarda el nuevo access_token
      })
    );
  }
 private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Decodifica el token para obtener los roles
    getUserRoles(): string[] | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.roles || [];
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