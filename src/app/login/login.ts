import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { schedulePromise } from 'rxjs/internal/scheduled/schedulePromise';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginModel = signal<{ username: string; password: string }>({
    username: '',
    password: ''
  })

  loginForm = form(this.loginModel, (schema) => {
    required(schema.username, { message: "Username is required" }),
      required(schema.password, { message: "Password is required" }),
      minLength(schema.password, 8, { message: "Password must be at least 8 characters long " })
  })

  login() {
    console.log(this.loginForm.password().value())
    console.log(this.loginForm.username().value())
    this.loginModel.set({ username: "", password: "" })
  }
}
