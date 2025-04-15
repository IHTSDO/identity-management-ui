import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Login, User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [NgIf, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent {
    loginInformation: Login = new Login('', '', true);
    passwordVisible: boolean = false;

    user!: User;
    userSubscription: Subscription;

    referer!: string;
    refererSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router, private readonly route: ActivatedRoute) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
        this.refererSubscription = this.authenticationService.getReferer().subscribe(data => this.referer = data);
    }

    showPassword(): void {
        this.passwordVisible = true;
    }

    hidePassword(): void {
        this.passwordVisible = false;
    }

    login(): void {
        this.authenticationService.httpLogin(this.loginInformation).subscribe({
            next: () => {
                const returnUrl = this.route.snapshot.queryParamMap.get('serviceReferer');
                const returnUrl2 = this.route.snapshot.fragment?.substring(this.route.snapshot.fragment.indexOf('=') + 1, this.route.snapshot.fragment.length);

                if (returnUrl) {
                    console.log('path1');
                    window.location.href = returnUrl;
                } else if(returnUrl2) {
                    console.log('path2');
                    window.location.href = returnUrl2;
                } else {
                    this.authenticationService.httpGetUser().subscribe({
                        next: (user: any) => {
                            this.authenticationService.setUser(user);
                            this.router.navigate(['/home']);
                        }
                    });
                }
            },
            error: (e) => console.error('e: ', e)
        });
    }

    logout(): void {
        this.authenticationService.httpLogout().subscribe({
            next: () => {
                this.authenticationService.setUser(undefined!);
                this.router.navigate(['/']);
            },
            error: (e) => console.error('error: ', e)
        });
    }
}
