import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { LoginRequest } from '../../common/interfaces';
import { LoginService } from './login-service';

type LoginState = {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
};

// Початковий стан: форма готова до запиту, токена й помилки ще немає.
const initialState: LoginState = {
  isLoading: false,
  error: null,
  accessToken: null,
};

export const LoginStore = signalStore(
  // Один спільний store для всього застосунку.
  { providedIn: 'root' },
  withState(initialState),
  // Авторизація виводиться з наявності токена, щоб не дублювати стан.
  withComputed(({ accessToken }) => ({
    isAuthenticated: computed(() => accessToken() !== null),
  })),
  withMethods((store, loginService = inject(LoginService)) => ({
    async login(credentials: LoginRequest): Promise<void> {
      // Перед запитом вмикаємо індикатор і прибираємо попередню помилку.
      patchState(store, { isLoading: true, error: null });

      try {
        // Перетворюємо HTTP Observable на Promise для послідовного async/await.
        const response = await firstValueFrom(loginService.login(credentials));
        patchState(store, {
          accessToken: response.accessToken,
          isLoading: false,
        });
      } catch (error: unknown) {
        // Нормалізуємо серверну помилку для показу у формі.
        const message = error instanceof HttpErrorResponse
          ? error.error?.message ?? 'Unable to sign in.'
          : 'Unable to sign in.';

        patchState(store, { error: message, isLoading: false });
      }
    },

    clearError(): void {
      // Можна викликати під час редагування, щоб сховати стару помилку.
      patchState(store, { error: null });
    },
  })),
);
