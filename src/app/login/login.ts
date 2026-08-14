import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import axios from 'axios';
import { schedulePromise } from 'rxjs/internal/scheduled/schedulePromise';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router)
  loginModel = signal<{ username: string; password: string }>({
    username: '',
    password: ''
  })

  loginForm = form(this.loginModel, (schema) => {
    required(schema.username, { message: "Username is required" }),
      required(schema.password, { message: "Password is required" }),
      minLength(schema.password, 8, { message: "Password must be at least 8 characters long " })
  })

  async login() {
    const res = await axios.post(`${import.meta.env.NG_APP_API_URL}/api/Auth/login`, {
      Username: this.loginForm.username().value(),
      Password: this.loginForm.password().value()
    })
    this.loginForm.password().value.set("")
    if (res.status === 200) {
      localStorage.setItem("username", this.loginForm.username().value())
      this.router.navigate(['/dashboard'])
    }
  }
}
