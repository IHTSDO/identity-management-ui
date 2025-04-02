import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Login} from "../../models/user";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
    loginInformation: Login = new Login('', '', true);

    constructor(private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        console.log('ngOnInit');
    }

    login(): void {
        this.authenticationService.httpLogin(this.loginInformation).subscribe(
            login => {
                console.log('login: ', login);
            }
        )
    }
}
