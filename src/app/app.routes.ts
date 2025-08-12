import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {UserInformationComponent} from "./components/user-information/user-information.component";
import {SecurityComponent} from "./components/security/security.component";
import {authenticationGuard} from "./guards/authentication.guard";

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, canActivate:[authenticationGuard]},
    {path: 'user-information', component: UserInformationComponent, canActivate:[authenticationGuard]},
    {path: 'security', component: SecurityComponent, canActivate:[authenticationGuard]},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
