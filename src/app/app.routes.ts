import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { PageNotFound } from './page-not-found/page-not-found';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: "",
        title: "My Timeline",
        component: LandingPage
    },
    {
        path: "login",
        title: "Login",
        component: Login
    },
    {
        path: "register",
        title: "Register",
        component: Register
    },
    {
        path: "dashboard",
        title: "Dashboard",
        component: Dashboard
    },
    {
        path: "**",
        component: PageNotFound
    }
];
