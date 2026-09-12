import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { LOGIN_ENDPOINT } from '../../common/apis.constants';

@Service()
export class LoginService {
    http = inject(HttpClient);

  login({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }): void {
    this.http.post(LOGIN_ENDPOINT, { email, password, rememberMe }).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Handle successful login, e.g., store token, redirect, etc.
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle login error, e.g., show error message to user
      }
    );
  }


}
