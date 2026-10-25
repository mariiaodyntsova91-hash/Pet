import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LOGIN_ENDPOINT } from '../../common/apis.constants';
import { LoginRequest, LoginResponse } from '../../common/interfaces';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly http = inject(HttpClient);

  // Сервіс лише виконує HTTP-запит; стан запиту обробляє LoginStore.
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(LOGIN_ENDPOINT, credentials);
  }
}
