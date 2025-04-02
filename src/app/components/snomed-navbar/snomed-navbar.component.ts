import {Component} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-snomed-navbar',
    standalone: true,
    imports: [NgIf],
    templateUrl: './snomed-navbar.component.html',
    styleUrl: './snomed-navbar.component.scss'
})
export class SnomedNavbarComponent {

    user!: User;
    userSubscription: Subscription;

    expandedUserMenu: boolean = false;
    expandedAppMenu: boolean = false;
    expandedItemMenu: boolean = false;

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    switchMenu(name: string): void {
        switch (name) {
            case 'user':
                this.expandedUserMenu = true;
                this.expandedAppMenu = false;
                this.expandedItemMenu = false;
                break;
            case 'app':
                this.expandedUserMenu = false;
                this.expandedAppMenu = true;
                this.expandedItemMenu = false;
                break;
            case 'item':
                this.expandedUserMenu = false;
                this.expandedAppMenu = false;
                this.expandedItemMenu = true;
                break;
        }
    }

    logout(): void {
        this.authenticationService.httpLogout().subscribe({
            next: (v) => {
                this.authenticationService.setUser(undefined!);
                this.router.navigate(['/login']);
            },
            error: (e) => console.error('error: ', e),
            complete: () => console.info('complete')
        });
    }
}
