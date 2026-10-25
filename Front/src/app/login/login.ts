import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { LoginRequest } from '../../common/interfaces';
import { LoginStore } from './login.store';

// Чекбокс має бути обов'язково заданий, щоб Signal Forms побудував поле.
type LoginFormModel = Omit<LoginRequest, 'rememberMe'> & { rememberMe: boolean };

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [FormField, FormRoot],
})
export class Login {
  readonly loginStore = inject(LoginStore);
  // Цей сигнал є єдиним джерелом значень, введених у форму.
  readonly loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
    rememberMe: false,
  });

  readonly loginForm = form(
    this.loginModel,
    (path) => {
      // Правила валідації запускаються автоматично під час зміни значень.
      required(path.email, { message: 'Email is required.' });
      email(path.email, { message: 'Enter a valid email address.' });
      required(path.password, { message: 'Password is required.' });
    },
    {
      submission: {
        // FormRoot викличе логін лише після успішної перевірки полів.
        action: async () => this.loginStore.login(this.loginModel()),
      },
    },
  );
}
