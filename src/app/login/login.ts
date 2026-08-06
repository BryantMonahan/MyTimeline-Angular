import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';

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

  loginForm = form(this.loginModel)

  login() {
    console.log(this.loginForm.password().value())
    console.log(this.loginForm.username().value())
    this.loginModel.set({ username: "", password: "" })
  }
}
