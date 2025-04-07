import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {UserInformationComponent} from "./components/user-information/user-information.component";
import {SecurityComponent} from "./components/security/security.component";
import {LoginComponent} from "./components/login/login.component";

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'user-information', component: UserInformationComponent},
    {path: 'security', component: SecurityComponent},
];
