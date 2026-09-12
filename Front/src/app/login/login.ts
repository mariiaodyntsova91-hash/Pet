import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginService } from './login-service';
import { LoginInfo } from '../../common/interfaces';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule],
})
export class Login {
  loginService = inject(LoginService);
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required/*, Validators.email*/]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  });

  onSubmit(): LoginInfo | void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      // Here you can add your login logic, e.g., call an authentication service
      this.loginService.login({ email, password, rememberMe });

    } else {
      console.log('Form is invalid');
    }
  }
}
