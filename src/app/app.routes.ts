import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {UserInformationComponent} from "./components/user-information/user-information.component";
import {SecurityComponent} from "./components/security/security.component";
import {LoginComponent} from "./components/login/login.component";
import {LogoutComponent} from "./components/logout/logout.component";
// import {authenticationGuard} from "./guards/authentication.guard";

export const routes: Routes = [
    {path: 'login', redirectTo: '', pathMatch: 'full'},
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'user-information', component: UserInformationComponent},
    {path: 'security', component: SecurityComponent},
    // {path: 'home', component: HomeComponent, canActivate:[authenticationGuard]},
    // {path: 'user-information', component: UserInformationComponent, canActivate:[authenticationGuard]},
    // {path: 'security', component: SecurityComponent, canActivate:[authenticationGuard]},
    {path: 'logout', component: LogoutComponent},
    {path: '**', component: LoginComponent}
];
