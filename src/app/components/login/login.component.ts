import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Login, User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [NgIf, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
    loginInformation: Login = new Login('', '', true);

    user!: User;
    userSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
    }

    login(): void {
        this.authenticationService.httpLogin(this.loginInformation).subscribe({
            next: () => {
                this.authenticationService.httpGetUser().subscribe({
                    next: (user: any) => {
                        this.authenticationService.setUser(user);
                        this.router.navigate(['/home']);
                    }
                });
            },
            error: (e) => console.error('e: ', e)
        });
    }
}
