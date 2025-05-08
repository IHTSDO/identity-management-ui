import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgIf, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService, public router: Router) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        this.authenticationService.httpGetUser().subscribe({
            next: (user) => {
                this.authenticationService.setUser(user);
            },
            error: () => {
                this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
            }
        });
    }

    redirectTo(url: string): void {
        window.open(url, '_blank');
    }

    getInitials(user: User): string {
        let initials = '';

        if (user.firstName) {
            initials += user.firstName?.charAt(0).toUpperCase();
        }

        if (user.lastName) {
            initials += user.lastName?.charAt(0).toUpperCase();
        }

        return initials;
    }
}
