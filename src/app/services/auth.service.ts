import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, of, BehaviorSubject, throwError, map, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 

interface AuthResponse {
  access_token: string;      
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
  private apiUrl = 'http://localhost:3000/auth'; 
   private userApiUrl = 'http://localhost:3000/users'; 

private authStatus = new BehaviorSubject<boolean>(this.hasToken());


  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(

      tap(response => this.setSession({ access_token: response.access_token, refresh_token: response.refresh_token })),
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => this.setSession(response)), 
    );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('access_token', authResult.access_token);
    if (authResult.refresh_token) {
      localStorage.setItem('refresh_token', authResult.refresh_token);
    }
    this.authStatus.next(true); 
  }

 logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.authStatus.next(false); 
  }

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
      return decoded.sub; 
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }
    refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserIdFromToken();

    if (!refreshToken || !userId) {
      return throwError(() => new Error('No refresh token or user ID available'));
    }

    return this.http.post(`${this.apiUrl}/refresh`, { userId, refreshToken }).pipe(
      tap((response: any) => {
        this.setSession(response); 
      })
    );
  }
 private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

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

hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles ? roles.includes(role) : false;
  }
}