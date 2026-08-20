import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { LoginRequest } from '../interfaces/login-request.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

import { TokenService } from '../../../core/services/token.service';

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ======================================================
  // API URL
  // ======================================================

  private readonly apiUrl =
    `${environment.apiUrl}/api/auth`;


  // ======================================================
  // AUTHENTICATION SIGNALS
  // ======================================================

  private loggedIn = signal(
    !!localStorage.getItem('token')
  );

  private currentUser = signal<any>(
    this.getStoredUser()
  );


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {}


  // ======================================================
  // LOGIN
  // ======================================================

  login(data: {
    email: string;
    password: string;
  }) {

    return this.http.post<{
      token: string;
      id: number;
      name: string;
      email: string;
      role: string;
    }>(
      `${this.apiUrl}/login`,
      data
    );

  }


  // ======================================================
  // REGISTER
  // ======================================================

  register(data: {
    name: string;
    email: string;
    password: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }


  // ======================================================
  // FORGOT PASSWORD
  // ======================================================

  forgotPassword(data: {
    email: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/forgot-password`,
      data,
      {
        responseType: 'text'
      }
    );

  }


  // ======================================================
  // RESET PASSWORD
  // ======================================================

  resetPassword(data: {
    token: string;
    newPassword: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/reset-password`,
      data,
      {
        responseType: 'text'
      }
    );

  }


  // ======================================================
  // CHECK LOGIN STATUS
  // ======================================================

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }


  // ======================================================
  // GET CURRENT USER
  // ======================================================

  getCurrentUser() {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;

  }


  // ======================================================
  // LOGOUT
  // ======================================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.loggedIn.set(false);

    this.currentUser.set(null);

  }


  // ======================================================
  // SAVE AUTHENTICATION
  // ======================================================

  saveAuthentication(response: {
    token: string;
    id: number;
    name: string;
    email: string;
    role: string;
  }): void {

    const user = {

      id:
        response.id,

      name:
        response.name,

      email:
        response.email,

      role:
        response.role

    };


    // Save JWT token

    localStorage.setItem(
      'token',
      response.token
    );


    // Save user information

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );


    // Update Signals

    this.loggedIn.set(true);

    this.currentUser.set(user);

  }


  // ======================================================
  // GET STORED USER
  // ======================================================

  private getStoredUser() {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;

  }


  // ======================================================
  // READ-ONLY AUTHENTICATION SIGNAL
  // ======================================================

  isAuthenticated =
    this.loggedIn.asReadonly();


  // ======================================================
  // READ-ONLY USER SIGNAL
  // ======================================================

  user =
    this.currentUser.asReadonly();

}